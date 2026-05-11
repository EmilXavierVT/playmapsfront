// parts.jsx — shared building blocks for playmaps screens
const { useState, useEffect, useMemo } = React;

// ─── Status bar shown at top of every screen
function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div className="status-bar" style={{ color: c }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* signal */}
        <svg width="18" height="11" viewBox="0 0 18 11" aria-hidden="true">
          <rect x="0"  y="7" width="3" height="4" rx="0.6" fill={c}/>
          <rect x="5"  y="5" width="3" height="6" rx="0.6" fill={c}/>
          <rect x="10" y="3" width="3" height="8" rx="0.6" fill={c}/>
          <rect x="15" y="0" width="3" height="11" rx="0.6" fill={c}/>
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true" fill={c}>
          <path d="M8 3a8 8 0 0 1 5.6 2.4l1-1A9.4 9.4 0 0 0 8 1.6 9.4 9.4 0 0 0 1.4 4.4l1 1A8 8 0 0 1 8 3Z"/>
          <path d="M8 6a5 5 0 0 1 3.5 1.4l1-1A6.4 6.4 0 0 0 8 4.6a6.4 6.4 0 0 0-4.5 1.8l1 1A5 5 0 0 1 8 6Z"/>
          <circle cx="8" cy="9.4" r="1.3"/>
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={c} strokeOpacity=".4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.6" fill={c}/>
          <rect x="23.5" y="4" width="2" height="4" rx="1" fill={c} opacity=".5"/>
        </svg>
      </span>
    </div>
  );
}

// ─── Bottom navigation bar (3 tabs)
function BottomNav({ active, onNav }) {
  return (
    <div className="pm-bottombar" role="navigation" aria-label="Navigation">
      <button className={`menu ${active === 'menu' ? 'active' : ''}`} onClick={() => onNav('menu')} aria-label="Menu">
        <Icon.Burger size={32} />
      </button>
      <button className={active === 'home' ? 'active' : ''} onClick={() => onNav('home')} aria-label="Kort">
        <Icon.PinMap size={36} />
      </button>
      <button className={`right ${active === 'profile' ? 'active' : ''}`} onClick={() => onNav('profile')} aria-label="Profil">
        <Icon.Profile size={32} />
      </button>
    </div>
  );
}

// ─── Park info card (used on home + details)
function ParkInfoCard({ park, onNavigate, onOpenDetails }) {
  return (
    <div className="pm-card" style={{
      width: 363, padding: '14px 18px',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 14px',
      alignItems: 'center',
    }}>
      <button onClick={onOpenDetails} style={{
        background: 'transparent', border: 0, padding: 0, textAlign: 'left',
        font: '700 19px/1.2 Inter, sans-serif', color: '#0f1a2e', cursor: 'pointer',
      }}>
        {park.name}
      </button>
      <div style={{ font: '600 14px/1.2 Inter, sans-serif', color: '#0f1a2e', textAlign: 'right' }}>
        {park.km.toFixed(1)} km
      </div>
      <div style={{ font: '400 14px/1.2 Inika, serif', color: '#0f1a2e', opacity: .85 }}>
        Antal: <b>{park.count}</b> · {park.facilities.length} faciliteter
      </div>
      <button onClick={() => onNavigate(park)} style={{
        background: 'rgba(255,255,255,0.55)',
        border: 0, borderRadius: 18,
        padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 6,
        font: '600 13px/1 Inter, sans-serif', color: '#0f1a2e',
        cursor: 'pointer',
      }}>
        <Icon.Compass size={16} /> Naviger
      </button>
    </div>
  );
}

// ─── Map (interactive markers)
const MAP_BG = (typeof window !== 'undefined' && window.__resources && window.__resources.mapBg) || './assets/map.png';

