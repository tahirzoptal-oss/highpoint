import Hero from '../components/Hero';
import BeltSlider from '../components/BeltSlider';
import LeadFormBanner from '../components/LeadFormBanner';
import LogoSlider from '../components/LogoSlider';
import Testimonials from '../components/Testimonials';
import Founder from '../components/Founder';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import OurWork from '../components/OurWork';
import OurProcess from '../components/OurProcess';
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
      <LeadFormBanner />
      <LogoSlider />
      <Testimonials />
      <BeltSlider />
      <Founder />
      <BeltSlider />
      <Services />
      <BeltSlider />
      <WhyChooseUs />
      <OurWork />
      <OurProcess />
      <Blog />
      <CTABanner />
      <FAQ />
      <ServiceAreas />
    </>
  );
}
