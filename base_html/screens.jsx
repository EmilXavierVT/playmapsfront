// screens.jsx — every page in the playmaps app
const { useState: useS, useEffect: useE } = React;

// ─────────────────────────────────────────────────────────────
// LOGIN
function LoginScreen({ onLogin }) {
  const [u, setU] = useS('emil');
  const [p, setP] = useS('••••••');
  return (
    <div className="pm-screen bg-login pm-route">
      <StatusBar />
      <div style={{ position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Icon.Logo size={150} />
      </div>
      <div style={{
        position: 'absolute', top: 240, left: 0, right: 0, textAlign: 'center',
        font: '800 38px/1 "Playfair Display", serif', color: '#1f2a18', letterSpacing: '.5px',
      }}>
        playmaps
      </div>
      <div style={{
        position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center',
        font: '400 14px/1.4 Inika, serif', color: '#3a3526', opacity: .8,
      }}>
        Find legepladser i nærheden
      </div>

      <div style={{ position:'absolute', top: 360, left: 66, width: 270 }}>
        <div className="pm-pill" style={{ height: 55, marginBottom: 16, padding: '0 16px', display:'flex', alignItems:'center' }}>
          <input className="pm-input" placeholder="Brugernavn" value={u} onChange={e => setU(e.target.value)} />
        </div>
        <div className="pm-pill" style={{ height: 55, padding: '0 16px', display:'flex', alignItems:'center' }}>
          <input className="pm-input" type="password" placeholder="Kodeord" value={p} onChange={e => setP(e.target.value)} />
        </div>
      </div>

      <button onClick={onLogin} className="pm-pill solid" style={{
        position: 'absolute', top: 530, left: '50%', transform: 'translateX(-50%)',
        width: 160, height: 55, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }}>
        Login
      </button>

      <div style={{ position: 'absolute', top: 605, left: 0, right: 0, textAlign:'center' }}>
        <div><button className="pm-link blue" onClick={onLogin}>Ny bruger? klik her</button></div>
        <div style={{ marginTop: 14 }}><button className="pm-link red">Glemt kodeord?</button></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME (Forside)
function HomeScreen({ onNav, onSelectPark, focusedPark, setFocusedPark, favorites, toggleFav }) {
  const focused = PARKS.find(p => p.id === focusedPark) || PARKS[0];
  return (
    <div className="pm-screen bg-home pm-route">
      <StatusBar />
      <div style={{
        position:'absolute', top: 60, left: 0, right: 0, textAlign:'center',
        font:'800 28px/1 "Playfair Display", serif', color: '#1f2a18',
      }}>
        playmaps
      </div>
      <div style={{
        position:'absolute', top: 95, left: 0, right: 0, textAlign:'center',
        font:'400 13px/1 Inika, serif', color: '#1f2a18', opacity: .75,
      }}>
        Tirsdag · 14:32
      </div>

      <div style={{ position:'absolute', top: 130, left: 19 }}>
        <PMMap focusedId={focused.id} onSelect={p => setFocusedPark(p.id)} />
      </div>

      <button onClick={() => toggleFav(focused.id)} className={`pm-fav ${favorites.includes(focused.id) ? 'active' : ''}`} style={{ top: 144, right: 30 }}>
        <Icon.Star size={20} filled={favorites.includes(focused.id)} />
      </button>

      <div style={{ position:'absolute', top: 400, left: 19, width: 363,
        font: '400 12px/1 Inika, serif', color:'#1f2a18', opacity:.75, marginBottom: 4,
      }}>
        Tap en pin på kortet
      </div>

      <div style={{ position: 'absolute', top: 420, left: 19, width: 363, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ParkInfoCard park={focused}
          onNavigate={() => alert(`Navigerer til ${focused.name}`)}
          onOpenDetails={() => onSelectPark(focused.id)} />
        {PARKS.filter(p => p.id !== focused.id).slice(0, 2).map(p => (
          <ParkInfoCard key={p.id} park={p}
            onNavigate={() => setFocusedPark(p.id)}
            onOpenDetails={() => onSelectPark(p.id)} />
        ))}
      </div>

      <BottomNav active="home" onNav={onNav} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PARK DETAILS (Check-ind Info)
function DetailsScreen({ parkId, onNav, onBack, onCheckIn, onCheckOut, checkedIn, favorites, toggleFav }) {
  const park = PARKS.find(p => p.id === parkId) || PARKS[0];
  const checked = (checkedIn[park.id] || []).length > 0;

  const facIcon = name => ({
    'Gynger': Icon.Swing, 'Rutsjebane': Icon.Slide, 'Fodboldbane': Icon.Ball,
    'Sandkasse': Icon.Swing, 'Klatrestativ': Icon.Slide,
  }[name] || Icon.Slide);

  return (
    <div className="pm-screen bg-cream pm-route">
      <StatusBar />
      <button onClick={onBack} style={{
        position:'absolute', top: 56, left: 18, width: 38, height: 38,
        background:'rgba(255,255,255,.6)', border:0, borderRadius:'50%', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 2px 6px rgba(0,0,0,.2)', zIndex: 5,
      }} aria-label="Tilbage">
        <Icon.ChevronLeft />
      </button>
      <button onClick={() => toggleFav(park.id)} className={`pm-fav ${favorites.includes(park.id) ? 'active' : ''}`} style={{ top: 56, right: 18 }}>
        <Icon.Star size={20} filled={favorites.includes(park.id)} />
      </button>

      {/* park summary card */}
      <div style={{ position:'absolute', top: 110, left: 19, width: 363 }}>
        <ParkInfoCard park={park} onNavigate={() => alert(`Navigerer til ${park.name}`)} onOpenDetails={() => {}} />
      </div>

      {/* facilities */}
      <div className="pm-card" style={{ position:'absolute', top: 215, left: 19, width: 363, padding: '14px 18px' }}>
        <div style={{ font:'700 16px/1 Inter, sans-serif', color:'#0f1a2e', marginBottom: 12, textAlign:'center' }}>
          Faciliteter
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {park.facilities.map(f => {
            const I = facIcon(f);
            return (
              <div key={f} style={{
                display:'flex', alignItems:'center', gap: 12,
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.45)',
                borderRadius: 12,
                font:'400 16px/1 Inika, serif', color:'#0f1a2e',
              }}>
                <I size={20} /> {f}
              </div>
            );
          })}
        </div>
      </div>

      {/* comments */}
      <div className="pm-card" style={{ position:'absolute', top: 410, left: 19, width: 363, padding: '14px 18px', backdropFilter:'none' }}>
        <div style={{ font:'700 14px/1 Inter, sans-serif', color:'#0f1a2e', marginBottom: 10, textAlign:'center' }}>
          Kommentare fra andre brugere
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          <div style={{ font:'400 14px/1.35 Inika, serif', color:'#0f1a2e' }}>
            <b>Niels:</b> Ny gynge installeret i sidste uge — meget populær!
          </div>
          <div style={{ font:'400 14px/1.35 Inika, serif', color:'#0f1a2e' }}>
            <b>Rasmus:</b> Plads til mange børn, lille parkeringsplads dog.
          </div>
          <div style={{ font:'400 14px/1.35 Inika, serif', color:'#0f1a2e' }}>
            <b>Mette:</b> Skygge under træerne — perfekt om sommeren.
          </div>
        </div>
      </div>

      <button onClick={onCheckIn} className="pm-btn-green" style={{
        position:'absolute', top: 580, left: 63, width: 266, height: 56,
        fontWeight: 700,
      }}>
        Tjek ind
      </button>
      <button onClick={onCheckOut} className="pm-btn-green" style={{
        position:'absolute', top: 648, left: 63, width: 266, height: 56,
        fontWeight: 700,
        background: checked ? 'rgb(206,111,111)' : 'rgba(139,201,165,0.5)',
        color: checked ? '#fff' : '#0c2018',
      }} disabled={!checked}>
        Tjek ud
      </button>

      <BottomNav active="home" onNav={onNav} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE
function ProfileScreen({ onNav, kids, onAddKid, onLogout, lastCheck, favorites }) {
  return (
    <div className="pm-screen bg-cream pm-route">
      <StatusBar />
      <div style={{ position:'absolute', top: 60, left: 0, right: 0, textAlign:'center',
        font:'800 26px/1 "Playfair Display", serif', color:'#1f2a18' }}>
        Min profil
      </div>

      {/* avatar */}
      <div style={{
        position:'absolute', top: 100, left:'50%', transform:'translateX(-50%)',
        width: 80, height: 80, borderRadius:'50%', background:'linear-gradient(135deg,#93a7e5,#8bc9a5)',
        display:'flex', alignItems:'center', justifyContent:'center',
        font:'700 28px/1 Inter, sans-serif', color:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,.2)',
      }}>E</div>
      <div style={{ position:'absolute', top: 188, left:0, right:0, textAlign:'center',
        font:'700 20px/1 Inter, sans-serif', color:'#0f1a2e' }}>Emil</div>
      <div style={{ position:'absolute', top: 215, left:0, right:0, textAlign:'center',
        font:'400 13px/1 Inika, serif', color:'#0f1a2e', opacity:.7 }}>emil@example.dk</div>

      {/* info card */}
      <div className="pm-card" style={{ position:'absolute', top: 250, left: 20, width: 363, padding: '16px 20px' }}>
        <div style={{ font:'400 15px/1.6 Inika, serif', color:'#0f1a2e' }}>
          Sidste indtjekning: <b>{lastCheck || 'Ingen endnu'}</b>
        </div>
        <div style={{ font:'400 15px/1.6 Inika, serif', color:'#0f1a2e' }}>
          Status: {Object.values({}).length ? <b>Checket ind</b> : <b>Ikke checket ind</b>}
        </div>
        <div style={{ font:'400 15px/1.6 Inika, serif', color:'#0f1a2e' }}>
          Favoritter: <b>{favorites.length}</b>
        </div>

        <div style={{ font:'700 15px/1 Inter, sans-serif', color:'#0f1a2e', marginTop: 14, marginBottom: 8 }}>
          Børn:
        </div>
        <div style={{ display:'flex', gap: 10, flexWrap:'wrap', alignItems:'center' }}>
          {kids.map(k => (
            <div key={k.id} className="pm-kid-card" style={{ width: 110, height: 60, fontSize: 17 }}>
              {k.name}
            </div>
          ))}
          <button onClick={onAddKid} style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'var(--green)', border:0, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: 'var(--shadow-card)',
          }} aria-label="Tilføj barn">
            <Icon.Plus size={26} />
          </button>
        </div>
      </div>

      {/* settings + logout */}
      <button style={{
        position:'absolute', top: 530, left: 20, width: 363, height: 54,
        background:'rgba(147,167,229,.55)', border:0, borderRadius: 14,
        font:'600 16px/1 Inter, sans-serif', color:'#0f1a2e',
        display:'flex', alignItems:'center', gap: 12, padding:'0 20px',
        boxShadow:'var(--shadow-soft)', cursor:'pointer',
      }}>
        <Icon.Gear /> Indstillinger
      </button>
      <button onClick={onLogout} style={{
        position:'absolute', top: 596, left: 20, width: 363, height: 54,
        background:'rgba(206,111,111,.85)', border:0, borderRadius: 14,
        font:'600 16px/1 Inter, sans-serif', color:'#fff',
        display:'flex', alignItems:'center', gap: 12, padding:'0 20px',
        boxShadow:'var(--shadow-soft)', cursor:'pointer',
      }}>
        <Icon.Logout color="#fff" /> Log ud
      </button>

      <BottomNav active="profile" onNav={onNav} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MENU OVERLAY (Overlay)
function MenuScreen({ onNav, onClose }) {
  const items = [
    { icon: Icon.Star,   label: 'Se Favoritter' },
    { icon: Icon.Help,   label: 'FAQ' },
    { icon: Icon.Search, label: 'Søg område' },
    { icon: Icon.Gear,   label: 'Indstillinger' },
    { icon: Icon.AdFree, label: 'Reklamefri' },
    { icon: Icon.Slide,  label: 'Søg efter faciliteter' },
  ];
  return (
    <div className="pm-screen bg-cream pm-route">
      <StatusBar />
      <div style={{ position:'absolute', top: 60, left: 0, right: 0, textAlign:'center',
        font:'800 26px/1 "Playfair Display", serif', color:'#1f2a18' }}>
        Menu
      </div>
      <div style={{ position:'absolute', top: 130, left: 23, display:'flex', flexDirection:'column', gap: 14 }}>
        {items.map((it, i) => (
          <MenuRow key={i} icon={it.icon} label={it.label} onClick={() => alert(it.label)} />
        ))}
      </div>
      <BottomNav active="menu" onNav={onNav} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHECK-IN OVERLAY (sheet over details/home)
function CheckInSheet({ kids, onPick, onClose, onAddKid }) {
  return (
    <div style={{
      position:'absolute', inset: 0, zIndex: 100,
      borderRadius: 'inherit', overflow:'hidden',
    }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', animation:'pm-fade-bg .2s ease both' }} />
      <div style={{
        position:'absolute', left: 0, right: 0, bottom: 0,
        background:'linear-gradient(rgb(254,254,254) 0%, rgb(229,209,147) 100%)',
        borderRadius: '32px 32px 0 0',
        padding: '24px 24px 60px',
        animation: 'pm-sheet-in .28s cubic-bezier(.2,.8,.2,1) both',
        boxShadow: '0 -10px 30px rgba(0,0,0,.3)',
      }}>
        <div style={{ width: 44, height: 4, borderRadius:2, background:'rgba(0,0,0,.2)',
          margin: '0 auto 18px' }} />
        <div style={{ font:'700 22px/1 Inter, sans-serif', color:'#0f1a2e', textAlign:'center', marginBottom: 6 }}>
          Check Ind
        </div>
        <div style={{ font:'400 13px/1.4 Inika, serif', color:'#0f1a2e', opacity:.7, textAlign:'center', marginBottom: 22 }}>
          Hvem checker ind?
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 12, justifyContent:'center' }}>
          {kids.map(k => (
            <button key={k.id} className="pm-kid-card" style={{ width: 130, height: 70, border: 0 }}
              onClick={() => onPick(k)}>
              {k.name}
            </button>
          ))}
          <button onClick={onAddKid} style={{
            width: 56, height: 56, borderRadius: 20,
            background: 'var(--green)', border:0, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: 'var(--shadow-card)',
            alignSelf:'center',
          }} aria-label="Tilføj barn">
            <Icon.Plus size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}

// CHECK-OUT sheet
function CheckOutSheet({ checkedKids, onPick, onClose }) {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:100, borderRadius:'inherit', overflow:'hidden' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', animation:'pm-fade-bg .2s ease both' }} />
      <div style={{
        position:'absolute', left: 0, right: 0, bottom: 0,
        background:'linear-gradient(rgb(254,254,254) 0%, rgb(229,209,147) 100%)',
        borderRadius: '32px 32px 0 0',
        padding: '24px 24px 60px',
        animation: 'pm-sheet-in .28s cubic-bezier(.2,.8,.2,1) both',
        boxShadow: '0 -10px 30px rgba(0,0,0,.3)',
      }}>
        <div style={{ width: 44, height: 4, borderRadius:2, background:'rgba(0,0,0,.2)',
          margin: '0 auto 18px' }} />
        <div style={{ font:'800 36px/1 "Playfair Display", serif', color:'#2b2b2b', textAlign:'center', marginBottom: 6 }}>
          Check Ud
        </div>
        <div style={{ font:'400 13px/1.4 Inika, serif', color:'#0f1a2e', opacity:.7, textAlign:'center', marginBottom: 22 }}>
          Vælg barn at checke ud
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 12, alignItems:'center' }}>
          {checkedKids.length === 0 && (
            <div style={{ font:'400 14px Inika, serif', color:'#0f1a2e', opacity:.7 }}>Ingen er checket ind.</div>
          )}
          {checkedKids.map(k => (
            <button key={k.id} className="pm-kid-card" style={{ width: 200, height: 60, fontSize: 18 }}
              onClick={() => onPick(k)}>
              {k.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ADD CHILD modal
function AddChildModal({ onSave, onClose }) {
  const [name, setName] = useS('');
  const [bday, setBday] = useS('');
  const [gender, setGender] = useS('');
  return (
    <div style={{ position:'absolute', inset:0, zIndex:120, borderRadius:'inherit', overflow:'hidden' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', animation:'pm-fade-bg .2s ease both' }} />
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width: 320,
        background:'#fff', borderRadius: 24,
        padding: '20px 22px',
        boxShadow: '0 12px 40px rgba(0,0,0,.4)',
        animation: 'pm-modal-in .25s cubic-bezier(.2,.8,.2,1) both',
      }}>
        <div style={{ font:'700 20px/1 Inter, sans-serif', color:'#0f1a2e', textAlign:'center', marginBottom: 16 }}>
          Tilføj barn
        </div>
        <Field label="Navn:" value={name} onChange={setName} />
        <Field label="Fødselsdag:" value={bday} onChange={setBday} placeholder="DD/MM/ÅÅÅÅ" />
        <FieldSelect label="Køn:" value={gender} onChange={setGender} options={['Dreng','Pige','Andet']} />
        <div style={{ display:'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{
            flex:1, height: 46, borderRadius: 14, border: 0,
            background:'rgba(0,0,0,.08)', font:'600 15px Inter, sans-serif', cursor:'pointer',
          }}>Annuller</button>
          <button disabled={!name} onClick={() => onSave({ id: Date.now(), name, bday, gender })} style={{
            flex:1, height: 46, borderRadius: 14, border: 0,
            background: name ? 'var(--green)' : 'rgba(139,201,165,.5)',
            font:'700 15px Inter, sans-serif', color:'#0c2018',
            cursor: name ? 'pointer' : 'not-allowed',
          }}>Gem</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display:'block', marginBottom: 12 }}>
      <div style={{ font:'600 13px Inter, sans-serif', color:'#0f1a2e', marginBottom: 6 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', height: 42, borderRadius: 10,
          border:'1px solid rgba(0,0,0,.12)', padding:'0 12px',
          font:'400 15px Inika, serif', outline:'none' }} />
    </label>
  );
}
function FieldSelect({ label, value, onChange, options }) {
  return (
    <label style={{ display:'block', marginBottom: 8 }}>
      <div style={{ font:'600 13px Inter, sans-serif', color:'#0f1a2e', marginBottom: 6 }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width:'100%', height: 42, borderRadius: 10,
          border:'1px solid rgba(0,0,0,.12)', padding:'0 12px',
          font:'400 15px Inika, serif', outline:'none', background:'#fff' }}>
        <option value="">Vælg…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

window.LoginScreen = LoginScreen;
window.HomeScreen = HomeScreen;
window.DetailsScreen = DetailsScreen;
window.ProfileScreen = ProfileScreen;
window.MenuScreen = MenuScreen;
window.CheckInSheet = CheckInSheet;
window.CheckOutSheet = CheckOutSheet;
window.AddChildModal = AddChildModal;
