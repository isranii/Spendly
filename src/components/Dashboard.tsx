import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { StatsCard } from "./StatsCard";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { BudgetOverview } from "./BudgetOverview";
import { GoalsSection } from "./GoalsSection";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'goals'>('overview');
  const stats = useQuery(api.transactions.getStats);
  const transactions = useQuery(api.transactions.list, { limit: 10 });
  const budgetStatus = useQuery(api.budgets.getBudgetStatus);
  const goals = useQuery(api.goals.list, {});

  const tabs = [
    { id: 'overview', label: 'Portfolio Overview', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💎' },
    { id: 'budgets', label: 'Budgets', icon: '🏛️' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="luxury-glass rounded-2xl p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-gold to-champagne text-black shadow-luxury font-semibold'
                  : 'text-gold/70 hover:text-gold hover:bg-black/20'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="luxury-text font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Net Worth"
                value={`$${stats.netWorth.toLocaleString()}`}
                subtitle="Total Assets"
                trend={stats.netWorth > 0 ? 'up' : 'down'}
                icon="💰"
              />
              <StatsCard
                title="Monthly Income"
                value={`$${stats.monthlyIncome.toLocaleString()}`}
                subtitle="This Month"
                trend="up"
                icon="📈"
              />
              <StatsCard
                title="Monthly Expenses"
                value={`$${stats.monthlyExpenses.toLocaleString()}`}
                subtitle="This Month"
                trend="down"
                icon="💸"
              />
              <StatsCard
                title="Monthly Net"
                value={`$${stats.monthlyNet.toLocaleString()}`}
                subtitle="Profit/Loss"
                trend={stats.monthlyNet > 0 ? 'up' : 'down'}
                icon="⚖️"
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="luxury-card">
              <h3 className="luxury-title text-xl font-bold text-pearl mb-6">Quick Transaction</h3>
              <TransactionForm />
            </div>
            
            <div className="luxury-card">
              <h3 className="luxury-title text-xl font-bold text-pearl mb-6">Recent Activity</h3>
              {transactions && <TransactionList transactions={transactions.slice(0, 5)} />}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="luxury-card">
            <h3 className="luxury-title text-xl font-bold text-pearl mb-6">Add Transaction</h3>
            <TransactionForm />
          </div>
          <div className="lg:col-span-2 luxury-card">
            <h3 className="luxury-title text-xl font-bold text-pearl mb-6">Transaction History</h3>
            {transactions && <TransactionList transactions={transactions} />}
          </div>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="luxury-card">
          <h3 className="luxury-title text-2xl font-bold text-pearl mb-8">Budget Management</h3>
          {budgetStatus && <BudgetOverview budgets={budgetStatus} />}
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="luxury-card">
          <h3 className="luxury-title text-2xl font-bold text-pearl mb-8">Financial Goals</h3>
          {goals && <GoalsSection goals={goals} />}
        </div>
      )}
    </div>
  );
}
