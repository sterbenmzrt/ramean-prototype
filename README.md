# Ramean

Platform patungan langganan digital dengan jaminan escrow. Pengguna dapat bergabung
ke grup patungan layanan seperti Netflix, YouTube Premium, ChatGPT Plus, Gemini
Advanced, dan Canva Pro. Dana ditahan oleh sistem (escrow) sampai akses akun dirilis.

Proyek ini adalah MVP: alur lengkap dari registrasi sampai masuk lobby grup, beserta
panel admin untuk mengelola grup, transaksi, dan rilis/refund escrow. Pembayaran masih
disimulasikan (mock), belum terhubung ke payment gateway nyata.

## Tech Stack

- Next.js 14 (App Router) dengan API routes
- Prisma ORM + SQLite
- NextAuth.js (Credentials dan Google)
- Tailwind CSS
- Vitest untuk pengujian

## Prasyarat

- Node.js versi 18 atau lebih baru (dikembangkan dengan Node 22)
- npm

## Menjalankan di Lokal

Langkah berikut diasumsikan dijalankan dari folder root proyek setelah `git clone`.

### 1. Install dependency

```bash
npm install
```

### 2. Siapkan file environment

Salin `.env.example` menjadi `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Lalu isi nilainya. Dua nilai berikut wajib dibuat acak. Hasilkan dengan perintah ini
(butuh Node.js, tidak perlu OpenSSL):

```bash
# NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# CREDENTIAL_ENC_KEY (harus 32 byte, format base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Isi `.env` minimal seperti ini:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<hasil perintah di atas>"
CREDENTIAL_ENC_KEY="<hasil perintah di atas>"
```

Catatan:
- `CREDENTIAL_ENC_KEY` dipakai untuk enkripsi kredensial akun bersama. Tanpa nilai ini,
  fitur akses akun di lobby akan error.
- `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` opsional. Login Google hanya berfungsi
  bila keduanya diisi; login email/password tetap jalan tanpa keduanya.

### 3. Siapkan database

Perintah berikut membuat database SQLite, menjalankan migrasi, dan mengisi data awal
(layanan, grup kosong, dan akun demo):

```bash
npx prisma migrate dev
npm run db:seed
```

### 4. Jalankan aplikasi

```bash
npm run dev
```

Aplikasi berjalan di http://localhost:3000.

## Akun Demo

Akun berikut dibuat oleh seed:

| Peran            | Email             | Password      | Keterangan              |
|------------------|-------------------|---------------|-------------------------|
| Pengguna         | demo@ramean.id    | password123   | Saldo Rp50.000          |
| Pengguna         | hemat@ramean.id   | password123   | Saldo Rp5.000 (uji saldo kurang) |
| Admin            | admin@ramean.id   | admin123      | Akses panel `/admin`    |

Panel admin tersedia di http://localhost:3000/admin.

## Alur Demo Singkat

1. Login sebagai `demo@ramean.id`, buka marketplace, pilih sebuah layanan.
2. Bergabung ke grup dan selesaikan checkout dengan Saldo Ramean. Dana masuk status
   escrow (HELD).
3. Login sebagai `admin@ramean.id`, buka panel admin, isi kredensial grup, lalu rilis
   escrow untuk anggota tersebut.
4. Kembali sebagai `demo@ramean.id`, buka lobby grup. Setelah escrow dirilis, kredensial
   akun akan tampil.

## Perintah Lain

```bash
npm run build      # build produksi
npm run start      # menjalankan hasil build
npm test           # menjalankan pengujian (Vitest)
npm run db:reset    # reset database dan isi ulang seed
```

## Catatan

- Pembayaran disimulasikan. Metode selain Saldo Ramean bersifat demo dan tidak memproses
  transaksi nyata.
- Database SQLite (`prisma/dev.db`) dan database pengujian (`test.db`) tidak ikut
  di-commit; keduanya dibuat secara lokal lewat langkah di atas.
