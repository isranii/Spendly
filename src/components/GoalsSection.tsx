import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "../../convex/_generated/dataModel";

interface GoalsSectionProps {
  goals: Doc<"goals">[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [deadline, setDeadline] = useState("");
  
  const createGoal = useMutation(api.goals.create);
  const updateProgress = useMutation(api.goals.updateProgress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAmount || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createGoal({
        title,
        targetAmount: parseFloat(targetAmount),
        category,
        priority,
        deadline: deadline ? new Date(deadline).getTime() : undefined,
      });
      
      setTitle("");
      setTargetAmount("");
      setCategory("");
      setDeadline("");
      setShowForm(false);
      toast.success("Goal created successfully");
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const handleAddProgress = async (goalId: string, amount: number) => {
    try {
      await updateProgress({ goalId: goalId as any, amount });
      toast.success("Progress updated!");
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="luxury-title text-xl font-bold text-pearl">Financial Goals</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="luxury-button-secondary"
        >
          {showForm ? "Cancel" : "New Goal"}
        </button>
      </div>

      {showForm && (
        <div className="luxury-glass rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Goal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="luxury-input"
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="luxury-input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="luxury-input"
                  placeholder="e.g., Savings"
                />
              </div>
              <div>
                <label className="block text-gold/80 text-sm font-medium mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="luxury-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gold/80 text-sm font-medium mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="luxury-input"
                />
              </div>
            </div>
            <button type="submit" className="luxury-button">
              Create Goal
            </button>
          </form>
        </div>
      )}

      {/* Active Goals */}
      <div>
        <h4 className="luxury-title text-lg font-bold text-pearl mb-4">Active Goals</h4>
        {activeGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gold/60 luxury-text">No active goals yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal._id} className="luxury-card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="luxury-title text-lg font-bold text-pearl">{goal.title}</h5>
                      <p className="text-gold/60 text-sm">{goal.category}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400' 
                        : goal.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {goal.priority} priority
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gold/80">Progress</span>
                      <span className="text-pearl font-medium">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-black/30 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gold/80 text-sm">{progress.toFixed(1)}% complete</span>
                      <button
                        onClick={() => {
                          const amount = prompt("Add amount to goal:");
                          if (amount && !isNaN(parseFloat(amount))) {
                            handleAddProgress(goal._id, parseFloat(amount));
                          }
                        }}
                        className="luxury-button-secondary text-sm px-4 py-2"
                      >
                        Add Progress
                      </button>
                    </div>
                    
                    {goal.deadline && (
                      <p className="text-gold/60 text-xs">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h4 className="luxury-title text-lg font-bold text-pearl mb-4">Completed Goals</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map((goal) => (
              <div key={goal._id} className="luxury-card opacity-75">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h5 className="luxury-title font-bold text-pearl">{goal.title}</h5>
                    <p className="text-gold/60 text-sm">{goal.category}</p>
                  </div>
                </div>
                <p className="text-emerald-400 font-medium">
                  Goal Achieved: ${goal.targetAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
