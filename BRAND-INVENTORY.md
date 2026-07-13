# Capstone Roofing Brand DNA Inventory

## index.html

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 7 | meta title | Capstone Contracting Solutions \| #1 Roofing Contractor Kansas City, MO | brandDNA.meta.title |
| 8 | meta description | Family-owned roofing contractor in Kansas City. Roof repair, replacement, storm damage, and insurance claims. Licensed, insured, owner on-site every job. Free estimate — we call you back in 5 minutes. | brandDNA.meta.description |
| 15 | ld+json name | Capstone Contracting Solutions | brandDNA.company.legalName |
| 16 | ld+json url | https://www.roofsbycapstone.com | brandDNA.company.url |
| 17 | ld+json telephone | +18167211111 | brandDNA.contact.phone |
| 18 | ld+json email | info@roofsbycapstone.com | brandDNA.contact.email |
| 21 | ld+json street | 915 NW High View Dr | brandDNA.address.street |
| 22 | ld+json city | Grain Valley | brandDNA.address.city |
| 23 | ld+json region | MO | brandDNA.address.state |
| 24 | ld+json postalCode | 64029 | brandDNA.address.zip |
| 29 | ld+json latitude | 39.0131 | brandDNA.address.lat |
| 30 | ld+json longitude | -94.2024 | brandDNA.address.lng |
| 36-37 | ld+json hours weekday | Monday-Friday 07:00-19:00 | brandDNA.hours.weekday |
| 41-43 | ld+json hours saturday | Saturday 08:00-17:00 | brandDNA.hours.saturday |
| 48-49 | ld+json rating | 5.0 / 85 reviews | brandDNA.reviews.rating |
| 53 | ld+json description | Family-owned roofing contractor serving Greater Kansas City... | brandDNA.company.description |
| 54 | ld+json areaServed | Greater Kansas City, Missouri | brandDNA.company.serviceRegion |
| 56 | ld+json image | https://www.roofsbycapstone.com/hero-image.png | brandDNA.assets.heroImage |
| 58 | ld+json founder | Eric Saettone | brandDNA.team.founders[0] |
| 59 | ld+json founder | Bekka Saettone | brandDNA.team.founders[1] |

---

## src/components/Hero.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 33 | img alt | Capstone Roofing, Kansas City roofing contractor | brandDNA.assets.hero.alt |
| 53 | eyebrow copy | BUILT ON STRENGTH. BACKED BY INTEGRITY. | brandDNA.copy.hero.eyebrow |
| 60-61 | h1 headline | THE FINAL CONTRACTOR YOU'LL EVER NEED. | brandDNA.copy.hero.headline |
| 68 | subheadline | Roofing, restoration, and exterior solutions built to protect what matters most. | brandDNA.copy.hero.subheadline |
| 74 | google maps url | https://www.google.com/maps?q=Capstone+Contracting+Solutions+Grain+Valley+MO | brandDNA.contact.googleMapsUrl |
| 88 | rating badge | 5.0 | brandDNA.reviews.rating |
| 90 | review count | (47) | brandDNA.reviews.googleCount |
| 92 | review source | Google Reviews | brandDNA.reviews.googleLabel |
| 97 | facebook url | https://www.facebook.com/CapstoneContractingKC | brandDNA.social.facebook |
| 108 | rating badge | 5.0 | brandDNA.reviews.rating |
| 110 | review count | (38) | brandDNA.reviews.facebookCount |
| 112 | review source | Facebook Reviews | brandDNA.reviews.facebookLabel |
| 120-123 | trust claims | Same-Day Response Available, Insurance Claims Handled, Owner On-Site Every Job, 100% Satisfaction Guarantee | brandDNA.copy.trustClaims |
| 151 | form header | GET MY FREE ESTIMATE | brandDNA.copy.formHeader |
| 153 | form subtext | We call you back in 5 minutes! | brandDNA.copy.formSubtext |
| 179-184 | service options | Roof Repair, Roof Replacement, Storm Damage Restoration, Insurance Claims Assistance, Emergency Roofing, Roof Inspection | brandDNA.services.list |
| 202 | button text | GET MY FREE ESTIMATE → | brandDNA.copy.buttonText |

