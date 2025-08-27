# 🚀 MoneyWise Hybrid Tools

This directory contains the new hybrid approach for MoneyWise project management, combining the power of OCaml for complex operations with the simplicity of shell scripts for basic file operations.

## 🏗️ Architecture Overview

### **Hybrid Approach Benefits**
- **OCaml**: Type-safe, fast, and maintainable code for complex operations
- **Shell Scripts**: Simple, familiar, and efficient for basic file operations
- **Intelligent Routing**: Automatically chooses the right tool for each operation
- **Gradual Migration**: Keep existing scripts while building new capabilities

### **Operation Categories**

#### 🔧 Complex Operations (OCaml)
- **Database Management**: Schema validation, migrations, connection testing
- **API Operations**: HTTP requests, authentication, response handling
- **Configuration Management**: YAML/JSON parsing, validation, environment setup
- **Service Health Checks**: Process monitoring, port checking, health status
- **Prerequisite Validation**: Tool availability, version checking, dependency management

#### 📁 Simple Operations (Shell)
- **File Operations**: Copy, move, delete, permissions
- **Directory Management**: Create, list, navigate
- **Basic Commands**: Execute system commands, check file existence
- **Environment Setup**: Simple variable setting, path management

## 🛠️ Usage

### **Main Wrapper Script**
```bash
# Use the hybrid wrapper for all operations
./tools/moneywise-hybrid.sh <command> [options]

# Examples:
./tools/moneywise-hybrid.sh setup                    # Setup project (OCaml)
./tools/moneywise-hybrid.sh status                   # Check status (OCaml)
./tools/moneywise-hybrid.sh file-copy src.txt dst/   # Copy file (Shell)
./tools/moneywise-hybrid.sh create-dir new-folder    # Create directory (Shell)
```

### **Direct OCaml Tool Usage**
```bash
# Build the OCaml tool
cd tools/ocaml
dune build

# Use directly
dune exec -- moneywise-cli status
dune exec -- moneywise-cli setup --project-root /path/to/project
```

### **Makefile for OCaml Development** 🆕
```bash
# Navigate to OCaml tools directory
cd tools/ocaml

# Show all available targets
make help

# Build the project
make build

# Run tests
make test

# Check OCaml installation
make check-ocaml

# Install tool system-wide
make install

# Run specific commands
make run-status
make run-help

# Development workflow
make dev-setup    # Setup development environment
make dev          # Complete development workflow
make quick        # Quick build and test cycle
```

## 📁 Directory Structure

```
tools/
├── moneywise-hybrid.sh          # Main hybrid wrapper script
├── README.md                     # This file
└── ocaml/                       # OCaml-based tools
    ├── dune-project             # Dune project configuration
    ├── Makefile                 # 🆕 Development Makefile
    ├── lib/                     # Library code
    │   ├── dune                 # Library build configuration
    │   └── types.ml             # Core type definitions
    └── bin/                     # Executable code
        ├── dune                 # Binary build configuration
        └── moneywise_cli.ml     # Main CLI implementation
```

## 🔄 Migration Strategy

### **Phase 1: Hybrid Foundation** ✅
- [x] Create OCaml tool structure
- [x] Implement basic CLI commands
- [x] Create hybrid wrapper script
- [x] Route operations intelligently
- [x] 🆕 Add comprehensive Makefile

### **Phase 2: Core Operations** 🚧
- [ ] Database schema management
- [ ] API client operations
- [ ] Configuration parsing
- [ ] Service health monitoring

### **Phase 3: Advanced Features** 📋
- [ ] Database migrations
- [ ] Automated testing
- [ ] Performance monitoring
- [ ] Error reporting and logging

### **Phase 4: Full Migration** 📋
- [ ] Replace complex shell scripts
- [ ] Maintain shell scripts for simple operations
- [ ] Comprehensive testing suite
- [ ] Performance optimization

## 🧪 Development

### **Prerequisites**
- OCaml 4.14.0+
- Dune 3.0+
- OPAM package manager

### **Building**
```bash
# Using Dune directly
cd tools/ocaml
dune build

# Using Makefile (recommended)
cd tools/ocaml
make build
```

### **Testing**
```bash
# Test the hybrid wrapper
./tools/moneywise-hybrid.sh help
./tools/moneywise-hybrid.sh status

# Test OCaml tool directly
cd tools/ocaml
dune exec -- moneywise-cli --help

# Test using Makefile
cd tools/ocaml
make test
make run-status
```

### **Development Workflow**
```bash
cd tools/ocaml

# Complete development setup
make dev-setup

# Quick development cycle
make quick

# Full development workflow
make dev

# Check dependencies
make check-deps

# Format code
make format

# Run linting
make lint
```

### **Adding New Commands**

#### **OCaml Commands** (Complex Operations)
1. Add command to `tools/ocaml/bin/moneywise_cli.ml`
2. Update routing in `tools/moneywise-hybrid.sh`
3. Test with `./tools/moneywise-hybrid.sh <command>`
4. 🆕 Use `make run-<command>` for testing

#### **Shell Commands** (Simple Operations)
1. Add case to `handle_simple_operation()` in `tools/moneywise-hybrid.sh`
2. Test with `./tools/moneywise-hybrid.sh <command>`

## 🔍 Current Status

### **✅ Implemented**
- Basic OCaml CLI framework
- Hybrid operation routing
- Simple file operations
- Project status checking
- Help system
- 🆕 Comprehensive Makefile with development targets

### **🚧 In Progress**
- Database schema validation
- Configuration management
- Service health monitoring

### **📋 Planned**
- API client operations
- Advanced database operations
- Performance monitoring
- Comprehensive testing

## 🎯 Benefits of This Approach

1. **Type Safety**: OCaml provides compile-time guarantees
2. **Performance**: OCaml is fast and memory-efficient
3. **Maintainability**: Structured code vs. shell script complexity
4. **Gradual Migration**: No need to rewrite everything at once
5. **Best of Both Worlds**: Use the right tool for each job
6. **Production Ready**: OCaml is used in production systems worldwide
7. **🆕 Developer Experience**: Comprehensive Makefile for easy development

## 🔗 Integration with Existing Scripts

The hybrid approach is designed to work alongside your existing shell scripts:

- **Keep using** `scripts/` directory for specialized operations
- **Gradually migrate** complex operations to OCaml
- **Use hybrid wrapper** as the main entry point
- **Fall back to legacy** scripts when needed
- **🆕 Use Makefile** for OCaml development and testing

## 📚 Resources

- [OCaml Documentation](https://ocaml.org/docs/)
- [Dune Build System](https://dune.readthedocs.io/)
- [Cmdliner CLI Library](https://erratique.ch/software/cmdliner/)
- [MoneyWise Project](https://github.com/quyen/moneywise)

---

**Next Steps**: Start using the hybrid wrapper for your daily operations and gradually migrate complex database and API operations to the OCaml tools! The new Makefile makes development much easier with targets like `make dev`, `make quick`, and `make run-<command>`.
