#!/usr/bin/env node
/* global fetch, process, console */
/**
 * Generates TypeScript API client and types from Swagger/OpenAPI spec.
 *
 * Generates endpoints by Swagger tags (configured via API_TAGS).
 *
 * Output (generated, gitignored): src/shared/api/generated/*
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.resolve(__dirname, "../../src/shared/api/generated");
const TEMPLATES_DIR = path.join(__dirname, "templates");
const TYPES_SUBDIR = "types";
const CLIENTS_SUBDIR = "clients";

function readDotEnv(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function getSwaggerUrl() {
  if (process.env.VITE_API_DOC_URL) return process.env.VITE_API_DOC_URL;
  const envFromFile = readDotEnv(path.join(REPO_ROOT, ".env"));
  if (envFromFile.VITE_API_DOC_URL) return envFromFile.VITE_API_DOC_URL;
  throw new Error(
    "VITE_API_DOC_URL is not set. Please add VITE_API_DOC_URL=<swagger-doc-url> to .env (repo root) or export it in your shell."
  );
}

function getTagList() {
  const raw = process.env.API_TAGS ?? readDotEnv(path.join(REPO_ROOT, ".env")).API_TAGS;
  if (!raw) {
    throw new Error(
      'API_TAGS is not set. Please add API_TAGS="Tag A,Tag B" to .env (repo root) or export it in your shell.'
    );
  }
  const tags = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!tags.length) {
    throw new Error('API_TAGS is empty. Please set API_TAGS="Tag A,Tag B".');
  }
  return tags;
}

function getGroupMappings() {
  // Optional. Format (similar spirit to KMP tag->module mapping):
  // API_GROUPS="auth:User / Authentication|Operators / Auth;master:Master Data|Address Detail"
  // - group key before ":" becomes output filename (slugified)
  // - tags are separated by "|"
  const raw = process.env.API_GROUPS ?? readDotEnv(path.join(REPO_ROOT, ".env")).API_GROUPS;
  if (!raw) return null;
  const groups = [];
  for (const chunk of raw.split(";")) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) {
      throw new Error(
        'Invalid API_GROUPS. Expected "groupKey:Tag A|Tag B;otherGroup:Tag C". Missing ":" in: ' + trimmed
      );
    }
    const key = trimmed.slice(0, idx).trim();
    const tagsPart = trimmed.slice(idx + 1).trim();
    const tags = tagsPart
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!key || tags.length === 0) continue;
    groups.push({ key, tags });
  }
  return groups.length ? groups : null;
}

function getSharedModelWhitelist() {
  // Optional. Comma-separated type names to prefer in types.shared.ts.
  // Example: API_SHARED_MODELS="PaginationInfo,OperatorListVoucherDataPagination"
  const raw = process.env.API_SHARED_MODELS ?? readDotEnv(path.join(REPO_ROOT, ".env")).API_SHARED_MODELS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugifyTag(tag) {
  return tag
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveRef(spec, ref) {
  if (!ref || !ref.startsWith("#/")) return null;
  const parts = ref.replace("#/", "").split("/");
  let cur = spec;
  for (const p of parts) cur = cur?.[p];
  return cur;
}

function rawRefToTypeName(ref) {
  if (!ref) return "unknown";
  const name = ref.split("/").pop();
  return name.replace(/^model\./, "").replace(/[.-]/g, "_");
}

function paginationShortAliasFromLongName(longName) {
  /**
   * Converts swagger pagination wrapper names to shorter aliases.
   *
   * Example: PaginationResponse_array_model_FooBar -> FooBarPagination
   */
  const prefix = "PaginationResponse_array_model_";
  if (longName.startsWith(prefix)) {
    const rest = longName.slice(prefix.length);
    if (rest) return `${rest}Pagination`;
  }
  return null;
}

function paginationDtoShortAliasFromLongName(longName) {
  /**
   * Converts swagger "pagination response DTO" wrapper names to shorter aliases.
   *
   * Example:
   * PaginationResponseDTO_model_PaginationResponse_array_model_FooBar
   * -> FooBarPaginationResponseDTO
   */
  const prefix = "PaginationResponseDTO_model_PaginationResponse_array_model_";
  if (longName.startsWith(prefix)) {
    const rest = longName.slice(prefix.length);
    if (rest) return `${rest}PaginationResponseDTO`;
  }
  return null;
}