---

## src/components/Services.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 5,13,21,29,37,45,53,61,69,77,85,93 | service labels | ROOF REPAIR, ROOF REPLACEMENT, NEW ROOF INSTALLATION, EMERGENCY ROOFING, ROOF INSPECTIONS, HISTORICAL ROOF RESTORATION, STORM DAMAGE REPAIR, INSURANCE CLAIMS ASSISTANCE, SIDING, GUTTERS, WINDOWS, METAL ROOFING | brandDNA.services.list |
| 110 | img src | /work/gemini2.png | brandDNA.assets.services.mobile |
| 125 | img src | /work/gemini2.png | brandDNA.assets.services.desktop |
| 138 | logo src | /capstone-logo.svg | brandDNA.assets.logo |
| 141 | section label | OUR SERVICES | brandDNA.copy.services.label |
| 144-146 | section heading | COMPLETE EXTERIOR SOLUTIONS FOR LASTING PROTECTION. | brandDNA.copy.services.heading |
| 150 | section body | From roof replacement and storm damage restoration to gutters, siding, and windows. Capstone handles every exterior need your home has, managed directly by the owners. | brandDNA.copy.services.body |

---

## src/components/Reviews.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 6 | review author | Sarah M. | brandDNA.reviews.items[0].author |
| 7 | review source | Google Reviews | brandDNA.reviews.items[0].source |
| 8 | review text | Bekka and her team were absolutely wonderful... | brandDNA.reviews.items[0].text |
| 12 | review author | James T. | brandDNA.reviews.items[1].author |
| 14 | review text | After the hail storm hit... | brandDNA.reviews.items[1].text |
| 18 | review author | Linda K. | brandDNA.reviews.items[2].author |
| 19 | review source | Facebook Reviews | brandDNA.reviews.items[2].source |
| 20 | review text | We had three other quotes but Bekka... | brandDNA.reviews.items[2].text |
| 24 | review author | David R. | brandDNA.reviews.items[3].author |
| 26 | review text | From start to finish, Capstone delivered... | brandDNA.reviews.items[3].text |
| 30 | review author | Michelle W. | brandDNA.reviews.items[4].author |
| 32 | review text | Capstone replaced our entire roof... | brandDNA.reviews.items[4].text |
| 36 | review author | Tom & Karen B. | brandDNA.reviews.items[5].author |
| 38 | review text | We are repeat customers and Capstone continues... | brandDNA.reviews.items[5].text |
| 125 | section label | REVIEWS | brandDNA.copy.reviews.label |
| 126-128 | section heading | REAL REVIEWS FROM REAL NEIGHBORS JUST LIKE YOU | brandDNA.copy.reviews.heading |
| 131-135 | section body | When you hire a roofing contractor in Kansas City... | brandDNA.copy.reviews.body |
| 143 | summary text | Rated 5.0 Stars Across 85+ Reviews on Google & Facebook | brandDNA.copy.reviews.summary |
| 207 | google maps link | https://www.google.com/maps?q=Capstone+Contracting+Solutions+Grain+Valley+MO | brandDNA.contact.googleMapsUrl |
| 217 | facebook reviews link | https://www.facebook.com/CapstoneContractingKC/reviews | brandDNA.social.facebookReviews |

---

