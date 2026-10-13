import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { t } from "./i18n/index.ts";
import { ParticipantApp } from "./participant/ParticipantApp.tsx";
import "./styles.css";

// Panel organizatora ładowany osobno — strona uczestnika (telefon, słabe łącze) pozostaje lekka.
const AdminApp = lazy(() => import("./admin/AdminApp.tsx").then((m) => ({ default: m.AdminApp })));

function Router() {
  const path = location.pathname;
  const m = /^\/t\/([A-Za-z0-9_-]{43})\/?$/.exec(path);
  if (m) return <ParticipantApp secret={m[1]!} />;
  if (path === "/admin" || path.startsWith("/admin/")) return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  return (
    <div className="page">
      <div className="brand">{t.brand}</div>
      <main className="container">
        <h1>Harmony Upload</h1>
        <p className="muted">{t.link.home}</p>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
