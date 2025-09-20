import React from "react";

export function Checkbox({ id, checked, onCheckedChange }) {
  return <input type="checkbox" id={id} checked={checked} onChange={() => onCheckedChange(!checked)} />;
}
