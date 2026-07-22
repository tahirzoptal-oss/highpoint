import LegalPage from '../components/LegalPage';
import { PRIVACY_SECTIONS } from '../config/legal-pages';
import { brandDNA } from '../config/brand-dna';

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      intro={`This policy explains what information ${brandDNA.company.name} collects through this website, why we collect it, who else can see it, and what you can ask us to do with it. We have kept it in plain language on purpose.`}
      sections={PRIVACY_SECTIONS}
    />
  );
}
