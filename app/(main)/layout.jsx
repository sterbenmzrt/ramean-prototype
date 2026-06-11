import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

// Layout dengan chrome (NavBar + Footer) untuk halaman utama.
// Halaman auth (/login, /register) sengaja di luar grup ini = tanpa chrome.
export default function MainLayout({ children }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[300] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Lewati ke konten
      </a>
      <NavBar />
      <main id="main" className="page-anim">{children}</main>
      <Footer />
    </>
  );
}
