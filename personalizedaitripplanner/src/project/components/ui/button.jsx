// src/components/ui/button.jsx
import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
}