## src/components/Founder.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 14 | accent label | ABOUT CAPSTONE SOLUTIONS | brandDNA.copy.founder.label |
| 16-17 | heading | RAISING THE STANDARD IN EXTERIOR SOLUTIONS. | brandDNA.copy.founder.heading |
| 21 | body para 1 | At Capstone Solutions, we don't just build roofs, we build trust. Woman-owned and led by Bekka Saettone, Capstone was founded on the belief that integrity and quality are not optional. Every homeowner deserves honesty, clarity, and a contractor who shows up. | brandDNA.copy.founder.para1 |
| 24 | body para 2 | Bekka Saettone leads every aspect of the business as CEO... | brandDNA.copy.founder.para2 |
| 41-42 | founder photo | /owner.webp | brandDNA.assets.founderPhoto |
| 42 | founder photo alt | Bekka Saettone, Founder of Capstone Contracting Solutions | brandDNA.assets.founderPhotoAlt |
| 50 | founder name | BEKKA SAETTONE | brandDNA.team.founder.name |
| 51 | founder title | Founder & CEO, Capstone Contracting Solutions | brandDNA.team.founder.title |
| 66 | experience stat | 10+ | brandDNA.team.founder.yearsExp |
| 67-68 | experience label | YEARS OF EXPERIENCE YOU CAN COUNT ON | brandDNA.team.founder.expLabel |
| 99 | vision label | VISION | brandDNA.copy.founder.visionLabel |
| 102-104 | vision text | To be the most trusted residential and exterior construction company in Greater Missouri. A brand homeowners call first and recommend without hesitation, built on integrity, quality, and long-term relationships. | brandDNA.copy.founder.vision |
| 126 | mission label | MISSION | brandDNA.copy.founder.missionLabel |
| 129-132 | mission text | To do it right and lead with integrity. Every project is owner-managed from inspection to final walkthrough, delivering honest assessments, expert craftsmanship, and the clarity every homeowner deserves. | brandDNA.copy.founder.mission |

---

## src/components/FAQ.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 5 | faq q | HOW FAST CAN YOU COMPLETE A ROOFING PROJECT IN KANSAS CITY? | brandDNA.faq.items[0].q |
| 6 | faq a | Most residential roof replacements in Kansas City can be completed in a single day... | brandDNA.faq.items[0].a |
| 9 | faq q | DO YOU OFFER ROOFING FINANCING IN KANSAS CITY, MO? | brandDNA.faq.items[1].q |
| 10 | faq a | Yes. We offer convenient financing... | brandDNA.faq.items[1].a |
| 13 | faq q | WHAT AREAS DOES CAPSTONE CONTRACTING SOLUTIONS SERVICE? | brandDNA.faq.items[2].q |
| 14 | faq a | We proudly serve the Kansas City Metro Area... | brandDNA.faq.items[2].a |
| 17 | faq q | WHAT ARE THE SIGNS I NEED A ROOF REPAIR IN KANSAS CITY? | brandDNA.faq.items[3].q |
| 18 | faq a | Watch for missing or curling shingles... | brandDNA.faq.items[3].a |
| 21 | faq q | DO YOU HELP WITH INSURANCE CLAIMS AFTER STORM DAMAGE? | brandDNA.faq.items[4].q |
| 22 | faq a | Absolutely. Insurance claims assistance is one of our specialties... | brandDNA.faq.items[4].a |
| 25 | faq q | IS IT BETTER TO REPAIR OR REPLACE MY ROOF IN MISSOURI? | brandDNA.faq.items[5].q |
| 26 | faq a | It depends on the age and extent of damage... | brandDNA.faq.items[5].a |
| 29 | faq q | CAN A NEW ROOF IMPROVE MY HOME'S VALUE IN KANSAS CITY? | brandDNA.faq.items[6].q |
| 30 | faq a | Absolutely. A new roof is one of the highest ROI home improvements... | brandDNA.faq.items[6].a |
| 59 | logo alt | Capstone Solutions | brandDNA.assets.logo |
| 65 | label | GOT QUESTIONS? | brandDNA.copy.faq.label |
| 67-69 | heading | FREQUENTLY ASKED QUESTIONS | brandDNA.copy.faq.heading |

---

