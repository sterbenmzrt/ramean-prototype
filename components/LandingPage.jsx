// Ramean.id — Landing Page
'use strict';

const { C, SERVICES, fmt, SvcIcon, Tag, Btn } = window;

// ── Shared UI Components for Landing Page ──────────────────────────────────
const SectionHeading = ({ tagline, title, desc, align = 'left' }) => (
  <div style={{ textAlign: align, marginBottom: 48 }}>
    {tagline && (
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textMd, fontFamily: C.fontBody, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
        {tagline}
      </div>
    )}
    <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 38, color: C.text, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 16 }}>{title}</h2>
    {desc && <p style={{ color: C.textMd, fontSize: 16, lineHeight: 1.65, maxWidth: align === 'center' ? 560 : 480, margin: align === 'center' ? '0 auto' : '0', fontFamily: C.fontBody }}>{desc}</p>}
  </div>
);

const ImagePlaceholder = ({ width = '100%', height = '100%', minHeight = 400, bg = '#E8EDF5' }) => (
  <div style={{ width, height, minHeight, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B0BCD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  </div>
);

// ── SVG Icons (no emoji) ────────────────────────────────────────────────────
const IconArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textMd} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconGrid = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textMd} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconHeadset = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textMd} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const IconPen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textMd} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

// ── Step Card Component ─────────────────────────────────────────────────────
const StepCard = ({ label, title, desc, ctaLabel, ctaLink, active = false, nav }) => (
  <div style={{ border: '1px solid ' + C.border, padding: active ? 40 : '28px 40px', backgroundColor: C.white }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMd, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: C.fontBody, marginBottom: 12 }}>{label}</div>
    <h3 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: active ? 28 : 22, marginBottom: 12, color: C.text, lineHeight: 1.2 }}>{title}</h3>
    <p style={{ color: C.textMd, fontSize: 15, lineHeight: 1.6, marginBottom: 24, fontFamily: C.fontBody }}>{desc}</p>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Btn variant={active ? 'outline' : 'outline'} size={active ? 'md' : 'sm'} onClick={() => nav('catalog')}>{ctaLabel}</Btn>
      <Btn variant="ghost" size={active ? 'md' : 'sm'} extraStyle={{ color: C.textMd }}>Pelajari lebih lanjut</Btn>
    </div>
  </div>
);

// ── Why Item Component ──────────────────────────────────────────────────────
const WhyItem = ({ num, title, desc }) => (
  <div style={{ display: 'flex', gap: 28, marginBottom: 44, position: 'relative', zIndex: 1 }}>
    <div style={{
      width: 44, height: 44,
      backgroundColor: C.white,
      border: '1.5px solid ' + C.border,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: C.fontHeading, fontWeight: 700, fontSize: 15, color: C.text,
      flexShrink: 0, borderRadius: 2
    }}>
      {num}
    </div>
    <div style={{ paddingTop: 6 }}>
      <h4 style={{ fontFamily: C.fontHeading, fontWeight: 600, fontSize: 18, marginBottom: 8, color: C.text }}>{title}</h4>
      <p style={{ color: C.textMd, fontSize: 14, lineHeight: 1.65, fontFamily: C.fontBody }}>{desc}</p>
    </div>
  </div>
);

