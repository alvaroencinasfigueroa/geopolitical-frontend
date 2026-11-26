import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList, AreaChart, Area
} from 'recharts';
import './intel.css';

/* ============================================================
   ESTADÍSTICAS — PANEL DE INTELIGENCIA GEOPOLÍTICA
   Diseño: briefing de inteligencia / terminal de situational awareness
   ============================================================ */

// ============================================================
// DATOS
// ============================================================
const STEEL = {
  production: {
    title: 'Producción Mundial de Acero',
    short: 'Acero crudo',
    unit: 'Millones de toneladas (Mt)',
    shortUnit: 'Mt',
    brief: 'China produce <strong>más acero que el resto del mundo combinado</strong>. Un billón de toneladas anuales sin equivalente histórico: en 1990, la producción mundial total era menor que la de China actual.',
    implication: 'Ventaja estructural en construcción, defendería y manufactura pesada.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 1004.0, china: true, trend: [955, 1035, 1018, 1005, 1004] },
      { name: 'India', flag: '🇮🇳', value: 149.0, china: false, trend: [111, 125, 140, 144, 149] },
      { name: 'Japón', flag: '🇯🇵', value: 84.0, china: false, trend: [88, 87, 85, 85, 84] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 79.0, china: false, trend: [80, 79, 80, 79, 79] },
      { name: 'Rusia', flag: '🇷🇺', value: 71.0, china: false, trend: [73, 72, 72, 71, 71] },
      { name: 'Corea del Sur', flag: '🇰🇷', value: 63.0, china: false, trend: [62, 63, 63, 64, 63] },
      { name: 'Alemania', flag: '🇩🇪', value: 37.0, china: false, trend: [38, 38, 37, 37, 37] },
      { name: 'Turquía', flag: '🇹🇷', value: 36.0, china: false, trend: [29, 33, 35, 36, 36] },
      { name: 'Brasil', flag: '🇧🇷', value: 33.0, china: false, trend: [32, 33, 33, 33, 33] },
      { name: 'Irán', flag: '🇮🇷', value: 31.0, china: false, trend: [28, 30, 30, 31, 31] }
    ]
  }
};

const SHIPS = {
  tonnage: {
    title: 'Construcción Naval Mundial',
    short: 'Tonelaje bruto',
    unit: 'Millones de GT entregados',
    shortUnit: 'M GT',
    brief: 'China construye <strong>más de la mitad</strong> del tonelaje mundial de comercio. Su capacidad instalada equivale a las tres mayores Banneras de la competencia combinadas.',
    implication: 'Control del coste logístico del comercio global y de la cadena de suministro marítima.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 53.2, china: true, trend: [47, 48, 50, 51, 53.2] },
      { name: 'Corea del Sur', flag: '🇰🇷', value: 23.5, china: false, trend: [21, 22, 23, 23, 23.5] },
      { name: 'Japón', flag: '🇯🇵', value: 13.4, china: false, trend: [14.8, 14.5, 14.1, 13.7, 13.4] },
      { name: 'UE', flag: '🇪🇺', value: 2.7, china: false, trend: [2.9, 2.8, 2.8, 2.7, 2.7] },
      { name: 'Resto', flag: '🌐', value: 6.7, china: false, trend: [6.4, 6.5, 6.6, 6.6, 6.7] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 0.5, china: false, trend: [0.7, 0.6, 0.6, 0.5, 0.5] }
    ]
  }
};

