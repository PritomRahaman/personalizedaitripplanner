// src/components/ui/card.jsx
import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl bg-white shadow ${className}`}>
      {children}
    </div>
  );
}


export function CardHeader({ children, className }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}
export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
export function CardTitle({ children, className }) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}