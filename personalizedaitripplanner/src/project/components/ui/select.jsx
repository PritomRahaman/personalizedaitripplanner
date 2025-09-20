import React from "react";

export function Select({ children, value, onValueChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className="border rounded px-3 py-2 w-full"
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className }) {
  return <div className={className}>{children}</div>;
}
export function SelectContent({ children }) {
  return <>{children}</>;
}
export function SelectItem({ children, value }) {
  return <option value={value}>{children}</option>;
}
export function SelectValue({ placeholder }) {
  return <>{placeholder}</>;
}
