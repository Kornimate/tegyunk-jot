export function Announcement({ type = "info", message, extraStyle }) {
  // Tailwind colors for different types
  const typeClasses = {
    info: "bg-gray-300 text-gray-800 border-gray-500",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-red-100 text-red-800 border-red-300",
    danger: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-l-4 rounded-md ${typeClasses[type]} ${extraStyle}`}
    >
      <span>{message}</span>
    </div>
  );
}