function refToTypeName(ref) {
  const raw = rawRefToTypeName(ref);
  const dtoShort = paginationDtoShortAliasFromLongName(raw);
  if (dtoShort) return dtoShort;
  const short = paginationShortAliasFromLongName(raw);
  return short ?? raw;
}

function schemaToTs(spec, schema, definitions, visited = new Set()) {
  if (!schema) return "unknown";
  if (schema.$ref) {
    const name = refToTypeName(schema.$ref);
    if (!visited.has(schema.$ref)) {
      visited.add(schema.$ref);
      const def = resolveRef(spec, schema.$ref);
      if (def) definitions.add(schema.$ref);
    }
    return name;
  }
  if (schema.type === "string") return schema.enum ? schema.enum.map((e) => `"${e}"`).join(" | ") : "string";
  if (schema.type === "integer" || schema.type === "number") return "number";
  if (schema.type === "boolean") return "boolean";
  if (schema.type === "array") {
    const items = schema.items ? schemaToTs(spec, schema.items, definitions, visited) : "unknown";
    return `${items}[]`;
  }
  if (schema.type === "object" || schema.properties) {
    const props = schema.properties || {};
    const entries = Object.entries(props).map(([k, v]) => {
      const optional = !(schema.required || []).includes(k);
      const t = schemaToTs(spec, v, definitions, visited);
      return `  ${k}${optional ? "?" : ""}: ${t};`;
    });
    return entries.length ? `{\n${entries.join("\n")}\n}` : "Record<string, unknown>";
  }
  return "unknown";
}

function collectRefs(spec, obj, refs) {
  if (!obj) return;
  if (typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((o) => collectRefs(spec, o, refs));
    return;
  }
  if (obj.$ref && typeof obj.$ref === "string") refs.add(obj.$ref);
  for (const v of Object.values(obj)) collectRefs(spec, v, refs);
}

function getResponseSchema(operation) {
  const res = operation.responses;
  if (!res) return null;
  const ok = res["200"] || res["201"] || res["204"] || Object.values(res)[0];
  if (!ok) return null;
  return ok.schema || (ok.content && ok.content["application/json"] && ok.content["application/json"].schema);
}

function getRequestBodySchema(operation) {
  if (operation.requestBody && operation.requestBody.content && operation.requestBody.content["application/json"])
    return operation.requestBody.content["application/json"].schema;
  return operation.parameters?.find((p) => p.in === "body")?.schema || null;
}

function isBaseResponseWrapperName(name) {
  return /^BaseResponseDTO_/.test(name);
}

function isPaginationResponseName(name) {
  /** Common swagger-generated pagination wrapper naming from Go. */
  return /^PaginationResponse_array_/.test(name);
}

function isPaginationResponseDtoName(name) {
  /** Common swagger-generated pagination response DTO wrapper naming from Go. */
  return /^PaginationResponseDTO_model_PaginationResponse_array_/.test(name);
}

function unwrapBaseResponseWrapper(spec, def, refs) {
  // Swagger wrappers in this API commonly look like:
  // { data?: <T>, request_id?: string }
  const dataSchema = def?.properties?.data;
  if (!dataSchema) return null;
  const inner = schemaToTs(spec, dataSchema, refs);
  return inner || "unknown";
}

