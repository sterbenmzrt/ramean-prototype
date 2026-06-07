// Ramean.id — Shared tokens, data, and UI primitives
'use strict';

const C = {
  primary:  '#03346E',
  yellow:   '#FBDA7B',
  astral:   '#3674B5',
  bg:       '#F8F9FB', white:  '#FFFFFF',
  text:     '#0F172A', textMd: '#475569', textSm: '#94A3B8',
  border:   '#E2E8F0', borderLt: '#F1F5F9',
  ok:       '#059669', okBg:   '#ECFDF5',
  err:      '#DC2626', errBg:  '#FEF2F2',
  warn:     '#B45309', warnBg: '#FEF3C7',
  fontHeading: "'Urbanist', sans-serif",
  fontBody:    "'Inter', sans-serif",
};

const SERVICES = [
  { id:'netflix',  name:'Netflix',           cat:'Streaming',    tagline:'Film & Series Tanpa Batas',
    desc:'Nikmati ribuan film, series, dan dokumenter premium dari seluruh dunia kapan saja.',
    color:'#E50914', price:15000, orig:54000,  disc:72, slots:6, left:3, avail:true,  hot:false,
    feats:['Resolusi 4K Ultra HD','Download offline','1 perangkat aktif','Bebas iklan'],
    durs:[{m:1,lbl:'1 Bulan',p:15000,save:''},{m:3,lbl:'3 Bulan',p:42000,save:'Hemat 6%'},{m:6,lbl:'6 Bulan',p:78000,save:'Hemat 13%'},{m:12,lbl:'1 Tahun',p:150000,save:'Hemat 17%'}]},
  { id:'youtube',  name:'YouTube Premium',   cat:'Streaming',    tagline:'Bebas Iklan & Download Video',
    desc:'Tonton YouTube tanpa gangguan iklan, simpan video offline, dan nikmati YouTube Music.',
    color:'#FF0000', price:8000,  orig:39000,  disc:79, slots:6, left:5, avail:true,  hot:true,
    feats:['Bebas iklan','Background play','Download video','YouTube Music Premium'],
    durs:[{m:1,lbl:'1 Bulan',p:8000,save:''},{m:3,lbl:'3 Bulan',p:22000,save:'Hemat 8%'},{m:6,lbl:'6 Bulan',p:42000,save:'Hemat 12%'},{m:12,lbl:'1 Tahun',p:80000,save:'Hemat 17%'}]},
  { id:'canva',    name:'Canva Pro',          cat:'Produktivitas', tagline:'Desain Profesional Tanpa Batas',
    desc:'Akses 100M+ elemen premium, template eksklusif, brand kit, dan fitur AI terdepan.',
    color:'#00C4CC', price:12000, orig:85000,  disc:86, slots:5, left:2, avail:true,  hot:false,
    feats:['100M+ aset premium','Background remover','Brand kit','Template eksklusif'],
    durs:[{m:1,lbl:'1 Bulan',p:12000,save:''},{m:3,lbl:'3 Bulan',p:34000,save:'Hemat 6%'},{m:6,lbl:'6 Bulan',p:64000,save:'Hemat 11%'},{m:12,lbl:'1 Tahun',p:120000,save:'Hemat 17%'}]},
  { id:'gemini',   name:'Gemini Advanced',    cat:'AI Tools',     tagline:'AI Terdepan dari Google',
    desc:'Gunakan Gemini Ultra, AI paling canggih dari Google, disertai 1TB Google Drive.',
    color:'#1A73E8', price:18000, orig:169000, disc:89, slots:5, left:4, avail:true,  hot:false,
    feats:['Gemini Ultra 1.0','1TB Google Drive','Google One Premium','Akses prioritas'],
    durs:[{m:1,lbl:'1 Bulan',p:18000,save:''},{m:3,lbl:'3 Bulan',p:51000,save:'Hemat 6%'},{m:6,lbl:'6 Bulan',p:96000,save:'Hemat 11%'},{m:12,lbl:'1 Tahun',p:180000,save:'Hemat 17%'}]},
  { id:'chatgpt',  name:'ChatGPT Plus',       cat:'AI Tools',     tagline:'GPT-4o untuk Produktivitas Max',
    desc:'Akses GPT-4o, DALL-E 3, browsing web real-time, dan semua fitur eksklusif ChatGPT Plus.',
    color:'#10A37F', price:20000, orig:284000, disc:93, slots:4, left:0, avail:false, hot:true,
    feats:['Akses GPT-4o','DALL-E 3 image gen','Browsing web real-time','Code interpreter'],
    durs:[{m:1,lbl:'1 Bulan',p:20000,save:''},{m:3,lbl:'3 Bulan',p:57000,save:'Hemat 5%'},{m:6,lbl:'6 Bulan',p:108000,save:'Hemat 10%'},{m:12,lbl:'1 Tahun',p:200000,save:'Hemat 17%'}]},
];

