import React from "react";

export function Label({ children, className, htmlFor }) {
  return <label htmlFor={htmlFor} className={`block ${className}`}>{children}</label>;
}
