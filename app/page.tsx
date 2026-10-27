import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquees from "@/components/Marquees";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Packs from "@/components/Packs";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Motion from "@/components/Motion";

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">Aller au contenu</a>
      <div className="grain" aria-hidden="true" />
      <Loader />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquees />
        <About />
        <Services />
        <Work />
        <Process />
        <Packs />
        <Partners />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <div className="footer-wrap"><Footer /></div>
      <BackToTop />
      <Motion />
    </>
  );
}