const fmt = (n) => 'Rp' + n.toLocaleString('id-ID');

// ── Logo ──────────────────────────────────────────────────────────────────────
const RameanLogo = ({ size=32, dark=false }) => (
  <div style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer',userSelect:'none'}}>
    <img src="assets/logo.png" width={size} height={size} alt="Ramean.id"
      style={{borderRadius:'50%',flexShrink:0,display:'block'}} />
    <span style={{fontFamily:C.fontHeading,fontWeight:700,
      fontSize:Math.round(size*0.65),color:dark?'#FFFFFF':C.text,letterSpacing:'-0.3px',lineHeight:1}}>
      ramean<span style={{color:dark?C.yellow:C.primary}}>.id</span>
    </span>
  </div>
);

// ── Service Icon ──────────────────────────────────────────────────────────────
const SvcIcon = ({ svc, size=44 }) => {
  const logos = {
    netflix:'assets/netflix-logo.svg', youtube:'assets/youtube-logo.svg',
    canva:'assets/canva-logo.svg',     gemini:'assets/gemini-logo.svg',
    chatgpt:'assets/chatgpt-logo.svg',
  };
  return (
    <div style={{width:size,height:size,borderRadius:Math.round(size*0.2),
      backgroundColor:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',
      flexShrink:0,border:'1px solid #E2E8F0',overflow:'hidden',
      boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
      <img src={logos[svc.id]} alt={svc.name}
        style={{width:'65%',height:'65%',objectFit:'contain',display:'block'}} />
    </div>
  );
};

// ── Tag / Badge ───────────────────────────────────────────────────────────────
const Tag = ({ children, variant='primary' }) => {
  const vs = {
    primary: {bg:'#EEF2FF', color:C.primary},
    yellow:  {bg:'#FEF9C3', color:'#92400E'},
    green:   {bg:C.okBg,    color:C.ok},
    red:     {bg:C.errBg,   color:C.err},
    warn:    {bg:C.warnBg,  color:C.warn},
    navy:    {bg:'#EEF2FF', color:C.primary},
    gold:    {bg:'#FEF9C3', color:'#92400E'},
    muted:   {bg:C.borderLt,color:C.textMd},
  };
  const s = vs[variant]||vs.primary;
  return <span style={{padding:'3px 10px',borderRadius:20,backgroundColor:s.bg,color:s.color,
    fontSize:12,fontWeight:500,fontFamily:C.fontBody,whiteSpace:'nowrap'}}>{children}</span>;
};

// ── Button ────────────────────────────────────────────────────────────────────
const Btn = ({ children, variant='primary', onClick, disabled=false, size='md', full=false, extraStyle={} }) => {
  const base = {fontFamily:C.fontBody,fontWeight:500,cursor:disabled?'not-allowed':'pointer',
    borderRadius:8,opacity:disabled?0.5:1,transition:'all 0.15s',
    display:'inline-flex',alignItems:'center',justifyContent:'center',
    gap:8,width:full?'100%':'auto',whiteSpace:'nowrap',lineHeight:1};
  const sz = {
    sm:  {padding:'8px 16px',   fontSize:13},
    md:  {padding:'11px 22px',  fontSize:14},
    lg:  {padding:'14px 28px',  fontSize:15},
  };
  const vr = {
    primary:       {backgroundColor:C.primary, color:'white',        border:'1px solid '+C.primary},
    yellow:        {backgroundColor:C.yellow,  color:C.text,         border:'1px solid #E9C547'},
    outline:       {backgroundColor:'transparent',color:C.text,      border:'1px solid '+C.border},
    outlinePrimary:{backgroundColor:'transparent',color:C.primary,   border:'1px solid '+C.primary},
    ghost:         {backgroundColor:'transparent',color:C.textMd,    border:'1px solid transparent'},
    outlineWhite:  {backgroundColor:'transparent',color:'white',     border:'1px solid rgba(255,255,255,0.5)'},
    muted:         {backgroundColor:C.borderLt,color:C.textMd,       border:'1px solid '+C.border},
    danger:        {backgroundColor:C.err,     color:'white',         border:'1px solid '+C.err},
    goldDk:        {backgroundColor:'#C8911C', color:'white',         border:'1px solid #C8911C'},
  };
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{...base,...sz[size],...(vr[variant]||vr.primary),...extraStyle}}>
      {children}
    </button>
  );
};

