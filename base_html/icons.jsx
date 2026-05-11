// icons.jsx — inline SVG icons for playmaps
// All icons accept size (default 24) and color (default currentColor)

const Icon = {
  Burger: ({ size = 28, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6"  width="18" height="2.4" rx="1.2" fill={color}/>
      <rect x="3" y="11" width="18" height="2.4" rx="1.2" fill={color}/>
      <rect x="3" y="16" width="18" height="2.4" rx="1.2" fill={color}/>
    </svg>
  ),
  PinMap: ({ size = 30, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5c-3.86 0-7 3.05-7 6.81 0 4.5 5.6 10.5 6.5 11.45.27.28.73.28 1 0 .9-.95 6.5-6.95 6.5-11.45C19 5.55 15.86 2.5 12 2.5Zm0 9.5a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z" fill={color}/>
    </svg>
  ),
  Profile: ({ size = 28, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.4" r="4.2" fill={color}/>
      <path d="M3.6 21c0-4.4 3.76-7.4 8.4-7.4s8.4 3 8.4 7.4" fill={color}/>
    </svg>
  ),
  Plus: ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="10.5" y="4" width="3" height="16" rx="1.5" fill={color}/>
      <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill={color}/>
    </svg>
  ),
  Star: ({ size = 22, filled = false, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#f5b91a' : 'none'} stroke={color} strokeWidth={filled ? 0 : 1.6} aria-hidden="true">
      <path d="M12 2.7l2.93 5.94 6.57.96-4.75 4.62 1.12 6.52L12 17.66l-5.87 3.08 1.12-6.52L2.5 9.6l6.57-.96L12 2.7Z"/>
    </svg>
  ),
  Compass: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z" fill={color}/>
    </svg>
  ),
  Search: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.6" stroke={color} strokeWidth="1.8"/>
      <path d="M16 16l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Gear: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm8.4 3.6c0-.5-.05-.98-.13-1.46l2.13-1.65-2-3.46-2.5.86a7.94 7.94 0 0 0-2.53-1.46l-.4-2.63h-4l-.4 2.63c-.92.34-1.78.83-2.53 1.46l-2.5-.86-2 3.46 2.13 1.65A8.4 8.4 0 0 0 3.6 12c0 .5.05.98.13 1.46L1.6 15.11l2 3.46 2.5-.86c.75.63 1.6 1.12 2.53 1.46l.4 2.63h4l.4-2.63a7.94 7.94 0 0 0 2.53-1.46l2.5.86 2-3.46-2.13-1.65c.08-.48.13-.96.13-1.46Z" stroke={color} strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Logout: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 8l4 4-4 4M20 12H10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Help: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M9.4 9.4a2.6 2.6 0 1 1 4 2.4c-.8.5-1.4 1-1.4 2v.4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1" fill={color}/>
    </svg>
  ),
  Slide: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19c4-2 8-9 14-13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="18" cy="6" r="2" fill={color}/>
      <path d="M3 19h6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Swing: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 4l2 11M15 4l-2 11" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="8" y="15" width="8" height="2.4" rx="1.2" fill={color}/>
    </svg>
  ),
  Ball: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M12 3v18M3 12h18M5.5 6c2.5 1.5 11 1.5 13 0M5.5 18c2.5-1.5 11-1.5 13 0" stroke={color} strokeWidth="1.4"/>
    </svg>
  ),
  AdFree: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 17V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M3.5 4.5l17 17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 13h8M9 10l3 3M15 10l-3 3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Check: ({ size = 22, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L20 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronLeft: ({ size = 22, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logo: ({ size = 110, color = '#1f3b27' }) => (
    <svg width={size} height={size * 0.82} viewBox="0 0 200 165" aria-hidden="true">
      <defs>
        <linearGradient id="logograd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fbf6c"/>
          <stop offset="1" stopColor="#e9c462"/>
        </linearGradient>
      </defs>
      <path d="M100 12c-30 0-54 22-54 49 0 31 38 65 50 78a6 6 0 0 0 8 0c12-13 50-47 50-78 0-27-24-49-54-49Z" fill="url(#logograd)" stroke="#1f3b27" strokeWidth="3"/>
      <circle cx="100" cy="60" r="20" fill="#fff" stroke="#1f3b27" strokeWidth="3"/>
      <path d="M88 60a12 12 0 0 1 24 0M94 60v-6M106 60v-6" stroke="#1f3b27" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

window.Icon = Icon;
