// app.jsx — top-level state machine + scaling
const { useState: useState_, useEffect: useEffect_, useRef: useRef_ } = React;

function PhoneFrame({ children }) {
  const ref = useRef_(null);
  useEffect_(() => {
    const fit = () => {
      const el = ref.current; if (!el) return;
      const pad = 32;
      const sx = (window.innerWidth - pad) / 402;
      const sy = (window.innerHeight - pad) / 874;
      const s = Math.min(sx, sy, 1.05);
      el.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div ref={ref} style={{
      width: 402, height: 874, position: 'relative', borderRadius: 60,
      transformOrigin: 'center center',
      background: '#0a0a0a',
      padding: 0,
      boxShadow: '0 50px 100px -30px rgba(0,0,0,.55), 0 24px 60px -25px rgba(0,0,0,.35), inset 0 0 0 8px #1a1a1a, inset 0 0 0 10px #2a2a2a',
    }}>
      <div style={{
        position:'absolute', top: 22, left:'50%', transform:'translateX(-50%)',
        width: 110, height: 32, borderRadius: 18, background:'#000', zIndex: 60, pointerEvents:'none'
      }} />
      <div style={{ position:'absolute', inset: 8, borderRadius: 56, overflow:'hidden', background:'#fff' }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState_('login'); // login | home | details | profile | menu
  const [parkId, setParkId] = useState_('banana');
  const [focusedPark, setFocusedPark] = useState_('banana');

  const [kids, setKids] = useState_([
    { id: 1, name: 'Michel' },
    { id: 2, name: 'Andrea' },
  ]);
  const [favorites, setFavorites] = useState_(['banana']);
  const toggleFav = id => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  // checkedIn: { parkId: [kidId, ...] }
  const [checkedIn, setCheckedIn] = useState_({});
  const [lastCheck, setLastCheck] = useState_(null);

  // overlays
  const [showCheckIn, setShowCheckIn] = useState_(false);
  const [showCheckOut, setShowCheckOut] = useState_(false);
  const [showAddChild, setShowAddChild] = useState_(false);
  const [toast, setToast] = useState_(null);

  const flashToast = t => { setToast(t); setTimeout(() => setToast(null), 1800); };

  const handleCheckInPick = kid => {
    setCheckedIn(s => ({ ...s, [parkId]: [...(s[parkId] || []), kid.id] }));
    const park = PARKS.find(p => p.id === parkId);
    setLastCheck(`${park.name} · i dag`);
    setShowCheckIn(false);
    flashToast(`${kid.name} er tjekket ind`);
  };

  const handleCheckOutPick = kid => {
    setCheckedIn(s => {
      const next = { ...s };
      next[parkId] = (next[parkId] || []).filter(id => id !== kid.id);
      if (!next[parkId].length) delete next[parkId];
      return next;
    });
    setShowCheckOut(false);
    flashToast(`${kid.name} er tjekket ud`);
  };

  const handleAddKid = data => {
    setKids(k => [...k, { id: data.id, name: data.name }]);
    setShowAddChild(false);
    flashToast(`${data.name} tilføjet`);
  };

  const checkedKidsHere = (checkedIn[parkId] || []).map(id => kids.find(k => k.id === id)).filter(Boolean);

  return (
    <PhoneFrame>
      {route === 'login' && (
        <LoginScreen onLogin={() => setRoute('home')} />
      )}
      {route === 'home' && (
        <HomeScreen
          onNav={setRoute}
          onSelectPark={(id) => { setParkId(id); setRoute('details'); }}
          focusedPark={focusedPark}
          setFocusedPark={setFocusedPark}
          favorites={favorites}
          toggleFav={toggleFav}
        />
      )}
      {route === 'details' && (
        <DetailsScreen
          parkId={parkId}
          onNav={setRoute}
          onBack={() => setRoute('home')}
          onCheckIn={() => setShowCheckIn(true)}
          onCheckOut={() => setShowCheckOut(true)}
          checkedIn={checkedIn}
          favorites={favorites}
          toggleFav={toggleFav}
        />
      )}
      {route === 'profile' && (
        <ProfileScreen
          onNav={setRoute}
          kids={kids}
          onAddKid={() => setShowAddChild(true)}
          onLogout={() => setRoute('login')}
          lastCheck={lastCheck}
          favorites={favorites}
        />
      )}
      {route === 'menu' && (
        <MenuScreen onNav={setRoute} onClose={() => setRoute('home')} />
      )}

      {showCheckIn && (
        <CheckInSheet
          kids={kids}
          onPick={handleCheckInPick}
          onClose={() => setShowCheckIn(false)}
          onAddKid={() => { setShowCheckIn(false); setShowAddChild(true); }}
        />
      )}
      {showCheckOut && (
        <CheckOutSheet
          checkedKids={checkedKidsHere}
          onPick={handleCheckOutPick}
          onClose={() => setShowCheckOut(false)}
        />
      )}
      {showAddChild && (
        <AddChildModal
          onSave={handleAddKid}
          onClose={() => setShowAddChild(false)}
        />
      )}

      {toast && <div className="pm-toast">{toast}</div>}
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
