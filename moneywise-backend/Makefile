.PHONY: build run test clean migrate

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