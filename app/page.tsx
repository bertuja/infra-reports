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
  ejecutivo: { label: "Ejecutivo",  color: "#60a5fa", bg: "#1e3a5f" },
  devs:      { label: "Técnico",    color: "#34d399", bg: "#1a3a2a" },
  infra:     { label: "Infra",      color: "#a78bfa", bg: "#2d1f4a" },
  hotsale:   { label: "Hot Sale",   color: "#fb923c", bg: "#3a1f0d" },
  otro:      { label: "General",    color: "#94a3b8", bg: "#1e2533" },
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
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "#0d1b2a", borderBottom: "1px solid #1e2d45" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, background: "#1e88e5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              📊
            </div>
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16 }}>Infra Reports</div>
              <div style={{ color: "#475569", fontSize: 11 }}>DBYTE Infrastructure Portal</div>
            </div>
          </div>
          <div style={{ color: "#475569", fontSize: 12 }}>
            {reports.length} reporte{reports.length !== 1 ? "s" : ""}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        {reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#475569" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <div style={{ fontSize: 18, color: "#64748b", marginBottom: 8 }}>No hay reportes todavía</div>
            <div style={{ fontSize: 13 }}>
              Usá{" "}
              <code style={{ background: "#1e2533", padding: "2px 8px", borderRadius: 4, color: "#60a5fa" }}>
                add-report.sh
              </code>{" "}
              para subir el primero
            </div>
          </div>
        ) : (
          clients.map((client) => {
            const cr = reports.filter((r) => r.client === client);
            return (
              <section key={client} style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #1e2d45" }}>
                  <h2 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700 }}>{client}</h2>
                  <span style={{ background: "#1e2533", color: "#64748b", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                    {cr.length}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                  {cr.map((report) => {
                    const meta = TYPE_META[report.type] ?? TYPE_META.otro;
                    return (
                      <Link key={report.id} href={`/reports/${report.file}`} target="_blank" style={{ textDecoration: "none" }}>
                        <div style={{ background: "#1a1d27", border: "1px solid #2d3148", borderRadius: 10, padding: "18px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${meta.color}40` }}>
                              {meta.label}
                            </span>
                            <span style={{ color: "#334155", fontSize: 11 }}>{formatDate(report.date)}</span>
                          </div>
                          <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14, marginTop: 4 }}>{report.title}</div>
                          {report.description && (
                            <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{report.description}</div>
                          )}
                          <div style={{ color: "#3b82f6", fontSize: 12, marginTop: 4 }}>Ver reporte →</div>
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

      <footer style={{ borderTop: "1px solid #1e2d45", padding: "20px 32px", textAlign: "center", color: "#334155", fontSize: 12 }}>
        DBYTE Infrastructure Reports · Generado con Claude Code
      </footer>
    </div>
  );
}
