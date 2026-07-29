import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    category: 'Economia',
    countryFocus: 'China',
    imageUrl: '',
    isFree: false,
    isPublished: true
  });

  const [statData, setStatData] = useState({
    category: 'Economia', indicator: '', chinaValue: '', usaValue: '', unit: '', year: 2026, source: ''
  });

  const [message, setMessage] = useState('');

  // Si no hay token de admin, mandamos al login unificado
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/articles`, articleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Artículo publicado exitosamente.');
      setArticleData({ title: '', content: '', category: 'Economia', countryFocus: 'China', imageUrl: '', isFree: false, isPublished: true });
    } catch (error) {
      setMessage('Error al subir el artículo. ' + (error.response?.data?.message || ''));
    }
  };

  const handleCreateStat = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...statData,
        chinaValue: parseFloat(statData.chinaValue),
        usaValue: parseFloat(statData.usaValue),
        year: parseInt(statData.year)
      };

      await axios.post(`${API_URL}/statistics`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Estadística subida con éxito. Ve a la página de inicio para ver la gráfica.');
      setStatData({ category: 'Economia', indicator: '', chinaValue: '', usaValue: '', unit: '', year: 2024, source: '' });
    } catch (error) {
      setMessage('Error al subir estadística: ' + (error.response?.data?.message || ''));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    navigate('/login');
  };

  if (!token) {
    // Se está redirigiendo, no mostramos nada
    return null;
  }

  return (
    <>
      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>REDACTAR NUEVO INFORME</h3>
          <button onClick={handleLogout} style={{ ...btnStyle, borderColor: 'var(--china-red)', color: 'var(--china-red)' }}>
            Cerrar sesión
          </button>
        </div>
        <div className="glass-card">
          <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Título del Artículo"
              value={articleData.title}
              onChange={e => setArticleData({...articleData, title: e.target.value})}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Contenido completo del artículo..."
              value={articleData.content}
              onChange={e => setArticleData({...articleData, content: e.target.value})}
              required
              rows="8"
              style={{...inputStyle, resize: 'vertical'}}
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <select
                value={articleData.category}
                onChange={e => setArticleData({...articleData, category: e.target.value})}
                style={inputStyle}
              >
                <option value="Economia">Economía</option>
                <option value="Militar">Militar</option>
                <option value="Tecnologia">Tecnología</option>
                <option value="Demografia">Demografía</option>
              </select>
              <select
                value={articleData.countryFocus}
                onChange={e => setArticleData({...articleData, countryFocus: e.target.value})}
                style={inputStyle}
              >
                <option value="China">China</option>
                <option value="USA">EE.UU.</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="URL de la Imagen (opcional)"
              value={articleData.imageUrl}
              onChange={e => setArticleData({...articleData, imageUrl: e.target.value})}
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={articleData.isFree}
                  onChange={e => setArticleData({...articleData, isFree: e.target.checked})}
                />
                Artículo Gratuito
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={articleData.isPublished}
                  onChange={e => setArticleData({...articleData, isPublished: e.target.checked})}
                />
                Publicar ahora
              </label>
            </div>
            <button type="submit" style={{...btnStyle, background: 'var(--china-red)', borderColor: 'var(--china-red)', color: '#fff'}}>Publicar Artículo</button>
          </form>
        </div>
      </section>

      <section className="section container">
        <h3 className="section-title" style={{ marginTop: '40px' }}>SUBIR ESTADÍSTICA</h3>
        <div className="glass-card">
          <form onSubmit={handleCreateStat} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Indicador (Ej: PIB, Inversión en IA)"
              value={statData.indicator}
              onChange={e => setStatData({...statData, indicator: e.target.value})}
              required
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="number"
                step="0.01"
                placeholder="Valor China (Ej: 17.7)"
                value={statData.chinaValue}
                onChange={e => setStatData({...statData, chinaValue: e.target.value})}
                required
                style={inputStyle}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor USA (Ej: 27.3)"
                value={statData.usaValue}
                onChange={e => setStatData({...statData, usaValue: e.target.value})}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="text"
                placeholder="Unidad (Ej: Trillones USD)"
                value={statData.unit}
                onChange={e => setStatData({...statData, unit: e.target.value})}
                required
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Año (Ej: 2024)"
                value={statData.year}
                onChange={e => setStatData({...statData, year: e.target.value})}
                required
                style={inputStyle}
              />
            </div>
            <select
              value={statData.category}
              onChange={e => setStatData({...statData, category: e.target.value})}
              style={inputStyle}
            >
              <option value="Economia">Economía</option>
              <option value="Militar">Militar</option>
              <option value="Tecnologia">Tecnología</option>
              <option value="Demografia">Demografía</option>
            </select>
            <input
              type="text"
              placeholder="Fuente (Ej: Banco Mundial)"
              value={statData.source}
              onChange={e => setStatData({...statData, source: e.target.value})}
              style={inputStyle}
            />
            <button type="submit" style={{...btnStyle, background: 'var(--usa-cyan)', borderColor: 'var(--usa-cyan)', color: '#000'}}>Subir Dato Estadístico</button>
          </form>
        </div>
      </section>

      {message && (
        <div className="section container">
          <p style={{ color: 'var(--usa-cyan)', textAlign: 'center' }}>{message}</p>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  padding: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  flex: 1
};

const btnStyle = {
  padding: '12px',
  backgroundColor: 'transparent',
  border: '1px solid var(--usa-cyan)',
  color: 'var(--usa-cyan)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontFamily: 'Orbitron, sans-serif',
  transition: 'all 0.3s'
};