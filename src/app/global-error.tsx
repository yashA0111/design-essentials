"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#080808",
          color: "#f0ede8",
          fontFamily: "sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <h1 style={{ color: "#c4a96b", fontSize: "28px", fontWeight: 400 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#8c8c8c", lineHeight: 1.7 }}>
            The application hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "24px",
              padding: "12px 28px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#c4a96b",
              color: "#080808",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