const CARS = {
  total: {
    title: 'Producción Mundial de Vehículos',
    short: 'Volumen total',
    unit: 'Millones de vehículos (todo tipo)',
    shortUnit: 'M',
    brief: 'China produce <strong>3× más vehículos que EE.UU.</strong> y más que los siguientes cuatro países juntos. Fabricó uno de cada tres vehículos matriculados en el planeta.',
    implication: 'El coste de producción de vehículos más bajo del mundo presiona a toda la industria automotriz global.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 31.28, china: true, trend: [25.3, 26.4, 27.6, 30.1, 31.3] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 10.56, china: false, trend: [8.9, 8.8, 9.3, 10.6, 10.6] },
      { name: 'Japón', flag: '🇯🇵', value: 8.23, china: false, trend: [7.8, 7.6, 7.4, 8.1, 8.2] },
      { name: 'India', flag: '🇮🇳', value: 6.01, china: false, trend: [4.6, 5.0, 5.4, 5.7, 6.0] },
      { name: 'México', flag: '🇲🇽', value: 3.99, china: false, trend: [3.2, 3.4, 3.6, 3.9, 4.0] },
      { name: 'Corea del Sur', flag: '🇰🇷', value: 3.96, china: false, trend: [3.6, 3.7, 3.9, 3.9, 4.0] },
      { name: 'Alemania', flag: '🇩🇪', value: 3.90, china: false, trend: [3.4, 3.5, 3.8, 3.9, 3.9] },
      { name: 'Brasil', flag: '🇧🇷', value: 2.55, china: false, trend: [2.1, 2.3, 2.4, 2.5, 2.6] }
    ]
  }
};

const DRONES = {
  civilian: {
    title: 'Producción Mundial de Drones',
    short: 'Drones comerciales',
    unit: 'Millones de drones civiles al año',
    shortUnit: 'M',
    brief: 'China fabrica <strong>~75–80% de los drones comerciales del mundo</strong>. Shenzhen —donde headquartered DJI, Autel y EHang— produce más que el resto del planeta junto. La cadena de suministro es íntegramente doméstica.',
    implication: 'Dominio absoluto sobre la siguiente generación de guerra asimétrica y de inspección industrial.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 24.5, china: true, trend: [12, 15, 18, 21, 24.5] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 3.2, china: false, trend: [2.1, 2.4, 2.7, 3.0, 3.2] },
      { name: 'Japón', flag: '🇯🇵', value: 0.45, china: false, trend: [0.38, 0.40, 0.42, 0.44, 0.45] },
      { name: 'Corea del Sur', flag: '🇰🇷', value: 0.38, china: false, trend: [0.30, 0.32, 0.34, 0.36, 0.38] },
      { name: 'Alemania', flag: '🇩🇪', value: 0.22, china: false, trend: [0.18, 0.19, 0.20, 0.21, 0.22] },
      { name: 'Francia', flag: '🇫🇷', value: 0.18, china: false, trend: [0.15, 0.16, 0.16, 0.17, 0.18] },
      { name: 'Reino Unido', flag: '🇬🇧', value: 0.15, china: false, trend: [0.12, 0.13, 0.14, 0.14, 0.15] },
      { name: 'Israel', flag: '🇮🇱', value: 0.12, china: false, trend: [0.10, 0.11, 0.11, 0.12, 0.12] }
    ]
  }
};

const FIBER = {
  production: {
    title: 'Producción Mundial de Fibra Óptica',
    short: 'Fibra óptica',
    unit: 'Millones de kilómetros de fibra al año',
    shortUnit: 'M km',
    brief: 'China produce <strong>~65–70% de la fibra óptica mundial</strong>. YOFC, Hengtong, Futong y ZTT fabrican juntas más que Corning, Prysmian y Sumitomo combinadas. Cada backbone de internet global pasa por manufactura china.',
    implication: 'Control del componente crítico de la infraestructura de datos global y de las comunicaciones de defensa.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 410.0, china: true, trend: [330, 350, 370, 392, 410] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 55.0, china: false, trend: [48, 50, 52, 54, 55] },
      { name: 'Japón', flag: '🇯🇵', value: 38.0, china: false, trend: [40, 39, 39, 38, 38] },
      { name: 'India', flag: '🇮🇳', value: 22.0, china: false, trend: [15, 17, 19, 21, 22] },
      { name: 'Corea del Sur', flag: '🇰🇷', value: 12.0, china: false, trend: [10, 10.5, 11, 11.5, 12] },
      { name: 'Italia', flag: '🇮🇹', value: 8.5, china: false, trend: [8.2, 8.3, 8.4, 8.4, 8.5] },
      { name: 'Francia', flag: '🇫🇷', value: 6.0, china: false, trend: [5.8, 5.9, 5.9, 6.0, 6.0] },
      { name: 'Alemania', flag: '🇩🇪', value: 5.5, china: false, trend: [5.4, 5.4, 5.5, 5.5, 5.5] }
    ]
  }
};

