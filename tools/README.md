# 🚀 MoneyWise Development Tools

**Purpose**: Streamline MoneyWise project development with a unified interface that intelligently routes commands to the most appropriate tool - either type-safe OCaml CLI tools (DEFAULT) or efficient shell scripts (use `--shell` flag).

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

### **OCaml CLI Tools - Strengths (DEFAULT):**
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
- **OCaml First**: OCaml tools are the DEFAULT for commands that have OCaml equivalents
- **Shell Opt-in**: Use `--shell` flag to explicitly run shell script versions
- **Intelligent Routing**: Automatically chooses OCaml or shell script based on command type
- **Consistent Interface**: Same command pattern regardless of underlying implementation
- **Centralized Control**: Manage all project operations from one place
- **Best of Both Worlds**: Leverage strengths of each approach where they shine

## 🛠️ What You Get

```bash
# One command for all operations
./tools/moneywise-hybrid.sh <command>

# OCaml commands (DEFAULT - no flags needed)
./tools/moneywise-hybrid.sh check      # Verify project prerequisites (OCaml)
./tools/moneywise-hybrid.sh status     # Show project health (OCaml)
./tools/moneywise-hybrid.sh test       # Execute test suite (OCaml)
./tools/moneywise-hybrid.sh setup      # Initialize project (OCaml)

# Shell commands (require --shell flag)
./tools/moneywise-hybrid.sh --shell prereq-checker      # Verify prerequisites (Shell)
./tools/moneywise-hybrid.sh --shell setup-backend       # Backend setup (Shell)
./tools/moneywise-hybrid.sh --shell schema-manager      # Database operations (Shell)
```

## 📁 What's Inside

```
tools/
├── moneywise-hybrid.sh    # Main interface - use this for everything
├── ocaml/                 # Type-safe tools for complex operations
└── README.md              # This file
```

## 🔄 Current Implementation Status

**OCaml CLI Tools (DEFAULT - Currently Implemented)**:
- ✅ `setup` - Basic project setup operations
- ✅ `check` - Project prerequisites checking
- ✅ `status` - Project status and health monitoring
- ✅ `test` - Test execution and validation

**Shell Script Commands (Use `--shell` flag)**:
- ✅ **Phase 1: Prerequisites & Structure Verification**
  - `prereq-checker` - Verify system requirements (Shell - independent use)
- 🚀 **Phase 2: Complete Project Setup (Main Setup)**
  - `setup` - Complete project setup (OCaml - DEFAULT) - runs all setup phases
  - `setup-backend` - Backend-specific setup (Shell - when user wants backend only)
- ⚙️ **Phase 3: Environment & Configuration (Additional Setup)**
  - `get-supabase-credentials` - Get Supabase database credentials (Shell)
  - `env-manager` - Environment management (Shell)
- 🗄️ **Phase 4: Database Operations (Additional Setup)**
  - `schema-manager` - Database schema management (Shell)
  - `db-operations` - Database operations (Shell)
- 🔧 **Phase 5: Service Management (Additional Setup)**
  - `service-manager` - Service management (Shell)
- 🧪 **Phase 6: Testing & Validation (Additional Setup)**
  - `test-schema-manager` - Test database schema (Shell)
  - `test-db-connection` - Test database connection (Shell)
  - `test-setup-scripts` - Test setup scripts (Shell)
  - `run-all-tests` - Run all tests (Shell)
- 📊 **Phase 7: Monitoring & Quick Checks (Additional Setup)**
  - `quick-check` - Quick project check (Shell)

## 🚀 Typical Setup Workflow

The hybrid wrapper provides a logical execution order:

1. **`setup`** - Complete project setup (OCaml - DEFAULT)
2. **`check`** - Verify setup was successful (OCaml - DEFAULT)
3. **`--shell get-supabase-credentials`** - Configure database access (Shell)
4. **`--shell setup-backend`** - Backend-specific setup (Shell)
5. **`--shell schema-manager`** - Set up database structure (Shell)
6. **`--shell service-manager`** - Start required services (Shell)
7. **`--shell run-all-tests`** - Validate everything works (Shell)
8. **`--shell quick-check`** - Monitor ongoing status (Shell)

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

## 📝 Migration Strategy

**OCaml First Approach**: We're gradually migrating functionality from shell scripts to OCaml tools:
- **Phase 1**: Core operations (check, status, test, setup) ✅ Complete
- **Phase 2**: Environment and configuration management 🔄 In Progress
- **Phase 3**: Database operations 🔄 Planned
- **Phase 4**: Service management 🔄 Planned
- **Phase 5**: Testing and validation 🔄 Planned

**Shell Scripts**: Will remain available via `--shell` flag for:
- Operations not yet migrated to OCaml
- Quick debugging and development
- System-specific operations that benefit from shell flexibility
