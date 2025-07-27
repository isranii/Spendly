import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createTransaction = useMutation(api.transactions.create);

  const categories = [
    "Food & Dining", "Shopping", "Transportation", "Entertainment",
    "Bills & Utilities", "Healthcare", "Travel", "Investment",
    "Salary", "Business", "Gifts", "Education", "Insurance", "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransaction({
        amount: numAmount,
        description: description.trim(),
        category,
        type,
        notes: notes.trim() || undefined,
      });
      
      setAmount("");
      setDescription("");
      setCategory("");
      setNotes("");
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} recorded successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
            type === "expense"
              ? "bg-gradient-to-r from-gold to-champagne text-black shadow-luxury"
              : "luxury-glass text-gold/70 hover:text-gold hover:bg-black/30"
          }`}
        >
          💸 Expense
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
            type === "income"
              ? "bg-gradient-to-r from-gold to-champagne text-black shadow-luxury"
              : "luxury-glass text-gold/70 hover:text-gold hover:bg-black/30"
          }`}
        >
          💰 Income
        </button>
      </div>

      <div>
        <label className="block text-gold/90 text-sm font-medium mb-2">Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold/60">$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="luxury-input pl-8"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gold/90 text-sm font-medium mb-2">Description *</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="luxury-input"
          placeholder="What was this transaction for?"
          maxLength={100}
          required
        />
      </div>

      <div>
        <label className="block text-gold/90 text-sm font-medium mb-2">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="luxury-input"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gold/90 text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="luxury-input resize-none"
          rows={3}
          placeholder="Additional details..."
          maxLength={500}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full luxury-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : `Record ${type === 'income' ? 'Income' : 'Expense'}`}
      </button>
    </form>
  );
}
