.PHONY: build run test clean migrate install-sqlx start-redis dev

# Build the project
build:
	cargo build

# Run the development server
run:
	cargo run

# Run tests
test:
	cargo test

# Clean build artifacts
clean:
	cargo clean

# Run database migrations
migrate:
	sqlx migrate run

# Install sqlx CLI if not present
install-sqlx:
	cargo install sqlx-cli --no-default-features --features postgres

# Start Redis locally with a best-effort approach
# - Tries systemd services (redis or redis-server)
# - Falls back to launching redis-server in the background
start-redis:
	@echo "Starting Redis..."
	@([ -x "$$(command -v systemctl)" ] && (sudo systemctl start redis || sudo systemctl start redis-server)) || (redis-server --daemonize yes || true)
	@redis-cli ping || true

# Convenience: start Redis then run the backend
dev: start-redis run