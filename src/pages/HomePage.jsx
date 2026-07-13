import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Reviews from '../components/Reviews';
import Founder from '../components/Founder';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import OurWork from '../components/OurWork';
import OurProcess from '../components/OurProcess';
import SpecialOffers from '../components/SpecialOffers';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import ServiceAreas from '../components/ServiceAreas';
import CTABanner from '../components/CTABanner';
import SEO from '../components/SEO';
import { buildLocalBusiness, buildFAQ } from '../lib/schema';

export default function HomePage() {
  return (
    <>
      <SEO path="/" jsonLd={[buildLocalBusiness(), buildFAQ()].filter(Boolean)} />
      <Hero />
      <TrustStrip />
      <Reviews />
      <Founder />
      <Services />
      <WhyChooseUs />
      <OurWork />
      <OurProcess />
      <SpecialOffers />
      <Blog />
      <FAQ />
      <ServiceAreas />
      <CTABanner />
    </>
  );
}
