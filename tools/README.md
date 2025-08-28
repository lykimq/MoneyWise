# 🚀 MoneyWise Development Tools

**Purpose**: Streamline MoneyWise project development with a unified interface that intelligently routes commands to the most appropriate tool - either type-safe OCaml CLI tools or efficient shell scripts.

## 🎯 Project Structure

The MoneyWise project has multiple script directories and tools for different tasks:
- `scripts/core/` - Utility functions and helpers
- `scripts/database/` - Database operations and schema management
- `scripts/setup/` - Environment setup and service management
- `scripts/testing/` - Test execution and validation
- `moneywise-backend/` - Rust backend operations
- `moneywise-app/` - React Native app operations

## 🔄 Why We Keep Both Approaches

We intentionally maintain both OCaml CLI tools and shell scripts because each approach has unique strengths that complement the other:

### **OCaml CLI Tools - Strengths:**
- **Type Safety**: Compile-time error checking prevents runtime failures
- **Maintainability**: Structured code is easier to debug and enhance
- **Performance**: Native compilation for compute-intensive operations
- **Reliability**: Strong type system catches errors before deployment
- **Scalability**: Tools grow robustly with project complexity

### **OCaml CLI Tools - Disadvantages:**
- **Development Speed**: Slower to write and modify for simple operations
- **Build Time**: Requires compilation before testing changes
- **Learning Curve**: Team needs OCaml knowledge for modifications
- **Overhead**: Unnecessary complexity for simple file operations

### **Shell Scripts - Strengths:**
- **Speed**: Quick to write, modify, and test
- **Flexibility**: Easy to adapt and customize for specific needs
- **Ubiquity**: Available on all Unix-like systems without dependencies
- **I/O Efficiency**: Excellent for file operations and system calls
- **Debugging**: Simple to trace and troubleshoot

### **Shell Scripts - Disadvantages:**
- **Error Prone**: No compile-time checking, runtime errors common
- **Maintenance**: Can become complex and hard to maintain over time
- **Portability**: May break across different shell environments
- **Type Safety**: No guarantees about data structure integrity

## 🏗️ Our Hybrid Architecture

**Unified Interface**: One command (`./tools/moneywise-hybrid.sh`) that intelligently routes to the best tool for each task:
- **Intelligent Routing**: Automatically chooses OCaml or shell script based on command type
- **Consistent Interface**: Same command pattern regardless of underlying implementation
- **Centralized Control**: Manage all project operations from one place
- **Best of Both Worlds**: Leverage strengths of each approach where they shine

## 🛠️ What You Get

```bash
# One command for all operations
./tools/moneywise-hybrid.sh <command>

# Examples:
./tools/moneywise-hybrid.sh check      # Verify project prerequisites (OCaml)
./tools/moneywise-hybrid.sh status     # Show project health (OCaml)
./tools/moneywise-hybrid.sh test       # Execute test suite (OCaml)
./tools/moneywise-hybrid.sh setup      # Initialize project (Shell)
./tools/moneywise-hybrid.sh db-schema  # Database operations (Shell)
```

## 📁 What's Inside

```
tools/
├── moneywise-hybrid.sh    # Main interface - use this for everything
├── ocaml/                 # Type-safe tools for complex operations
└── README.md              # This file
```

## 🔄 Current Implementation Status

**OCaml CLI Tools (Currently Implemented)**:
- ✅ `check` - Project prerequisites checking
- ✅ `status` - Project status and health monitoring
- ✅ `test` - Test execution and validation
- ✅ `setup` - Basic project setup operations

**Shell Script Commands (Currently Available)**:
- 🔧 **Phase 1: Initial Setup & Prerequisites**
  - `prereq-checker` - Verify system requirements
- ⚙️ **Phase 2: Environment & Configuration**
  - `get-supabase-credentials` - Get Supabase database credentials
  - `env-manageer` - Environment management
- 🚀 **Phase 2.5: Project Setup & Installation**
  - `setup` - Complete project setup (root)
  - `setup-backend` - Backend-specific setup (if needed)
- 🗄️ **Phase 3: Database Setup & Management**
  - `schema-manager` - Database schema management
  - `db-operations` - Database operations
- 🔧 **Phase 4: Service Management**
  - `service-manager` - Service management
- 🧪 **Phase 5: Testing & Validation**
  - `test-schema-manager` - Test database schema
  - `test-db-connection` - Test database connection
  - `test-setup-scripts` - Test setup scripts
  - `run-all-tests` - Run all tests
- 📊 **Phase 6: Monitoring & Quick Checks**
  - `quick-check` - Quick project check

## 🚀 Typical Setup Workflow

The hybrid wrapper provides a logical execution order:

1. **`prerequ-checker`** - Verify system requirements
2. **`get-supabase-credentials`** - Configure database access
3. **`setup`** - Complete project setup
4. **`setup-backend`** - Backend-specific setup (if needed)
5. **`schema-manager`** - Set up database structure
6. **`service-manager`** - Start required services
7. **`run-all-tests`** - Validate everything works
8. **`quick-check`** - Monitor ongoing status

## 💡 Why This Hybrid Approach Matters

- **Development Velocity**: Spend time building features, not figuring out tools
- **Code Quality**: Type safety prevents errors before they reach production
- **Team Onboarding**: New developers can contribute faster with unified interface
- **Maintenance**: Structured code is easier to debug and enhance
- **Scalability**: Tools grow with project complexity
- **Flexibility**: Keep efficient shell scripts for simple operations while gaining type safety for complex ones
- **Strategic Choice**: Intentional decision to leverage the best of both worlds

## 🔮 Strategic Benefits

Our hybrid approach provides:
- **Optimal Tool Selection**: Use the right tool for each specific task
- **Risk Mitigation**: Type safety for critical operations, speed for simple tasks
- **Team Flexibility**: Developers can work with familiar tools while gaining new capabilities
- **Performance Optimization**: OCaml for compute-intensive operations, shell scripts for I/O operations
- **Maintenance Balance**: Structured code for complex logic, quick fixes for simple operations
