# Spendly - Luxury Finance Tracking App

## Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Running the Application](#running-the-application)
* [Project Structure](#project-structure)
* [App Authentication](#app-authentication)
* [Deployment](#deployment)
* [HTTP API](#http-api)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Introduction

Spendly is an exclusive financial sanctuary designed to help you master the art of sophisticated wealth orchestration. It provides a meticulously engineered platform where financial mastery converges with timeless elegance for the most distinguished connoisseurs. This application allows users to track income and expenses, set and manage budgets, and achieve financial goals with a luxurious user experience.

## Features

Spendly offers a comprehensive suite of tools to manage your finances:

* **Portfolio Overview**: Get a quick glance at your net worth, monthly income, monthly expenses, and overall monthly net profit/loss.
* **Transaction Management**:
    * Record income and expenses with detailed descriptions, amounts, and categories.
    * View a history of all your transactions.
    * Categorize transactions for better financial insights.
* **Budgeting**:
    * Create and manage budgets for various categories (e.g., "Food & Dining", "Shopping").
    * Set budget limits and define periods (weekly, monthly, yearly).
    * Monitor your spending against set budgets and view remaining amounts and utilization percentages.
* **Financial Goals**:
    * Set and track financial goals with target amounts, categories, priorities (low, medium, high), and optional deadlines.
    * Update progress towards your goals and see how close you are to achieving them.
    * View both active and completed goals.
* **User Authentication**: Secure sign-in and sign-up with email and password, or anonymous sign-in options.
* **Responsive and Elegant UI**: Built with a luxury-themed design using Tailwind CSS, ensuring a visually appealing and smooth experience across devices.

## Tech Stack

Spendly is built using a modern and robust technology stack:

* **Frontend**:
    * [React](https://react.dev/) (Version 19.0.0)
    * [Vite](https://vitejs.dev/) (Build Tool)
    * [Tailwind CSS](https://tailwindcss.com/) (Styling Framework)
    * [Sonner](https://sonner.emilkowalski.it/) (Toast Notifications)
* **Backend**:
    * [Convex](https://convex.dev/) (Fullstack Backend as a Service - for database, queries, and mutations)
    * [@convex-dev/auth](https://auth.convex.dev/) (Authentication for Convex)
* **Development Tools**:
    * TypeScript
    * ESLint (for linting)
    * Prettier (for code formatting)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (LTS version recommended)
* npm or Yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/isranii/Spendly.git](https://github.com/isranii/Spendly.git)
    cd Spendly
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Convex Setup**: This project uses Convex as its backend. It is connected to the Convex deployment named `hushed-rat-639`.
    * Ensure you have the Convex CLI installed globally:
        ```bash
        npm install -g convex
        ```
    * Run the setup script which helps with environment variables for Convex Auth:
        ```bash
        node setup.mjs
        ```
        This will create a `.env.local` file with necessary environment variables.

## Running the Application

To start both the frontend and backend development servers, use the following command:

```bash
npm run dev
# or
yarn dev 

+++

This command runs two parallel processes:

dev:frontend: Starts the Vite development server for the React frontend, usually opening in your browser (vite --open).
dev:backend: Starts the Convex development server (convex dev).
Project Structure
src/: Contains the frontend React application code.
src/App.tsx: Main application component.
src/components/: Reusable React components (e.g., Dashboard, TransactionForm, BudgetOverview, GoalsSection, StatsCard, TransactionList).
src/index.css: Tailwind CSS configuration and custom styles.
convex/: Contains the backend Convex functions (queries, mutations) and schema definitions.
convex/auth.ts: Authentication-related Convex functions.
convex/budgets.ts: Functions for managing user budgets.
convex/goals.ts: Functions for managing financial goals.
convex/transactions.ts: Functions for managing income and expense transactions.
convex/schema.ts: Defines the database schema for your Convex tables (transactions, budgets, goals, accounts, users).
convex/_generated/: Automatically generated Convex client and server utilities (do not modify directly).
public/: Static assets.
package.json: Project metadata, scripts, and dependencies.
tailwind.config.js: Tailwind CSS configuration file.
vite.config.ts: Vite build configuration.
App Authentication
Spendly uses Convex Auth with Anonymous auth for easy sign-in during development. You can extend or modify this authentication setup for production use.
Deployment
For information on deploying your Convex app to production, refer to the Convex Hosting and Deployment documentation.
HTTP API
User-defined HTTP routes are defined in the convex/router.ts file. These routes are separated from convex/http.ts to prevent modification of authentication routes.
Contributing
We welcome contributions! Please feel free to open issues or submit pull requests.
License
This project is open-source and available under the MIT License.
Contact
For any questions or inquiries, you can contact me at jahnaviisrani12@gmail.com .