# Spendly - Luxury Finance Tracking App

Spendly is an exclusive financial sanctuary designed for sophisticated wealth orchestration, enabling users to track income and expenses, manage budgets, and achieve financial goals with an elegant user experience.

## ✨ Features

* **Portfolio Overview**: Quick insights into net worth, monthly income, expenses, and net profit/loss.
* **Transaction Management**: Record and categorize income and expenses with detailed descriptions.
* **Budgeting**: Create, manage, and monitor budgets for various categories (weekly, monthly, yearly periods).
* **Financial Goals**: Set, track, and update progress on financial goals with customizable categories, priorities, and deadlines.
* **User Authentication**: Secure sign-in/sign-up with email/password, or anonymous sign-in.
* **Responsive & Elegant UI**: A luxury-themed design built with Tailwind CSS for a seamless experience across devices.

## 💻 Tech Stack

* **Frontend**: React (v19.0.0), Vite, Tailwind CSS, Sonner (Toast Notifications)
* **Backend**: Convex (Fullstack Backend as a Service for database, queries, and mutations), @convex-dev/auth (Authentication for Convex)
* **Development Tools**: TypeScript, ESLint, Prettier

## 🚀 Getting Started

Follow these steps to set up and run Spendly locally.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/isranii/Spendly.git](https://github.com/isranii/Spendly.git)
    cd Spendly
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Convex Setup**:
    * Install the Convex CLI globally:
        ```bash
        npm install -g convex
        ```
    * Run the setup script to configure environment variables for Convex Auth:
        ```bash
        node setup.mjs
        ```
        This will create a `.env.local` file.

### Running the Application

To start both the frontend and backend development servers:

```bash
npm run dev
# or
yarn dev

T```
his command runs two parallel processes: dev:frontend (Vite development server) and dev:backend (Convex development server).

### 📁 Project Structure

* `src/`: Contains the React frontend application code, including main components (App.tsx, Dashboard.tsx, TransactionForm.tsx, BudgetOverview.tsx, GoalsSection.tsx, StatsCard.tsx, TransactionList.tsx).
* `convex/`: Houses backend Convex functions (queries, mutations) and database schema definitions (auth.ts, budgets.ts, goals.ts, transactions.ts, schema.ts).
* `public/`: Stores static assets.
* `package.json`: Project metadata, scripts, and dependencies.
* `tailwind.config.js`: Tailwind CSS configuration.
* `vite.config.ts`: Vite build configuration.

### 🔐 App Authentication

Spendly utilizes Convex Auth with Password and Anonymous providers for secure user management.

### 🚀 Deployment

For deployment information, refer to the Convex Hosting and Deployment documentation.

### 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

### 📄 License

This project is open-source and available under the MIT License.

### 📧 Contact

For questions or inquiries, please contact me at jahnaviisrani12@gmail.com.
```