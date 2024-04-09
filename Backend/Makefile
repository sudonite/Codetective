ENV_FILE := ../.env
BIN_PATH := ./bin/server
SEED_PATH := ./scripts/seed.go

.PHONY: build run seed

build:
	@go build -o $(BIN_PATH)

run: build
	@$(call file_exists, $(BIN_PATH))

seed:
	@$(call file_exists, go run $(SEED_PATH))

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