## src/components/OurProcess.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 4-7 | process steps | 1. Contact Us by Call, Form, or Referral, 2. Free Inspection, Photo Documentation & Insurance Guidance, 3. Detailed Estimate, Material Selection & Scheduling, 4. Professional Installation, Final Walkthrough & Warranty Docs | brandDNA.process.steps |
| 18 | alt text | Capstone crew completing a roof installation in Kansas City | brandDNA.assets.process.alt |
| 18,32 | img src | /work/project2.jpg | brandDNA.assets.process.image |
| 42 | badge text | 4-Step Roofing Process | brandDNA.copy.process.badgeText |
| 43 | badge subtext | Transparent. Owner-Managed. No Surprises. | brandDNA.copy.process.badgeSubtext |
| 49-50 | label/heading | OUR PROCESS / SIMPLE. TRANSPARENT. | brandDNA.copy.process.label / heading |
| 57 | body text | From your first call to warranty documentation, you will always know exactly where your project stands, handled directly by Bekka and her team, start to finish. | brandDNA.copy.process.body |
| 92 | button text | GET MY FREE ESTIMATE → | brandDNA.copy.buttonText |

---

## src/components/SpecialOffers.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 3,11,19 | offer labels | FIRST RESPONDERS, EDUCATORS, MILITARY & VETERANS | brandDNA.offers.categories |
| 45-46 | label/heading | SPECIAL OFFERS / MAKING QUALITY ROOFING MORE ACCESSIBLE | brandDNA.copy.offers.label / heading |
| 52-54 | body text | We believe every homeowner deserves quality roofing without financial stress. As a family-owned company, we proudly offer a $100 service discount for: | brandDNA.copy.offers.body |
| 74 | offer detail | Plus, take advantage of convenient financing... | brandDNA.copy.offers.detail |

---

## src/components/WhyChooseUs.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 4-5,13-14,21-22,29-30,37-38,45-46 | reasons | Free Roof Inspection & Same-Day Estimates, Owner-Managed From Start to Finish, Insurance Claims Specialists, Financing Through Trusted Lenders, $100 Discount for First Responders & Educators, 5-Star Rated on Google and Facebook | brandDNA.whyChoose.reasons |
| 71 | img src | /work/gemini3.png | brandDNA.assets.whyChoose.mobile |
| 114 | img src | /work/gemini3.png | brandDNA.assets.whyChoose.desktop |
| 83-84 | label/heading | WHY CAPSTONE / WHY MORE HOMEOWNERS CHOOSE CAPSTONE | brandDNA.copy.whyChoose.label / heading |
| 90-91 | body text | Not all roofing companies are created equal. Capstone Contracting Solutions is woman-owned and every project is personally managed by Bekka Saettone. When you hire us, you are working directly with the owner from day one. | brandDNA.copy.whyChoose.body |

---

## src/components/Blog.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 3,4,11,12,18,19 | blog image | /work/project1.jpg, /work/project3.jpg, /work/gemini1.png | brandDNA.assets.blog.images |
| 5-7,11-14,20-21 | blog post data | April 2026, in the Community, title, excerpt | brandDNA.blog.items[n].date/source/title/excerpt |
| 42-43 | label/heading | FROM THE ROOFTOP / EXPERT TIPS AND HOMEOWNER INSIGHTS | brandDNA.copy.blog.label / heading |
| 52-54 | body text | We don't just fix roofs, we educate and empower our customers... | brandDNA.copy.blog.body |

---

## src/components/OurWork.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 4-14 | project gallery | /work/action-video.mp4, /work/action1.jpg through /work/project6.jpg | brandDNA.assets.gallery.projects |
| 67 | label | OUR WORK | brandDNA.copy.gallery.label |
| 68-69 | heading | SEE THE DIFFERENCE IN EVERY SHINGLE | brandDNA.copy.gallery.heading |
| 72-73 | body text | Real projects completed across Kansas City, Blue Springs, Lee's Summit, and Greater Missouri. Results speak louder than promises. | brandDNA.copy.gallery.body |

---

