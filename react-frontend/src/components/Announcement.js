import { useState } from "react";

export function Announcement({
  type = "info",
  message,
  extraStyle = "",
  closable = false
}) {
  const [visible, setVisible] = useState(true);

  const typeClasses = {
    info: "bg-gray-300 text-gray-800 border-gray-500",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    danger: "bg-red-100 text-red-800 border-red-300",
  };

  if (!visible) return null; // hides the component

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-l-4 rounded-md ${typeClasses[type]} ${extraStyle}`}
    >
      <span>{message}</span>

      {closable && (
        <button
          onClick={() => setVisible(false)}
          className="text-xl font-bold leading-none hover:text-opacity-70"
        >
          &times;
        </button>
      )}
    </div>
  );
}
