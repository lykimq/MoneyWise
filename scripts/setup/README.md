# ⚙️ Setup Scripts

Environment setup, service management, and prerequisites for MoneyWise development and deployment.

## 📁 Files

### `prereq-checker.sh` - **System Prerequisites Validator**
**Purpose**: Verifies all required tools, services, and dependencies are available and properly configured.

**What it checks**:
- **System Tools**: Git, curl, wget, tar, unzip
- **Development Tools**: Rust, Cargo, SQLx CLI
- **Database Tools**: PostgreSQL client (psql), Redis client
- **System Services**: PostgreSQL, Redis service status
- **Network**: Internet connectivity for package downloads
- **Permissions**: File and directory access rights

**Usage**:
```bash
# Check all prerequisites
./prereq-checker.sh

# Check specific category
./prereq-checker.sh --check-tools
./prereq-checker.sh --check-database
./prereq-checker.sh --check-services

# Fix missing prerequisites (interactive)
./prereq-checker.sh --fix-missing
```

**Output**: Clear pass/fail indicators with actionable recommendations for missing components.

### `service-manager.sh` - **Service Lifecycle Management**
**Purpose**: Manages development services (PostgreSQL, Redis) with start, stop, restart, and status operations.

**Supported Services**:
- **PostgreSQL**: Database service management
- **Redis**: Caching service management
- **Custom Services**: Extensible for additional services

**Usage**:
```bash
# Service status
./service-manager.sh status

# Start services
./service-manager.sh start
./service-manager.sh start postgresql
./service-manager.sh start redis

# Stop services
./service-manager.sh stop
./service-manager.sh stop postgresql

# Restart services
./service-manager.sh restart
./service-manager.sh restart postgresql

# Service information
./service-manager.sh info postgresql
```

**Features**:
- Cross-platform service detection
- Automatic dependency resolution
- Service health monitoring
- Graceful shutdown handling

### `env-manager.sh` - **Environment Configuration Manager**
**Purpose**: Manages .env files, environment variables, and configuration across different environments.

**Capabilities**:
- **Environment Creation**: Generate .env files from templates
- **Configuration Validation**: Verify required variables are set
- **Environment Switching**: Manage multiple environment configurations
- **Secure Handling**: Protect sensitive credentials and API keys
- **Template Management**: Use environment-specific templates

**Usage**:
```bash
# Create new environment
./env-manager.sh create local
./env-manager.sh create development
./env-manager.sh create production

# Validate environment
./env-manager.sh validate

# List environments
./env-manager.sh list

# Switch environment
./env-manager.sh switch development

# Update configuration
./env-manager.sh update DATABASE_URL
```

**Environment Types**:
- **local**: Local development with localhost services
- **development**: Development server configuration
- **staging**: Pre-production testing environment
- **production**: Live production environment

### `get-supabase-credentials.sh` - **Supabase Configuration Setup**
**Purpose**: Retrieves and configures Supabase credentials for database and authentication services.

**What it does**:
- **Credential Retrieval**: Fetches Supabase project credentials
- **Configuration Setup**: Updates .env files with Supabase settings
- **Validation**: Verifies credential validity and connectivity
- **Integration**: Sets up Supabase CLI configuration

**Usage**:
```bash
# Setup Supabase credentials
./get-supabase-credentials.sh

# Setup with specific project
./get-supabase-credentials.sh --project-ref your-project-ref

# Update existing credentials
./get-supabase-credentials.sh --update

# Validate credentials
./get-supabase-credentials.sh --validate
```

**Requirements**:
- Supabase account and project
- Supabase CLI installed
- Valid project reference ID

## 🔧 Usage Patterns

### **Initial Development Setup**
```bash
# 1. Check prerequisites
./prereq-checker.sh

# 2. Start required services
./service-manager.sh start

# 3. Create environment
./env-manager.sh create local

# 4. Setup Supabase (if using)
./get-supabase-credentials.sh
```

### **Environment Management**
```bash
# Switch between environments
./env-manager.sh switch development
./env-manager.sh switch production

# Validate configuration
./env-manager.sh validate

# Update specific variables
./env-manager.sh update RUST_LOG
```

