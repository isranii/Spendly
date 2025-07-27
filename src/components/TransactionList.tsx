import { Doc } from "../../convex/_generated/dataModel";

interface TransactionListProps {
  transactions: Doc<"transactions">[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💎</div>
        <p className="text-gold/60 luxury-text">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="luxury-glass rounded-xl p-4 hover:bg-black/30 hover:border-gold/40 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                transaction.type === "income" 
                  ? "bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 group-hover:bg-red-500/30"
              }`}>
                {transaction.type === "income" ? "↗" : "↘"}
              </div>
              <div>
                <h4 className="text-pearl font-medium luxury-text">{transaction.description}</h4>
                <p className="text-gold/60 text-sm">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold luxury-title ${
                transaction.type === "income" ? "text-emerald-400" : "text-red-400"
              }`}>
                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
              </p>
              <p className="text-gold/60 text-sm">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