// ── NavBar ────────────────────────────────────────────────────────────────────
const NavBar = ({ page, nav, loggedIn }) => {
  const links = [['catalog','Katalog'],['landing','Beranda']];
  return (
    <nav style={{position:'sticky',top:0,zIndex:200,backgroundColor:'rgba(255,255,255,0.97)',
      backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',borderBottom:'1px solid '+C.border}}>
      <div style={{maxWidth:1240,margin:'0 auto',padding:'0 40px',height:68,
        display:'flex',alignItems:'center',justifyContent:'space-between',gap:32}}>
        <div onClick={()=>nav('landing')}><RameanLogo size={34} /></div>

        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          {links.map(([pg,lbl])=>(
            <button key={lbl} onClick={()=>nav(pg)} style={{
              background:'none',border:'none',cursor:'pointer',padding:'8px 16px',borderRadius:8,
              fontFamily:C.fontBody,fontSize:14,fontWeight:500,
              color: page===pg ? C.primary : C.textMd,
              backgroundColor: page===pg ? '#EEF2FF' : 'transparent',
              transition:'all 0.15s',
            }}>{lbl}</button>
          ))}
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          {loggedIn
            ? (
                <div onClick={()=>nav('dashboard')} style={{
                  width: 38, height: 38, borderRadius: '50%', backgroundColor: C.primary,
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: C.fontHeading, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  border: '2px solid transparent', transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.border = '2px solid ' + C.border}
                onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}>
                  AR
                </div>
              )
            : <>
                <Btn variant="outline" size="sm" onClick={()=>nav('auth')}>Masuk</Btn>
                <Btn variant="primary" size="sm" onClick={()=>nav('auth')}>Daftar Gratis</Btn>
              </>}
        </div>
      </div>
    </nav>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = ({ nav }) => (
  <footer style={{borderTop:'1px solid '+C.border, backgroundColor:C.white, padding:'72px 40px 36px'}}>
    <div style={{maxWidth:1240,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1fr',gap:56,marginBottom:64}}>
        <div>
          <div onClick={()=>nav('landing')} style={{marginBottom:24,cursor:'pointer'}}><RameanLogo size={34} /></div>
          <p style={{color:C.textMd,fontFamily:C.fontBody,fontSize:14,lineHeight:1.65,marginBottom:20,maxWidth:260}}>
            Dapatkan update terbaru tentang layanan dan fitur baru Ramean.
          </p>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <input type="email" placeholder="Email kamu" style={{
              flex:1,padding:'10px 14px',borderRadius:8,border:'1px solid '+C.border,
              fontFamily:C.fontBody,fontSize:13,outline:'none',color:C.text,
            }} />
            <Btn variant="outline" size="sm">Langganan</Btn>
          </div>
          <p style={{color:C.textSm,fontSize:11,fontFamily:C.fontBody}}>
            Kami hanya kirim yang penting. Tidak ada spam.
          </p>
        </div>

        {[
          {title:'Layanan',    links:['Katalog','Streaming','Produktivitas','AI Tools']},
          {title:'Perusahaan', links:['Tentang Kami','Blog','Karir','Hubungi Kami']},
          {title:'Sosial',     links:['Instagram','X / Twitter','LinkedIn','YouTube']},
        ].map(col=>(
          <div key={col.title}>
            <h4 style={{fontSize:11,fontWeight:600,marginBottom:18,
              letterSpacing:'0.08em',textTransform:'uppercase',
              color:C.textSm,fontFamily:C.fontBody}}>{col.title}</h4>
            {col.links.map(l=>(
              <div key={l} style={{marginBottom:12}}>
                <a href="#" style={{color:C.textMd,textDecoration:'none',fontSize:14,
                  fontFamily:C.fontBody,fontWeight:400}}
                  onMouseEnter={e=>e.target.style.color=C.text}
                  onMouseLeave={e=>e.target.style.color=C.textMd}>{l}</a>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{borderTop:'1px solid '+C.border,paddingTop:28,
        display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
        <span style={{color:C.textSm,fontSize:12,fontFamily:C.fontBody}}>© 2025 Ramean.id · All rights reserved.</span>
        <div style={{display:'flex',gap:24}}>
          {['Kebijakan Privasi','Syarat & Ketentuan','Pengaturan Cookie'].map(l=>(
            <a key={l} href="#" style={{color:C.textSm,fontSize:12,textDecoration:'none',fontFamily:C.fontBody}}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { C, SERVICES, fmt, RameanLogo, SvcIcon, Tag, Btn, NavBar, Footer });