// ── Testimonial Card ────────────────────────────────────────────────────────
const TestimonialCard = ({ brandName, text, name, role }) => (
  <div style={{ border: '1px solid ' + C.border, padding: 32, backgroundColor: C.white, display: 'flex', flexDirection: 'column' }}>
    <div style={{ fontWeight: 700, fontFamily: C.fontHeading, fontSize: 18, marginBottom: 24, color: C.text }}>
      {brandName}
    </div>
    <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, flex: 1, marginBottom: 32, fontFamily: C.fontBody }}>{text}</p>
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: C.borderLt, flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 600, fontFamily: C.fontHeading, fontSize: 14, marginBottom: 3, color: C.text }}>{name}</div>
        <div style={{ fontSize: 13, color: C.textMd, fontFamily: C.fontBody }}>{role}</div>
      </div>
    </div>
    <a href="#" style={{ fontSize: 13, color: C.text, fontFamily: C.fontBody, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
      Baca ceritanya
    </a>
  </div>
);

// ── FAQ Item ────────────────────────────────────────────────────────────────
const FaqItem = ({ title, desc, linkLabel }) => (
  <div>
    <h4 style={{ fontFamily: C.fontHeading, fontWeight: 600, fontSize: 17, marginBottom: 10, color: C.text }}>{title}</h4>
    <p style={{ color: C.textMd, fontSize: 14, lineHeight: 1.65, marginBottom: 14, fontFamily: C.fontBody }}>{desc}</p>
    <a href="#" style={{ fontSize: 13, color: C.text, fontWeight: 500, textDecoration: 'none', fontFamily: C.fontBody }}>{linkLabel}</a>
  </div>
);

// ── Service Marketplace Card ────────────────────────────────────────────────
const ServiceMarketCard = ({ svc, nav }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={() => nav('detail', svc.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.white,
        border: '1px solid ' + (hovered ? '#CBD5E0' : C.border),
        borderRadius: 16,
        padding: '20px 16px 14px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 10,
        position: 'relative',
      }}
    >
      {/* Badge */}
      {svc.hot && svc.avail && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          backgroundColor: '#FEF9C3', color: '#92400E',
          fontSize: 10, fontWeight: 700, padding: '3px 8px',
          borderRadius: 20, fontFamily: C.fontBody,
        }}>Terlaris</div>
      )}
      {!svc.avail && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          backgroundColor: '#FEF3C7', color: '#B45309',
          fontSize: 10, fontWeight: 700, padding: '3px 8px',
          borderRadius: 20, fontFamily: C.fontBody,
        }}>Antri</div>
      )}

      {/* Icon */}
      <SvcIcon svc={svc} size={72} />

      {/* Name */}
      <div style={{
        fontFamily: C.fontHeading, fontWeight: 700,
        fontSize: 14, color: C.text, lineHeight: 1.3,
      }}>{svc.name}</div>

      {/* Price */}
      <div style={{
        fontFamily: C.fontHeading, fontWeight: 800,
        fontSize: 16, color: '#D97706',
      }}>
        {fmt(svc.price)}
        <span style={{ fontSize: 11, fontWeight: 500, color: C.textMd }}> /30h</span>
      </div>

      {/* CTA Button — same style as sign up */}
      <button
        onClick={e => { e.stopPropagation(); nav('detail', svc.id); }}
        style={{
          width: '100%',
          padding: '9px 14px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: svc.avail ? C.primary : '#94A3B8',
          color: 'white',
          fontFamily: C.fontBody,
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'all 0.15s',
          marginTop: 2,
        }}
      >
        {svc.avail ? 'Pesan' : 'Daftar Antri'}
      </button>
    </div>
  );
};

// ── What We Offer (marketplace grid) ─────────────────────────────────────────
const WhatWeOffer = ({ nav }) => {
  const [activeTab, setActiveTab] = React.useState('Semua');
  const tabs = ['Semua', 'Streaming', 'Produktivitas', 'AI Tools'];
  const displayed = activeTab === 'Semua' ? SERVICES : SERVICES.filter(s => s.cat === activeTab);

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', borderTop: '1px solid ' + C.border }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMd, fontFamily: C.fontBody, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Layanan Kami</div>
        <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 38, color: C.text, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 16 }}>Semua yang kamu butuhkan ada di sini</h2>
        <p style={{ color: C.textMd, fontSize: 16, lineHeight: 1.65, maxWidth: 560, margin: '0 auto', fontFamily: C.fontBody }}>Dari hiburan hingga produktivitas dan AI — satu platform untuk semua kebutuhanmu, dengan harga terbaik.</p>
      </div>

      {/* Tab Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 20px', borderRadius: 20, cursor: 'pointer',
            fontFamily: C.fontBody, fontSize: 13, fontWeight: 500,
            backgroundColor: activeTab === tab ? C.primary : C.white,
            color: activeTab === tab ? 'white' : C.textMd,
            border: '1px solid ' + (activeTab === tab ? C.primary : C.border),
            transition: 'all 0.15s',
          }}>{tab}</button>
        ))}
      </div>

      {/* Marketplace Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}>
        {displayed.map(svc => (
          <ServiceMarketCard key={svc.id} svc={svc} nav={nav} />
        ))}
      </div>

      {/* See all CTA */}
      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <Btn variant="outline" size="md" onClick={() => nav('catalog')}>Lihat Semua Layanan</Btn>
      </div>
    </section>
  );
};

