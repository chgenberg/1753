"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sv">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Helvetica, Arial, sans-serif',
          backgroundColor: "#f5f5f7",
          color: "#1d1d1f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#766a62",
            }}
          >
            500
          </p>
          <h1
            style={{
              marginTop: "0.75rem",
              fontSize: "1.875rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Något gick fel
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#515151",
              maxWidth: "28rem",
            }}
          >
            Testa att ladda om sidan. Om felet kvarstår, kontakta oss
            på info@1753skin.com.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#108474",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
            }}
          >
            Försök igen
          </button>
        </div>
      </body>
    </html>
  );
}