// Motocicletas — datos basados en OICA, IMMA (International Motorcycle Manufacturers
// Association) y Motorcycle Industry Council. Volumen de unidades producidas al año.
const MOTORCYCLES = {
  production: {
    title: 'Producción Mundial de Motocicletas',
    short: 'Motocicletas',
    unit: 'Millones de motocicletas producidas al año',
    shortUnit: 'M',
    brief: 'China es el <strong>mayor productor mundial de motocicletas</strong>, seguido de India. Pero lo decisivo es el saldo comercial: China exporta alrededor de 4,5 millones de unidades al año mientras India apenas rebasa las 800.000 — China fabrica motas para el mundo, India para su mercado interior.',
    implication: 'Control de la cadena de suministro global de dos ruedas, clave para la logística de última milla en Asia y África.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 27.0, china: true, trend: [22.5, 24.0, 25.4, 26.2, 27.0] },
      { name: 'India', flag: '🇮🇳', value: 21.0, china: false, trend: [18.4, 19.2, 20.1, 20.6, 21.0] },
      { name: 'Indonesia', flag: '🇮🇩', value: 7.5, china: false, trend: [6.2, 6.7, 7.0, 7.3, 7.5] },
      { name: 'Japón', flag: '🇯🇵', value: 4.0, china: false, trend: [4.6, 4.4, 4.2, 4.1, 4.0] },
      { name: 'Brasil', flag: '🇧🇷', value: 2.3, china: false, trend: [1.9, 2.0, 2.1, 2.2, 2.3] },
      { name: 'Tailandia', flag: '🇹🇭', value: 1.7, china: false, trend: [1.4, 1.5, 1.6, 1.6, 1.7] },
      { name: 'México', flag: '🇲🇽', value: 1.5, china: false, trend: [1.3, 1.4, 1.4, 1.5, 1.5] },
      { name: 'Vietnam', flag: '🇻🇳', value: 1.3, china: false, trend: [0.9, 1.0, 1.1, 1.2, 1.3] }
    ]
  }
};

// Televisores — datos basados en OICA, AVS Forum (Consumer Electronics Association),
// TrendForce y WitsView. Volumen de unidades producidas/enviadas al año.
const TELEVISIONS = {
  production: {
    title: 'Producción Mundial de Televisores',
    short: 'Televisores',
    unit: 'Millones de televisores producidos al año',
    shortUnit: 'M',
    brief: 'China fabrica <strong>más de la mitad de los televisores del mundo</strong>. Hisense, TCL, Skyworth, Konka y Changhong cubren el mercado global de paneles y de marca blanca; ensamblan la producción de casi todos los códigos de TV de las principales marcas europeas y estadounidenses.',
    implication: 'Control del terminal de consumo y de la cadena de paneles de display, la capa más visible de la cadena de valor electrónica.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 195.0, china: true, trend: [175, 182, 188, 192, 195] },
      { name: 'Vietnam', flag: '🇻🇳', value: 44.0, china: false, trend: [28, 33, 38, 42, 44] },
      { name: 'México', flag: '🇲🇽', value: 30.0, china: false, trend: [24, 26, 28, 29, 30] },
      { name: 'Corea del Sur', flag: '🇰🇷', value: 19.0, china: false, trend: [19, 19.5, 20, 19.5, 19] },
      { name: 'India', flag: '🇮🇳', value: 14.0, china: false, trend: [9, 11, 12.5, 13.5, 14] },
      { name: 'Brasil', flag: '🇧🇷', value: 12.0, china: false, trend: [10, 11, 11.5, 12, 12] },
      { name: 'Japón', flag: '🇯🇵', value: 8.0, china: false, trend: [9.5, 9, 8.6, 8.2, 8] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 3.0, china: false, trend: [3.5, 3.4, 3.2, 3.1, 3] }
    ]
  }
};

