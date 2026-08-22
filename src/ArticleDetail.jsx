import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import ShareButton from "./ShareButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5253/api";

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    // Obtenemos el token de Admin o de Suscriptor (el que exista)
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("subscriberToken");
      
    // Solo declaramos headers UNA vez
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get(`${API_URL}/articles/slug/${slug}`, { headers })
      .then((res) => setArticle(res.data))
      .catch((err) => console.error("Error cargando el artículo:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubscribe = async () => {
    setPayError("");
    const token = localStorage.getItem("subscriberToken");
    const subscriberId = localStorage.getItem("subscriberId");

    if (!token || !subscriberId) {
      navigate("/login", { state: { from: `/articulo/${slug}` } });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/payments/create`,
        {
          SubscriberId: parseInt(subscriberId),
          Amount: 5.0,
          Currency: "usdttrc20",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPaymentInfo(res.data);
    } catch (error) {
      setPayError(
        error.response?.data?.message ||
          "Error al generar la dirección de pago."
      );
    }
  };

  if (loading)
    return (
      <div className="section container">
        <p>Cargando informe...</p>
      </div>
    );

  if (!article)
    return (
      <div className="section container">
        <p>Artículo no encontrado.</p>
        <Link
          to="/"
          className="btn-login"
          style={{
            textDecoration: "none",
            display: "inline-block",
            marginTop: "20px",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    );

  // Si tu C# envía isLocked, lo usamos. Si no, revisamos si el texto está cortado.
  const isLocked = article.isLocked || (article.content && article.content.includes("[Contenido bloqueado"));

  return (
    <div className="section container">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link
          to="/"
          className="nav-link"
          style={{
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          ← Volver a la lista
        </Link>

        <div className="article-tags" style={{ marginBottom: "20px" }}>
          <span
            className={`tag ${article.countryFocus === "China" ? "tag-china" : "tag-usa"}`}
          >
            {article.countryFocus}
          </span>
          {!article.isFree && (
            <span className="tag tag-premium">🔒 PREMIUM</span>
          )}
        </div>

        <h1
          className="article-title"
          style={{ fontSize: "36px", marginBottom: "20px" }}
        >
          {article.title}
        </h1>

        <div
          className="article-footer"
          style={{
            borderBottom: "1px solid var(--glass-border)",
            paddingBottom: "20px",
            marginBottom: "10px",
          }}
        >
          <span>
            📅{" "}
            {new Date(article.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>👁 {article.views} vistas</span>
          <span>📂 {article.category}</span>
        </div>

        <ShareButton title={article.title} url={window.location.href} />

        <div
          className="glass-card"
          style={{ padding: "40px", marginTop: "20px", position: "relative" }}
        >
          <div className={isLocked ? "paywall-fade" : ""}>
            <p
              style={{
                color: "#d1d5db",
                lineHeight: "1.8",
                fontSize: "18px",
                whiteSpace: "pre-wrap",
              }}
            >
              {article.content}
            </p>
          </div>

          {isLocked && (
            <div className="paywall-cta">
              <h3 className="paywall-cta-title">CONTINÚA LEYENDO</h3>
              <p className="paywall-cta-text">
                Este es un informe exclusivo. Suscríbete por 5 USD en cripto
                para acceder al análisis completo.
              </p>

              {!paymentInfo ? (
                <button
                  onClick={handleSubscribe}
                  className="paywall-cta-button"
                >
                  Suscribirme y leer
                </button>
              ) : (
                <div className="paywall-payment-box">
                  <p>
                    Envía{" "}
                    <strong>
                      {paymentInfo.amount} {paymentInfo.currency.toUpperCase()}
                    </strong>{" "}
                    a:
                  </p>
                  <p className="paywall-address">{paymentInfo.payAddress}</p>
                  <p className="paywall-note">
                    Tu cuenta se activará automáticamente al confirmarse el pago
                    en blockchain.
                  </p>
                </div>
              )}

              {payError && (
                <p
                  style={{
                    color: "var(--china-red)",
                    marginTop: "15px",
                    fontSize: "14px",
                  }}
                >
                  {payError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}