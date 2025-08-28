# 💰 MoneyWise

> **Smart money management for everyone** - A beautiful, privacy-focused personal finance app that works offline.

[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue.svg)](https://reactnative.dev/)
[![Framework](https://img.shields.io/badge/framework-React%20Native%20%2B%20Expo-61dafb.svg)](https://expo.dev/)
[![Language](https://img.shields.io/badge/language-Rust%20%7C%20OCaml%20%7C%20TypeScript-orange.svg)](https://github.com/lykimq/MoneyWise#-built-with)
[![License](https://img.shields.io/badge/license-Non--Commercial-green.svg)](LICENSE)

## ✨ What is MoneyWise?

MoneyWise is a cross-platform personal finance app that helps you take control of your money. Built with privacy and simplicity in mind, it works completely offline while providing powerful insights into your spending habits, budget management, and savings goals.

**🎯 Perfect for:**
- Individuals who want to track daily expenses
- Budget-conscious people planning monthly spending
- Anyone saving for specific financial goals
- Users who value privacy and offline functionality

---

## 🚀 Key Features

### 💳 **Expense Tracking**
- Log income and expenses with categories and notes
- Support for multiple currencies
- Photo receipts and transaction history
- Smart categorization and auto-suggestions

### 📊 **Budget Management**
- Set monthly and yearly budgets by category
- Real-time spending alerts and notifications
- Visual progress tracking with charts
- Carryover budgets for long-term planning

### 🎯 **Savings Goals**
- Create personalized savings targets
- Track progress with visual indicators
- Set deadlines and milestone celebrations
- Multiple goal management

### 🌍 **Multi-Language Support**
- English, French, and Vietnamese
- Localized currency formats
- Cultural financial practices
- Easy language switching

### 🔒 **Privacy & Security**
- **100% offline-first** - Your data stays on your device
- No account creation required
- Optional cloud backup (coming soon)
- GDPR compliant

---

## 🛠️ Built With

### **Frontend**
- **React Native** + **Expo SDK 53** - Cross-platform mobile development
- **TypeScript** - Type-safe code and better developer experience
- **React Navigation** - Smooth, native navigation experience
- **TanStack Query** - Efficient data fetching and caching
- **React Native Reanimated** - Buttery smooth animations

### **Backend**
- **Rust** - High-performance, memory-safe backend
- **Axum** - Modern, fast web framework
- **PostgreSQL** - Robust, scalable database (Supabase + Local)
- **Redis** - Lightning-fast caching layer
- **SQLx** - Async, compile-time checked SQL

### **Development Tools**
- **OCaml** - Type-safe, high-performance development tools
- **Dune** - Modern build system
- **OCamlDoc** - Professional documentation generation (better than odoc!)
- **Cmdliner** - Professional CLI framework
- **Hybrid Architecture** - OCaml for complex operations, shell scripts for simple tasks
- **Professional Workflow** - Makefile integration and gradual migration strategy

---

## 🏗️ Project Architecture

```
MoneyWise/
├── 🔄 .github/workflows        # CI/CD pipelines and GitHub Actions
├── 📱 moneywise-app/           # React Native frontend
├── 🦀 moneywise-backend/       # Rust backend API
├── 🗄️ scripts/                 # Setup and utility scripts
├── 🧰 tools/                   # Development tools and utilities
│   ├── 🐫 ocaml/              # OCaml-based project management tools
│   └── 🔀 moneywise-hybrid.sh # Hybrid wrapper for OCaml + shell operations
├── 📚 docs/                    # Project documentation and guides
│   └── 🐫 ocamldoc/           # Development tools documentation (deployed to GitHub Pages)
```

### **Database Strategy**
- **Production**: Supabase (hosted, managed, scalable)
- **Development**: Local PostgreSQL (offline development)
- **Hybrid**: Automatic environment detection and migration compatibility

---

## 📱 Screenshots

*Coming soon - Beautiful UI previews of the app in action*

---

## 🎯 Why Choose MoneyWise?

| Feature | MoneyWise | Other Apps |
|---------|-----------|------------|
| **Offline First** | ✅ Always works | ❌ Requires internet |
| **Privacy** | ✅ Your data stays local | ❌ Cloud-dependent |
| **Multi-Currency** | ✅ Native support | ❌ Limited options |
| **No Signup** | ✅ Start immediately | ❌ Account required |
| **Open Source** | ✅ Transparent & free | ❌ Proprietary |
| **Development Tools** | ✅ OCaml + Shell hybrid | ❌ Single approach |

---

## 📋 Current Status

**Foundation Complete - Core Features in Development** - The app has a solid architecture and basic UI framework:

- ✅ **Project Setup** - React Native + Expo + Rust backend
- ✅ **Navigation** - Bottom tab navigation with 5 main screens
- ✅ **Basic UI Framework** - Component library and design system
- ✅ **Backend API** - Budget management endpoints with Redis caching
- ✅ **Database Schema** - PostgreSQL with migrations and sample data
- ✅ **Development Tools** - OCaml-based project management tools
- 🔄 **Core Features** - Transaction management, budgets, goals (UI ready, backend in progress)
- 📋 **Testing** - Comprehensive test suite setup
- 🎨 **Polish** - Animations, accessibility, performance optimization

---

## 🚀 Getting Started

### For Users
*Coming soon to App Store and Google Play*

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/lykimq/MoneyWise.git
   cd moneywise
   ```

2. **Frontend Setup**
   ```bash
   cd moneywise-app
   npm install
   npx expo start
   ```

3. **Backend Setup**
   ```bash
   cd moneywise-backend
   # See README.md in the backend directory for detailed setup instructions
   ```

4. **Development Tools Setup** (Optional)
   ```bash
   cd tools/ocaml
   make dev-setup    # Setup development environment
   make build        # Build tools
   make test         # Run tests
   ./tools/moneywise-hybrid.sh help  # Show available commands
   ```

5. **📚 Development Tools API Documentation**
   **[📖 View API Docs →](https://lykimq.github.io/MoneyWise)** - Complete API reference
---

## 📋 Roadmap

### **Q3 2025** - Core Features Completion
- [x] Project setup and architecture
- [x] Backend API with budget management
- [x] Database schema and migrations
- [x] Basic UI framework and navigation
- [x] Development tools and architecture
- [ ] Transaction management (backend + frontend integration)
- [ ] Budget tracking (frontend integration)
- [ ] Savings goals (frontend integration)
- [ ] Multi-language support

### **Q4 2025** - Enhanced Features
- [ ] Advanced analytics and reports
- [ ] Recurring transactions
- [ ] Export/import functionality
- [ ] Cloud sync (optional)

### **Q1 2026** - Advanced Features
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Debt management
- [ ] Financial insights AI

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 **Report bugs** - Open an issue with detailed steps
- 💡 **Suggest features** - Share your ideas for improvement
- 🔧 **Fix issues** - Pick up a good first issue
- 📚 **Improve docs** - Help make MoneyWise easier to use
- 🌍 **Add languages** - Help with translations
- 🐫 **OCaml Development** - Help improve development tools

**Getting Started with Contributing:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Non-Commercial License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Native community** - For the amazing mobile framework
- **Expo team** - For simplifying React Native development
- **Rust community** - For the performant backend language
- **OCaml community** - For the type-safe development tools
- **Supabase team** - For the excellent database hosting platform
- **Contributors** - Everyone who helps make MoneyWise better

---

## 📞 Support & Community

- **GitHub Issues** - [Report bugs & request features](https://github.com/lykimq/MoneyWise/issues)
- **Documentation** - [Setup & usage guides](https://github.com/lykimq/MoneyWise/tree/main/docs)
- **Development Tools** - [OCaml tools & architecture](https://github.com/lykimq/MoneyWise/tree/main/tools)

---

<div align="center">

**Made with ❤️ by the MoneyWise team**

*Empowering people to take control of their financial future*

[⭐ Star this repo](https://github.com/lykimq/MoneyWise) • [🐛 Report an issue](https://github.com/lykimq/MoneyWise/issues) • [📖 View documentation](https://github.com/lykimq/MoneyWise/tree/main/docs)

</div>