// Juguetes — datos basados en The Toy Association (US), Toy Industries of Europe
// (TIE), 中国玩具和婴童用品协会 (CTJPA) y estimaciones sectoriales. Volumen de
// unidades producidas o exportadas al año.
const TOYS = {
  production: {
    title: 'Producción Mundial de Juguetes',
    short: 'Juguetes',
    unit: 'Miles de millones de unidades producidas al año',
    shortUnit: 'mil M',
    brief: 'China fabrica <strong>cerca del 70% de los juguetes del mundo</strong>. El 75% de las marcas globales de juguete se ensamblan en Guangdong, y el sector chino mueve más de 50.000 millones de dólares anuales en exportaciones. La ventaja no es el costo: es la densidad industrial de Shantou y Dongguan.',
    implication: 'Control del primer objeto que un niño posee en su vida — y de un canal de entrada masivo para propaganda de marca y dependencia del consumidor.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 82.0, china: true, trend: [68, 72, 76, 79, 82] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 14.0, china: false, trend: [13.2, 13.5, 13.8, 14.0, 14.0] },
      { name: 'India', flag: '🇮🇳', value: 9.0, china: false, trend: [6.8, 7.4, 8.1, 8.6, 9.0] },
      { name: 'Vietnam', flag: '🇻🇳', value: 5.0, china: false, trend: [3.2, 3.7, 4.2, 4.7, 5.0] },
      { name: 'Indonesia', flag: '🇮🇩', value: 4.5, china: false, trend: [3.6, 3.9, 4.1, 4.3, 4.5] },
      { name: 'Japón', flag: '🇯🇵', value: 3.2, china: false, trend: [3.6, 3.5, 3.4, 3.3, 3.2] },
      { name: 'México', flag: '🇲🇽', value: 2.8, china: false, trend: [2.3, 2.4, 2.6, 2.7, 2.8] },
      { name: 'Unión Europea', flag: '🇪🇺', value: 2.5, china: false, trend: [2.8, 2.7, 2.6, 2.6, 2.5] }
    ]
  }
};

// Ropa — datos basados en Statista, WTO, International Trade Centre (ITC), China
// National Garment Association y Consultancy of Allied Irenic. Volumen de
// prendas producidas al año.
const APPAREL = {
  production: {
    title: 'Producción Mundial de Ropa',
    short: 'Prendas de vestir',
    unit: 'Miles de millones de prendas producidas al año',
    shortUnit: 'mil M',
    brief: 'China confcciona <strong>cerca de la mitad de las prendas del mundo</strong>. Produce para Zara, H&M, Uniqlo, Walmart y Nike, pero las marcas siguen siendo de otros: China gana la fábrica, no el escaparate. La ventaja es el ecosistema de proveedores — Bangladesh y Vietnam no pueden igualar la densidad de Guangdong.',
    implication: 'Control del eslabón manufacturero de la cadena de valor global del tekstil, aunque el valor de marca siga en Occidente.',
    items: [
      { name: 'China', flag: '🇨🇳', value: 55.0, china: true, trend: [52, 53, 54, 54.5, 55] },
      { name: 'India', flag: '🇮🇳', value: 18.5, china: false, trend: [16.2, 17.1, 17.8, 18.2, 18.5] },
      { name: 'Vietnam', flag: '🇻🇳', value: 9.5, china: false, trend: [7.2, 7.9, 8.6, 9.1, 9.5] },
      { name: 'Bangladesh', flag: '🇧🇩', value: 8.0, china: false, trend: [6.8, 7.2, 7.6, 7.8, 8.0] },
      { name: 'Indonesia', flag: '🇮🇩', value: 4.5, china: false, trend: [3.9, 4.1, 4.3, 4.4, 4.5] },
      { name: 'Turquía', flag: '🇹🇷', value: 4.0, china: false, trend: [3.5, 3.6, 3.8, 3.9, 4.0] },
      { name: 'EE.UU.', flag: '🇺🇸', value: 3.5, china: false, trend: [3.6, 3.6, 3.5, 3.5, 3.5] },
      { name: 'UE', flag: '🇪🇺', value: 2.5, china: false, trend: [2.7, 2.6, 2.6, 2.5, 2.5] }
    ]
  }
};

