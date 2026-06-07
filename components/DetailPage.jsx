// Ramean.id — Detail Page (modular)
'use strict';

const { C, SERVICES, fmt, SvcIcon, Tag, Btn } = window;

// ── User Slot Avatar ──────────────────────────────────────────────────────────
const SlotAvatar = ({ name, joined, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    backgroundColor: C.white,
    border: '1px solid ' + C.border,
    borderRadius: 10,
    flex: 1,
    minWidth: 0,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      backgroundColor: color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: C.fontHeading, fontWeight: 700, fontSize: 14, color: 'white',
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, color: C.text,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
      <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textSm, marginTop: 1 }}>Bergabung {joined}</div>
    </div>
    <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
      backgroundColor: C.ok, flexShrink: 0 }} />
  </div>
);

const EmptySlot = ({ label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    backgroundColor: C.bg,
    border: '1.5px dashed ' + C.border,
    borderRadius: 10,
    flex: 1,
    minWidth: 0,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '1.5px dashed ' + C.border, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
    <div>
      <div style={{ fontFamily: C.fontBody, fontWeight: 500, fontSize: 13, color: C.textSm }}>{label}</div>
      <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textSm, marginTop: 1 }}>Slot tersedia</div>
    </div>
  </div>
);

// ── Obfuscate name helper ─────────────────────────────────────────────────────
const obfuscateName = (name) => {
  const parts = name.split(' ');
  return parts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + '*'.repeat(Math.min(part.length - 1, 6)) + part[part.length - 1];
  }).join(' ');
};

