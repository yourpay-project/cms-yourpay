# API Client Generator

Generates TypeScript API client and types from the Swagger/OpenAPI spec.

## Usage

```bash
make generate-api
```

With a custom Swagger doc URL:

```bash
API_DOC_URL=https://your-api.example.com/swagger/doc.json make generate-api
```

Generate by tags:

```bash
API_TAGS="Operators / Auth,Operators / Report" make generate-api
```

Group multiple Swagger tags into one output file (similar to KMP “mapTagsToPackage” concept):

```bash
API_GROUPS="auth:Operators / Auth|User / Authentication;master:Master Data|Address Detail;ops:Operators / Report|Operators / Customer;files:Files" make generate-api
```

## Output structure

- **`src/shared/api/generated/types/shared.ts`**
  - `BaseResponse<T>`: generic wrapper for backend responses.
  - `PaginationResponse<TItem>` and `PaginationResponseDTO<TPage>`: shared pagination models.
  - Shared enums/models that are reused across multiple tags (e.g. currency, country, metadata).
- **`src/shared/api/generated/types/*.ts`**
  - Per-tag/per-group models.
  - Pagination helpers in the form `XPagination` and `XPaginationResponseDTO` instead of the long swagger names (`PaginationResponse_array_model_X`, `PaginationResponseDTO_model_PaginationResponse_array_model_X`).
- **`src/shared/api/generated/clients/*.ts`**
  - API functions per tag/group.
  - Requests/responses are fully typed, reusing the shared models above.
- **`src/shared/api/generated/index.ts`**
  - Barrel exporting all clients and types for convenient imports.
- **`src/shared/api/generated/REPORT.md`**
  - Human readable report (URL hit, endpoints, models, tags, function names, request/response types).

Generated files are listed in **`.gitignore`** — do not commit them. Regenerate after backend spec changes.

## Usage in app (FSD)

```ts
import {
  postV1OperatorsLogin,
  postV1OperatorsLoginSso,
} from "@/shared/api/generated";
import type {
  OperatorLoginResponseDTO,
  OperatorSSOLoginRequest,
} from "@/shared/api/generated";
```

## Configuration

- **`API_DOC_URL`** (env)
  - Swagger doc URL (example: `https://krakend-dev.yourpay.co.id/api/swagger/doc.json`).
  - Set in `.env` at the repo root.
- **`API_TAGS`** (make var / env)
  - Comma-separated Swagger tags to generate.
  - Defaults live in the `Makefile` and can be overridden per-run:
    - `make generate-api API_TAGS="Operators / Auth,Files"`
- **`API_GROUPS`** (make var / env, optional)
  - Groups multiple Swagger tags into a single generated module.
  - Format: `API_GROUPS="auth:Operators / Auth|User / Authentication;master:Master Data|Address Detail"`.
- **`API_SHARED_MODELS`** (make var / env, optional)
  - Comma-separated type names that should always live in `types/shared.ts`.
  - Only affects where types are emitted; the source of truth remains the Swagger schema.

Templates: `scripts/generate-api/templates/*.txt`.
