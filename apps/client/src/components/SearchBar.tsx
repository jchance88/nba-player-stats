import React, { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search players..." }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 15,
        }}
      />
      <button
        type="submit"
        className="search-button"
        style={{
          padding: "8px 18px",
          borderRadius: 6,
          border: "none",
          background: "#1d428a",
          color: "#fff",
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Search
      </button>
    </form>
  );
}
