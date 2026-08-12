import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminPanel({ onArticleCreated }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [articleData, setArticleData] = useState({
    title: '', content: '', category: 'Economia', countryFocus: 'China', imageUrl: '', isFree: false, isPublished: true
  });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null); // Nuevo: saber si estamos editando
  const [adminArticles, setAdminArticles] = useState([]); // Nuevo: lista de artículos
  const [statData, setStatData] = useState({
    category: 'Economia', indicator: '', chinaValue: '', usaValue: '', unit: '', year: 2026, source: ''
  });

  // Cargar artículos si ya hay token
  useEffect(() => {
    if (token) fetchAdminArticles();
  }, [token]);

  const fetchAdminArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/articles/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminArticles(res.data);
    } catch (error) {
      console.error("Error al cargar artículos de admin", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginData);
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
      setMessage('Admin autenticado.');
    } catch {
      setMessage('Error de autenticación.');
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // MODO EDICIÓN (PUT)
        await axios.put(`${API_URL}/articles/${editingId}`, articleData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Artículo actualizado correctamente.');
      } else {
        // MODO CREACIÓN (POST)
        await axios.post(`${API_URL}/articles`, articleData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Artículo publicado exitosamente.');
      }
      
      setArticleData({ title: '', content: '', category: 'Economia', countryFocus: 'China', imageUrl: '', isFree: false, isPublished: true });
      setEditingId(null); // Salimos del modo edición
      fetchAdminArticles(); // Recargamos la lista
      if (onArticleCreated) onArticleCreated();
    } catch (error) {
      setMessage('Error al guardar: ' + (error.response?.data?.message || ''));
    }
  };

  // Cargar datos en el formulario para editar
  const handleEdit = (article) => {
    setEditingId(article.id);
    setArticleData({
      title: article.title,
      content: article.content,
      category: article.category,
      countryFocus: article.countryFocus,
      imageUrl: article.imageUrl || '',
      isFree: article.isFree,
      isPublished: article.isPublished
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setArticleData({ title: '', content: '', category: 'Economia', countryFocus: 'China', imageUrl: '', isFree: false, isPublished: true });
  };

  // Borrar artículo
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este artículo permanentemente?")) {
      try {
        await axios.delete(`${API_URL}/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Artículo eliminado.');
        fetchAdminArticles();
      } catch (error) {
        setMessage('Error al borrar.');
      }
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
      setMessage('Estadística subida con éxito.');
      setStatData({ category: 'Economia', indicator: '', chinaValue: '', usaValue: '', unit: '', year: 2024, source: '' });
    } catch (error) {
      setMessage('Error al subir estadística: ' + (error.response?.data?.message || ''));
    }
  };

  if (!token) {
    return (
      <section className="section container">
        <h3 className="section-title">PANEL DE ADMINISTRACIÓN</h3>
        <div className="glass-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontFamily: 'Orbitron', textAlign: 'center' }}>Acceso Restringido</h4>
            <input type="text" placeholder="Usuario Admin" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} required style={inputStyle} />
            <input type="password" placeholder="Contraseña" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required style={inputStyle} />
            <button type="submit" style={btnStyle}>Ingresar</button>
            {message && <p style={{ color: 'var(--china-red)', textAlign: 'center' }}>{message}</p>}
          </form>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section container">
        <h3 className="section-title">{editingId ? "EDITAR INFORME" : "REDACTAR NUEVO INFORME"}</h3>
        <div className="glass-card">
          <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Título" value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} required style={inputStyle} />
            <textarea placeholder="Contenido..." value={articleData.content} onChange={e => setArticleData({...articleData, content: e.target.value})} required rows="8" style={{...inputStyle, resize: 'vertical'}} />
            <div style={{ display: 'flex', gap: '16px' }}>
              <select value={articleData.category} onChange={e => setArticleData({...articleData, category: e.target.value})} style={inputStyle}>
                <option value="Economia">Economía</option>
                <option value="Militar">Militar</option>
                <option value="Tecnologia">Tecnología</option>
              </select>
              <select value={articleData.countryFocus} onChange={e => setArticleData({...articleData, countryFocus: e.target.value})} style={inputStyle}>
                <option value="China">China</option>
                <option value="USA">EE.UU.</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <input type="text" placeholder="URL de la Imagen (opcional)" value={articleData.imageUrl} onChange={e => setArticleData({...articleData, imageUrl: e.target.value})} style={inputStyle} />
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <label><input type="checkbox" checked={articleData.isFree} onChange={e => setArticleData({...articleData, isFree: e.target.checked})} /> Gratuito</label>
              <label><input type="checkbox" checked={articleData.isPublished} onChange={e => setArticleData({...articleData, isPublished: e.target.checked})} /> Publicar</label>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="submit" style={{...btnStyle, background: editingId ? 'var(--usa-cyan)' : 'var(--china-red)', borderColor: editingId ? 'var(--usa-cyan)' : 'var(--china-red)', color: '#fff', flex: 1}}>
                {editingId ? "Guardar Cambios" : "Publicar Artículo"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} style={{...btnStyle, flex: 0.5}}>
                  Cancelar
                </button>
              )}
            </div>
            {message && <p style={{ color: 'var(--usa-cyan)', textAlign: 'center' }}>{message}</p>}
          </form>
        </div>
      </section>

      {/* LISTA DE ARTÍCULOS PARA EDITAR/BORRAR */}
      <section className="section container">
        <h3 className="section-title" style={{ borderLeftColor: '#fff' }}>GESTIÓN DE INFORMES ({adminArticles.length})</h3>
        <div className="glass-card" style={{ padding: '20px' }}>
          {adminArticles.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay artículos creados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {adminArticles.map(art => (
                <div key={art.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: art.isPublished ? 'var(--usa-cyan)' : '#eab308' }}>
                      {art.isPublished ? '● Publicado' : '○ Borrador'}
                    </span>
                    <h4 style={{ fontFamily: 'Inter', margin: '5px 0' }}>{art.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(art)} style={smallBtnStyle}>Editar</button>
                    <button onClick={() => handleDelete(art.id)} style={{...smallBtnStyle, borderColor: 'var(--china-red)', color: 'var(--china-red)'}}>Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FORMULARIO DE ESTADÍSTICAS */}
      <section className="section container">
        <h3 className="section-title" style={{ marginTop: '40px' }}>SUBIR ESTADÍSTICA</h3>
        <div className="glass-card">
          <form onSubmit={handleCreateStat} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Indicador (Ej: PIB)" value={statData.indicator} onChange={e => setStatData({...statData, indicator: e.target.value})} required style={inputStyle} />
            <div style={{ display: 'flex', gap: '16px' }}>
              <input type="number" step="0.01" placeholder="Valor China" value={statData.chinaValue} onChange={e => setStatData({...statData, chinaValue: e.target.value})} required style={inputStyle} />
              <input type="number" step="0.01" placeholder="Valor USA" value={statData.usaValue} onChange={e => setStatData({...statData, usaValue: e.target.value})} required style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input type="text" placeholder="Unidad" value={statData.unit} onChange={e => setStatData({...statData, unit: e.target.value})} required style={inputStyle} />
              <input type="number" placeholder="Año" value={statData.year} onChange={e => setStatData({...statData, year: e.target.value})} required style={inputStyle} />
            </div>
            <button type="submit" style={{...btnStyle, background: 'var(--usa-cyan)', borderColor: 'var(--usa-cyan)', color: '#000'}}>Subir Dato</button>
          </form>
        </div>
      </section>
    </>
  );
}

const inputStyle = {
  padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none', flex: 1
};
const btnStyle = {
  padding: '12px', backgroundColor: 'transparent', border: '1px solid var(--usa-cyan)', color: 'var(--usa-cyan)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif'
};
const smallBtnStyle = {
  padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid var(--usa-cyan)', color: 'var(--usa-cyan)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
};