ENV_FILE := ../.env
BIN_PATH := ./bin/server
SEED_PATH := ./scripts/seed.go

ifeq (seed,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

define file_exists
	@if [ -e /.dockerenv ]; then \
		$(1); \
	elif [ -e ../.env ]; then \
		env $$(cat ../.env | grep -v '^#' | xargs) $(1); \
	else \
		echo "Run inside a container or create $(ENV_FILE) file"; \
		exit 1; \
	fi
endef

build:
	@go build -o $(BIN_PATH)

run: build
	@$(call file_exists, $(BIN_PATH))

seed:
	@echo "Waiting for database..."
	@$(call file_exists, go run $(SEED_PATH) $(RUN_ARGS))
