import LegalPage from '../components/LegalPage';
import { TERMS_SECTIONS } from '../config/legal-pages';
import { brandDNA } from '../config/brand-dna';

export default function TermsConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      path="/terms-conditions"
      intro={`These terms cover the use of this website and the information published on it. Work that ${brandDNA.company.name} carries out for you is governed by the written estimate and agreement you sign, which always takes precedence over anything here.`}
      sections={TERMS_SECTIONS}
    />
  );
}
