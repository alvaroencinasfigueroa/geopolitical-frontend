import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";
import ArticleDetail from "./ArticleDetail";
import Login from "./Login";
import AdminPanel from "./AdminPanel";
import SpinningGlobe from "./SpinningGlobe";
import EstadisticasPage from "./EstadisticasPage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5253/api";

// ==========================================
// 1. LAYOUT PRINCIPAL (Navbar y Footer)
// ==========================================
function Layout() {
  return (
    <div>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo" style={{ textDecoration: "none" }}>
            GEOPOLITICS<span className="logo-red">.</span>
            <span className="logo-cyan">DATA</span>
          </Link>
          <div className="nav-links">
            <Link
              to="/"
              className="nav-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Análisis
            </Link>
            <Link
              to="/estadisticas"
              className="nav-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Estadísticas
            </Link>
            <Link
              to="/login"
              className="btn-login"
              style={{ textDecoration: "none" }}
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} Geopolitics.Data - Todos los derechos
            reservados.
          </p>
          <p className="footer-logo">DATA IS THE NEW POWER</p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 2. PÁGINA DE INICIO (Home)
// ==========================================
function Home() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/articles`)
      .then((res) => setArticles(res.data))
      .catch((err) => console.error("Error cargando artículos:", err));

    axios
      .get(`${API_URL}/statistics?category=Economia`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error cargando estadísticas:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="hero container">
        <div className="badge">Análisis en Tiempo Real</div>
        <SpinningGlobe />
        <h2 className="hero-title">
          <span className="text-red">CHINA</span>
          <span className="vs-text">VS</span>
          <span className="text-cyan">USA</span>
        </h2>
        <p className="hero-subtitle">
          Comparativas exactas, gráficas interactivas y análisis profundo sobre
          la economía, tecnología y poder militar de las dos mayores
          superpotencias del siglo XXI.
        </p>
      </header>

      {stats.length > 0 && (
        <section className="section container">
          <h3 className="section-title">DASHBOARD ECONÓMICO</h3>
          <div className="glass-card">
            {!loading && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="indicator"
                    stroke="#888"
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F0F14",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#FFF" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="chinaValue"
                    name="China"
                    fill="#FF003C"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="usaValue"
                    name="EE.UU."
                    fill="#00F0FF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      )}

      <section className="section container">
        <h3 className="section-title red">ÚLTIMOS INFORMES</h3>
        <div className="article-list">
          {articles.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No hay artículos publicados aún.</p>
          ) : (
            articles.map((article) => (
              <Link
                to={`/articulo/${article.slug}`}
                key={article.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="article-row">
                  <div className="article-thumbnail">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} />
                    ) : (
                      <span className="thumb-text">{article.category}</span>
                    )}
                  </div>
                  <div className="article-info">
                    <div className="article-tags">
                      <span
                        className={`tag ${article.countryFocus === "China" ? "tag-china" : "tag-usa"}`}
                      >
                        {article.countryFocus}
                      </span>
                      {!article.isFree && (
                        <span className="tag tag-premium">🔒 PREMIUM</span>
                      )}
                    </div>
                    <h4 className="article-title">{article.title}</h4>
                    <p className="article-content-preview">{article.content}</p>
                    <div className="article-footer">
                      <span>
                        📅{" "}
                        {new Date(article.createdAt).toLocaleDateString(
                          "es-ES",
                        )}
                      </span>
                      <span>👁 {article.views} vistas</span>
                      <span>📂 {article.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}

// ==========================================
// 3. COMPONENTE PRINCIPAL (Router)
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="articulo/:slug" element={<ArticleDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="estadisticas" element={<EstadisticasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