function emitInterface(spec, ref, defsMap, definitions, visited) {
  const def = resolveRef(spec, ref);
  if (!def || visited.has(ref)) return "";
  visited.add(ref);
  const rawName = rawRefToTypeName(ref);
  const name = refToTypeName(ref);
  if (isBaseResponseWrapperName(name)) {
    const inner = unwrapBaseResponseWrapper(spec, def, definitions);
    return `export type ${name} = BaseResponse<${inner}>;\n`;
  }
  if (isPaginationResponseDtoName(rawName)) {
    const dataSchema = def?.properties?.data;
    const pageType = dataSchema ? schemaToTs(spec, dataSchema, definitions) : "unknown";
    // By design: always emit only the short alias (XPaginationResponseDTO).
    return `export type ${name} = PaginationResponseDTO<${pageType}>;\n`;
  }
  if (isPaginationResponseName(rawName)) {
    const itemsSchema = def?.properties?.items;
    const itemType =
      itemsSchema?.type === "array" && itemsSchema.items
        ? schemaToTs(spec, itemsSchema.items, definitions)
        : "unknown";
    // By design: always emit only the short alias (XPagination).
    // All references are rewritten to the short alias via refToTypeName().
    return `export type ${name} = PaginationResponse<${itemType}>;\n`;
  }
  if (def && Array.isArray(def.enum) && def.enum.length) {
    const literals = def.enum
      .map((v) => (typeof v === "string" ? `"${v}"` : typeof v === "number" ? `${v}` : "unknown"))
      .filter((v) => v !== "unknown");
    if (literals.length) return `export type ${name} = ${literals.join(" | ")};\n`;
  }
  if (def.type !== "object" && !def.properties) return "";
  const props = def.properties || {};
  const required = def.required || [];
  const entries = Object.entries(props);
  if (entries.length === 0) {
    // Avoid empty interfaces that violate @typescript-eslint/no-empty-object-type.
    return `export type ${name} = Record<string, unknown>;\n`;
  }
  const lines = entries.map(([k, v]) => {
    const optional = !required.includes(k);
    const t = schemaToTs(spec, v, new Set(), new Set(visited));
    return `  ${k}${optional ? "?" : ""}: ${t};`;
  });
  return `export interface ${name} {\n${lines.join("\n")}\n}\n`;
}

function getModelDeps(spec, ref) {
  const def = resolveRef(spec, ref);
  const deps = new Set();
  if (!def) return deps;
  collectRefs(spec, def, deps);
  deps.delete(ref);
  return deps;
}

function typeNameSetFromRefs(refs) {
  const out = new Set();
  for (const r of refs) out.add(refToTypeName(r));
  out.delete("unknown");
  return out;
}

function computeSharedTypeNames(spec, refsByBucket, alwaysSharedNames) {
  const counts = new Map();
  const nameToRef = new Map();
  for (const refs of Object.values(refsByBucket)) {
    for (const ref of refs) {
      const name = refToTypeName(ref);
      if (name === "unknown") continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
      if (!nameToRef.has(name)) nameToRef.set(name, ref);
    }
  }

  let shared = new Set();
  for (const [name, c] of counts.entries()) if (c > 1) shared.add(name);
  for (const n of alwaysSharedNames) shared.add(n);

  const depMap = new Map();
  for (const name of shared) {
    const ref = nameToRef.get(name);
    if (!ref) continue;
    const deps = [...getModelDeps(spec, ref)].map(refToTypeName).filter((x) => x !== "unknown");
    depMap.set(name, new Set(deps));
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const name of [...shared]) {
      const deps = depMap.get(name);
      if (!deps) continue;
      for (const d of deps) {
        if (d === name) continue;
        if (!shared.has(d)) {
          shared.delete(name);
          changed = true;
          break;
        }
      }
    }
  }

  for (const name of [...shared]) {
    if (isBaseResponseWrapperName(name)) shared.delete(name);
  }

  return shared;
}