## src/components/ServiceAreas.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 2-7 | service areas | KANSAS CITY, BLUE SPRINGS, INDEPENDENCE, LEE'S SUMMIT, GRAIN VALLEY, OAK GROVE, RAYTOWN, GRANDVIEW, BELTON, RAYMORE, LIBERTY, GLADSTONE, NORTH KANSAS CITY, PLEASANT HILL, HARRISONVILLE, ST. LOUIS, CHESTERFIELD, ST. CHARLES | brandDNA.serviceAreas.cities |
| 23-24 | label/heading | SERVICE AREAS / PROUDLY SERVING GREATER MISSOURI | brandDNA.copy.serviceAreas.label / heading |
| 30-31 | body text | Whether you are in Kansas City or the St. Louis metro, our team is ready to help. We proudly serve 20+ communities across Missouri, bringing peace of mind to homeowners throughout the state. | brandDNA.copy.serviceAreas.body |
| 49-50 | maps embed title/url | Capstone Contracting Solutions - 915 NW High View Dr, Grain Valley, MO / https://maps.google.com/maps?q=915+NW+High+View+Dr,+Grain+Valley,+MO+64029... | brandDNA.contact.address / mapsUrl |

---

## src/components/CTABanner.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 29 | logo src | /capstone-logo.svg | brandDNA.assets.logo |
| 30-31 | label/heading | GET STARTED TODAY / READY TO GET STARTED? | brandDNA.copy.cta.label / heading |
| 37-40 | body text | The best time to fix your roof is before the next Kansas City storm hits... | brandDNA.copy.cta.body |
| 57-60 | form header/subtext | GET MY FREE ESTIMATE / We call you back in 5 minutes! | brandDNA.copy.formHeader / formSubtext |
| 84-90 | service options | How Can We Help?, Roof Repair, Roof Replacement, Storm Damage Restoration, Insurance Claims Assistance, Emergency Roofing, Roof Inspection | brandDNA.services.list |
| 98 | button text | GET MY FREE ESTIMATE → | brandDNA.copy.buttonText |

---

## src/components/TrustStrip.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 2-5 | trust claims | Insurance Claim Experts, Premium Quality Materials, Experienced Professionals, Customer Focused | brandDNA.copy.trustClaims |
| 61,62,63,66,69,70 | badge filenames | /badges/tamko.png, /badges/owens-corning.jpg, /badges/owens-corning-platinum.png, /badges/certainteed.png, /badges/trust-badge-1.png, /badges/trust-badge-2.png | brandDNA.assets.badges |

---

## src/components/Footer.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 62 | logo src | /capstone-logo.svg | brandDNA.assets.logo |
| 64-65 | brand tagline | DO IT RIGHT. LEAD WITH INTEGRITY. WOMAN-OWNED. FAMILY-LED. THE LAST CONTRACTOR YOU'LL EVER NEED. | brandDNA.copy.tagline |
| 93 | section header | COMPANY | brandDNA.footer.sections.company |
| 107 | section header | SERVICES | brandDNA.footer.sections.services |
| 121-122 | section header/cta | GET IN TOUCH / NEED ROOFING HELP? CALL TODAY. | brandDNA.footer.contactLabel / contactCta |
| 126-127 | address | 915 NW High View Dr, Grain Valley, MO 64029 | brandDNA.address.full |
| 131-132 | phone link | (816) 721-1111 | brandDNA.contact.phone |
| 137-138 | email link | info@roofsbycapstone.com | brandDNA.contact.email |
| 150 | button text | GET MY FREE ESTIMATE | brandDNA.copy.buttonText |
| 165-166 | review stat | Google 5.0 ★ (47) | brandDNA.reviews.googleStat |
| 171 | review stat | Facebook 5.0 ★ (38) | brandDNA.reviews.facebookStat |
| 177 | license | License #BC757294 | brandDNA.company.licenseNumber |
| 186 | copyright | Copyright 2026 Capstone Contracting Solutions. All Rights Reserved. | brandDNA.copy.copyright |
| 189 | credit | King Contractor | brandDNA.credit.agency |

---

