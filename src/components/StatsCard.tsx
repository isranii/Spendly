interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  icon: string;
}

export function StatsCard({ title, value, subtitle, trend, icon }: StatsCardProps) {
  return (
    <div className="luxury-card group hover:scale-105 transition-all duration-500 relative overflow-hidden cursor-pointer">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-gold/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl filter drop-shadow-lg">{icon}</div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            trend === 'up' 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {trend === 'up' ? '↗ Positive' : '↘ Negative'}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-gold/90 text-sm luxury-text font-medium tracking-wide">{title}</h3>
          <p className="luxury-title text-2xl font-bold text-pearl group-hover:text-gold/90 transition-colors duration-300">
            {value}
          </p>
          <p className="text-gold/60 text-xs luxury-text">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