const DATASETS = {
  steel: STEEL,
  ships: SHIPS,
  cars: CARS,
  drones: DRONES,
  fiber: FIBER,
  motorcycles: MOTORCYCLES,
  televisions: TELEVISIONS,
  toys: TOYS,
  apparel: APPAREL
};

const TABS = [
  { id: 'steel', label: 'Acero', icon: '⚙️', metric: 'production' },
  { id: 'ships', label: 'Naval', icon: '🚢', metric: 'tonnage' },
  { id: 'cars', label: 'Autos', icon: '🚗', metric: 'total' },
  { id: 'drones', label: 'Drones', icon: '🛸', metric: 'civilian' },
  { id: 'fiber', label: 'Fibra', icon: '🔌', metric: 'production' },
  { id: 'motorcycles', label: 'Motos', icon: '🏍️', metric: 'production' },
  { id: 'televisions', label: 'TVs', icon: '📺', metric: 'production' },
  { id: 'toys', label: 'Juguetes', icon: '🧸', metric: 'production' },
  { id: 'apparel', label: 'Ropa', icon: '👕', metric: 'production' }
];

const CATEGORIES = {
  steel: 'Materiales críticos',
  ships: 'Capacidad industrial',
  cars: 'Manufactura',
  drones: 'Tecnología dual',
  fiber: 'Infraestructura digital',
  motorcycles: 'Movilidad de dos ruedas',
  televisions: 'Electrónica de consumo',
  toys: 'Bienes de consumo',
  apparel: 'Textil y confección'
};

// ============================================================
// FORMATO
// ============================================================
function formatNumber(value, maxDecimals = 2) {
  const num = Number(value);
  const decimals = Number.isInteger(num) ? 0 : maxDecimals;
  const fixed = num.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart ? `${withThousands},${decPart}` : withThousands;
}

function formatCompact(value) {
  const num = Number(value);
  // Billones (>1000) con sufijo M para coherencia con la unidad del dataset
  if (num >= 1000) return formatNumber(num, 0);
  if (num >= 100) return formatNumber(num, 0);
  if (num >= 10) return formatNumber(num, 0);
  return formatNumber(num, 1);
}

