# Simple Makefile for MoneyWise App

.PHONY: help install start android ios web clean

help: ## Show available commands
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make start    - Start Expo development server"
	@echo "  make android  - Start Android development"
	@echo "  make ios      - Start iOS development"
	@echo "  make web      - Start web development"
	@echo "  make clean    - Clean node_modules and cache"

install: ## Install dependencies
	npm install

start: ## Start Expo development server
	npx expo start

android: ## Start Android development
	npx expo start --android

ios: ## Start iOS development
	npx expo start --ios

web: ## Start web development
	npx expo start --web

clean: ## Clean node_modules and cache
	rm -rf node_modules
	rm -rf .expo
	npm install