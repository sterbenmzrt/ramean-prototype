// Ramean.id — Checkout Page (modular)
'use strict';

const { C, SERVICES, fmt, SvcIcon, Btn } = window;

// ╔══════════════════════════════════════════════════════════╗
// ║  CHECKOUT PAGE                                           ║
// ╚══════════════════════════════════════════════════════════╝
const CheckoutPage = ({ nav, svcId }) => {
  const svc  = SERVICES.find(s => s.id === svcId) || SERVICES[0];
  const [step, setStep] = React.useState(0);
  const [pay,  setPay]  = React.useState('qris');
  const [form, setForm] = React.useState({ email: '', wa: '' });
  const [durIdx, setDurIdx] = React.useState(0);

  // Success screen
  if (step === 2) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ backgroundColor: C.white, borderRadius: 24, border: '1px solid ' + C.border,
        padding: '64px 52px', maxWidth: 480, width: '100%', textAlign: 'center',
        boxShadow: '0 8px 48px rgba(13,27,53,0.1)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: C.okBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 36 }}>✓</div>
        <h2 style={{ fontFamily: C.fontHeading, fontWeight: 800, fontSize: 28,
          color: C.text, marginBottom: 12 }}>Pesanan Dikonfirmasi!</h2>
        <p style={{ color: C.textMd, fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
          Detail akun <strong>{svc.name}</strong> akan dikirim ke WhatsApp kamu dalam 1 jam.
        </p>
        <Btn variant="primary" full size="lg" onClick={() => nav('catalog')}>Beli Layanan Lain</Btn>
      </div>
    </div>
  );

  const steps = ['Detail Pesanan', 'Pembayaran', 'Selesai'];
  const payMethods = [
    { id: 'qris',    lbl: 'QRIS',             sub: 'Scan QR dari semua e-wallet & bank' },
    { id: 'bca',     lbl: 'Transfer BCA',     sub: 'Virtual Account BCA otomatis' },
    { id: 'mandiri', lbl: 'Transfer Mandiri', sub: 'Virtual Account Mandiri otomatis' },
    { id: 'gopay',   lbl: 'GoPay',            sub: 'Bayar langsung via aplikasi GoPay' },
  ];

  const d = svc.durs[durIdx];

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', padding: '52px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 52 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: i <= step ? C.primary : C.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i <= step ? 'white' : C.textSm, fontWeight: 800, fontSize: 13,
                  fontFamily: C.fontHeading }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 400,
                  color: i === step ? C.text : C.textMd, whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, backgroundColor: i < step ? C.primary : C.border,
                  maxWidth: 100, margin: '0 16px', marginBottom: 20 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>

          {/* LEFT FORM */}
          <div style={{ backgroundColor: C.white, borderRadius: 12, border: '1px solid ' + C.border, padding: '36px' }}>
            {step === 0 ? (
              <>
                <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700,
                  fontSize: 22, color: C.text, marginBottom: 24 }}>Detail Pesanan</h2>

                {/* Package selector in checkout */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: C.text,
                    marginBottom: 8, fontFamily: C.fontBody }}>Pilih Paket</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {svc.durs.map((d, i) => (
                      <div key={i} onClick={() => setDurIdx(i)} style={{
                        padding: '10px 8px', textAlign: 'center', cursor: 'pointer', borderRadius: 8,
                        border: `1.5px solid ${durIdx === i ? C.primary : C.border}`,
                        backgroundColor: durIdx === i ? '#EEF2FF' : C.white, transition: 'all 0.15s',
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: C.textMd, fontFamily: C.fontBody, marginBottom: 4 }}>{d.lbl}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: durIdx === i ? C.primary : C.text, fontFamily: C.fontHeading }}>{fmt(d.p)}</div>
                        {d.save && <div style={{ fontSize: 10, color: C.ok, fontWeight: 600, marginTop: 2 }}>{d.save}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'email', lbl: 'Email Aktif',     ph: 'contoh@email.com', type: 'email', hint: 'Konfirmasi pesanan dikirim ke email ini' },
                  { key: 'wa',   lbl: 'Nomor WhatsApp',   ph: '08xxxxxxxxxx',     type: 'tel',   hint: 'Detail akun akan dikirim via WhatsApp' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: C.text,
                      marginBottom: 7, fontFamily: C.fontBody }}>{f.lbl}</label>
                    <input
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.ph} type={f.type}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 8,
                        border: '1.5px solid ' + C.border, fontSize: 14, outline: 'none',
                        fontFamily: C.fontBody, boxSizing: 'border-box', color: C.text }} />
                    <p style={{ fontSize: 12, color: C.textSm, marginTop: 6, fontFamily: C.fontBody }}>{f.hint}</p>
                  </div>
                ))}

                <div style={{ marginTop: 32 }}>
                  <Btn variant="primary" full size="lg" onClick={() => setStep(1)}>
                    Lanjut ke Pembayaran →
                  </Btn>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: C.fontHeading, fontWeight: 700,
                  fontSize: 22, color: C.text, marginBottom: 28 }}>Metode Pembayaran</h2>
                {payMethods.map(m => (
                  <div key={m.id} onClick={() => setPay(m.id)}
                    style={{ padding: '16px 18px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${pay === m.id ? C.primary : C.border}`,
                      backgroundColor: pay === m.id ? '#EEF2FF' : C.white,
                      marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14,
                      transition: 'all 0.15s' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${pay === m.id ? C.primary : '#D1D5DB'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {pay === m.id && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.primary }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text, fontFamily: C.fontBody }}>{m.lbl}</div>
                      <div style={{ fontSize: 12, color: C.textMd, fontFamily: C.fontBody }}>{m.sub}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
                  <Btn variant="ghost" size="md" onClick={() => setStep(0)}>← Kembali</Btn>
                  <Btn variant="primary" full size="lg" onClick={() => setStep(2)}>
                    Konfirmasi Pembayaran
                  </Btn>
                </div>
              </>
            )}
          </div>

          {/* RIGHT ORDER SUMMARY */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ backgroundColor: C.white, borderRadius: 12, border: '1px solid ' + C.border, padding: '26px' }}>
              <h3 style={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 15,
                color: C.text, marginBottom: 20 }}>Ringkasan Pesanan</h3>

              {/* Service row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
                paddingBottom: 20, borderBottom: '1px solid ' + C.borderLt }}>
                <SvcIcon svc={svc} size={44} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, fontFamily: C.fontBody }}>{svc.name}</div>
                  <div style={{ fontSize: 12, color: C.textMd, marginTop: 2, fontFamily: C.fontBody }}>{d.lbl} · 1 slot</div>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Harga normal',      value: fmt(svc.orig * d.m), line: true },
                  { label: 'Diskon via Ramean',  value: '- ' + fmt(svc.orig * d.m - d.p), green: true },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: C.textMd, fontFamily: C.fontBody }}>{row.label}</span>
                    <span style={{
                      textDecoration: row.line ? 'line-through' : 'none',
                      color: row.green ? C.ok : row.line ? C.textSm : C.text,
                      fontWeight: row.green ? 600 : 400, fontFamily: C.fontBody,
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Skema harga breakdown */}
              <div style={{ backgroundColor: C.bg, borderRadius: 8, padding: '12px 14px', marginBottom: 14, border: '1px solid ' + C.borderLt }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, fontFamily: C.fontBody, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Ramean Hitung Ini Untukmu
                </div>
                {[
                  { label: `Harga resmi / bulan`, value: fmt(svc.orig) },
                  { label: `Dibagi ${svc.slots} pengguna`, value: `÷ ${svc.slots}` },
                  { label: `Paket ${d.lbl} (${d.m} bln)`, value: fmt(d.p) },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
                    padding: '4px 0', borderTop: i > 0 ? '1px solid ' + C.borderLt : 'none' }}>
                    <span style={{ color: C.textMd, fontFamily: C.fontBody }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: i === 2 ? C.primary : C.text, fontFamily: C.fontBody }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ borderTop: '1px solid ' + C.border, paddingTop: 14, marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: C.fontBody }}>Total Bayar</span>
                <span style={{ fontWeight: 800, fontSize: 20, color: C.primary, fontFamily: C.fontHeading }}>{fmt(d.p)}</span>
              </div>

              {/* Savings badge */}
              <div style={{ backgroundColor: C.okBg, borderRadius: 8, padding: '10px 14px' }}>
                <span style={{ fontSize: 12, color: C.ok, fontWeight: 600, lineHeight: 1.5, fontFamily: C.fontBody }}>
                  Kamu hemat {fmt(svc.orig * d.m - d.p)} dari harga normal!
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CheckoutPage });