// ============================================================
// TOOLTIP
// ============================================================
function IntelTooltip({ active, payload, shortUnit, total }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  const share = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
  const isChina = item.china;

  return (
    <div className="intel-tooltip" style={{ borderColor: isChina ? 'var(--china-red)' : 'var(--usa-cyan)' }}>
      <div className="intel-tooltip-head" style={{ color: isChina ? 'var(--china-red)' : 'var(--usa-cyan)' }}>
        <span className="intel-tooltip-rank">RANK {String(item.rank).padStart(2, '0')}</span>
        <span>{item.flag} {item.name}</span>
      </div>
      <div className="intel-tooltip-value">
        {formatNumber(item.value, 2)}
        <span className="intel-tooltip-unit">{shortUnit}</span>
      </div>
      <div className="intel-tooltip-foot">
        <span>{share}% del total</span>
        {isChina && <span className="intel-tooltip-tag">LÍDER</span>}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function EstadisticasPage() {
  const [active, setActive] = useState('steel');
  const [selected, setSelected] = useState(null);
  const [clock, setClock] = useState(new Date());
  const currentTab = TABS.find(t => t.id === active);
  const dataset = DATASETS[active][currentTab.metric];

  // Reloj de inteligencia
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Reiniciar selección al cambiar de dataset
  useEffect(() => { setSelected(null); }, [active]);

  const ranked = useMemo(
    () => dataset.items
      .map((it, i) => ({ ...it, rank: i + 1 }))
      .sort((a, b) => b.value - a.value)
      .map((it, i) => ({ ...it, rank: i + 1 })),
    [dataset]
  );

  const chinaItem = ranked.find(i => i.china);
  const secondItem = ranked.find(i => !i.china);
  const total = ranked.reduce((a, b) => a + b.value, 0);
  const share = Math.round((chinaItem.value / total) * 100);
  const ratio = (chinaItem.value / secondItem.value).toFixed(1);
  const combined = ranked.filter(i => !i.china).reduce((a, b) => a + b.value, 0);
  const vsCombined = (chinaItem.value / combined).toFixed(1);

  const selectedItem = selected !== null ? ranked[selected] : null;

  const axisStyle = { stroke: 'rgba(148,163,184,.35)', tick: { fill: 'rgba(148,163,184,.8)', fontSize: 11 } };

  // Tendencia normalizada a índice base 100 (primer año = 100) para que ambas
  // series sean comparables aunque las magnitudes sean muy distintas
  const trendData = useMemo(() => {
    const cBase = chinaItem.trend[0] || 1;
    const rBase = secondItem.trend[0] || 1;
    return chinaItem.trend.map((v, i) => ({
      year: `20${20 + i}`,
      china: Math.round((v / cBase) * 100),
      runnerUp: Math.round((secondItem.trend[i] / rBase) * 100)
    }));
  }, [chinaItem, secondItem]);

  return (
    <div className="intel-page">
      {/* ============ HEADER ============ */}
      <header className="intel-header container">
        <div className="intel-header-top">
          <div className="intel-stamp">
            <span className="intel-stamp-dot" />
            SITUATIONAL AWARENESS · {CATEGORIES[active].toUpperCase()}
          </div>
          <div className="intel-clock">
            <span className="intel-clock-time">
              {clock.toLocaleTimeString('es-ES', { hour12: false })}
            </span>
            <span className="intel-clock-date">
              {clock.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </span>
          </div>
        </div>

        <h1 className="intel-title">
          <span className="intel-title-cn">CHINA</span>
          <span className="intel-title-sep">/</span>
          <span className="intel-title-world">GLOBAL</span>
        </h1>
        <p className="intel-sub">
          Índice de dominancia industrial por sector · Datos 2024–2025 · Fuentes: UNCTAD, World Steel Association,
          OICA, IMMA, TrendForce, The Toy Association, TIE, ITC, Statista, Drone Industry Insights, CRU International, OECD
        </p>

        {/* Selector de sector */}
        <nav className="intel-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`intel-tab ${active === tab.id ? 'intel-tab-active' : ''}`}
              aria-pressed={active === tab.id}
            >
              <span className="intel-tab-icon">{tab.icon}</span>
              <span className="intel-tab-label">{tab.label}</span>
              <span className="intel-tab-index">0{TABS.findIndex(t => t.id === tab.id) + 1}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* ============ TARJETA PRINCIPAL ============ */}
      <section className="intel-panel container">
        <div className="intel-panel-head">
          <div>
            <div className="intel-panel-kicker">SECTOR · {CATEGORIES[active]}</div>
            <h2 className="intel-panel-title">{dataset.title}</h2>
          </div>
          <div className="intel-panel-unit">
            <span className="intel-panel-unit-label">UNIDAD</span>
            <span className="intel-panel-unit-value">{dataset.unit}</span>
          </div>
        </div>

        <div className="intel-grid">
          {/* ---- GRÁFICO PRINCIPAL ---- */}
          <div className="intel-chart-wrap">
            <ResponsiveContainer width="100%" height={480}>
              <BarChart
                data={ranked}
                margin={{ top: 40, right: 24, left: 0, bottom: 64 }}
                barCategoryGap="16%"
              >
                <defs>
                  <linearGradient id="gradChina" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF2E5B" />
                    <stop offset="55%" stopColor="#FF003C" />
                    <stop offset="100%" stopColor="#A8002E" />
                  </linearGradient>
                  <linearGradient id="gradOther" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748B" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <filter id="glowChina" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="9" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="2 6" stroke="rgba(148,163,184,.10)" vertical={false} />
                <XAxis
                  dataKey="name"
                  {...axisStyle}
                  angle={-28}
                  textAnchor="end"
                  interval={0}
                  height={64}
                  tick={{ fill: 'rgba(148,163,184,.8)', fontSize: 11 }}
                />
                <YAxis {...axisStyle} width={52} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,.04)' }}
                  content={<IntelTooltip shortUnit={dataset.shortUnit} total={total} />}
                  animationDuration={120}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1100}
                  animationEasing="ease-out"
                  maxBarSize={64}
                  onClick={(_, index) => setSelected(selected === index ? null : index)}
                  activeBar={{ style: { filter: 'url(#glowChina)' } }}
                >
                  {ranked.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.china ? 'url(#gradChina)' : 'url(#gradOther)'}
                      filter={entry.china ? 'url(#glowChina)' : undefined}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    offset={14}
                    content={({ x, y, width, index }) => {
                      const e = ranked[index];
                      if (!e) return null;
                      return (
                        <text
                          x={x + width / 2}
                          y={y - 10}
                          textAnchor="middle"
                          fill={e.china ? '#FF5C7A' : 'rgba(226,232,240,.85)'}
                          fontSize={e.china ? 19 : 12}
                          fontWeight={800}
                          fontFamily="Orbitron, sans-serif"
                          style={{ textShadow: '0 0 10px rgba(0,0,0,.95)' }}
                        >
                          {formatCompact(e.value)}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="intel-chart-hint">INTERACTÚA CON LAS BARRAS PARA VER EL DESGLOSE</div>
          </div>

          {/* ---- PANEL LATERAL: MÉTRICAS ---- */}
          <aside className="intel-side">
            {/* Ratio vs resto del mundo */}
            <div className="intel-metric intel-metric-hero">
              <div className="intel-metric-label">VS. RESTO DEL MUNDO COMBINADO</div>
              <div className="intel-metric-big">
                {vsCombined}
                <span className="intel-metric-suffix">×</span>
              </div>
              <div className="intel-metric-sub">
                China produce <strong>{formatNumber(chinaItem.value, 1)}</strong> {dataset.shortUnit};
                el resto del mundo junto, <strong>{formatNumber(combined, 1)}</strong>
              </div>
              <div className="intel-meter">
                <div className="intel-meter-fill" style={{ width: `${share}%` }} />
              </div>
              <div className="intel-meter-labels">
                <span>CHINA {share}%</span>
                <span>RESTO {100 - share}%</span>
              </div>
            </div>

            {/* Ratio vs #2 */}
            <div className="intel-metric">
              <div className="intel-metric-label">VENTAJA VS. SEGUNDO LUGAR</div>
              <div className="intel-metric-row">
                <div className="intel-metric-mid">{ratio}×</div>
                <div className="intel-metric-context">
                  <div className="intel-metric-context-row">
                    <span className="intel-dot intel-dot-cn" /> {chinaItem.flag} {chinaItem.name}
                    <strong>{formatNumber(chinaItem.value, 1)}</strong>
                  </div>
                  <div className="intel-metric-context-row">
                    <span className="intel-dot intel-dot-other" /> {secondItem.flag} {secondItem.name}
                    <strong>{formatNumber(secondItem.value, 1)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Posición de China */}
            <div className="intel-metric">
              <div className="intel-metric-label">POSICIÓN GLOBAL</div>
              <div className="intel-rank">
                <span className="intel-rank-num">01</span>
                <div>
                  <div className="intel-rank-name">{chinaItem.flag} {chinaItem.name}</div>
                  <div className="intel-rank-sub">{share}% de la cuota mundial</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ============ DETALLE SELECCIONADO ============ */}
        {selectedItem && (
          <div className="intel-detail" style={{ borderColor: selectedItem.china ? 'var(--china-red)' : 'var(--usa-cyan)' }}>
            <div className="intel-detail-left">
              <div className="intel-detail-rank">RANK {String(selectedItem.rank).padStart(2, '0')}</div>
              <div className="intel-detail-name">{selectedItem.flag} {selectedItem.name}</div>
              <div className="intel-detail-share">
                {((selectedItem.value / total) * 100).toFixed(1)}% del total de la muestra
                {selectedItem.china && ' · líder mundial'}
              </div>
            </div>
            <div className="intel-detail-value" style={{ color: selectedItem.china ? '#FF5C7A' : '#00F0FF' }}>
              {formatNumber(selectedItem.value, 2)}
              <span className="intel-detail-unit">{dataset.shortUnit}</span>
            </div>
          </div>
        )}

        {/* ============ ANÁLISIS + TENDENCIA ============ */}
        <div className="intel-grid intel-grid-bottom">
          <div className="intel-brief">
            <div className="intel-brief-head">
              <span className="intel-brief-tag">LECTURA</span>
              <span className="intel-brief-title">Implicación estratégica</span>
            </div>
            <p
              className="intel-brief-text"
              dangerouslySetInnerHTML={{ __html: dataset.brief }}
            />
            <div className="intel-implication">
              <span className="intel-implication-icon">▸</span>
              <span>{dataset.implication}</span>
            </div>
          </div>

          <div className="intel-trend">
            <div className="intel-brief-head">
              <span className="intel-brief-tag">TENDENCIA</span>
              <span className="intel-brief-title">Desempeño relativo · índice base 100 (2020)</span>
            </div>
            <ResponsiveContainer width="100%" height={168}>
              <AreaChart data={trendData} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaChina" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,0,60,.45)" />
                    <stop offset="100%" stopColor="rgba(255,0,60,0)" />
                  </linearGradient>
                  <linearGradient id="areaOther" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,240,255,.30)" />
                    <stop offset="100%" stopColor="rgba(0,240,255,0)" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="year"
                  stroke="rgba(148,163,184,.35)"
                  tick={{ fill: 'rgba(148,163,184,.7)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  hide
                  domain={['dataMin - 8', 'dataMax + 8']}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(6,8,14,.97)',
                    border: '1px solid rgba(148,163,184,.25)',
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif'
                  }}
                  labelStyle={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}
                  formatter={(value, name) => [
                    `${value} (índice)`,
                    name === 'china' ? `${chinaItem.flag} ${chinaItem.name}` : `${secondItem.flag} ${secondItem.name}`
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="china"
                  name={`${chinaItem.name}`}
                  stroke="#FF003C"
                  strokeWidth={2.5}
                  fill="url(#areaChina)"
                  dot={{ r: 2.5, fill: '#FF003C', strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="runnerUp"
                  name={secondItem.name}
                  stroke="#00F0FF"
                  strokeWidth={1.8}
                  strokeDasharray="4 3"
                  fill="url(#areaOther)"
                  dot={{ r: 2, fill: '#00F0FF', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="intel-trend-legend">
              <span><span className="intel-dot intel-dot-cn" /> {chinaItem.name}</span>
              <span><span className="intel-dot intel-dot-other" /> {secondItem.name}</span>
              <span className="intel-trend-note">Base 100 = 2020</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="intel-footer container">
        <div className="intel-footer-rule" />
        <div className="intel-footer-row">
          <span>GEOPOLITICS.DATA · PANEL DE ESTADÍSTICAS COMPARADAS</span>
          <span className="intel-footer-tag">DATOS VERIFICADOS · UNCTAD / WTO / ITC / WORLDSTEEL / OICA / TIE / TRENDFORCE</span>
        </div>
      </footer>
    </div>
  );
}
