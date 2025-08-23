import React from "react";
export default function EmptyState({
  title = "No results",
  description = "Try changing the search or filters.",
}) {
  return (
    <div
      style={{
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
      <div style={{ marginTop: 8, color: "#666" }}>{description}</div>
    </div>
  );
}
