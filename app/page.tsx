import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Audience from "@/components/Audience";
import Pillars from "@/components/Pillars";
import Experience from "@/components/Experience";
import Manifest from "@/components/Manifest";
import Community from "@/components/Community";
import JoinForm from "@/components/JoinForm";
import Support from "@/components/Support";
import Footer from "@/components/Footer";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nowa Era",
  alternateName: "New Age Life",
  url: "https://newage.life",
  description:
    "Przestrzeń dla świadomych ludzi, którzy chcą rozwijać się duchowo, budować dobrostan i tworzyć wspólnotę opartą na obecności, wsparciu i głębszym sensie.",
  slogan: "Nowa Era Świadomych Ludzi",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>
        <Hero />
        <Mission />
        <Audience />
        <Pillars />
        <Experience />
        <Manifest />
        <Community />
        <JoinForm />
        <Support />
      </main>
      <Footer />
    </>
  );
}
