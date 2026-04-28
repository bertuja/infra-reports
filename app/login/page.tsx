"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setError("Clave incorrecta");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#1a1d27",
        border: "1px solid #2d3148",
        borderRadius: 12,
        padding: "40px 44px",
        width: "100%",
        maxWidth: 380,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48,
            background: "#1e88e5",
            borderRadius: 12,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: 14,
          }}>
            📊
          </div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 18 }}>Infra Reports</div>
          <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>DBYTE Infrastructure Portal</div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Clave de acceso
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            required
            style={{
              width: "100%",
              padding: "11px 14px",
              background: "#0f1117",
              border: error ? "1px solid #ef4444" : "1px solid #2d3148",
              borderRadius: 8,
              color: "#e2e8f0",
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              marginBottom: error ? 8 : 16,
              letterSpacing: 2,
            }}
          />

          {error && (
            <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "11px",
              background: loading || !password ? "#1e3a5f" : "#1e88e5",
              color: loading || !password ? "#475569" : "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