// Curated set of markers (positions in % of map area)
const PARKS = [
  { id: 'banana',   name: 'Banana Park',     x: 32, y: 36, km: 0.6, count: 8, facilities: ['Gynger', 'Rutsjebane', 'Fodboldbane'] },
  { id: 'lyngby',   name: 'Lyngby Parken',   x: 64, y: 28, km: 1.4, count: 3, facilities: ['Gynger', 'Sandkasse'] },
  { id: 'eg',       name: 'Egeparken',       x: 22, y: 60, km: 0.9, count: 0, facilities: ['Gynger', 'Klatrestativ'] },
  { id: 'aaby',     name: 'Aaby Plads',      x: 78, y: 58, km: 2.1, count: 5, facilities: ['Rutsjebane', 'Fodboldbane'] },
  { id: 'soby',     name: 'Søby Have',       x: 50, y: 72, km: 1.1, count: 2, facilities: ['Gynger', 'Sandkasse', 'Klatrestativ'] },
  { id: 'nord',     name: 'Nordskoven',      x: 14, y: 22, km: 3.4, count: 1, facilities: ['Klatrestativ'] },
  { id: 'kirke',    name: 'Kirkeengen',      x: 86, y: 40, km: 2.7, count: 4, facilities: ['Gynger', 'Rutsjebane'] },
];

function PMMap({ size = { w: 363, h: 248 }, focusedId, onSelect, showCurrent = true }) {
  return (
    <div style={{
      position: 'relative', width: size.w, height: size.h,
      borderRadius: 25, overflow: 'hidden',
      boxShadow: '0 2px 15px rgba(0,0,0,0.45)',
      background: '#dde6ce',
      backgroundImage: `url(${MAP_BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* subtle vignette */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.12) 100%)', pointerEvents:'none' }}/>

      {showCurrent && (
        <div style={{
          position: 'absolute', left: '46%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 14, height: 14, borderRadius: '50%',
          background: '#1d8df0', boxShadow: '0 0 0 4px rgba(29,141,240,0.25)',
          animation: 'pm-pulse 1.6s ease-out infinite',
          zIndex: 5,
        }} />
      )}

      {PARKS.map(p => {
        const focused = focusedId === p.id;
        return (
          <button key={p.id} onClick={() => onSelect && onSelect(p)} style={{
            position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
            transform: `translate(-50%, -100%) scale(${focused ? 1.3 : 1})`,
            background:'transparent', border:0, padding:0, cursor:'pointer',
            zIndex: focused ? 12 : 6,
            transition: 'transform .18s ease',
          }} aria-label={p.name}>
            <svg width="22" height="28" viewBox="0 0 22 28">
              <defs>
                <filter id={`s-${p.id}`} x="-20%" y="-10%" width="140%" height="130%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity=".45"/>
                </filter>
              </defs>
              <g filter={`url(#s-${p.id})`}>
                <path d="M11 0a10 10 0 0 0-10 10c0 6.5 9 17 9.4 17.4a.8.8 0 0 0 1.2 0C12 27 21 16.5 21 10A10 10 0 0 0 11 0Z" fill={focused ? '#ff6f3c' : '#1d8df0'}/>
                <circle cx="11" cy="10" r="4.4" fill="#fff"/>
              </g>
            </svg>
            {focused && (
              <div style={{
                position:'absolute', bottom: 30, left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(20,20,20,0.92)', color:'#fff',
                font: '600 11px/1 Inter, sans-serif',
                padding: '5px 8px', borderRadius: 8, whiteSpace:'nowrap',
              }}>{p.name}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Reusable rounded button row (overlay menu)
function MenuRow({ icon: IconC, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 356, height: 56,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 22px',
      background: 'rgba(147,167,229,0.7)',
      border: 0, borderRadius: 14,
      boxShadow: 'var(--shadow-soft)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      font: '700 18px/1 Inter, sans-serif',
      color: '#0f1a2e',
      cursor: 'pointer',
    }}>
      <IconC size={22} />
      <span>{label}</span>
    </button>
  );
}

window.StatusBar = StatusBar;
window.BottomNav = BottomNav;
window.ParkInfoCard = ParkInfoCard;
window.PMMap = PMMap;
window.MenuRow = MenuRow;
window.PARKS = PARKS;
