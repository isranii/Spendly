# 💰 Spendly - Luxury Finance Tracking App

> An exclusive financial sanctuary designed for sophisticated wealth orchestration, enabling users to track income and expenses, manage budgets, and achieve financial goals with an elegant user experience.

## ✨ Features

- **📊 Portfolio Overview**: Quick insights into net worth, monthly income, expenses, and net profit/loss
- **💳 Transaction Management**: Record and categorize income and expenses with detailed descriptions
- **🎯 Budgeting**: Create, manage, and monitor budgets for various categories (weekly, monthly, yearly periods)
- **🏆 Financial Goals**: Set, track, and update progress on financial goals with customizable categories, priorities, and deadlines
- **🔐 User Authentication**: Secure sign-in/sign-up with email/password, or anonymous sign-in
- **📱 Responsive & Elegant UI**: A luxury-themed design built with Tailwind CSS for a seamless experience across devices

## 💻 Tech Stack

### Frontend
- **React** (v19.0.0) - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Sonner** - Beautiful toast notifications
- **TypeScript** - Type-safe development

### Backend
- **Convex** - Fullstack Backend as a Service
- **@convex-dev/auth** - Authentication for Convex
- Real-time database with automatic sync
- Serverless functions for queries and mutations

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **npm-run-all** - Run multiple scripts in parallel

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/isranii/Spendly.git
   cd Spendly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or using yarn
   yarn install
   ```

3. **Set up Convex Backend**
   
   Install Convex CLI globally:
   ```bash
   npm install -g convex
   ```
   
   Run the setup script for environment configuration:
   ```bash
   node setup.mjs
   ```
   
   This creates a `.env.local` file with necessary Convex Auth variables.

4. **Start the development server**
   ```bash
   npm run dev
   # or using yarn
   yarn dev
   ```
   
   This runs both the frontend (Vite) and backend (Convex) in parallel.

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Architecture

```
Spendly/
├── 📂 src/                          # Frontend React application
│   ├── 📄 App.tsx                   # Main application component
│   ├── 📄 SignInForm.tsx            # Authentication form
│   ├── 📄 SignOutButton.tsx         # Sign out functionality
│   ├── 📄 main.tsx                  # Application entry point
│   ├── 📄 index.css                 # Global styles and luxury theme
│   └── 📂 components/               # Reusable UI components
│       ├── 📄 Dashboard.tsx         # Main dashboard with tabs
│       ├── 📄 TransactionForm.tsx   # Add/edit transactions
│       ├── 📄 TransactionList.tsx   # Display transaction history
│       ├── 📄 BudgetOverview.tsx    # Budget management interface
│       ├── 📄 GoalsSection.tsx      # Financial goals tracking
│       └── 📄 StatsCard.tsx         # Statistics display cards
├── 📂 convex/                       # Backend Convex functions
│   ├── 📄 schema.ts                 # Database schema definitions
│   ├── 📄 auth.ts                   # Authentication configuration
│   ├── 📄 transactions.ts           # Transaction CRUD operations
│   ├── 📄 budgets.ts                # Budget management functions
│   ├── 📄 goals.ts                  # Goals tracking functions
│   ├── 📄 http.ts                   # HTTP routes setup
│   └── 📂 _generated/               # Auto-generated Convex types
├── 📂 public/                       # Static assets
├── 📄 package.json                  # Project dependencies and scripts
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 vite.config.ts                # Vite build configuration
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 README.md                     # Project documentation
```

## 🔐 Authentication System

Spendly uses **Convex Auth** with multiple provider options:

- **🔑 Password Provider**: Traditional email/password authentication
- **👤 Anonymous Provider**: Guest access without registration
- **🔒 Secure Sessions**: JWT-based authentication with automatic token refresh

## 📊 Database Schema

The application uses the following data models:

### Transactions
```typescript
{
  userId: Id<"users">,
  amount: number,
  description: string,
  category: string,
  type: "income" | "expense",
  date: number,
  tags?: string[],
  notes?: string
}
```

### Budgets
```typescript
{
  userId: Id<"users">,
  category: string,
  limit: number,
  period: "weekly" | "monthly" | "yearly",
  startDate: number,
  isActive: boolean
}
```

### Goals
```typescript
{
  userId: Id<"users">,
  title: string,
  targetAmount: number,
  currentAmount: number,
  deadline?: number,
  category: string,
  priority: "low" | "medium" | "high",
  isCompleted: boolean,
  description?: string
}
```

## 🎨 Design System

Spendly features a luxury-themed design with:

- **🎨 Color Palette**: Pearl, Gold, Champagne, and deep blacks
- **✨ Glass Morphism**: Backdrop blur effects and transparent elements
- **🌟 Smooth Animations**: Hover effects and micro-interactions
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔤 Typography**: Playfair Display for headings, Inter for body text

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only Vite dev server
npm run dev:backend      # Start only Convex dev server

# Production
npm run build            # Build for production
npm run lint             # Run linting and type checking
```

## 🚀 Deployment

### Deploy to Convex
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Convex**
   ```bash
   npx convex deploy
   ```

For detailed deployment instructions, visit the [Convex Deployment Documentation](https://docs.convex.dev/production/hosting).

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with descriptive messages**
   ```bash
   git commit -m 'Add: Amazing new feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📧 Contact & Support

**Developer**: Jahnavi Israni  
**Email**: jahnaviisrani12@gmail.com  
**GitHub**: [@isranii](https://github.com/isranii)

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/isranii/Spendly/issues) page.

---

<div align="center">

**✨ Built with passion for sophisticated financial management ✨**

*Made with ❤️ using React, TypeScript, and Convex*

</div>