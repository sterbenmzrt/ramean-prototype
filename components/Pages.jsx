// Ramean.id — Catalog & Auth pages
'use strict';

const { C, SERVICES, fmt, SvcIcon, Tag, Btn } = window;

// ╔══════════════════════════════════════════════════════════╗
// ║  CATALOG PAGE                                            ║
// ╚══════════════════════════════════════════════════════════╝
const CatalogPage = ({ nav }) => {
  const [cat, setCat] = React.useState('Semua');
  const cats = ['Semua','Streaming','Produktivitas','AI Tools'];
  const filtered = cat === 'Semua' ? SERVICES : SERVICES.filter(s => s.cat === cat);

  return (
    <div style={{backgroundColor:C.bg,minHeight:'100vh'}}>

      {/* Hero Header */}
      <div style={{backgroundColor:C.white,borderBottom:'1px solid '+C.border,padding:'72px 40px 64px',textAlign:'center'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h1 style={{fontFamily:C.fontHeading,fontWeight:700,fontSize:48,
            color:C.text,marginBottom:16,letterSpacing:'-1px',lineHeight:1.1}}>
            Jelajahi Katalog Kami
          </h1>
          <p style={{color:C.textMd,fontSize:17,lineHeight:1.65,fontFamily:C.fontBody,maxWidth:520,margin:'0 auto'}}>
            Temukan layanan yang tepat untukmu. Streaming, produktivitas, AI tools, dan lainnya — dengan harga hingga 93% lebih hemat.
          </p>
        </div>
      </div>

      {/* Filter + Grid */}
      <div style={{maxWidth:1240,margin:'0 auto',padding:'48px 40px'}}>

        {/* Filter Bar */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:36}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.textSm,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:C.fontBody,marginBottom:8}}>Layanan</div>
            <h2 style={{fontFamily:C.fontHeading,fontWeight:700,fontSize:28,color:C.text,margin:0}}>Katalog</h2>
            <p style={{color:C.textMd,fontSize:13,fontFamily:C.fontBody,marginTop:4}}>Filter berdasarkan kategori untuk menemukan yang kamu butuhkan</p>
          </div>
          <div style={{display:'flex',gap:8}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:'8px 18px',borderRadius:6,cursor:'pointer',
                fontFamily:C.fontBody,fontSize:13,fontWeight:500,
                backgroundColor:cat===c?C.primary:'transparent',
                color:cat===c?'white':C.textMd,
                border:'1px solid '+(cat===c?C.primary:C.border),
                transition:'all 0.15s',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Catalog Marketplace Card */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
          {filtered.map(svc=>{
            const CatalogCard = () => {
              const [hov, setHov] = React.useState(false);
              return (
                <div
                  onClick={()=>nav('detail',svc.id)}
                  onMouseEnter={()=>setHov(true)}
                  onMouseLeave={()=>setHov(false)}
                  style={{
                    backgroundColor:C.white,
                    border:'1px solid '+(hov?'#CBD5E0':C.border),
                    borderRadius:16,padding:'20px 16px 14px',
                    cursor:'pointer',
                    transition:'all 0.18s',
                    boxShadow:hov?'0 8px 24px rgba(0,0,0,0.09)':'0 1px 4px rgba(0,0,0,0.04)',
                    transform:hov?'translateY(-3px)':'translateY(0)',
                    display:'flex',flexDirection:'column',alignItems:'center',
                    textAlign:'center',gap:10,position:'relative',
                  }}>

                  {/* Badge */}
                  {!svc.avail&&(
                    <div style={{position:'absolute',top:10,right:10,
                      backgroundColor:'#FEF3C7',color:'#B45309',
                      fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20,fontFamily:C.fontBody}}>Antri</div>
                  )}
                  {svc.avail&&svc.hot&&(
                    <div style={{position:'absolute',top:10,right:10,
                      backgroundColor:'#FEF9C3',color:'#92400E',
                      fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20,fontFamily:C.fontBody}}>Terlaris</div>
                  )}
                  {svc.avail&&!svc.hot&&(
                    <div style={{position:'absolute',top:10,left:10,
                      backgroundColor:'#ECFDF5',color:'#059669',
                      fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20,fontFamily:C.fontBody}}>Hemat {svc.disc}%</div>
                  )}

                  <SvcIcon svc={svc} size={72} />

                  <div style={{fontFamily:C.fontHeading,fontWeight:700,fontSize:14,color:C.text,lineHeight:1.3}}>
                    {svc.name}
                  </div>

                  <div style={{fontFamily:C.fontHeading,fontWeight:800,fontSize:17,color:'#D97706'}}>
                    {fmt(svc.price)}
                    <span style={{fontSize:11,fontWeight:500,color:C.textMd}}> /30h</span>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={e=>{e.stopPropagation();nav('detail',svc.id);}}
                    style={{
                      width:'100%',padding:'9px 14px',borderRadius:8,
                      border:'none',
                      backgroundColor:svc.avail?C.primary:'#94A3B8',
                      color:'white',
                      fontFamily:C.fontBody,fontWeight:600,fontSize:13,
                      cursor:'pointer',transition:'all 0.15s',marginTop:2,
                    }}>
                    {svc.avail?'Pesan':'Daftar Antri'}
                  </button>
                </div>
              );
            };
            return <CatalogCard key={svc.id} />;
          })}
        </div>
      </div>

      {/* Why Ramean Banner */}
      <div style={{maxWidth:1240,margin:'0 auto',padding:'0 40px 80px'}}>
        <div style={{borderTop:'1px solid '+C.border,paddingTop:72,textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:11,fontWeight:600,color:C.textSm,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:C.fontBody,marginBottom:12}}>Kenapa</div>
          <h2 style={{fontFamily:C.fontHeading,fontWeight:700,fontSize:40,color:C.text,marginBottom:12,letterSpacing:'-0.5px'}}>Semua dalam satu tempat</h2>
          <p style={{color:C.textMd,fontSize:16,fontFamily:C.fontBody}}>Akses semua langgananmu dari satu dashboard yang bersih</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
          {[
            {tag:'Simple',   title:'Tidak ada setup rumit atau biaya tersembunyi',  desc:'Langsung gunakan layananmu setelah pembelian. Tidak perlu konfigurasi apapun.', link:'Pelajari'},
            {tag:'Secure',   title:'Pembayaran dan data kamu selalu terlindungi',    desc:'Kami menggunakan enkripsi standar industri untuk setiap transaksi.',            link:'Percayai kami'},
          ].map((item,i)=>(
            <div key={i} style={{border:'1px solid '+C.border,display:'grid',gridTemplateColumns:'1fr 1fr'}}>
              <div style={{padding:'40px 36px'}}>
                <div style={{fontSize:11,fontWeight:600,color:C.textSm,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:C.fontBody,marginBottom:16}}>{item.tag}</div>
                <h3 style={{fontFamily:C.fontHeading,fontWeight:700,fontSize:22,color:C.text,marginBottom:12,lineHeight:1.3}}>{item.title}</h3>
                <p style={{color:C.textMd,fontSize:14,fontFamily:C.fontBody,lineHeight:1.65,marginBottom:20}}>{item.desc}</p>
                <a href="#" style={{fontSize:13,color:C.text,fontFamily:C.fontBody,fontWeight:500,textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
                  {item.link} <span>›</span>
                </a>
              </div>
              <div style={{backgroundColor:'#E8EDF5',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B0BCD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ╔══════════════════════════════════════════════════════════╗
// ║  AUTH PAGE                                               ║
// ╚══════════════════════════════════════════════════════════╝
const AuthPage = ({ nav, onLogin }) => {
  const { RameanLogo } = window;
  const [mode, setMode] = React.useState('login');
  const [form, setForm] = React.useState({ name:'', phone:'', email:'', password:'', confirm:'' });
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pwMatch = form.confirm === '' || form.password === form.confirm;

  const inputBase = {
    width:'100%', padding:'11px 14px', borderRadius:8,
    border:'1px solid '+C.border, fontSize:14, outline:'none',
    fontFamily:C.fontBody, boxSizing:'border-box', color:C.text,
    backgroundColor:C.white, transition:'border-color 0.15s',
  };
  const labelStyle = {
    display:'block', fontWeight:500, fontSize:13, color:C.text,
    marginBottom:6, fontFamily:C.fontBody,
  };

  const Field = ({ label, children, hint, error }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: C.textSm, marginTop: 5, fontFamily: C.fontBody }}>{hint}</div>}
      {error && <div style={{ fontSize: 11, color: '#DC2626', marginTop: 5, fontFamily: C.fontBody }}>{error}</div>}
    </div>
  );

  return (
    <div style={{backgroundColor:C.bg, minHeight:'100vh', display:'flex',
      flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px'}}>

      <div style={{marginBottom:28, cursor:'pointer'}} onClick={()=>nav('landing')}>
        <RameanLogo size={36} />
      </div>

      <div style={{width:'100%', maxWidth: mode==='register' ? 480 : 440,
        backgroundColor:C.white, border:'1px solid '+C.border, borderRadius:14, padding:'36px 40px'}}>

        <h2 style={{fontFamily:C.fontHeading, fontWeight:700, fontSize:26,
          color:C.text, marginBottom:6, textAlign:'center'}}>
          {mode==='login' ? 'Selamat datang kembali' : 'Buat Akun Ramean'}
        </h2>
        <p style={{color:C.textMd, fontSize:14, marginBottom:28, lineHeight:1.6,
          textAlign:'center', fontFamily:C.fontBody}}>
          {mode==='login'
            ? 'Masukkan kredensialmu untuk melanjutkan.'
            : 'Daftar gratis dan mulai hemat bersama Ramean.'}
        </p>

        {/* ─── REGISTER FORM ─── */}
        {mode === 'register' && (<>
          {/* Vertical: Nama + No WA */}
          <Field label="Nama Lengkap">
            <input value={form.name} onChange={e=>up('name',e.target.value)}
              placeholder="Nama Lengkap" style={inputBase} />
          </Field>
          <Field label="Nomor WhatsApp" hint="Kami kirim detail akun via WhatsApp">
            <div style={{ display:'flex', alignItems:'center', border:'1px solid '+C.border,
              borderRadius:8, overflow:'hidden', backgroundColor:C.white }}>
              <div style={{
                padding:'11px 10px', backgroundColor:'#F8FAFC', borderRight:'1px solid '+C.border,
                fontSize:13, color:C.text, fontFamily:C.fontBody, whiteSpace:'nowrap',
                display:'flex', alignItems:'center', gap:5,
              }}>
                <span>🇮🇩</span>
                <span style={{fontWeight:600}}>+62</span>
              </div>
              <input
                value={form.phone}
                onChange={e=>up('phone',e.target.value.replace(/\D/g,''))}
                placeholder="8xxxxxxxxxx" type="tel"
                style={{ ...inputBase, border:'none', borderRadius:0, flex:1, padding:'11px 10px' }} />
            </div>
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={e=>up('email',e.target.value)}
              placeholder="email@kamu.com" type="email" style={inputBase} />
          </Field>

          {/* Vertical: Password + Confirm */}
          <Field label="Password">
            <div style={{ position:'relative' }}>
              <input value={form.password} onChange={e=>up('password',e.target.value)}
                placeholder="Min. 8 karakter" type={showPw?'text':'password'}
                style={{ ...inputBase, paddingRight:40 }} />
              <button onClick={()=>setShowPw(!showPw)} style={{
                position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:C.textMd, fontSize:14,
              }}>{showPw ? '🙈' : '👁'}</button>
            </div>
          </Field>
          <Field
            label="Konfirmasi Password"
            error={!pwMatch ? 'Password tidak cocok' : ''}
          >
            <div style={{ position:'relative' }}>
              <input value={form.confirm} onChange={e=>up('confirm',e.target.value)}
                placeholder="Ulangi password" type={showConfirm?'text':'password'}
                style={{
                  ...inputBase, paddingRight:40,
                  borderColor: !pwMatch ? '#FCA5A5' : form.confirm && pwMatch ? '#86EFAC' : C.border,
                }} />
              <button onClick={()=>setShowConfirm(!showConfirm)} style={{
                position:'absolute', right:10, top: !pwMatch ? '40%' : '50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:C.textMd, fontSize:14,
              }}>{showConfirm ? '🙈' : '👁'}</button>
            </div>
          </Field>

          {/* Terms */}
          <div style={{ fontSize:12, color:C.textMd, fontFamily:C.fontBody,
            marginBottom:20, lineHeight:1.7, textAlign:'center' }}>
            Dengan mendaftar, kamu menyetujui{' '}
            <a href="#" style={{ color:C.primary, textDecoration:'none', fontWeight:500 }}>Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" style={{ color:C.primary, textDecoration:'none', fontWeight:500 }}>Kebijakan Privasi</a>
            {' '}Ramean.
          </div>
        </>)}

        {/* ─── LOGIN FORM ─── */}
        {mode === 'login' && (<>
          <Field label="Email">
            <input value={form.email} onChange={e=>up('email',e.target.value)}
              placeholder="email@kamu.com" type="email" style={inputBase} />
          </Field>
          <Field label="Password">
            <div style={{ position:'relative' }}>
              <input value={form.password} onChange={e=>up('password',e.target.value)}
                placeholder="••••••••" type={showPw?'text':'password'}
                style={{ ...inputBase, paddingRight:40 }} />
              <button onClick={()=>setShowPw(!showPw)} style={{
                position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:C.textMd, fontSize:14,
              }}>{showPw ? '🙈' : '👁'}</button>
            </div>
          </Field>
          <div style={{ textAlign:'right', marginBottom:20 }}>
            <a href="#" style={{ fontSize:12, color:C.textMd, textDecoration:'none', fontFamily:C.fontBody }}>
              Lupa password?
            </a>
          </div>
        </>)}

        <Btn variant="primary" full size="lg" onClick={()=>onLogin()}>
          {mode==='login' ? 'Masuk' : 'Daftar Sekarang'}
        </Btn>

        <div style={{marginTop:16, textAlign:'center'}}>
          <button onClick={()=>setMode(mode==='login'?'register':'login')}
            style={{background:'none', border:'none', cursor:'pointer',
              fontWeight:400, fontSize:13, color:C.textMd, fontFamily:C.fontBody}}>
            {mode==='login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <span style={{color:C.primary, fontWeight:600}}>
              {mode==='login' ? 'Daftar gratis' : 'Masuk'}
            </span>
          </button>
        </div>
      </div>

      <div style={{marginTop:24, fontSize:12, color:C.textSm, fontFamily:C.fontBody}}>© 2025 Ramean</div>
    </div>
  );
};

// ╔══════════════════════════════════════════════════════════╗
// ║  DASHBOARD PAGE                                          ║
// ╚══════════════════════════════════════════════════════════╝
const DashboardPage = ({ nav }) => {
  const [activeTab, setActiveTab] = React.useState('profil');
  const tabs = [
    { id: 'profil',  label: 'Detail Profil' },
    { id: 'pesanan', label: 'Pesanan' },
    { id: 'history', label: 'History' },
  ];

  // Mock user
  const user = {
    name: 'Ahmad Rivaldhi', email: 'ahmad@email.com',
    phone: '+62 812 3456 7890', joined: 'Januari 2025',
    avatar: 'AR',
  };

  // Mock orders
  const orders = [
    { id: 'RMN-20250101', svc: 'Netflix Premium', pkg: '3 Bulan', price: 45000, status: 'active', expiry: '01 Apr 2025', group: 'Grup 768' },
    { id: 'RMN-20250201', svc: 'ChatGPT Plus', pkg: '1 Bulan', price: 35000, status: 'active', expiry: '01 Mar 2025', group: 'Grup 440' },
  ];

  // Mock history
  const history = [
    { id: 'RMN-20240901', svc: 'Canva Pro', pkg: '1 Bulan', price: 18000, status: 'expired', date: '01 Okt 2024', group: 'Grup 312' },
    { id: 'RMN-20240801', svc: 'YouTube Premium', pkg: '3 Bulan', price: 24000, status: 'expired', date: '01 Nov 2024', group: 'Grup 201' },
    { id: 'RMN-20240601', svc: 'Gemini Advanced', pkg: '1 Bulan', price: 45000, status: 'refunded', date: '01 Jul 2024', group: 'Grup 089' },
  ];

  const statusBadge = (status) => {
    const map = {
      active:   { label: 'Aktif',    bg: '#ECFDF5', color: '#059669' },
      expired:  { label: 'Berakhir', bg: '#F1F5F9', color: '#64748B' },
      refunded: { label: 'Direfund', bg: '#FEF9C3', color: '#B45309' },
    };
    const s = map[status] || map.expired;
    return (
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
        backgroundColor: s.bg, color: s.color, fontFamily: C.fontBody,
      }}>{s.label}</span>
    );
  };

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* Hero header */}
      <div style={{ backgroundColor: C.white, borderBottom: '1px solid ' + C.border, padding: '40px 40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* User info row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', backgroundColor: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: C.fontHeading, fontWeight: 700, fontSize: 22, color: 'white', flexShrink: 0,
            }}>{user.avatar}</div>
            <div>
              <h1 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 22, color: C.text, margin: 0 }}>
                {user.name}
              </h1>
              <div style={{ fontSize: 13, color: C.textMd, fontFamily: C.fontBody, marginTop: 3 }}>
                {user.email} · Bergabung {user.joined}
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '12px 24px', background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid ' + C.primary : '2px solid transparent',
                fontFamily: C.fontBody, fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? C.primary : C.textMd,
                cursor: 'pointer', transition: 'all 0.15s', marginBottom: -1,
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 40px' }}>

        {/* ─── DETAIL PROFIL ─── */}
        {activeTab === 'profil' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
            {/* Edit profile form */}
            <div style={{ backgroundColor: C.white, border: '1px solid ' + C.border, borderRadius: 12, padding: 28 }}>
              <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 24 }}>
                Informasi Akun
              </h2>
              {[
                { label: 'Nama Lengkap',      value: user.name,   key: 'name',  type: 'text' },
                { label: 'Email',             value: user.email,  key: 'email', type: 'email' },
                { label: 'Nomor WhatsApp',    value: user.phone,  key: 'phone', type: 'tel' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 18 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:500, color:C.text,
                    marginBottom:6, fontFamily:C.fontBody }}>{f.label}</label>
                  <input defaultValue={f.value} type={f.type} style={{
                    width:'100%', padding:'10px 14px', borderRadius:8,
                    border:'1px solid '+C.border, fontSize:14, outline:'none',
                    fontFamily:C.fontBody, boxSizing:'border-box', color:C.text, backgroundColor:C.white,
                  }} />
                </div>
              ))}
              <div style={{ borderTop: '1px solid ' + C.borderLt, paddingTop: 20, marginTop: 4 }}>
                <h3 style={{ fontFamily:C.fontHeading, fontWeight:600, fontSize:14, color:C.text, marginBottom:16 }}>
                  Ganti Password
                </h3>
                {['Password Lama','Password Baru','Konfirmasi Password Baru'].map(lbl => (
                  <div key={lbl} style={{ marginBottom: 14 }}>
                    <label style={{ display:'block', fontSize:13, fontWeight:500, color:C.text,
                      marginBottom:6, fontFamily:C.fontBody }}>{lbl}</label>
                    <input type="password" placeholder="••••••••" style={{
                      width:'100%', padding:'10px 14px', borderRadius:8,
                      border:'1px solid '+C.border, fontSize:14, outline:'none',
                      fontFamily:C.fontBody, boxSizing:'border-box', color:C.text, backgroundColor:C.white,
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <Btn variant="primary" size="md">Simpan Perubahan</Btn>
              </div>
            </div>

            {/* Stats sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ backgroundColor: C.white, border: '1px solid ' + C.border, borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textSm, letterSpacing:'0.07em',
                  textTransform:'uppercase', fontFamily:C.fontBody, marginBottom: 14 }}>Ringkasan</div>
                {[
                  { label: 'Layanan Aktif',   value: orders.length,             color: C.primary },
                  { label: 'Total Pesanan',   value: orders.length + history.length, color: C.text },
                  { label: 'Total Hemat',     value: 'Rp 142.000',               color: C.ok },
                ].map((item, i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'10px 0', borderTop: i > 0 ? '1px solid '+C.borderLt : 'none',
                  }}>
                    <span style={{ fontSize:13, color:C.textMd, fontFamily:C.fontBody }}>{item.label}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:item.color, fontFamily:C.fontHeading }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ backgroundColor: '#ECFDF5', borderRadius: 12, padding: '16px 20px',
                border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#059669', fontFamily:C.fontBody, marginBottom:6 }}>
                  ✓ Akun Terverifikasi
                </div>
                <div style={{ fontSize:12, color:'#065F46', fontFamily:C.fontBody, lineHeight:1.6 }}>
                  Profil dan nomor WhatsApp kamu telah terverifikasi oleh Ramean.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PESANAN ─── */}
        {activeTab === 'pesanan' && (
          <div>
            <h2 style={{ fontFamily:C.fontHeading, fontWeight:700, fontSize:17, color:C.text, marginBottom:20 }}>
              Pesanan Aktif
            </h2>
            {orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', color:C.textMd, fontFamily:C.fontBody }}>
                Belum ada pesanan aktif.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {orders.map(o => (
                  <div key={o.id} style={{
                    backgroundColor:C.white, border:'1px solid '+C.border, borderRadius:12,
                    padding:'20px 24px', display:'flex', alignItems:'center', gap:20,
                  }}>
                    <div style={{
                      width:44, height:44, borderRadius:10, backgroundColor:'#EEF2FF',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:C.fontHeading, fontWeight:700, fontSize:17, color:C.primary, flexShrink:0,
                    }}>{o.svc[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:C.fontHeading, fontWeight:700, fontSize:15, color:C.text, marginBottom:4 }}>
                        {o.svc}
                      </div>
                      <div style={{ fontSize:12, color:C.textMd, fontFamily:C.fontBody }}>
                        {o.pkg} · {o.group} · Berlaku sampai {o.expiry}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      {statusBadge(o.status)}
                      <div style={{ fontSize:14, fontWeight:700, color:C.primary, fontFamily:C.fontHeading, marginTop:6 }}>
                        {fmt(o.price)}
                      </div>
                      <div style={{ fontSize:11, color:C.textSm, fontFamily:C.fontBody }}>ID: {o.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── HISTORY ─── */}
        {activeTab === 'history' && (
          <div>
            <h2 style={{ fontFamily:C.fontHeading, fontWeight:700, fontSize:17, color:C.text, marginBottom:20 }}>
              Riwayat Transaksi
            </h2>
            {history.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', color:C.textMd, fontFamily:C.fontBody }}>
                Belum ada riwayat transaksi.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {history.map(h => (
                  <div key={h.id} style={{
                    backgroundColor:C.white, border:'1px solid '+C.border, borderRadius:12,
                    padding:'16px 24px', display:'flex', alignItems:'center', gap:16,
                  }}>
                    <div style={{
                      width:38, height:38, borderRadius:8, backgroundColor:C.bg,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:C.fontHeading, fontWeight:700, fontSize:15, color:C.textMd, flexShrink:0,
                    }}>{h.svc[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:C.fontBody, fontWeight:600, fontSize:14, color:C.text }}>{h.svc}</div>
                      <div style={{ fontSize:11, color:C.textMd, fontFamily:C.fontBody, marginTop:2 }}>
                        {h.pkg} · {h.group} · {h.date}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      {statusBadge(h.status)}
                      <div style={{ fontSize:13, fontWeight:600, color:C.textMd, fontFamily:C.fontBody, marginTop:4 }}>
                        {fmt(h.price)}
                      </div>
                      <div style={{ fontSize:10, color:C.textSm, fontFamily:C.fontBody }}>ID: {h.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

Object.assign(window, { CatalogPage, AuthPage, DashboardPage });