### **Service Management**
```bash
# Daily development workflow
./service-manager.sh start    # Start services
./service-manager.sh status   # Check status
./service-manager.sh stop     # Stop services

# Troubleshooting
./service-manager.sh restart postgresql
./service-manager.sh info redis
```

## 📋 Features

### **Cross-Platform Compatibility**
- **Linux**: Systemd, init.d, and service management
- **macOS**: Launchd and Homebrew services
- **Windows**: WSL and Windows services (via WSL)
- **Docker**: Container-based service detection

### **Environment Management**
- **Template System**: Environment-specific configuration templates
- **Validation**: Required variable checking and validation
- **Security**: Secure credential handling and storage
- **Backup**: Automatic .env file backup and restoration

### **Service Integration**
- **Health Checks**: Service status and connectivity validation
- **Dependency Management**: Automatic service startup order
- **Monitoring**: Service performance and resource usage
- **Logging**: Comprehensive service operation logging

### **Prerequisites Validation**
- **Tool Detection**: Automatic tool availability checking
- **Version Validation**: Minimum version requirement checking
- **Configuration Verification**: Tool configuration validation
- **Installation Guidance**: Step-by-step installation instructions

## 🔗 Dependencies

**Required**:
- `../core/module-loader.sh` - Core utility loading
- `../core/output-utils.sh` - Output formatting
- `../core/service-utils.sh` - Service management utilities
- `../core/env-utils.sh` - Environment utilities

**External Dependencies**:
- **PostgreSQL**: Database service
- **Redis**: Caching service
- **Supabase CLI**: Cloud service integration
- **System tools**: Git, curl, wget, etc.

## 🚀 Use Cases

### **Development Environment Setup**
1. **New Developer Onboarding**: Complete environment setup
2. **Project Initialization**: First-time project setup
3. **Environment Changes**: Switching between configurations
4. **Service Management**: Starting/stopping development services

### **Production Deployment**
1. **Environment Configuration**: Production environment setup
2. **Service Validation**: Pre-deployment service checks
3. **Credential Management**: Secure production credentials
4. **Health Monitoring**: Service status validation

### **Team Collaboration**
1. **Standardization**: Consistent environment configuration
2. **Documentation**: Environment setup procedures
3. **Troubleshooting**: Common setup issue resolution
4. **Updates**: Environment configuration updates

## ⚠️ Safety Notes

### **Safe Operations** (Read-Only)
- ✅ Prerequisites checking
- ✅ Service status monitoring
- ✅ Environment validation
- ✅ Configuration listing

### **Modifying Operations** (Use with Care)
- ⚠️ Service start/stop/restart
- ⚠️ Environment file creation/modification
- ⚠️ Configuration updates
- ⚠️ Credential management

**Always review**:
- Environment file changes before applying
- Service operations before executing
- Credential updates before saving

## 🔍 Troubleshooting

### **Common Issues**
- **Permission denied**: Check script permissions and user rights
- **Service not found**: Verify service installation and detection
- **Environment errors**: Check .env file syntax and variables
- **Credential issues**: Validate Supabase project and API keys

### **Debug Mode**
```bash
# Enable debug output
DEBUG=1 ./prereq-checker.sh
DEBUG=1 ./service-manager.sh status

# Verbose operations
./env-manager.sh --verbose
./service-manager.sh --verbose
```

### **Recovery Procedures**
- **Environment backup**: Automatic .env file backups
- **Service recovery**: Automatic service restart on failure
- **Configuration reset**: Reset to last known good configuration
- **Cleanup**: Remove temporary files and configurations

## 📊 Success Indicators

**Prerequisites**:
- ✅ All required tools installed and accessible
- ✅ Services running and healthy
- ✅ Network connectivity verified
- ✅ Permissions properly configured

**Services**:
- ✅ PostgreSQL running and accepting connections
- ✅ Redis running and responding to commands
- ✅ Services starting/stopping cleanly
- ✅ Health checks passing

**Environment**:
- ✅ .env files created and validated
- ✅ Required variables properly set
- ✅ Configuration templates applied
- ✅ Credentials securely stored