## src/components/TopBar.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 18 | cta text | Need roofing help? Call us now! | brandDNA.copy.topBar.cta |
| 19-20 | phone link | (816) 721-1111 | brandDNA.contact.phone |
| 24-25 | email link | info@roofsbycapstone.com | brandDNA.contact.email |
| 35 | button text | GET MY FREE ESTIMATE | brandDNA.copy.buttonText |

---

## src/pages/ContactPage.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 27-28 | hero image | /hero-image.png | brandDNA.assets.heroImage |
| 42 | page heading | CONTACT US | brandDNA.pages.contact.heading |
| 46 | intro text | Ready to get started? Reach out by phone, email, or fill out the form below. We get back to you same day. | brandDNA.pages.contact.intro |
| 59 | form heading | SEND US A MESSAGE | brandDNA.pages.contact.formHeading |
| 61-62 | form intro | Fill out the form below and a member of our team will contact you within 24 hours to schedule your free inspection. | brandDNA.pages.contact.formIntro |
| 85-97 | service options | Select a service..., Roof Repair, Roof Replacement, New Roof Installation, Storm Damage Restoration, Insurance Claims Assistance, Emergency Roofing, Roof Inspection, Siding, Gutters, Windows, Financing Inquiry, Other | brandDNA.services.list |
| 115 | button text | SEND MY MESSAGE → | brandDNA.copy.submitButton |
| 126 | contact card heading | CONTACT INFO | brandDNA.pages.contact.contactHeading |
| 136 | phone display | (816) 721-1111 | brandDNA.contact.phone |
| 147 | email display | info@roofsbycapstone.com | brandDNA.contact.email |
| 159 | address display | 915 NW High View Dr / Grain Valley, MO 64029 | brandDNA.address.street / city / state |
| 170-176 | hours display | Monday – Friday 7:00 AM – 7:00 PM, Saturday 8:00 AM – 5:00 PM, Sunday Emergency Calls Only | brandDNA.hours.full |
| 182 | emergency badge | 24/7 Emergency Roofing Available | brandDNA.copy.emergencyBadge |
| 188-189 | service area card | SERVING GREATER MISSOURI / Kansas City Metro & Surrounding Areas | brandDNA.copy.serviceAreaCard |

---

## src/pages/BlogPage.jsx

| Line | Field | Value | Replaces with |
|------|-------|-------|---------------|
| 6 | blog slug | how-to-tell-if-your-roof-needs-replacing | brandDNA.blog.posts[0].slug |
| 7-21 | blog post 1 | title, excerpt, date, category, readTime, image, featured, content | brandDNA.blog.posts[0].* |
| 27-43 | blog post 2 | Hail Damage: What Kansas City Homeowners... | brandDNA.blog.posts[1].* |
| 45-62 | blog post 3 | Choosing the Right Shingles... | brandDNA.blog.posts[2].* |
| 64-77 | blog post 4 | Complete Guide to Roof Insurance Claims... | brandDNA.blog.posts[3].* |
| 79-90 | blog post 5 | Gutters 101... | brandDNA.blog.posts[4].* |
| 92-103 | blog post 6 | Preparing Your Roof for Missouri Winter | brandDNA.blog.posts[5].* |
| 107 | categories | All, Roof Health, Storm Damage, Materials, Insurance, Gutters, Maintenance | brandDNA.blog.categories |
| 118-119 | hero image | /hero-image.png | brandDNA.assets.heroImage |
| 133-135 | page heading | KNOWLEDGE & ADVICE / ROOFING KNOWLEDGE & ADVICE | brandDNA.pages.blog.label / heading |
| 138-140 | intro text | Practical advice from the Capstone team... | brandDNA.pages.blog.intro |
| 150 | featured label | FEATURED POST | brandDNA.copy.blog.featuredLabel |

---

## Color Hex Codes (Inline Styles)

