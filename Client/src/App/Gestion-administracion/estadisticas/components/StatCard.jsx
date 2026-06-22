export const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-(--surface-container) p-4 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-(--on-surface-variant)">{title}</p>
        <h2 className="text-2xl font-bold text-(--on-surface)">{value}</h2>
      </div>

      {Icon && (
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="text-white w-5 h-5" />
        </div>
      )}
    </div>
  );
};