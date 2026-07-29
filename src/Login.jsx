import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', credential: '' });
  const [message, setMessage] = useState('');
  const [successCode, setSuccessCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessCode('');

    try {
      if (isLogin) {
        // Login único: el backend decide si sos admin o subscriber
        const res = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          credential: formData.credential
        });

        if (res.data.role === 'admin') {
          localStorage.setItem('adminToken', res.data.token);
          setMessage('Bienvenido, administrador. Redirigiendo...');
          setTimeout(() => navigate('/admin'), 1200);
        } else {
          localStorage.setItem('subscriberToken', res.data.token);
          localStorage.setItem('subscriberId', res.data.subscriberId);
          setMessage('Inicio de sesión exitoso. Redirigiendo...');
          setTimeout(() => navigate('/'), 1200);
        }
      } else {
        // Registro (solo para lectores, los admins no se auto-registran)
        const res = await axios.post(`${API_URL}/subscribers/register`, {
          name: formData.name,
          email: formData.email
        });
        setSuccessCode(res.data.accessCode);
        setMessage('Registro exitoso. Guarda tu código de acceso.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Ocurrió un error.');
    }
  };

  return (
    <section className="section container">
      <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto' }}>
        <h3 className="section-title" style={{ borderLeftColor: 'var(--china-red)' }}>
          {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {!isLogin && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            style={inputStyle}
          />

          {isLogin && (
            <input
              type="password"
              placeholder="Contraseña o código de acceso"
              value={formData.credential}
              onChange={e => setFormData({...formData, credential: e.target.value})}
              required
              style={inputStyle}
            />
          )}

          <button type="submit" style={{...btnStyle, background: 'var(--china-red)', borderColor: 'var(--china-red)', color: '#fff'}}>
            {isLogin ? 'Ingresar' : 'Registrarme'}
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => { setIsLogin(!isLogin); setMessage(''); setSuccessCode(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--usa-cyan)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate como lector' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {message && <p style={{ color: successCode ? 'var(--usa-cyan)' : 'var(--china-red)', textAlign: 'center', marginTop: '20px' }}>{message}</p>}

        {successCode && (
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--usa-cyan)', padding: '15px', borderRadius: '8px', textAlign: 'center', marginTop: '10px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>TU CÓDIGO DE ACCESO (Guárdalo bien):</p>
            <p style={{ fontFamily: 'Orbitron', fontSize: '20px', color: '#fff', letterSpacing: '2px' }}>{successCode}</p>
          </div>
        )}
      </div>
    </section>
  );
}

const inputStyle = {
  padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', fontFamily: 'Inter, sans-serif', outline: 'none'
};
const btnStyle = {
  padding: '12px', backgroundColor: 'transparent', border: '1px solid var(--usa-cyan)', color: 'var(--usa-cyan)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif'
};