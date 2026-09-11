import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

// ==========================================
// DATOS
// ==========================================
const STEEL = {
  production: {
    title: 'Producción Mundial de Acero',
    unit: 'Millones de toneladas de acero crudo producidas (2024)',
    summary: 'China produce <strong>más acero que el resto del mundo junto</strong>. Sus 1.000 millones de toneladas representan más del <strong>50%</strong> del total global.',
    items: [
      { name: 'China 🇨🇳', value: 1004.0, china: true },
      { name: 'India 🇮🇳', value: 149.0, china: false },
      { name: 'Japón 🇯🇵', value: 84.0, china: false },
      { name: 'EE.UU. 🇺🇸', value: 79.0, china: false },
      { name: 'Rusia 🇷🇺', value: 71.0, china: false },
      { name: 'Corea del Sur 🇰🇷', value: 63.0, china: false },
      { name: 'Alemania 🇩🇪', value: 37.0, china: false },
      { name: 'Turquía 🇹🇷', value: 36.0, china: false },
      { name: 'Brasil 🇧🇷', value: 33.0, china: false },
      { name: 'Irán 🇮🇷', value: 31.0, china: false }
    ]
  }
};

const SHIPS = {
  tonnage: {
    title: 'Producción Naval Mundial',
    unit: 'Millones de GT (tonelaje bruto) completados — 2025',
    summary: 'China construye <strong>más de la mitad</strong> del tonelaje mundial de barcos. Sola, supera la suma de todos los demás países.',
    items: [
      { name: 'China 🇨🇳', value: 53.2, china: true },
      { name: 'Corea del Sur 🇰🇷', value: 23.5, china: false },
      { name: 'Japón 🇯🇵', value: 13.4, china: false },
      { name: 'UE 🇪🇺', value: 2.7, china: false },
      { name: 'EE.UU. 🇺🇸', value: 0.5, china: false },
      { name: 'Resto', value: 6.7, china: false }
    ]
  }
};

const CARS = {
  total: {
    title: 'Producción Mundial de Vehículos',
    unit: 'Millones de vehículos producidos (2024)',
    summary: 'China produce <strong>3× más vehículos que EE.UU.</strong> — y <strong>más que los siguientes 4 países juntos</strong>. Fabrica 1 de cada 3 coches del planeta.',
    items: [
      { name: 'China 🇨🇳', value: 31.28, china: true },
      { name: 'EE.UU. 🇺🇸', value: 10.56, china: false },
      { name: 'Japón 🇯🇵', value: 8.23, china: false },
      { name: 'India 🇮🇳', value: 6.01, china: false },
      { name: 'México 🇲🇽', value: 3.99, china: false },
      { name: 'Corea del Sur 🇰🇷', value: 3.96, china: false },
      { name: 'Alemania 🇩🇪', value: 3.90, china: false },
      { name: 'Brasil 🇧🇷', value: 2.55, china: false }
    ]
  }
};

const DRONES = {
  civilian: {
    title: 'Producción Mundial de Drones',
    unit: 'Millones de drones civiles producidos (2024)',
    summary: 'China fabrica <strong>~75–80% de los drones comerciales del mundo</strong>. Solo Shenzhen produce más que el resto del planeta junto.',
    items: [
      { name: 'China 🇨🇳', value: 24.5, china: true },
      { name: 'EE.UU. 🇺🇸', value: 3.2, china: false },
      { name: 'Japón 🇯🇵', value: 0.45, china: false },
      { name: 'Corea del Sur 🇰🇷', value: 0.38, china: false },
      { name: 'Alemania 🇩🇪', value: 0.22, china: false },
      { name: 'Francia 🇫🇷', value: 0.18, china: false },
      { name: 'Reino Unido 🇬🇧', value: 0.15, china: false },
      { name: 'Israel 🇮🇱', value: 0.12, china: false }
    ]
  }
};

// Fibra óptica — datos basados en CRU International, YOFC reports, Corning 10-K
// Producción medida en millones de kilómetros de fibra (fiber-km) anuales.
const FIBER = {
  production: {
    title: 'Producción Mundial de Fibra Óptica',
    unit: 'Millones de kilómetros de fibra óptica producidos (2024)',
    summary: 'China produce <strong>~65–70% de la fibra óptica del mundo</strong>. YOFC, Hengtong, Futong y ZTT fabrican juntas más fibra que Corning, Prysmian y Sumitomo combinadas. La fibra china es la columna vertebral de internet global.',
    items: [
      { name: 'China 🇨🇳', value: 410.0, china: true },
      { name: 'EE.UU. 🇺🇸', value: 55.0, china: false },
      { name: 'Japón 🇯🇵', value: 38.0, china: false },
      { name: 'India 🇮🇳', value: 22.0, china: false },
      { name: 'Corea del Sur 🇰🇷', value: 12.0, china: false },
      { name: 'Italia 🇮🇹', value: 8.5, china: false },
      { name: 'Francia 🇫🇷', value: 6.0, china: false },
      { name: 'Alemania 🇩🇪', value: 5.5, china: false }
    ]
  }
};