// ── Landing Page ──────────────────────────────────────────────────────────
const LandingPage = ({ nav }) => (
  <div style={{ backgroundColor: C.bg }}>

    {/* HERO */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div>
        <h1 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: C.text, marginBottom: 24, letterSpacing: '-1px' }}>
          Nikmati layanan premium tanpa biaya penuh
        </h1>
        <p style={{ fontSize: 17, color: C.textMd, lineHeight: 1.65, marginBottom: 40, maxWidth: 460, fontFamily: C.fontBody }}>
          Ramean memungkinkan kamu mengakses Netflix, Canva, AI tools, dan lainnya dengan harga yang jauh lebih hemat. Bayar sesuai kebutuhan, tanpa kontrak jangka panjang.
        </p>
        <div style={{ display: 'flex', gap: 14 }}>
          <Btn variant="primary" size="lg" onClick={() => nav('catalog')}>Lihat Layanan</Btn>
          <Btn variant="outline" size="lg" onClick={() => nav('auth')}>Mulai Gratis</Btn>
        </div>
      </div>
      <div>
        <ImagePlaceholder minHeight={480} />
      </div>
    </section>

    {/* STATS */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', borderTop: '1px solid ' + C.border }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 64, alignItems: 'start' }}>
        <div>
          <SectionHeading
            tagline="Angka Nyata"
            title="Dipercaya puluhan ribu pengguna aktif"
          />
        </div>
        <div>
          <p style={{ fontSize: 16, color: C.textMd, lineHeight: 1.65, marginBottom: 28, fontFamily: C.fontBody }}>
            Ribuan orang sudah membuktikan bahwa Ramean adalah cara paling cerdas untuk menikmati layanan premium. Kami bukan sekadar platform — kami adalah solusi nyata untuk penghematan bulananmu.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn variant="outline" size="md" onClick={() => nav('catalog')}>Jelajahi Layanan</Btn>
            <Btn variant="ghost" size="md" extraStyle={{ color: C.textMd }}>Pelajari lebih lanjut</Btn>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid ' + C.border }}>
        {[
          { num: '93%', label: 'Hemat lebih besar', desc: 'Rata-rata penghematan pengguna Ramean dibanding harga normal per bulan.' },
          { num: '10K+', label: 'Pengguna aktif', desc: 'Bergabung bersama puluhan ribu orang yang sudah beralih ke Ramean.' },
          { num: '< 1 Jam', label: 'Aktivasi cepat', desc: 'Dari pembayaran hingga akun aktif, selesai dalam hitungan menit.' },
        ].map((stat, i) => (
          <div key={i} style={{ borderLeft: i > 0 ? '1px solid ' + C.border : 'none', paddingLeft: i > 0 ? 40 : 0, paddingTop: 36, paddingRight: 40 }}>
            <div style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 56, color: C.text, lineHeight: 1, marginBottom: 12 }}>{stat.num}</div>
            <div style={{ fontWeight: 600, fontFamily: C.fontHeading, fontSize: 16, color: C.text, marginBottom: 8 }}>{stat.label}</div>
            <p style={{ fontSize: 14, color: C.textMd, lineHeight: 1.6, fontFamily: C.fontBody }}>{stat.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', borderTop: '1px solid ' + C.border }}>
      <SectionHeading
        tagline="Cara Kerja"
        title="Tiga langkah untuk memulai"
        desc="Pilih layanan, bayar, dan langsung nikmati. Tidak ada proses panjang, tidak ada syarat rumit."
        align="center"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 40 }}>
        <div>
          <ImagePlaceholder minHeight={540} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StepCard
            label="Langkah 1"
            title="Pilih layanan yang kamu inginkan"
            desc="Jelajahi katalog kami dan temukan layanan yang paling sesuai. Netflix, Canva, Gemini, dan banyak lagi tersedia dengan harga jauh di bawah normal."
            ctaLabel="Lihat Katalog"
            active={true}
            nav={nav}
          />
          <StepCard
            label="Langkah 2"
            title="Lakukan pembayaran dengan mudah"
            desc="Pilih metode pembayaran favoritmu — QRIS, transfer bank, atau e-wallet. Proses aman dan terenkripsi penuh."
            ctaLabel="Bayar Sekarang"
            active={false}
            nav={nav}
          />
          <StepCard
            label="Langkah 3"
            title="Akun langsung aktif, siap dipakai"
            desc="Terima detail akun premium aktif dalam hitungan menit. Pantau semua langgananmu di satu dashboard yang bersih."
            ctaLabel="Mulai Sekarang"
            active={false}
            nav={nav}
          />
        </div>
      </div>
    </section>

    {/* WHY CHOOSE RAMEAN */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', borderTop: '1px solid ' + C.border }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div>
          <SectionHeading
            tagline="Kenapa Ramean"
            title="Dibuat untuk kamu yang menghargai waktu dan uang"
          />
          <p style={{ fontSize: 15, color: C.textMd, lineHeight: 1.65, marginBottom: 32, fontFamily: C.fontBody }}>
            Kami percaya bahwa akses ke layanan digital premium seharusnya tidak menguras kantong. Ramean hadir sebagai solusi praktis yang sudah terbukti.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn variant="outline" size="md" onClick={() => nav('catalog')}>Jelajahi Sekarang</Btn>
            <Btn variant="ghost" size="md" extraStyle={{ color: C.textMd }}>Pelajari lebih lanjut</Btn>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 22, top: 44, bottom: 20, width: 1, backgroundColor: C.border }} />
          <WhyItem num="01" title="Tanpa ikatan kontrak" desc="Tidak ada komitmen jangka panjang. Gunakan selama kamu mau, batalkan kapan saja tanpa denda." />
          <WhyItem num="02" title="Bayar hanya yang kamu pakai" desc="Harga transparan, tidak ada biaya tersembunyi. Apa yang kamu lihat adalah yang kamu bayar." />
          <WhyItem num="03" title="Satu dashboard untuk segalanya" desc="Kelola semua langgananmu di satu tempat. Tidak perlu ingat banyak password atau tanggal tagihan." />
          <WhyItem num="04" title="Termin fleksibel sesuai kebutuhan" desc="Pilih durasi 1 bulan, 3 bulan, atau 1 tahun. Semakin lama, semakin besar penghematan kamu." />
        </div>
      </div>
    </section>

    <WhatWeOffer nav={nav} />

    {/* TESTIMONIALS */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', borderTop: '1px solid ' + C.border }}>
      <SectionHeading
        title="Cerita nyata dari pengguna kami"
        desc="Bukan kata-kata kami, tapi pengalaman langsung orang-orang yang sudah merasakannya."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <TestimonialCard
          brandName="Netflix via Ramean"
          text='"Tadinya berat bayar Netflix Rp54.000/bulan. Sekarang cuma Rp15.000 dan kualitasnya sama persis. Tidak ada yang hilang, semua fitur lengkap."'
          name="Budi Santoso"
          role="Freelancer, Jakarta"
        />
        <TestimonialCard
          brandName="Canva Pro via Ramean"
          text='"Canva Pro dari Ramean benar-benar mengubah cara aku kerja. Hemat lebih dari Rp70.000 per bulan dan prosesnya cepat, dalam 30 menit akun sudah aktif."'
          name="Siti Rahma"
          role="Desainer, Bandung"
        />
        <TestimonialCard
          brandName="Gemini Advanced via Ramean"
          text='"Satu dashboard untuk semua langganan itu sangat membantu. Aku tidak perlu ingat banyak tanggal tagihan lagi. Simple dan efisien."'
          name="Ahmad Wijaya"
          role="Software Developer, Surabaya"
        />
      </div>
    </section>

    {/* BENEFIT / FAQ GRID */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px', borderTop: '1px solid ' + C.border }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignContent: 'start' }}>
          <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMd, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: C.fontBody, marginBottom: 12 }}>Mengapa Ramean</div>
            <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 34, color: C.text, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 0 }}>Keuntungan Berlangganan Lewat Kami</h2>
          </div>
          <FaqItem
            title="Mulai sekarang"
            desc="Layanan pertamamu hanya beberapa langkah lagi. Tidak perlu menunggu, tidak perlu antre."
            linkLabel="Lihat Katalog"
          />
          <FaqItem
            title="Butuh bantuan dulu?"
            desc="Tim dukungan kami responsif dan siap menjawab pertanyaanmu kapan saja."
            linkLabel="Hubungi Kami"
          />
          <FaqItem
            title="Masih ada pertanyaan?"
            desc="Cek halaman FAQ kami atau tanya langsung ke tim kami. Jawaban jelas, tanpa berputar-putar."
            linkLabel="Baca FAQ"
          />
          <FaqItem
            title="Siap beralih?"
            desc="Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat Ramean setiap bulan."
            linkLabel="Daftar Gratis"
          />
          <FaqItem
            title="Aman dan terpercaya"
            desc="Semua transaksi terenkripsi SSL. Akun premium langsung dari penyedia resmi, 100% aman."
            linkLabel="Pelajari Keamanan"
          />
          <FaqItem
            title="Garansi kepuasan"
            desc="Ada masalah teknis? Kami ganti akun atau refund penuh. Kepuasanmu adalah prioritas utama kami."
            linkLabel="Lihat Garansi"
          />
        </div>
        <div>
          <ImagePlaceholder minHeight="100%" />
        </div>
      </div>
    </section>

    {/* PERSONAL SERVICE CTA */}
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px 100px', borderTop: '1px solid ' + C.border }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMd, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: C.fontBody, marginBottom: 20 }}>Butuh akun pribadi?</div>
          <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 40, lineHeight: 1.15, color: C.text, marginBottom: 20, letterSpacing: '-0.5px' }}>
            Kalau kamu butuh akun hanya untuk dirimu sendiri, kami juga bisa bantu.
          </h2>
          <p style={{ fontSize: 15, color: C.textMd, lineHeight: 1.65, marginBottom: 16, fontFamily: C.fontBody }}>
            Tidak semua orang cocok dengan sistem berbagi. Jika kamu ingin akun eksklusif untuk penggunaan pribadi — kami menyediakan paket perorangan dengan akses penuh dan privasi terjaga.
          </p>
          <p style={{ fontSize: 15, color: C.textMd, lineHeight: 1.65, marginBottom: 36, fontFamily: C.fontBody }}>
            Cukup hubungi kami, ceritakan kebutuhanmu, dan kami akan carikan solusi terbaik untukmu.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Btn variant="primary" size="lg" onClick={() => nav('auth')}>Hubungi Kami</Btn>
          </div>
        </div>
        <div>
          <ImagePlaceholder minHeight={440} />
        </div>
      </div>
    </section>

  </div>
);

Object.assign(window, { LandingPage });
