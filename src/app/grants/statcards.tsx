// src/app/grant/stateards.tsx
interface StatsCardProps {
  title: string;
  amount: string;
  period: string;
}

export default function StatsCard({ title, amount, period }: StatsCardProps) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md border-l-4"
      style={{ borderLeftColor: '#0A867D' }}>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 my-2">{amount}</p>
      <p className="text-gray-400 text-xs">{period}</p>
    </div>
  );
}