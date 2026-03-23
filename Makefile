.PHONY: run build lint lint-staged hooks-init generate-api help

help:
	@echo "Usage:"
	@echo "  make run            Start dev server"
	@echo "  make build          Build"
	@echo "  make lint           Lint"
	@echo "  make lint-staged    Run lint-staged checks"
	@echo "  make hooks-init     Initialize husky hooks"
	@echo "  make generate-api   Generate API client from Swagger using API_TAGS."
	@echo ""
	@echo "Configure VITE_API_DOC_URL in .env. Generation selection is in Makefile vars (API_TAGS, API_SHARED_MODELS)."
	@echo "Override example: make generate-api API_TAGS=\"Operators / Auth,Files\""

run:
	npm run dev

build:
	npm run build

lint:
	npm run lint

lint-staged:
	npx lint-staged

hooks-init:
	npx husky init

# API client generator.
-include .env
export

GENERATED_DIR := src/shared/api/generated
SCRIPT_DIR := scripts/generate-api

# Default generation settings (override by passing env vars to `make`).
# Includes Operator Countries so that /v1/operators/countries endpoints are generated.
API_TAGS ?= Operators / Auth,Operators / Report,Files,Master Data,Operator / Biller,Operator / Fees,Operators / Action Approval,Operators / Customer,Operators / DTVA,Operators / Dynamic Link,Operators / Exchange Rate,Operators / Identity Access,Operators / Partner,Operators / Scratch Card,Operators / Verification Submission,Operators / Voucher,Operators / transactions,User,User / Authentication,Address Detail,Deprecated,Operator Countries

generate-api:
	@rm -rf $(GENERATED_DIR)
	@mkdir -p $(GENERATED_DIR)
	@API_TAGS="$(API_TAGS)" node $(SCRIPT_DIR)/generate-api.mjs
	@echo "Generated API client in $(GENERATED_DIR)/"