| Code | Usage | Replaces with |
|------|-------|---------------|
| #0F172A | Primary dark background (hero, footer sections) | brandDNA.colors.darkBg |
| #1E293B | Secondary dark background (cards, containers) | brandDNA.colors.cardBg |
| #C6A75E | Gold accent (buttons, headings, highlights) | brandDNA.colors.gold |
| #94A3BB | Light gray text (body copy, secondary) | brandDNA.colors.lightText |
| #64748B | Medium gray text (captions, tertiary) | brandDNA.colors.mediumText |
| rgba(198,167,94,*) | Gold with opacity variations | brandDNA.colors.goldRgba |
| rgba(100,116,139,*) | Gray with opacity variations | brandDNA.colors.grayRgba |

---

## Summary by Content Type

### Company & Legal
- Company name: "Capstone Contracting Solutions" (various forms: "Capstone Roofing", "Capstone Solutions")
- Phone: (816) 721-1111
- Email: info@roofsbycapstone.com
- Address: 915 NW High View Dr, Grain Valley, MO 64029
- License: BC757294
- Website: www.roofsbycapstone.com
- Founders: Bekka Saettone, Eric Saettone (wife-led, family company)

### Services (12 core services)
Roof Repair, Roof Replacement, New Roof Installation, Emergency Roofing, Roof Inspections, Historical Roof Restoration, Storm Damage Repair, Insurance Claims Assistance, Siding, Gutters, Windows, Metal Roofing

### Service Areas (18 cities + St. Louis metro)
Kansas City, Blue Springs, Independence, Lee's Summit, Grain Valley, Oak Grove, Raytown, Grandview, Belton, Raymore, Liberty, Gladstone, North Kansas City, Pleasant Hill, Harrisonville, St. Louis, Chesterfield, St. Charles

### Trust & Compliance Assets
- Badge files: /badges/tamko.png, /badges/owens-corning.jpg, /badges/owens-corning-platinum.png, /badges/certainteed.png, /badges/trust-badge-1.png, /badges/trust-badge-2.png
- Review stats: 5.0 rating / 47 Google reviews / 38 Facebook reviews / 85+ total

### Photo Gallery Sources (6 project image pools)
- Hero: /hero-image.png
- Projects: /work/project1.jpg through /work/project6.jpg
- Action footage: /work/action-video.mp4, /work/action1.jpg through /work/action4.jpg
- Generated imagery: /work/gemini1.png, /work/gemini2.png, /work/gemini3.png
- Owner photo: /owner.webp
- Logo: /capstone-logo.svg

### Hours
- Monday-Friday: 7:00 AM – 7:00 PM
- Saturday: 8:00 AM – 5:00 PM
- Sunday: Emergency Calls Only
- 24/7 Emergency Roofing Available

### Special Offers
- $100 discount for First Responders
- $100 discount for Educators
- $100 discount for Military & Veterans
- Financing options available through third-party partners

### Key Copy Themes
- Hero tagline: "THE FINAL CONTRACTOR YOU'LL EVER NEED"
- Trust pillar: "DO IT RIGHT. LEAD WITH INTEGRITY"
- Ownership: "Woman-owned", "Owner-managed", "Family-led"
- Differentiator: "Owner on-site every job"
- Process clarity: "Transparent. No surprises."
- Response time: "We call you back in 5 minutes"

---

## Fields Requiring Conversion

The following field types are hardcoded and will need parameterization:

1. **Typography**
   - Font stack: font-heading, font-body (defined in Tailwind config)
   - All heading copies (h1, h2, h3)
   - All body copy and CTAs

2. **Imagery**
   - All src paths under /public (hero, work, badges, owner)
   - Image alt text variations

3. **Links & URLs**
   - Google Maps embed URLs
   - Facebook profile/reviews URLs
   - Social media link handlers
   - Internal route links

4. **Form Options**
   - Service dropdown options (12 services)
   - Category filters for blog

5. **Layout/Component Data**
   - Process steps (4 items)
   - FAQ items (7 q&a pairs)
   - Review testimonials (6 items)
   - Blog posts (6 items)
   - Why Choose reasons (6 items)
   - Special offers categories (3 items)
   - Trust claims (4 items)

6. **Styling Constants**
   - Color hex codes (6 main palette colors)
   - Border and opacity values
   - Gradient definitions

