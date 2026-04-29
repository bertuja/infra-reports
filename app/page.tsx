import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";

interface Report {
  id: string;
  title: string;
  client: string;
  type: "ejecutivo" | "devs" | "infra" | "hotsale" | "otro";
  date: string;
  file: string;
  description?: string;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  ejecutivo: { label: "Ejecutivo",  color: "#4f46e5", bg: "#1e1b4b" },
  devs:      { label: "Técnico",    color: "#06b6d4", bg: "#0c4a6e" },
  infra:     { label: "Infra",      color: "#10b981", bg: "#064e3b" },
  hotsale:   { label: "Hot Sale",   color: "#f59e0b", bg: "#3a1f0d" },
  otro:      { label: "General",    color: "#8b5cf6", bg: "#3730a3" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export const revalidate = 0;

export default async function Home() {
  let reports: Report[] = [];
  try {
    const p = path.join(process.cwd(), "public/reports/manifest.json");
    reports = JSON.parse(await fs.readFile(p, "utf-8"));
    reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {}

  const clients = [...new Set(reports.map((r) => r.client))].sort();

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      {/* Header DBYTE */}
      <header style={{ background: "linear-gradient(135deg, #0c2340 0%, #1a365d 100%)", borderBottom: "2px solid #4f46e5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo DBYTE */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", borderRadius: 10, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "white" }}>D</span>
            </div>
            <div>
              <div style={{ color: "#f0f9ff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>DBYTE Infra Reports</div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>Infrastructure & DevOps Analytics</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>
              {reports.length} reporte{reports.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
        {reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "120px 0", color: "#475569" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📊</div>
            <div style={{ fontSize: 20, color: "#cbd5e1", marginBottom: 10, fontWeight: 700 }}>No hay reportes todavía</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
              Comienza agregando tu primer reporte de infraestructura
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Usá{" "}
              <code style={{ background: "rgba(79, 70, 229, 0.2)", padding: "4px 12px", borderRadius: 6, color: "#4f46e5", fontWeight: 700, border: "1px solid rgba(79, 70, 229, 0.3)" }}>
                add-report.sh
              </code>{" "}
              para subir tu primer reporte
            </div>
          </div>
        ) : (
          clients.map((client) => {
            const cr = reports.filter((r) => r.client === client);
            return (
              <section key={client} style={{ marginBottom: 56 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid rgba(79, 70, 229, 0.2)" }}>
                  <h2 style={{ color: "#f0f9ff", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
                    {client}
                  </h2>
                  <span style={{ background: "rgba(79, 70, 229, 0.15)", color: "#4f46e5", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 700, border: "1px solid rgba(79, 70, 229, 0.3)" }}>
                    {cr.length} reporte{cr.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                  {cr.map((report) => {
                    const meta = TYPE_META[report.type] ?? TYPE_META.otro;
                    return (
                      <Link key={report.id} href={`/reports/${report.file}`} target="_blank" style={{ textDecoration: "none" }}>
                        <div style={{
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(79, 70, 229, 0.2)",
                          borderRadius: 12,
                          padding: "20px 22px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          transition: "all 0.3s ease",
                          backdropFilter: "blur(8px)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.5)";
                          e.currentTarget.style.background = "rgba(79, 70, 229, 0.05)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.2)";
                          e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ background: meta.bg, color: meta.color, fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 20, border: `1px solid ${meta.color}40` }}>
                              {meta.label}
                            </span>
                            <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600 }}>{formatDate(report.date)}</span>
                          </div>
                          <div style={{ color: "#f0f9ff", fontWeight: 700, fontSize: 15, marginTop: 6, lineHeight: 1.4 }}>{report.title}</div>
                          {report.description && (
                            <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{report.description}</div>
                          )}
                          <div style={{ color: "#4f46e5", fontSize: 13, marginTop: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                            Ver reporte <span>→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1e293b", padding: "30px 32px", textAlign: "center", background: "linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, #0c2340 100%)" }}>
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
          🚀 DBYTE Infrastructure Reports Portal
        </div>
        <div style={{ color: "#64748b", fontSize: 12 }}>
          Análisis de infraestructura, rendimiento y preparación para crecimiento
        </div>
        <div style={{ color: "#334155", fontSize: 11, marginTop: 12 }}>
          Powered by DBYTE SRL · <span style={{ color: "#4f46e5", fontWeight: 600 }}>Claude Code</span> · <span style={{ color: "#7c3aed" }}>Vercel Deployment</span>
        </div>
      </footer>
    </div>
  );
}
