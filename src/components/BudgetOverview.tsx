import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface Budget {
  _id: string;
  category: string;
  limit: number;
  period: string;
  spent: number;
  remaining: number;
  percentage: number;
}

interface BudgetOverviewProps {
  budgets: Budget[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  
  const createBudget = useMutation(api.budgets.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !limit) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createBudget({
        category,
        limit: parseFloat(limit),
        period,
      });
      
      setCategory("");
      setLimit("");
      setShowForm(false);
      toast.success("Budget created successfully");
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="luxury-title text-xl font-bold text-pearl">Active Budgets</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="luxury-button-secondary"
        >
          {showForm ? "Cancel" : "New Budget"}
        </button>
      </div>

      {showForm && (
        <div className="luxury-glass rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="luxury-input"
                  placeholder="e.g., Food & Dining"
                />
              </div>
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="luxury-input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                  className="luxury-input"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <button type="submit" className="luxury-button">
              Create Budget
            </button>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏛️</div>
          <p className="text-gold/60 luxury-text">No budgets set up yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <div key={budget._id} className="luxury-card group hover:scale-102 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="luxury-title text-lg font-bold text-pearl">{budget.category}</h4>
                  <p className="text-gold/60 text-sm capitalize">{budget.period}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  budget.percentage > 90 
                    ? 'bg-red-500/20 text-red-400' 
                    : budget.percentage > 70
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {budget.percentage.toFixed(0)}%
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gold/80">Spent</span>
                  <span className="text-pearl font-medium">${budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gold/80">Remaining</span>
                  <span className="text-pearl font-medium">${budget.remaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gold/80">Limit</span>
                  <span className="text-pearl font-medium">${budget.limit.toLocaleString()}</span>
                </div>
                
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budget.percentage > 90 
                        ? 'bg-red-500' 
                        : budget.percentage > 70
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
