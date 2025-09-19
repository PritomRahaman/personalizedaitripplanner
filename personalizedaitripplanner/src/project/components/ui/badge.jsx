import React from "react";

export function Badge({ children, className }) {
  return <span className={`px-2 py-1 rounded text-sm ${className}`}>{children}</span>;
}
