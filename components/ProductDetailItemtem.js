export function ProductDetailItem({
  icon,
  label,
  value,
  valueClassName = "text-gray-900",
}) {
  return (
    <div className="bg-gray-50 min-h-17 flex items-center gap-3 rounded-2xl px-4 py-3">
      <div className="w-9 h-9 bg-white text-gray-400 flex justify-center items-center rounded-xl shadow-sm shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-gray-400 text-xs font-medium">{label}</p>
        <p
          className={`text-sm font-semibold truncate mt-0.5 ${valueClassName}`}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
