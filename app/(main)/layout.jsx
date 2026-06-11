import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

// Layout dengan chrome (NavBar + Footer) untuk halaman utama.
// Halaman auth (/login, /register) sengaja di luar grup ini = tanpa chrome.
export default function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="page-anim">{children}</div>
      <Footer />
    </>
  );
}