// ── Group Tersedia Section ────────────────────────────────────────────────────
const GroupTersediaSection = ({ svc, nav }) => {
  const [showMore, setShowMore] = React.useState(false);

  // Mock data — "Grup Mengumpulkan" (open, slots available)
  const openGroups = [
    {
      id: 'G768', name: 'Grup 768', price: svc.price, status: 'open',
      members: [], total: svc.slots, label: 'Grup Baru',
    },
    {
      id: 'G769', name: 'Grup 769', price: svc.price, status: 'open',
      members: ['Andi Rivaldo', 'Siti Maharani'],
      total: svc.slots, label: 'Grup Baru',
    },
  ];

  // Mock data — "Grup Penuh"
  const fullMockNames = ['Andi R', 'Aprilia S', 'Kevin W', 'Desi Ayu M', 'Raihan N', 'Bella K'];
  const fullGroups = [
    {
      id: 'G767', name: 'Grup 767', price: svc.price, status: 'full',
      members: fullMockNames.slice(0, svc.slots), total: svc.slots,
    },
  ];

  // Mock data — "Grup Aktif" (full + running, grid 3-col)
  const activeMockSets = [
    ['Hendra S', 'A\'s Hartono'],
    ['h****l r*****', 'D**'],
    ['Adi Ridwan', 'M****D Wahyu'],
    ['Budi Santoso', 'Reza Kurniawan'],
    ['Nina P', 'Lestari W'],
    ['Krisna A', 'Dewi S'],
  ];
  const activeGroups = [766, 765, 764, 763, 762, 761].map((num, i) => ({
    id: 'G' + num, name: 'Grup ' + num,
    activatedDate: '02/06/2026', total: svc.slots,
    members: activeMockSets[i] || activeMockSets[0],
  }));
  const visibleActive = showMore ? activeGroups : activeGroups.slice(0, 3);

  const SectionHeader = ({ icon, title, count, color = C.text }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', color }}>{icon}</span>
        <span style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 15, color }}>{title}</span>
      </div>
      <span style={{
        fontSize: 11, fontFamily: C.fontBody, fontWeight: 500,
        color: C.textMd, backgroundColor: C.borderLt,
        padding: '3px 10px', borderRadius: 20,
      }}>{count} grup</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Grup Sedang Mengumpulkan */}
      <div>
        <SectionHeader
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
          title="Grup Sedang Mengumpulkan" count={openGroups.length} color="#1D4ED8" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {openGroups.map(g => {
            const empty = g.total - g.members.length;
            return (
              <div key={g.id} style={{
                border: '1.5px solid #BFDBFE', borderRadius: 12,
                backgroundColor: '#FAFCFF', overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  padding: '12px 16px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid #E0EEFF',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <SvcIcon svc={svc} size={36} />
                    <div>
                      <div style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 14, color: C.text }}>{g.name}</div>
                      <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textMd }}>{fmt(g.price)}/user</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', fontFamily: C.fontBody }}>Grup Baru</span>
                  </div>
                </div>
                {/* Members */}
                <div style={{ padding: '10px 16px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.textMd, fontFamily: C.fontBody }}>
                      Anggota ({g.members.length}/{g.total})
                    </span>
                    <button
                      onClick={() => nav('checkout', svc.id)}
                      style={{
                        padding: '6px 16px', borderRadius: 8, border: 'none',
                        backgroundColor: '#F97316', color: 'white',
                        fontSize: 12, fontWeight: 700, fontFamily: C.fontBody,
                        cursor: 'pointer',
                      }}>+ Gabung</button>
                  </div>
                  {/* Slot list */}
                  {Array.from({ length: g.total }).map((_, idx) => {
                    const member = g.members[idx];
                    return (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '7px 0',
                        borderTop: idx > 0 ? '1px solid ' + C.borderLt : 'none',
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.textSm, width: 16, fontFamily: C.fontBody, flexShrink: 0 }}>{idx + 1}</span>
                        {member ? (
                          <span style={{ fontSize: 13, fontFamily: C.fontBody, color: C.text, fontStyle: 'normal' }}>
                            {obfuscateName(member)}
                          </span>
                        ) : (
                          <span style={{ fontSize: 13, fontFamily: C.fontBody, color: '#9CA3AF', fontStyle: 'italic' }}>
                            Tersedia
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grup Aktif — 3-column grid */}
      <div>
        <SectionHeader
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
          title="Grup Aktif" count={activeGroups.length} color="#059669" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {visibleActive.map(g => (
            <div key={g.id} style={{
              border: '1px solid ' + C.border, borderRadius: 12,
              backgroundColor: C.white, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '10px 12px', borderBottom: '1px solid ' + C.borderLt,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SvcIcon svc={svc} size={28} />
                  <div>
                    <div style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 12, color: C.text }}>{g.name}</div>
                    <div style={{ fontSize: 10, color: C.textSm, fontFamily: C.fontBody }}>Diaktivasi: {g.activatedDate}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#2563EB', fontFamily: C.fontBody }}>Aktif</span>
                </div>
              </div>
              {/* Members */}
              <div style={{ padding: '8px 12px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
                }}>
                  <span style={{ fontSize: 11, color: C.textMd, fontFamily: C.fontBody }}>Jumlah Member:</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFamily: C.fontBody }}>{g.total} anggota</span>
                </div>
                <div style={{ fontSize: 10, color: C.textSm, fontFamily: C.fontBody, marginBottom: 4 }}>Anggota Grup:</div>
                {g.members.map((m, idx) => (
                  <div key={idx} style={{
                    fontSize: 11, color: C.text, fontFamily: C.fontBody,
                    padding: '3px 0',
                    borderTop: idx > 0 ? '1px solid ' + C.borderLt : 'none',
                  }}>
                    {idx + 1}. {obfuscateName(m)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Show more */}
        {activeGroups.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => setShowMore(!showMore)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: C.primary,
                fontFamily: C.fontBody, display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
              {showMore ? 'Tampilkan lebih sedikit ∧' : 'Tampilkan lebih banyak ∨'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Detail Page Tab Panel ────────────────────────────────────────────────────
const DetailTabPanel = ({ svc, nav }) => {
  const [activeTab, setActiveTab] = React.useState('faq');
  const tabs = [
    { id: 'faq',    label: 'FAQ' },
    { id: 'skema',  label: 'Cara Ramean Bekerja' },
    { id: 'groups', label: 'Group Tersedia' },
  ];

  // FAQ data per service
  const faqData = {
    netflix:  [
      { q: 'Berapa lama aktivasi?', a: 'Akun aktif dalam waktu kurang dari 1 jam setelah pembayaran dikonfirmasi.' },
      { q: 'Apakah bisa menonton di semua perangkat?', a: 'Bisa! Akun slot Ramean mendukung 1 perangkat aktif sesuai paket langganan.' },
      { q: 'Apakah kualitasnya sama dengan akun normal?', a: 'Ya, 100% sama. Semua fitur termasuk 4K Ultra HD dan download offline tetap tersedia.' },
      { q: 'Bagaimana jika ada masalah?', a: 'Ada garansi penuh — jika ada kendala, kami akan ganti akun atau refund sepenuhnya.' },
    ],
    youtube: [
      { q: 'Berapa lama aktivasi?', a: 'Akun aktif dalam 1 jam setelah pembayaran dikonfirmasi.' },
      { q: 'Apakah bisa background play?', a: 'Ya, background play dan download video tetap bisa digunakan.' },
      { q: 'Apakah sudah termasuk YouTube Music?', a: 'Ya, YouTube Music Premium sudah termasuk dalam paket Ramean ini.' },
      { q: 'Apakah iklan benar-benar hilang?', a: 'Ya, 100% bebas iklan di seluruh konten YouTube.' },
    ],
    canva: [
      { q: 'Berapa lama aktivasi?', a: 'Akun Canva Pro aktif dalam waktu kurang dari 1 jam.' },
      { q: 'Apakah semua fitur Pro bisa diakses?', a: 'Ya, termasuk background remover, brand kit, 100M+ aset, dan template eksklusif.' },
      { q: 'Apakah bisa digunakan untuk desain komersial?', a: 'Bisa, sesuai lisensi Canva Pro yang berlaku.' },
      { q: 'Bagaimana jika ada masalah?', a: 'Kami berikan garansi akun aktif selama periode berlangganan.' },
    ],
    gemini: [
      { q: 'Berapa lama aktivasi?', a: 'Akses Gemini Advanced aktif dalam 1 jam setelah pembayaran.' },
      { q: 'Apakah sudah termasuk 1TB Google Drive?', a: 'Ya, paket Ramean ini sudah termasuk Google One 1TB dan keuntungan lainnya.' },
      { q: 'Model AI apa yang bisa diakses?', a: 'Gemini Ultra 1.0 — model AI paling canggih dari Google.' },
      { q: 'Bagaimana jika ada masalah?', a: 'Ada garansi penuh, kami ganti atau refund jika ada kendala.' },
    ],
    chatgpt: [
      { q: 'Berapa lama aktivasi?', a: 'Akun ChatGPT Plus aktif dalam waktu kurang dari 1 jam.' },
      { q: 'Apakah GPT-4o bisa diakses?', a: 'Ya, termasuk akses ke GPT-4o, DALL-E 3, dan browsing web real-time.' },
      { q: 'Apakah bisa pakai Code Interpreter?', a: 'Bisa, semua fitur Plus termasuk Code Interpreter dan plugin tersedia.' },
      { q: 'Bagaimana jika slot habis?', a: 'Daftarkan dirimu ke waiting list dan Ramean akan notifikasi saat slot tersedia.' },
    ],
  };

  const faqs = faqData[svc.id] || faqData.netflix;

  return (
    <div style={{ backgroundColor: C.white, border: '1px solid ' + C.border }}>
      {/* Tab Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid ' + C.border, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '14px 20px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid ' + C.primary : '2px solid transparent',
              fontFamily: C.fontBody,
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? C.primary : C.textMd,
              transition: 'all 0.15s',
              marginBottom: -1,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '24px 28px' }}>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            {faqs.map((item, i) => (
              <div key={item.q} style={{
                padding: '14px 0',
                borderBottom: i < faqs.length - 1 ? '1px solid ' + C.borderLt : 'none',
              }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 6, fontFamily: C.fontBody }}>
                  {item.q}
                </div>
                <div style={{ fontSize: 13, color: C.textMd, lineHeight: 1.65, fontFamily: C.fontBody }}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cara Ramean Bekerja Tab */}
        {activeTab === 'skema' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 17, color: C.text, margin: 0 }}>
                  Bagaimana Ramean Bekerja?
                </h3>
              </div>
              <p style={{ fontSize: 14, color: C.textMd, lineHeight: 1.7, fontFamily: C.fontBody, marginBottom: 16 }}>
                Ramean menggunakan sistem <strong>akun grup</strong>. Satu akun premium dibeli bersama oleh beberapa pengguna dalam satu grup. Setiap pengguna mendapat akses penuh dengan biaya yang jauh lebih rendah — inilah keunggulan Ramean.
              </p>
            </div>

            {/* Visual steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {[
                { step: '1', title: 'Ramean membentuk grup', desc: `Ramean mengumpulkan ${svc.slots} pengguna untuk berbagi satu akun ${svc.name} premium.` },
                { step: '2', title: 'Kamu bayar hanya bagianmu', desc: `Biaya ${fmt(svc.orig)}/bulan dibagi ${svc.slots} — kamu cukup bayar ${fmt(svc.price)}/bulan.` },
                { step: '3', title: 'Akun langsung aktif', desc: 'Ramean mengelola semua teknis. Kamu langsung nikmati layanan tanpa repot.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', backgroundColor: C.primary,
                    color: 'white', fontFamily: C.fontHeading, fontWeight: 700, fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{s.step}</div>
                  <div>
                    <div style={{ fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textMd, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ramean guarantee points */}
            <div style={{ backgroundColor: '#EEF2FF', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, fontFamily: C.fontBody, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                Jaminan Ramean
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  'Setiap slot mendapat akses fitur yang sama persis',
                  'Privasi terjaga — pengguna lain tidak dapat melihat aktivitasmu',
                  'Jika satu anggota keluar, Ramean langsung carikan pengganti',
                  'Garansi akun aktif selama periode berlanggananmu',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <polyline points="1 6 5 10 11 2" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 13, color: C.text, fontFamily: C.fontBody }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Group Tersedia Tab */}
        {activeTab === 'groups' && (
          <div>
            <GroupTersediaSection svc={svc} nav={nav} />
          </div>
        )}
      </div>
    </div>
  );
};

// ╔══════════════════════════════════════════════════════════╗
// ║  DETAIL PAGE                                             ║
// ╚══════════════════════════════════════════════════════════╝
const DetailPage = ({ nav, svcId }) => {
  const svc = SERVICES.find(s => s.id === svcId) || SERVICES[0];
  const [dur, setDur] = React.useState(0);

  const d = svc.durs[dur];
  const normalTotal = svc.orig * d.m;
  const savings     = normalTotal - d.p;

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: C.white, borderBottom: '1px solid ' + C.border, padding: '0 40px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', height: 48, display: 'flex', alignItems: 'center',
          gap: 8, fontSize: 14, color: C.textMd, fontFamily: C.fontBody }}>
          <span onClick={() => nav('landing')} style={{ cursor: 'pointer', color: C.text, fontWeight: 500 }}>Beranda</span>
          <span style={{ color: C.border }}>›</span>
          <span onClick={() => nav('catalog')} style={{ cursor: 'pointer', color: C.text, fontWeight: 500 }}>Katalog</span>
          <span style={{ color: C.border }}>›</span>
          <span style={{ color: C.textMd }}>{svc.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 40px',
        display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'flex-start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Service hero */}
          <div style={{ backgroundColor: C.white, border: '1px solid ' + C.border, padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
              <SvcIcon svc={svc} size={64} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h1 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 26, color: C.text, margin: 0 }}>{svc.name}</h1>
                  {svc.hot && <Tag variant="yellow">Terlaris</Tag>}
                  {!svc.avail && <Tag variant="warn">Menunggu Slot</Tag>}
                </div>
                <Tag variant="primary">{svc.cat}</Tag>
                <p style={{ color: C.textMd, fontSize: 14, marginTop: 12, lineHeight: 1.7, fontFamily: C.fontBody }}>{svc.desc}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {svc.feats.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', backgroundColor: C.bg, border: '1px solid ' + C.border }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="1 6 5 10 11 2" stroke={C.ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 400, fontFamily: C.fontBody }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Package Picker */}
          <div style={{ backgroundColor: C.white, border: '1px solid ' + C.border, padding: '28px' }}>
            <h2 style={{ fontFamily: C.fontHeading, fontWeight: 600, fontSize: 18,
              color: C.text, marginBottom: 16 }}>Pilih Paket</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {svc.durs.map((d, i) => (
                <div key={i} onClick={() => setDur(i)}
                  style={{ padding: '14px 10px', cursor: 'pointer', textAlign: 'center',
                    border: `1.5px solid ${dur === i ? C.primary : C.border}`,
                    backgroundColor: dur === i ? '#EEF2FF' : C.white, transition: 'all 0.15s',
                    borderRadius: 8 }}>
                  <div style={{ fontWeight: 500, fontSize: 12, color: C.textMd, marginBottom: 6,
                    fontFamily: C.fontBody, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.lbl}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: dur === i ? C.primary : C.text,
                    fontFamily: C.fontHeading }}>{fmt(d.p)}</div>
                  {d.save && <div style={{ fontSize: 11, color: C.ok, fontWeight: 500, marginTop: 4, fontFamily: C.fontBody }}>{d.save}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ / Cara Ramean Bekerja / Group Tersedia Tabs */}
          <DetailTabPanel svc={svc} nav={nav} />
        </div>

        {/* RIGHT — sticky summary */}
        <div style={{ position: 'sticky', top: 84, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ backgroundColor: C.white, border: '1px solid ' + C.border, overflow: 'hidden', borderRadius: 12 }}>

            {/* Price header */}
            <div style={{ backgroundColor: C.primary, padding: '20px 24px' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4, fontFamily: C.fontBody }}>
                Harga via Ramean
              </div>
              <div style={{ fontWeight: 700, fontSize: 32, color: 'white', fontFamily: C.fontHeading }}>
                {fmt(d.p)}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontFamily: C.fontBody }}>
                untuk {d.lbl} · {svc.slots} pengguna
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Basic info rows */}
              {[
                ['Layanan', svc.name],
                ['Paket', d.lbl],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, marginBottom: 10, fontFamily: C.fontBody }}>
                  <span style={{ color: C.textMd }}>{k}</span>
                  <span style={{ fontWeight: 500, color: C.text }}>{v}</span>
                </div>
              ))}

              {/* Ramean Pricing Schema — inline in summary card */}
              <div style={{
                backgroundColor: C.bg, borderRadius: 8, padding: '12px 14px',
                marginBottom: 14, border: '1px solid ' + C.borderLt,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.primary, fontFamily: C.fontBody,
                  letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10,
                }}>
                  Ramean Hitung Ini Untukmu
                </div>
                {[
                  { label: `Harga resmi ${svc.name}`,    value: fmt(svc.orig),         sub: 'per bulan', muted: true },
                  { label: `Dibagi ${svc.slots} pengguna`, value: `÷ ${svc.slots}`,    sub: 'dalam 1 grup', muted: true },
                  { label: 'Paket ' + d.lbl,              value: fmt(d.p),             sub: `${d.m} bln × ${fmt(svc.price)}`, primary: true },
                  { label: 'Total kamu hemat',             value: '- ' + fmt(savings),  sub: 'vs beli langsung', green: true },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 0',
                    borderTop: i > 0 ? '1px solid ' + C.borderLt : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: row.muted ? C.textMd : C.text, fontFamily: C.fontBody }}>{row.label}</div>
                      <div style={{ fontSize: 10, color: C.textSm, fontFamily: C.fontBody }}>{row.sub}</div>
                    </div>
                    <div style={{
                      fontWeight: 700, fontSize: 12,
                      color: row.green ? C.ok : row.primary ? C.primary : C.textMd,
                      fontFamily: C.fontHeading, whiteSpace: 'nowrap',
                    }}>{row.value}</div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ borderTop: '1px solid ' + C.border, paddingTop: 12, marginBottom: 14,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: C.text, fontFamily: C.fontBody }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: C.primary, fontFamily: C.fontHeading }}>{fmt(d.p)}</span>
              </div>

              {/* CTA — accessible even when full, but shows waiting message */}
              <Btn
                variant="primary" full size="lg"
                onClick={() => nav('checkout', svc.id)}
              >
                {svc.avail ? 'Pesan Sekarang' : 'Daftar Antri Slot'}
              </Btn>

              {/* Waiting note if full */}
              {!svc.avail && (
                <div style={{
                  marginTop: 10, padding: '10px 12px', backgroundColor: '#FEF3C7',
                  borderRadius: 8, fontSize: 12, color: '#92400E', fontFamily: C.fontBody, lineHeight: 1.6,
                }}>
                  Slot grup sedang penuh. Daftar antri dan Ramean akan notifikasi kamu saat ada slot tersedia.
                </div>
              )}

              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {['Pembayaran 100% aman', 'Aktivasi dalam 1 jam', 'Garansi Ramean'].map(t => (
                  <div key={t} style={{ fontSize: 11, color: C.textMd, textAlign: 'center', fontFamily: C.fontBody }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

Object.assign(window, { DetailPage });