const DATASETS = {
  steel: STEEL,
  ships: SHIPS,
  cars: CARS,
  drones: DRONES,
  fiber: FIBER
};

const TABS = [
  { id: 'steel', label: '🏭 Acero', metric: 'production' },
  { id: 'ships', label: '🚢 Barcos', metric: 'tonnage' },
  { id: 'cars', label: '🚗 Autos', metric: 'total' },
  { id: 'drones', label: '🛸 Drones', metric: 'civilian' },
  { id: 'fiber', label: '🔌 Fibra óptica', metric: 'production' }
];

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function EstadisticasPage() {
  const [active, setActive] = useState('steel');
  const currentTab = TABS.find(t => t.id === active);
  const dataset = DATASETS[active][currentTab.metric];

  // Cálculo de KPIs
  const chinaValue = dataset.items.find(i => i.china).value;
  const secondValue = [...dataset.items.filter(i => !i.china)]
    .sort((a, b) => b.value - a.value)[0].value;
  const total = dataset.items.reduce((a, b) => a + b.value, 0);
  const share = Math.round((chinaValue / total) * 100);
  const ratio = (chinaValue / secondValue).toFixed(1);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: '#0F0F14',
      border: '1px solid #FF003C',
      borderRadius: '8px',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    },
    labelStyle: { color: '#00F0FF' },
    formatter: (v) => v.toLocaleString('es-ES')
  };

  return (
    <>
      <header className="hero container">
        <div className="badge">Datos Comparados 2024-2025</div>
        <h2 className="hero-title">
          <span className="text-red">CHINA</span>
          <span className="vs-text">VS</span>
          <span className="text-cyan">MUNDO</span>
        </h2>
        <p className="hero-subtitle">
          La dominación industrial china medida en 5 sectores clave:
          acero, construcción naval, automotriz, drones y fibra óptica.
        </p>
      </header>

      <section className="section container">
        {/* TABS */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '999px',
                border: `1px solid ${active === tab.id ? '#FF003C' : 'rgba(255,255,255,0.1)'}`,
                background: active === tab.id ? '#FF003C' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TARJETA DEL GRÁFICO */}
        <div className="glass-card">
          <h3 className="section-title red">{dataset.title}</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
            {dataset.unit}
          </p>

          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={dataset.items} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="name"
                stroke="#888"
                tick={{ fill: '#888', fontSize: 11 }}
                angle={-25}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                {dataset.items.map((entry, i) => (
                  <Cell key={i} fill={entry.china ? '#FF003C' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '24px'
          }}>
            <div style={kpiStyle}>
              <div style={kpiValueStyle}>{share}%</div>
              <div style={kpiLabelStyle}>del total mundial</div>
            </div>
            <div style={kpiStyle}>
              <div style={kpiValueStyle}>{ratio}×</div>
              <div style={kpiLabelStyle}>vs. #2 ({secondValue.toLocaleString('es-ES')})</div>
            </div>
            <div style={kpiStyle}>
              <div style={kpiValueStyle}>{chinaValue.toLocaleString('es-ES')}</div>
              <div style={kpiLabelStyle}>solo China</div>
            </div>
          </div>

          {/* RESUMEN */}
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(255, 0, 60, 0.08)',
              borderLeft: '3px solid #FF003C',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}
            dangerouslySetInnerHTML={{ __html: dataset.summary }}
          />
        </div>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.8rem', marginTop: '20px' }}>
          Fuentes: UNCTAD, World Steel Association, OICA, Drone Industry Insights, CRU International, YOFC, Corning 10-K, OECD.
          Cifras redondeadas con fines comparativos.
        </p>
      </section>
    </>
  );
}

const kpiStyle = {
  background: 'rgba(255, 0, 60, 0.1)',
  border: '1px solid rgba(255, 0, 60, 0.4)',
  borderRadius: '10px',
  padding: '14px',
  textAlign: 'center'
};

const kpiValueStyle = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#00F0FF',
  fontFamily: 'Orbitron, sans-serif'
};

const kpiLabelStyle = {
  fontSize: '0.75rem',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginTop: '4px'
};
