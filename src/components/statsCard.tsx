interface StatsCardProps {
  title: string;
  content: any;
}

export default function StatsCard({ title, content }: StatsCardProps) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md border-l-4"
      style={{ borderLeftColor: '#0A867D' }}>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 my-2">{content}</p>
    </div>
  );
}