function generateTypesForRefs(spec, refs, includeTypeNames) {
  const refList = [...refs].filter((r) => {
    const name = refToTypeName(r);
    if (!includeTypeNames.has(name)) return false;
    // Rely on resolveRef so we don't depend on how the swagger spec keys are named.
    // This avoids missing exports when $ref contains prefixes like `model.`.
    return Boolean(resolveRef(spec, r));
  });

  const defsMap = new Map();
  refList.forEach((r) => defsMap.set(r, resolveRef(spec, r)));
  const visited = new Set();
  const blocks = [];
  for (const ref of refList) {
    const block = emitInterface(spec, ref, defsMap, refs, visited);
    if (block) blocks.push(block);
  }
  return blocks.join("\n");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function computeUsedSharedImportsFromBody(body, sharedTypeNames) {
  const used = new Set();
  const text = body || "";
  for (const name of sharedTypeNames) {
    if (name === "BaseResponse") continue;
    if (!text.includes(name)) continue;
    const re = new RegExp(`\\b${escapeRegExp(name)}\\b`);
    if (re.test(text)) used.add(name);
  }
  return used;
}

function toPascalCase(s) {
  return s.replace(/([-_]\w)/g, (m) => m[1].toUpperCase()).replace(/^\w/, (c) => c.toUpperCase());
}

function operationIdToFnName(operationId, method, pathKey) {
  if (operationId) {
    const s = operationId;
    return s[0].toLowerCase() + s.slice(1);
  }
  const pathName = pathKey
    .replace(/^\//, "")
    .replace(/\//g, "_")
    .replace(/{[^}]+}/g, "ById");
  return method.toLowerCase() + toPascalCase(pathName);
}

function formatOpLine({ method, path: pathKey, operation }) {
  const opId = operation.operationId ? ` (${operation.operationId})` : "";
  const summary = operation.summary ? ` - ${operation.summary}` : "";
  return `${method.toUpperCase()} ${pathKey}${opId}${summary}`;
}

function getOpTypes(spec, op) {
  const resSchema = getResponseSchema(op.operation);
  const reqSchema = getRequestBodySchema(op.operation);
  const dummyRefs = new Set();
  const resType = resSchema ? schemaToTs(spec, resSchema, dummyRefs) : "void";
  const reqType = reqSchema ? schemaToTs(spec, reqSchema, dummyRefs) : "undefined";
  const fnName = operationIdToFnName(op.operation.operationId, op.method, op.path);
  return { fnName, reqType, resType };
}

function refsToReadableModelNames(refs) {
  const names = [];
  for (const ref of refs) {
    if (typeof ref !== "string") continue;
    if (!ref.startsWith("#/")) continue;
    names.push(refToTypeName(ref));
  }
  return [...new Set(names)].sort();
}

function toMultiTagMarkdownReport({ apiDocUrl, tags, perTag, modelNames, outDir, spec }) {
  const lines = [];
  lines.push(`# Generated API Report`);
  lines.push(``);
  lines.push(`- **VITE_API_DOC_URL**: \`${apiDocUrl}\``);
  lines.push(`- **Generated dir**: \`${outDir}\``);
  lines.push(`- **Tags**: \`${tags.length}\``);
  lines.push(`- **Total endpoints**: \`${Object.values(perTag).reduce((n, v) => n + v.length, 0)}\``);
  lines.push(`- **Models**: \`${modelNames.length}\``);
  lines.push(``);
  lines.push(`## Tags`);
  tags.forEach((t) => lines.push(`- \`${t}\``));
  lines.push(``);
  for (const tag of tags) {
    lines.push(`## Endpoints for tag: ${tag}`);
    const ops = perTag[tag] || [];
    if (!ops.length) lines.push(`- (none)`);
    else {
      for (const op of ops) {
        const { fnName, reqType, resType } = getOpTypes(spec, op);
        lines.push(`- ${formatOpLine(op)}`);
        lines.push(`  - fn: \`${fnName}\``);
        lines.push(`  - req: \`${reqType}\``);
        lines.push(`  - res: \`${resType}\``);
      }
    }
    lines.push(``);
  }
  lines.push(`## Models / Interfaces`);
  if (modelNames.length === 0) lines.push(`- (none)`);
  else modelNames.forEach((m) => lines.push(`- \`${m}\``));
  lines.push(``);
  return lines.join("\n");
}

function generateApiFunctions(spec, operations) {
  const lines = [];
  for (const op of operations) {
    const { path: pathKey, method, operation } = op;
    const fnName = operationIdToFnName(operation.operationId, method, pathKey);
    const resSchema = getResponseSchema(operation);
    const reqSchema = getRequestBodySchema(operation);
    const dummyRefs = new Set();
    const resType = resSchema ? schemaToTs(spec, resSchema, dummyRefs) : "void";
    const reqType = reqSchema ? schemaToTs(spec, reqSchema, dummyRefs) : "undefined";
    const pathArg = pathKey.replace(/^\/+/, "");
    const isLogin = /login/i.test(pathKey);
    const hasBody = reqType !== "undefined";
    const shouldForceBody =
      isLogin && (method === "post" || method === "put" || method === "patch") && !hasBody;
    const effectiveReqType = shouldForceBody ? "Record<string, unknown>" : reqType;
    const initArg = isLogin ? "{ ...(init ?? {}), skipAuth: true }" : "init";
    if (method === "get" || method === "delete") {
      lines.push(
        `export async function ${fnName}(init?: RequestOptions): Promise<ApiResponse<${resType}>> {\n  return apiClient.${method}<${resType}>(\`${pathArg}\`, ${initArg});\n}`
      );
    } else if (hasBody || shouldForceBody) {
      lines.push(
        `export async function ${fnName}(body: ${effectiveReqType}, init?: RequestOptions): Promise<ApiResponse<${resType}>> {\n  return apiClient.${method}<${resType}>(\`${pathArg}\`, body as unknown as Record<string, unknown>, ${initArg});\n}`
      );
    } else {
      lines.push(
        `export async function ${fnName}(init?: RequestOptions): Promise<ApiResponse<${resType}>> {\n  return apiClient.${method}<${resType}>(\`${pathArg}\`, undefined, ${initArg});\n}`
      );
    }
  }
  return lines.join("\n\n");
}

function generateImports(spec, operations, bucketSlug, sharedTypeNames) {
  const typeRefs = new Set();
  for (const op of operations) {
    const resSchema = getResponseSchema(op.operation);
    const reqSchema = getRequestBodySchema(op.operation);
    if (resSchema?.$ref) typeRefs.add(refToTypeName(resSchema.$ref));
    // Some operations (e.g. DTVA, terminate customer) have no body: avoid importing unused request types.
    if (reqSchema?.$ref) {
      const hasBody =
        op.method !== "get" &&
        op.method !== "delete" &&
        !!schemaToTs(spec, reqSchema, new Set());
      if (hasBody) typeRefs.add(refToTypeName(reqSchema.$ref));
    }
  }
  if (typeRefs.size === 0) return "";

  const all = [...typeRefs].sort();
  const sharedRefs = all.filter((n) => sharedTypeNames.has(n));
  const bucketRefs = all.filter((n) => !sharedTypeNames.has(n));

  const imports = [];
  if (sharedRefs.length) imports.push(`import type { ${sharedRefs.join(", ")} } from '../${TYPES_SUBDIR}/shared';`);
  if (bucketRefs.length) imports.push(`import type { ${bucketRefs.join(", ")} } from '../${TYPES_SUBDIR}/${bucketSlug}';`);
  return imports.join("\n");
}

async function main() {
  const VITE_API_DOC_URL = getSwaggerUrl();
  const tagsToGenerate = getTagList();
  const groups = getGroupMappings();
  const sharedWhitelist = getSharedModelWhitelist();
  let spec;
  try {
    const res = await fetch(VITE_API_DOC_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${VITE_API_DOC_URL}`);
    spec = await res.json();
  } catch (e) {
    console.error("Failed to fetch Swagger:", e.message);
    process.exit(1);
  }

  const paths = spec.paths || {};
  const refsAll = new Set();
  const operationsByBucket = {};
  const refsByBucket = {};

  for (const [pathKey, pathItem] of Object.entries(paths)) {
    if (typeof pathItem !== "object") continue;
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      const op = pathItem[method];
      if (!op) continue;
      const tags = op.tags || [];
      if (groups) {
        for (const g of groups) {
          if (!g.tags.some((t) => tags.includes(t))) continue;
          if (!operationsByBucket[g.key]) operationsByBucket[g.key] = [];
          if (!refsByBucket[g.key]) refsByBucket[g.key] = new Set();
          collectRefs(spec, op, refsAll);
          collectRefs(spec, op, refsByBucket[g.key]);
          // Ensure we capture refs from extracted schemas too (some swagger shapes
          // are not reliably discovered by generic traversal).
          const resSchema = getResponseSchema(op);
          if (resSchema?.$ref) refsAll.add(resSchema.$ref);
          if (resSchema?.$ref) refsByBucket[g.key].add(resSchema.$ref);

          const reqSchema = getRequestBodySchema(op);
          if (reqSchema?.$ref && op.method !== "get" && op.method !== "delete") {
            refsAll.add(reqSchema.$ref);
            refsByBucket[g.key].add(reqSchema.$ref);
          }
          operationsByBucket[g.key].push({ path: pathKey, method, operation: op });
        }
      } else {
        for (const tag of tagsToGenerate) {
          if (!tags.includes(tag)) continue;
          if (!operationsByBucket[tag]) operationsByBucket[tag] = [];
          if (!refsByBucket[tag]) refsByBucket[tag] = new Set();
          collectRefs(spec, op, refsAll);
          collectRefs(spec, op, refsByBucket[tag]);
          // Ensure we capture refs from extracted schemas too (some swagger shapes
          // are not reliably discovered by generic traversal).
          const resSchema = getResponseSchema(op);
          if (resSchema?.$ref) refsAll.add(resSchema.$ref);
          if (resSchema?.$ref) refsByBucket[tag].add(resSchema.$ref);

          const reqSchema = getRequestBodySchema(op);
          if (reqSchema?.$ref && op.method !== "get" && op.method !== "delete") {
            refsAll.add(reqSchema.$ref);
            refsByBucket[tag].add(reqSchema.$ref);
          }
          operationsByBucket[tag].push({ path: pathKey, method, operation: op });
        }
      }
    }
  }

  const resolvedBuckets = Object.keys(operationsByBucket).sort();
  if (resolvedBuckets.length === 0) {
    console.error(
      groups
        ? `No endpoints found for API_GROUPS (and API_TAGS). Check your tag names match Swagger.`
        : `No endpoints found for API_TAGS: ${tagsToGenerate.join(", ")}`
    );
    process.exit(1);
  }

  function expandRefs(refs) {
    let prev = 0;
    while (refs.size !== prev) {
      prev = refs.size;
      for (const ref of [...refs]) {
        const def = resolveRef(spec, ref);
        if (def) collectRefs(spec, def, refs);
        if (def?.allOf) def.allOf.forEach((s) => collectRefs(spec, s, refs));
      }
    }
  }

  expandRefs(refsAll);
  for (const bucket of Object.keys(refsByBucket)) expandRefs(refsByBucket[bucket]);

  const alwaysShared = new Set([
    "ErrorResponse",
    "Extension",
    "Dialog",
    "CTA",
    "CTAItem",
    "I18NErrorString",
    ...sharedWhitelist,
  ]);
  const sharedTypeNames = computeSharedTypeNames(spec, refsByBucket, alwaysShared);

  const typesTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, "types.txt"), "utf8");
  const sharedHeader =
    `export interface BaseResponse<TData = unknown> {\n` +
    `  data?: TData;\n` +
    `  request_id?: string;\n` +
    `}\n\n` +
    `export interface PaginationResponse<TItem = unknown> {\n` +
    `  current_page?: number;\n` +
    `  items?: TItem[];\n` +
    `  limit?: number;\n` +
    `  total_items?: number;\n` +
    `  total_page?: number;\n` +
    `}\n\n` +
    `export interface PaginationResponseDTO<TPage = unknown> {\n` +
    `  data?: TPage;\n` +
    `  req_id?: string;\n` +
    `}\n\n`;
  const sharedModels = generateTypesForRefs(spec, refsAll, sharedTypeNames);
  const extraAliases = sharedTypeNames.has("github_com_yourpay_project_yourpay_backend_model_Metadata")
    ? `export type Metadata = github_com_yourpay_project_yourpay_backend_model_Metadata;\n\n`
    : "";
  const typesSharedOut = typesTemplate.replace("{{MODELS}}", sharedHeader + extraAliases + (sharedModels || ""));

  const perBucketTypesOut = [];
  for (const bucket of resolvedBuckets) {
    const bucketNames = typeNameSetFromRefs(refsByBucket[bucket] || new Set());
    const include = new Set([...bucketNames].filter((n) => !sharedTypeNames.has(n)));
    const body = generateTypesForRefs(spec, refsByBucket[bucket] || new Set(), include);
    const neededShared = computeUsedSharedImportsFromBody(body || "", sharedTypeNames);
    const needsBaseResponse = (body || "").includes("BaseResponse<");
    const needsPaginationResponse = (body || "").includes("PaginationResponse<");
    const needsPaginationResponseDTO = (body || "").includes("PaginationResponseDTO<");
    const importNames = [...neededShared].sort().filter((n) => n !== "BaseResponse");
    const hasAnyImport =
      needsBaseResponse || needsPaginationResponse || needsPaginationResponseDTO || importNames.length > 0;
    const importLine = hasAnyImport
      ? `import type { ${[
          ...(needsBaseResponse ? ["BaseResponse"] : []),
          ...(needsPaginationResponse ? ["PaginationResponse"] : []),
          ...(needsPaginationResponseDTO ? ["PaginationResponseDTO"] : []),
          ...importNames,
        ].join(", ")} } from './shared';\n\n`
      : "";
    const out = typesTemplate.replace("{{MODELS}}", importLine + (body || ""));
    perBucketTypesOut.push({ bucket, fileName: `${slugifyTag(bucket) || "api"}.ts`, content: out });
  }

  const apiTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, "api.txt"), "utf8");
  const perTagOutputs = [];
  for (const bucket of resolvedBuckets) {
    const operations = operationsByBucket[bucket] || [];
    if (operations.length === 0) {
      console.warn(`No endpoints found for "${bucket}".`);
    }
    const bucketSlug = slugifyTag(bucket) || "api";
    const imports = generateImports(spec, operations, bucketSlug, sharedTypeNames);
    const functions = generateApiFunctions(spec, operations);
    const apiOut = apiTemplate
      .replace("{{TAG}}", bucket)
      .replace("{{IMPORTS}}", imports)
      .replace("{{FUNCTIONS}}", functions || "// No endpoints for this tag.");
    const fileName = `${slugifyTag(bucket) || "api"}.ts`;
    perTagOutputs.push({ tag: bucket, fileName, apiOut, operations });
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const typesDir = path.join(OUT_DIR, TYPES_SUBDIR);
  fs.mkdirSync(typesDir, { recursive: true });
  fs.writeFileSync(path.join(typesDir, "shared.ts"), typesSharedOut, "utf8");
  for (const t of perBucketTypesOut) {
    fs.writeFileSync(path.join(typesDir, t.fileName), t.content, "utf8");
  }

  const clientsDir = path.join(OUT_DIR, CLIENTS_SUBDIR);
  fs.mkdirSync(clientsDir, { recursive: true });
  for (const o of perTagOutputs) {
    fs.writeFileSync(path.join(clientsDir, o.fileName), o.apiOut, "utf8");
  }

  const indexLines = [];
  for (const o of perTagOutputs)
    indexLines.push(`export * from './${CLIENTS_SUBDIR}/${o.fileName.replace(/\.ts$/, "")}';`);
  for (const t of perBucketTypesOut)
    indexLines.push(`export * from './${TYPES_SUBDIR}/${t.fileName.replace(/\.ts$/, "")}';`);
  indexLines.push(`export * from './${TYPES_SUBDIR}/shared';`);
  fs.writeFileSync(path.join(OUT_DIR, "index.ts"), indexLines.join("\n") + "\n", "utf8");

  const modelNames = refsToReadableModelNames(refsAll).filter((n) => n !== "unknown");
  const report = toMultiTagMarkdownReport({
    apiDocUrl: VITE_API_DOC_URL,
    tags: resolvedBuckets,
    perTag: Object.fromEntries(perTagOutputs.map((o) => [o.tag, o.operations])),
    modelNames,
    outDir: OUT_DIR,
    spec,
  });
  fs.writeFileSync(path.join(OUT_DIR, "REPORT.md"), report, "utf8");

  console.log(`VITE_API_DOC_URL: ${VITE_API_DOC_URL}`);
  console.log(groups ? `Groups: ${resolvedBuckets.length}` : `Tags: ${resolvedBuckets.length}`);
  for (const t of resolvedBuckets) {
    const ops = operationsByBucket[t] || [];
    console.log(`${groups ? "Group" : "Tag"}: ${t} (endpoints: ${ops.length})`);
    for (const op of ops) console.log(` - ${formatOpLine(op)}`);
  }
  console.log(`Models: ${modelNames.length}`);
  if (modelNames.length) console.log(` - ${modelNames.join(", ")}`);
  console.log("Generated:");
  console.log(" -", path.join(typesDir, "shared.ts"));
  for (const t of perBucketTypesOut) console.log(" -", path.join(typesDir, t.fileName));
  for (const o of perTagOutputs) console.log(" -", path.join(clientsDir, o.fileName));
  console.log(" -", path.join(OUT_DIR, "index.ts"));
  console.log(" -", path.join(OUT_DIR, "REPORT.md"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
