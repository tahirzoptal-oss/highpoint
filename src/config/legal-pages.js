import { brandDNA } from './brand-dna';

/**
 * Legal page copy — Privacy Policy and Terms & Conditions.
 *
 * Written against what this site actually does, not a boilerplate template:
 * the only data collected is what a visitor types into a lead form (see
 * src/lib/leadForm.js), the site sets no analytics or advertising cookies, and
 * the only embedded third parties are Google Maps and Google Fonts. Company
 * name, address, phone, email and state all come from brand-dna, so a data
 * refresh keeps these pages accurate.
 *
 * Each section is { heading, body }, where body is the same copy-deck markdown
 * the rest of the site renders (## and ### headings, - bullets, 1. numbers,
 * **bold**, [links](/path)).
 */

const co = brandDNA.company.name;
const { phone, email } = brandDNA.contact;
const address = brandDNA.address.full;
const state = brandDNA.address.state === 'WA' ? 'Washington' : brandDNA.address.state;
const site = String(brandDNA.company.url || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');

// The month these pages were authored. Update when the copy changes.
export const LEGAL_LAST_UPDATED = 'July 2026';

export const PRIVACY_SECTIONS = [
  {
    heading: 'Information We Collect',
    body: [
      `${co} only collects information you choose to give us. We do not ask you to create an account, and we do not buy personal information from third parties.`,
      '',
      '### Information you provide',
      '',
      'When you submit a quote request, contact form, or estimate request on this website, we collect the details you enter in those fields:',
      '',
      '- Your name',
      '- Your phone number',
      '- Your email address',
      '- The property address for the work, when you provide it',
      '- The service you are interested in',
      '- Any message or project details you write',
      '',
      '### Information collected automatically',
      '',
      'Like most websites, our hosting provider records basic technical information when a page is served, such as your IP address, browser type, and the pages you request. This information is used to keep the site running and secure. We do not use it to build a profile of you.',
    ].join('\n'),
  },
  {
    heading: 'How We Use Your Information',
    body: [
      'We use the information you submit for one purpose: to respond to you about roofing and renovation work. Specifically, we use it to:',
      '',
      '- Contact you about the estimate, inspection, or question you submitted',
      '- Prepare and discuss a quote for the work you asked about',
      '- Schedule and carry out work you authorise',
      '- Keep a record of the project and our communication with you',
      '- Meet our legal, insurance, and tax obligations',
      '',
      '**We do not sell, rent, or trade your personal information.** We do not use your details to send marketing you did not ask for, and we do not share your information with third parties for their own marketing.',
    ].join('\n'),
  },
  {
    heading: 'Cookies and Tracking Technologies',
    body: [
      `This website does not set advertising cookies and does not run third-party analytics or advertising trackers of its own.`,
      '',
      'Some cookies may be set by the third-party content embedded on our pages, most notably the Google Maps embed on our contact and service-area pages. Those cookies are set by Google, not by us, and are governed by Google\'s own privacy policy.',
      '',
      'You can block or delete cookies in your browser settings at any time. Blocking cookies may stop the embedded map from displaying correctly, but the rest of the site will continue to work.',
    ].join('\n'),
  },
  {
    heading: 'Third-Party Services',
    body: [
      'We use a small number of third-party services to run this website. Each one only receives the information it needs to do its job:',
      '',
      '- **Website hosting.** Our host stores and serves the pages of this site and keeps standard server logs.',
      '- **Google Maps.** Our contact and service-area pages embed a Google map. Loading a page with a map connects your browser to Google.',
      '- **Google Fonts.** Typefaces on this site are served by Google Fonts, which means your browser connects to Google to download them.',
      '- **Email and phone.** When you submit a form or call us, your enquiry reaches us through our email and telephone providers.',
      '',
      'We are not responsible for the privacy practices of these companies. We encourage you to read their privacy policies if you would like to know how they handle data.',
    ].join('\n'),
  },
  {
    heading: 'Data Security',
    body: [
      'This website is served over an encrypted HTTPS connection, so information you submit through a form is encrypted in transit.',
      '',
      'We limit access to enquiry and customer information to the people who need it to quote, schedule, or complete your work, and we keep it only as long as we need it for the project and for our legal and accounting obligations.',
      '',
      'No method of transmitting or storing information is completely secure. We take reasonable steps to protect your information, but we cannot guarantee absolute security. Please do not send sensitive information such as payment card numbers, bank details, or identification numbers through the forms on this website.',
    ].join('\n'),
  },
  {
    heading: 'Your Rights',
    body: [
      'You are in control of the information you give us. At any time you may:',
      '',
      '- Ask what personal information we hold about you',
      '- Ask us to correct information that is wrong or out of date',
      '- Ask us to delete your enquiry details, where we are not required to keep them',
      '- Ask us to stop contacting you',
      '',
      `To make any of these requests, email us at [${email}](mailto:${email}) or call ${phone}. We will respond as promptly as we can. We may need to confirm your identity before acting on a request, and we may need to keep certain records where the law requires it.`,
      '',
      'This website is intended for adults. We do not knowingly collect information from children.',
    ].join('\n'),
  },
  {
    heading: 'Contact Information',
    body: [
      'If you have a question about this policy or about how we handle your information, please get in touch:',
      '',
      `- **${co}**`,
      `- ${address}`,
      `- Phone: [${phone}](tel:${brandDNA.contact.phoneTelLink})`,
      `- Email: [${email}](mailto:${email})`,
      '',
      'You can also reach us through our [contact page](/contact).',
    ].join('\n'),
  },
  {
    heading: 'Policy Updates',
    body: [
      'We may update this policy from time to time, for example if we add a new service to the website or change how enquiries are handled. When we do, we will revise the "last updated" date at the top of this page.',
      '',
      'Continuing to use the website after an update means you accept the revised policy. We encourage you to check this page occasionally so you know where you stand.',
    ].join('\n'),
  },
];

export const TERMS_SECTIONS = [
  {
    heading: 'Website Usage',
    body: [
      `These terms apply to your use of ${site || 'this website'}, operated by ${co}. By browsing the site or submitting a form, you agree to them. If you do not agree, please do not use the site.`,
      '',
      'You agree to use this website only for lawful purposes and in a way that does not restrict anyone else\'s use of it. In particular, you agree not to:',
      '',
      '- Submit false, misleading, or fraudulent information through our forms',
      '- Attempt to gain unauthorised access to the site or any system behind it',
      '- Use automated tools to scrape, copy, or overload the site',
      '- Introduce malicious code or otherwise interfere with the site\'s operation',
      '',
      'We may change, suspend, or withdraw any part of this website at any time without notice.',
    ].join('\n'),
  },
  {
    heading: 'Services',
    body: [
      `${co} provides roofing and renovation services in ${brandDNA.company.serviceRegion || `${state}`}. The service descriptions on this website are general information about the work we do. They are not an offer, a contract, or a promise that a particular scope of work is right for your property.`,
      '',
      'The work we actually carry out for you, its scope, its price, and its schedule are set out in the written estimate and any agreement you sign with us. Where anything on this website conflicts with that written agreement, the written agreement governs.',
      '',
      'Submitting a form on this website does not create a contract or reserve a place in our schedule. It starts a conversation. We will contact you to arrange an inspection and discuss the work.',
    ].join('\n'),
  },
  {
    heading: 'Quotes and Estimates',
    body: [
      'Requests submitted through this website are requests for an estimate, not bookings.',
      '',
      '- Every estimate follows an inspection of your property. We do not price roofing work sight unseen.',
      '- An estimate is based on the conditions we can see and access at the time of inspection. Conditions found once work begins (damaged decking, concealed water damage, or similar) may change the scope and price, and we will discuss any such change with you before proceeding.',
      '- Estimates are valid for the period stated on the estimate itself. Material prices and availability can change.',
      '- Any timeline we discuss is an estimate. Weather, material lead times, permit processing, and access can all affect scheduling.',
      '',
      'Where insurance is involved, we can inspect and document roofing conditions and provide an estimate, but coverage and claim decisions are made by your insurance carrier, not by us.',
    ].join('\n'),
  },
  {
    heading: 'Limitation of Liability',
    body: [
      'The content on this website is provided for general information. We work to keep it accurate and current, but we do not warrant that it is complete, error-free, or suitable for your particular property or situation. Nothing on this website is a substitute for a professional inspection.',
      '',
      'To the fullest extent permitted by law, ' + co + ' is not liable for any indirect, incidental, or consequential loss arising from your use of this website, from any inability to use it, or from reliance on information published on it.',
      '',
      'Nothing in these terms limits or excludes any liability that cannot be limited or excluded under applicable law, and nothing here affects your rights under any written agreement for work we carry out for you.',
    ].join('\n'),
  },
  {
    heading: 'Intellectual Property',
    body: [
      `All content on this website, including text, photographs of our completed work, logos, graphics, and page design, is owned by ${co} or used with permission, and is protected by copyright and trademark law.`,
      '',
      'You may view this website and print or download pages for your own personal, non-commercial use in considering our services. You may not:',
      '',
      '- Republish, sell, or redistribute our content',
      '- Copy our project photographs or written content for another business',
      '- Use our name or logo without our written permission',
      '',
      'If you would like to use any of our content, please ask us first.',
    ].join('\n'),
  },
  {
    heading: 'External Links',
    body: [
      'This website contains links to third-party websites and embedded third-party content, such as our social media profiles, our Google listing, and Google Maps.',
      '',
      'Those sites are not under our control. We provide the links for convenience, and including one does not mean we endorse the site or everything on it. We are not responsible for the content, accuracy, or privacy practices of any third-party website. Visiting them is at your own risk and subject to their terms.',
    ].join('\n'),
  },
  {
    heading: 'Governing Law',
    body: [
      `These terms are governed by the laws of the State of ${state}, without regard to its conflict-of-law rules. Any dispute arising out of these terms or your use of this website will be handled in the courts of the State of ${state}.`,
      '',
      'If any part of these terms is found to be unenforceable, the remaining parts continue to apply.',
      '',
      'We may update these terms from time to time. The version published on this page is the version that applies, and the "last updated" date at the top of the page tells you when it last changed.',
    ].join('\n'),
  },
  {
    heading: 'Contact Information',
    body: [
      'If you have a question about these terms, please get in touch:',
      '',
      `- **${co}**`,
      `- ${address}`,
      `- Phone: [${phone}](tel:${brandDNA.contact.phoneTelLink})`,
      `- Email: [${email}](mailto:${email})`,
      '',
      'You can also reach us through our [contact page](/contact).',
    ].join('\n'),
  },
];
