/**
 * brand-dna.example-capstone.js
 *
 * Reference values for Capstone Contracting Solutions, the original client this
 * template was derived from. Used ONLY for the templatise smoke test (rename to
 * brand-dna.js, run npm install + npm run build, confirm the output is visually
 * identical to https://www.roofsbycapstone.com/).
 *
 * Per-client builds NEVER use these values. Stage 10.1 generates a fresh
 * brand-dna.js from each client's pipeline data and the validator fails closed
 * if any of these strings (Capstone / Bekka / Saettone / Grain Valley address)
 * leak through.
 */

export const brandDNA = {
  meta: {
    title: "Capstone Contracting Solutions | #1 Roofing Contractor Kansas City, MO",
    description:
      "Family-owned roofing contractor in Kansas City. Roof repair, replacement, storm damage, and insurance claims. Licensed, insured, owner on-site every job. Free estimate, we call you back in 5 minutes.",
  },

  company: {
    name: "Capstone Contracting Solutions",
    shortName: "Capstone",
    tagline: "DO IT RIGHT. LEAD WITH INTEGRITY. WOMAN-OWNED. FAMILY-LED. THE LAST CONTRACTOR YOU'LL EVER NEED.",
    url: "https://www.roofsbycapstone.com",
    licenseNumber: "BC757294",
    description: "Family-owned roofing contractor serving Greater Kansas City. Roof repair, replacement, storm damage restoration, insurance claims, siding, and gutters. Licensed Missouri contractor, fully insured, owner on-site every job.",
    serviceRegion: "Greater Kansas City, Missouri",
  },

  contact: {
    phone: "(816) 721-1111",
    phoneTelLink: "+18167211111",
    email: "info@roofsbycapstone.com",
    googleMapsUrl: "https://www.google.com/maps?q=Capstone+Contracting+Solutions+Grain+Valley+MO",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=915+NW+High+View+Dr,+Grain+Valley,+MO+64029&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },

  address: {
    street: "915 NW High View Dr",
    city: "Grain Valley",
    state: "MO",
    zip: "64029",
    full: "915 NW High View Dr, Grain Valley, MO 64029",
    lat: 39.0131,
    lng: -94.2024,
  },

  hours: {
    weekday: { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "19:00" },
    saturday: { dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" },
    display: [
      { label: "Monday – Friday", value: "7:00 AM – 7:00 PM" },
      { label: "Saturday", value: "8:00 AM – 5:00 PM" },
      { label: "Sunday", value: "Emergency Calls Only" },
    ],
    emergencyBadge: "24/7 Emergency Roofing Available",
  },

  social: {
    facebook: "https://www.facebook.com/CapstoneContractingKC",
    facebookReviews: "https://www.facebook.com/CapstoneContractingKC/reviews",
  },

  team: {
    founder: {
      name: "Bekka Saettone",
      displayName: "BEKKA SAETTONE",
      title: "Founder & CEO, Capstone Contracting Solutions",
      yearsExp: "10+",
      expLabel: "YEARS OF EXPERIENCE YOU CAN COUNT ON",
    },
    founders: ["Eric Saettone", "Bekka Saettone"],
  },

  // Single mode: "light" | "dark" — decided at Stage 7
  theme_mode: "light",

  // Voice register: "commercial" | "family" | "premium" — drives copy tone hints (Stage 6)
  voice_register: "family",

  // Background SVG pattern selector (one of the 13 in src/assets/bg-patterns/)
  shape_motif: "polygon",

  palette: {
    primary: "#0F172A",        // navy
    primary_dark: "#020617",   // deep navy
    primary_slate: "#1E293B",  // navy slate (cards / containers)
    accent: "#C6A75E",         // gold
    accent_light: "#D9BB7A",
    accent_dark: "#9C7F3F",
    neutral: "#94A3BB",        // cool gray text
    neutral_dim: "#64748B",    // medium gray
    silver: "#C0C6CF",
    ink: "#0B1220",            // body text on light bg
  },

  typography: {
    heading: "Oswald",
    body: "Montserrat",
    headingFontUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap",
    bodyFontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",
  },

  reviews: {
    rating: 5.0,
    googleCount: 47,
    facebookCount: 38,
    totalReviewCount: 85,
    googleLabel: "Google Reviews",
    facebookLabel: "Facebook Reviews",
    googleStat: "Google 5.0 ★ (47)",
    facebookStat: "Facebook 5.0 ★ (38)",
    items: [
      {
        author: "Sarah M.",
        source: "Google Reviews",
        text: "Bekka and her team were absolutely wonderful from start to finish. They handled our insurance claim, kept us updated every step of the way, and delivered beautiful work. Would recommend to anyone in Kansas City.",
      },
      {
        author: "James T.",
        source: "Google Reviews",
        text: "After the hail storm hit, Capstone was the only contractor who actually returned my call. They were on-site the next morning, walked through the damage with me, and had a quote in my hand by the end of the day.",
      },
      {
        author: "Linda K.",
        source: "Facebook Reviews",
        text: "We had three other quotes but Bekka was the only one who took the time to explain the materials and the process. Honest pricing, no surprises, and the crew was professional and respectful of our property.",
      },
      {
        author: "David R.",
        source: "Google Reviews",
        text: "From start to finish, Capstone delivered exactly what they promised. Roof looks great, gutters are flowing, and they cleaned up better than my landscapers do. Top-notch operation.",
      },
      {
        author: "Michelle W.",
        source: "Google Reviews",
        text: "Capstone replaced our entire roof in one day. The crew showed up at 7am sharp, worked nonstop, and were finished by sundown. We could not believe how clean the property was when they left.",
      },
      {
        author: "Tom & Karen B.",
        source: "Facebook Reviews",
        text: "We are repeat customers and Capstone continues to impress. They installed gutters last year, replaced the roof this year, and the quality has been consistent across both projects. Highly recommend.",
      },
    ],
  },

  services: [
    {
      slug: "roof-repair",
      name: "ROOF REPAIR",
      blurb: "Targeted fixes for leaks, missing shingles, flashing, and storm damage.",
      heroTitle: "ROOF REPAIR",
      subtitle: "FIX IT RIGHT THE FIRST TIME",
      description: "Not every roof problem needs a full replacement. Our repair specialists identify the root cause, damaged shingles, failing flashing, cracked vents, or deteriorated sealants, and fix it properly so the damage doesn't return. All work is guaranteed.",
      image: "/work/project1.jpg",
      benefits: [
        "Stops the leak for good, not just a temporary patch",
        "Same-day repairs available for most issues",
        "Honest assessment, we won't push a replacement you don't need",
      ],
      included: [
        "Full roof inspection before repair",
        "Damaged shingle replacement",
        "Flashing re-seal or replacement",
        "Written estimate before any work begins",
      ],
      process: [
        { num: "01", title: "Free Inspection", desc: "We inspect your entire roof, not just the visible damage. We look for what caused the issue as much as the issue itself." },
        { num: "02", title: "Damage Report", desc: "You receive a written report with photos showing exactly what needs attention and why." },
        { num: "03", title: "Same-Day Repair", desc: "Most repairs are completed the same day. We use matching materials from the same manufacturers as your original roof." },
        { num: "04", title: "Final Walkthrough", desc: "We walk the property with you and confirm the fix before we leave. Our repairs carry a workmanship warranty." },
      ],
      faq: [
        { q: "How do I know if I need repair or full replacement?", a: "We'll tell you honestly after the inspection. If the structural integrity is sound and damage is isolated, repair is the right call. If there is widespread deterioration, replacement will be recommended, and we'll show you the evidence." },
        { q: "Will the repaired section match the rest of my roof?", a: "We do our best to source matching shingles. On older roofs there may be some slight colour variation due to weathering, which we'll point out upfront." },
        { q: "How long do repairs take?", a: "Most residential repairs take 2 to 4 hours. Larger repairs may take a full day. We'll give you a time estimate before starting." },
        { q: "Is the repair guaranteed?", a: "Yes. All our repair work carries a workmanship warranty. Materials carry the manufacturer's warranty." },
      ],
      related: ["roof-replacement", "roof-inspections", "emergency-roofing"],
    },
    {
      slug: "roof-replacement",
      name: "ROOF REPLACEMENT",
      blurb: "Full tear-off and install with premium materials and a manufacturer warranty.",
      heroTitle: "ROOF REPLACEMENT",
      subtitle: "DECADES OF RENEWED PROTECTION",
      description: "A full roof replacement is one of the most significant investments you'll make in your home. We make it straightforward: one crew, one day on most homes, and a finished product that's built to last 30+ years with proper maintenance.",
      image: "/work/project2.jpg",
      benefits: [
        "Complete tear-off and disposal included in every quote",
        "30-year manufacturer warranty on materials",
        "Owner on-site throughout the entire job",
      ],
      included: [
        "Full tear-off and decking inspection",
        "Ice & water shield in all valleys and eaves",
        "Premium underlayment across the full deck",
        "Architectural shingles with 30-year warranty",
      ],
      process: [
        { num: "01", title: "Free Inspection & Quote", desc: "We inspect your current roof, measure accurately, and produce a detailed written quote, no vague estimates." },
        { num: "02", title: "Material Selection", desc: "Choose your shingle colour and style. We guide you through options that suit your home's architecture and your budget." },
        { num: "03", title: "Installation Day", desc: "Our crew arrives early, completes tear-off, installs all layers, and cleans up thoroughly, all in one day for most homes." },
        { num: "04", title: "Final Inspection", desc: "Final walkthrough with you, confirms everything meets spec, and hands you your warranty documents." },
      ],
      faq: [
        { q: "How long does a roof replacement take?", a: "Most residential replacements are completed in one day. Larger homes or complex roof lines may take two days." },
        { q: "Do you handle permits?", a: "Yes. We pull all required permits and handle all inspections required by your municipality." },
        { q: "Can my insurance cover the replacement?", a: "If the damage was caused by a covered event (storm, hail, wind), your insurance may cover most or all of the cost. We'll inspect and document the damage for your claim." },
        { q: "What shingle brands do you use?", a: "We work primarily with leading manufacturers including GAF, Owens Corning, and CertainTeed, each with strong warranty programs." },
      ],
      related: ["storm-damage-repair", "insurance-claims-assistance", "roof-repair"],
    },
    {
      slug: "new-roof-installation",
      name: "NEW ROOF INSTALLATION",
      blurb: "New construction roofing for residential and small commercial builds.",
      heroTitle: "NEW ROOF INSTALLATION",
      subtitle: "BUILT RIGHT FROM THE START",
      description: "New construction or a major addition? We partner with builders and homeowners to install roofing systems that are done right from day one, no shortcuts, no callbacks.",
      image: "/work/project3.jpg",
      benefits: [
        "Coordinated scheduling with your build timeline",
        "Full system installation, not just shingles",
        "All manufacturer installation specs followed exactly",
      ],
      included: [
        "Structural decking review and prep",
        "Full underlayment and leak barrier system",
        "Ridge vent and attic ventilation setup",
        "Architectural shingles and all flashings",
      ],
      process: [
        { num: "01", title: "Project Review", desc: "We review your plans, confirm measurements, and coordinate with your builder or GC on scheduling." },
        { num: "02", title: "Deck Prep", desc: "Decking is inspected and prepped before any layers go on. We won't cover a bad deck." },
        { num: "03", title: "Full System Install", desc: "All layers installed in sequence: leak barrier, underlayment, starter strips, shingles, ridge cap, and all flashings." },
        { num: "04", title: "Documentation", desc: "You receive full warranty registration and installation documentation for the homeowner's records." },
      ],
      faq: [
        { q: "Do you work with builders or just homeowners?", a: "Both. We work with custom home builders, general contractors, and individual homeowners on new construction projects." },
        { q: "What's the lead time for new installations?", a: "Typically 1 to 3 weeks depending on material availability and schedule. We coordinate around your build timeline." },
        { q: "Do you install metal roofing on new builds?", a: "Yes. See our Metal Roofing page for details on standing seam and metal shingle options." },
        { q: "What warranty comes with a new installation?", a: "Materials carry the manufacturer's warranty (typically 25 to 50 years). Our workmanship warranty covers installation defects." },
      ],
      related: ["metal-roofing", "roof-replacement", "roof-inspections"],
    },
    {
      slug: "emergency-roofing",
      name: "EMERGENCY ROOFING",
      blurb: "Same-day tarp-and-secure for active leaks and storm damage.",
      heroTitle: "EMERGENCY ROOFING",
      subtitle: "24/7 RAPID RESPONSE",
      description: "A storm doesn't wait for business hours, and neither do we. When your roof is compromised and water is coming in, we respond immediately, day, night, weekends, and holidays.",
      image: "/work/project4.jpg",
      benefits: [
        "Available 24 hours a day, 7 days a week",
        "Emergency tarping stops water damage fast",
        "Permanent repair scheduled without delay",
      ],
      included: [
        "Same-day or overnight emergency response",
        "Temporary tarping and board-up service",
        "Interior damage assessment",
        "Insurance documentation if applicable",
      ],
      process: [
        { num: "01", title: "Call Us Now", desc: "Call any time. We answer emergency calls 24/7, you'll reach a real person, not a voicemail." },
        { num: "02", title: "Rapid Response", desc: "We're on-site typically within 1 to 3 hours of your call depending on location and weather conditions." },
        { num: "03", title: "Secure & Stop Damage", desc: "We tarp, board, or otherwise secure the breach to stop water intrusion and further damage immediately." },
        { num: "04", title: "Permanent Repair Plan", desc: "We assess the full damage, document it for insurance, and schedule the permanent repair at the earliest opportunity." },
      ],
      faq: [
        { q: "Do you really answer calls at 2am?", a: "Yes. Our emergency line is answered by a real person around the clock. We understand water damage doesn't stop at 5pm." },
        { q: "What counts as a roofing emergency?", a: "Active water intrusion, a hole from storm debris, collapsed decking, or any situation where your home's interior is exposed to the elements." },
        { q: "Will insurance cover emergency repairs?", a: "In most cases where the damage was caused by a covered event, yes. We document everything for your claim from the moment we arrive." },
        { q: "How long does temporary tarping last?", a: "Emergency tarps are designed to hold through additional weather events. Permanent repairs are scheduled as soon as materials are available, usually within days." },
      ],
      related: ["roof-repair", "storm-damage-repair", "insurance-claims-assistance"],
    },
    {
      slug: "roof-inspections",
      name: "ROOF INSPECTIONS",
      blurb: "Free, photo-documented inspection with a written report.",
      heroTitle: "ROOF INSPECTIONS",
      subtitle: "KNOW EXACTLY WHERE YOU STAND",
      description: "Whether you're buying a home, filing an insurance claim, or just want peace of mind after a storm, a professional inspection gives you the full picture. We provide written reports with photos, no guesswork.",
      image: "/work/project5.jpg",
      benefits: [
        "Written report with photos delivered same day",
        "Unbiased assessment, no upsell pressure",
        "Insurance-ready documentation provided",
      ],
      included: [
        "Full roof surface inspection",
        "Flashing, vents, and penetration check",
        "Gutter and fascia condition assessment",
        "Written report with photo documentation",
      ],
      process: [
        { num: "01", title: "Schedule Your Inspection", desc: "Call or fill out our form. We typically schedule inspections within 24 to 48 hours." },
        { num: "02", title: "On-Site Inspection", desc: "One of our experienced team members gets on your roof and does a thorough, methodical inspection of every surface." },
        { num: "03", title: "Photo Documentation", desc: "We photograph all areas of concern, damage, wear, improper installation, and potential failure points." },
        { num: "04", title: "Written Report", desc: "You receive a detailed written report same day with our findings, severity ratings, and recommended actions." },
      ],
      faq: [
        { q: "How often should I have my roof inspected?", a: "We recommend an inspection every 2 to 3 years, and after any significant storm event. Catching small issues early prevents costly repairs later." },
        { q: "Is the inspection really free?", a: "Yes. Our initial inspection is completely free with no obligation to use our services." },
        { q: "Can I use your report for an insurance claim?", a: "Absolutely. Our reports include photos, measurements, and damage descriptions that insurance adjusters need. We can also attend your adjuster meeting." },
        { q: "Do you inspect commercial roofs too?", a: "We primarily serve residential properties. For commercial inquiries, contact us and we'll point you in the right direction." },
      ],
      related: ["roof-repair", "storm-damage-repair", "insurance-claims-assistance"],
    },
    {
      slug: "historical-roof-restoration",
      name: "HISTORICAL ROOF RESTORATION",
      blurb: "Slate, tile, and copper restoration for historic homes.",
      heroTitle: "HISTORIC RESTORATION",
      subtitle: "PRESERVE WHAT MATTERS",
      description: "Older homes require a different approach, materials that match the era, methods that respect the structure, and a team that understands what makes a historic property worth preserving. We have the experience to do it properly.",
      image: "/work/gemini1.png",
      benefits: [
        "Period-appropriate materials sourced and matched",
        "Structural assessment before any work begins",
        "Preserves home's historical character and value",
      ],
      included: [
        "Historical material research and sourcing",
        "Structural decking assessment and repair",
        "Period-appropriate shingle or slate installation",
        "Custom flashing fabrication if required",
      ],
      process: [
        { num: "01", title: "Historical Assessment", desc: "We research the original construction era, document existing materials, and identify what needs to be preserved vs replaced." },
        { num: "02", title: "Material Sourcing", desc: "We source materials that match the original, whether that's cedar shake, slate, or specific profile architectural shingles." },
        { num: "03", title: "Careful Installation", desc: "Restoration work is done carefully and methodically. We don't cut corners on older homes, if anything, we take more time." },
        { num: "04", title: "Preservation Documentation", desc: "We provide a full record of materials used and installation method for the property's historical records." },
      ],
      faq: [
        { q: "Can you match original slate roofing?", a: "Yes. We source reclaimed and new slate tiles and can match existing profiles closely. We'll show you samples before committing." },
        { q: "Do you work on homes in historic districts?", a: "Yes. We're familiar with local historic preservation requirements and can help you navigate the approval process." },
        { q: "Is historic restoration more expensive?", a: "Often, yes, due to specialised materials and labour. But we provide detailed quotes upfront so there are no surprises." },
        { q: "How do I know if my home qualifies as historic?", a: "Even if your home isn't formally designated, we apply restoration principles to any home over 50 years old where preserving original character matters to you." },
      ],
      related: ["roof-replacement", "roof-repair", "roof-inspections"],
    },
    {
      slug: "storm-damage-repair",
      name: "STORM DAMAGE REPAIR",
      blurb: "Hail and wind damage assessment, photo documentation, and full restoration.",
      heroTitle: "STORM DAMAGE RESTORATION",
      subtitle: "BACK TO NORMAL, FAST",
      description: "Storms are relentless. Hail dents shingles, wind tears flashings, and ice forces water under layers you thought were sealed. We've processed hundreds of storm claims and know exactly how to get your home restored without the insurance headaches.",
      image: "/work/project3.jpg",
      benefits: [
        "Free storm damage inspection with photo report",
        "Insurance documentation handled by our team",
        "Most work covered at no out-of-pocket cost",
      ],
      included: [
        "Full storm damage inspection",
        "Photo report for insurance submission",
        "Adjuster inspection attendance",
        "Complete restoration to pre-storm condition",
      ],
      process: [
        { num: "01", title: "Free Inspection", desc: "We inspect your roof, siding, gutters, and windows for storm damage. Even damage not visible from the ground gets documented." },
        { num: "02", title: "Insurance Report", desc: "We compile a detailed damage report with photos, measurements, and replacement cost estimates formatted for your insurer." },
        { num: "03", title: "Adjuster Meeting", desc: "We attend your adjuster inspection and walk the property together to make sure nothing is missed or undervalued." },
        { num: "04", title: "Restoration", desc: "Once the claim is approved, we schedule and complete all restoration work. We handle supplements if the initial approval falls short." },
      ],
      faq: [
        { q: "How do I know if I have storm damage?", a: "Hail damage often looks like small dents or bruising on shingles, not always visible without getting on the roof. After any storm with golf ball-sized hail or sustained wind above 50mph, call us." },
        { q: "What if my insurer denies the claim?", a: "We've helped many homeowners appeal denials. Our detailed documentation often makes the difference in a successful appeal." },
        { q: "Will my insurance premium go up?", a: "Filing a claim for a weather event (called an 'Act of God') generally does not increase your premium, since the event was outside your control. Confirm with your agent." },
        { q: "How long does the insurance process take?", a: "From inspection to claim approval typically takes 1 to 3 weeks. Restoration is scheduled immediately once approved." },
      ],
      related: ["insurance-claims-assistance", "emergency-roofing", "roof-replacement"],
    },
    {
      slug: "insurance-claims-assistance",
      name: "INSURANCE CLAIMS ASSISTANCE",
      blurb: "Owner-led claims support from estimate through final payment.",
      heroTitle: "INSURANCE CLAIMS ASSISTANCE",
      subtitle: "WE FIGHT FOR WHAT YOU'RE OWED",
      description: "Insurance companies have their own adjusters. You deserve someone in your corner. We've processed hundreds of claims and know exactly how to document damage, communicate with adjusters, and make sure you get the full value of your policy.",
      image: "/work/project4.jpg",
      benefits: [
        "We attend every adjuster inspection",
        "Supplement claims handled at no extra cost",
        "Hundreds of approved claims",
      ],
      included: [
        "Detailed photo damage documentation",
        "Written scope of damage report",
        "Adjuster inspection attendance",
        "Supplement filing if initial approval is low",
      ],
      process: [
        { num: "01", title: "Damage Documentation", desc: "We photograph and measure every area of damage, shingles, flashing, vents, gutters, fascia, and siding." },
        { num: "02", title: "Report Submission", desc: "We prepare and help you submit your claim with the documentation adjusters need to approve it efficiently." },
        { num: "03", title: "Adjuster Meeting", desc: "We attend your adjuster inspection and walk the roof together, pointing out every item that needs to be included in the scope." },
        { num: "04", title: "Claim Completion", desc: "Once approved, we complete all work included in the scope. If anything was missed, we file a supplement immediately." },
      ],
      faq: [
        { q: "Do you charge extra for claims assistance?", a: "No. Claims assistance is part of our service at no additional cost. You only pay your deductible." },
        { q: "Can you help if my claim was already denied?", a: "Yes. Denials can often be successfully appealed with proper documentation. Contact us and we'll review your situation." },
        { q: "Do you work with all insurance companies?", a: "Yes. We've worked with all major carriers in our region. Every process is slightly different and we know them all." },
        { q: "What if the insurance payout is less than the actual repair cost?", a: "We file a supplemental claim for any difference between the approved amount and actual cost. This is common and we handle it routinely." },
      ],
      related: ["storm-damage-repair", "roof-replacement", "emergency-roofing"],
    },
    {
      slug: "siding",
      name: "SIDING",
      blurb: "Vinyl, fiber cement, and composite siding repair and replacement.",
      heroTitle: "SIDING INSTALLATION & REPLACEMENT",
      subtitle: "CURB APPEAL MEETS PROTECTION",
      description: "Your siding is your home's first line of defence against the elements. We install and replace vinyl, fibre cement, and engineered wood siding, matching your home's style while dramatically improving its weather resistance and energy efficiency.",
      image: "/work/project5.jpg",
      benefits: [
        "Multiple material options to suit your budget",
        "Moisture barrier and insulation included",
        "Matches or improves your home's existing aesthetic",
      ],
      included: [
        "Full removal and disposal of old siding",
        "House wrap / moisture barrier installation",
        "Premium siding installation with all trim",
        "Colour and profile consultation",
      ],
      process: [
        { num: "01", title: "Consultation & Quote", desc: "We review your home, discuss material options, and provide a detailed written quote before any commitment." },
        { num: "02", title: "Material Selection", desc: "Choose from vinyl, fibre cement, or engineered wood in dozens of profiles and colours. We bring samples to your home." },
        { num: "03", title: "Installation", desc: "Old siding removed, moisture barrier installed, and new siding fitted, all by our own crew, no subcontractors." },
        { num: "04", title: "Clean-Up & Final Walk", desc: "Full site clean-up and a final walkthrough to confirm you're happy with every detail." },
      ],
      faq: [
        { q: "What siding material do you recommend?", a: "It depends on your priorities. Vinyl is lowest maintenance. Fibre cement is most durable. Engineered wood looks most like natural wood. We'll help you decide." },
        { q: "Can siding be covered by insurance?", a: "If storm or hail damage is present, yes. We inspect and document siding damage just like roofing damage." },
        { q: "How long does a siding installation take?", a: "A typical home takes 3 to 5 days depending on size and complexity." },
        { q: "Do you do partial siding replacements?", a: "Yes. If only one elevation is damaged, we can replace that section and match the existing profile and colour as closely as possible." },
      ],
      related: ["gutters", "windows", "storm-damage-repair"],
    },
    {
      slug: "gutters",
      name: "GUTTERS",
      blurb: "Seamless aluminum gutters and gutter guards.",
      heroTitle: "GUTTER INSTALLATION & REPLACEMENT",
      subtitle: "PROTECT YOUR FOUNDATION",
      description: "Gutters do more than redirect rainwater, they protect your foundation, prevent basement flooding, and stop erosion around your home. We install seamless aluminium gutters custom-formed to your home's exact dimensions.",
      image: "/work/gemini2.png",
      benefits: [
        "Seamless gutters, no joints to leak",
        "Custom-formed on-site to exact dimensions",
        "Full range of profiles and colours available",
      ],
      included: [
        "Removal and disposal of old gutters",
        "Seamless aluminium gutter installation",
        "Downspout installation and positioning",
        "Gutter guard options available",
      ],
      process: [
        { num: "01", title: "Measurement & Quote", desc: "We measure your home precisely and quote every linear foot. No rounding up, no inflated numbers." },
        { num: "02", title: "Custom Fabrication", desc: "Gutters are formed on-site from a continuous roll, no joints except at corners. This eliminates the most common leak points." },
        { num: "03", title: "Installation", desc: "Old gutters are removed and new ones installed with proper slope and secured hangers. Downspouts placed for optimal drainage." },
        { num: "04", title: "Flow Test", desc: "We run water through the system before we leave to confirm proper flow and no leaks." },
      ],
      faq: [
        { q: "What size gutter do I need?", a: "Most homes use 5-inch K-style. Larger roofs or high-rainfall areas may benefit from 6-inch. We'll recommend the right size." },
        { q: "Should I add gutter guards?", a: "If you have large trees overhanging your roof, guards significantly reduce cleaning frequency. We offer several guard styles." },
        { q: "How long do aluminium gutters last?", a: "With proper installation and basic maintenance, 20 to 30 years. Seamless gutters last longer than sectional because there are fewer failure points." },
        { q: "Can storm damage be claimed on insurance?", a: "Yes. We photograph and document gutter damage as part of any storm damage inspection." },
      ],
      related: ["siding", "roof-replacement", "storm-damage-repair"],
    },
    {
      slug: "windows",
      name: "WINDOWS",
      blurb: "Energy-efficient window installation and replacement.",
      heroTitle: "WINDOW REPLACEMENT",
      subtitle: "COMFORT, EFFICIENCY & CURB APPEAL",
      description: "Drafty windows waste energy and compromise your home's security. We install energy-efficient replacement windows that lower your bills, reduce outside noise, and look great, with a proper weathertight installation every time.",
      image: "/work/project6.jpg",
      benefits: [
        "Energy Star rated windows available",
        "Professional weathertight installation",
        "Reduces heating and cooling costs immediately",
      ],
      included: [
        "Removal and disposal of old windows",
        "Proper flashing and waterproofing",
        "Energy-efficient double or triple pane installation",
        "Interior and exterior trim finishing",
      ],
      process: [
        { num: "01", title: "Window Consultation", desc: "We assess your current windows, discuss style and efficiency options, and recommend the right product for each opening." },
        { num: "02", title: "Precise Measurement", desc: "Each window is measured precisely for a custom-fit replacement. No gaps, no shimming, no air leaks." },
        { num: "03", title: "Installation", desc: "Old windows removed, openings inspected and prepped, new windows set, flashed, and finished inside and out." },
        { num: "04", title: "Final Inspection", desc: "Every window is tested for smooth operation and air/water seal before we leave." },
      ],
      faq: [
        { q: "What window brands do you install?", a: "We work with leading manufacturers including Andersen, Pella, and Simonton. We'll match the right brand to your budget and home style." },
        { q: "Can window replacement be covered by insurance?", a: "If windows were damaged in a storm, hail, or other covered event, yes. We document window damage as part of storm inspections." },
        { q: "How long does window replacement take?", a: "Most homes can have all windows replaced in 1 to 2 days depending on quantity and complexity." },
        { q: "Do you do single window replacements?", a: "Yes. Whether it's one broken window or a full-home replacement, we handle it." },
      ],
      related: ["siding", "gutters", "storm-damage-repair"],
    },
    {
      slug: "metal-roofing",
      name: "METAL ROOFING",
      blurb: "Standing seam metal roofing for residential and commercial.",
      heroTitle: "METAL ROOFING",
      subtitle: "BUILT TO OUTLAST EVERYTHING ELSE",
      description: "Metal roofing is the highest-performing roofing system available for residential homes. Standing seam and metal shingle systems offer 50+ year lifespans, superior wind and impact resistance, and a modern aesthetic that sets your home apart.",
      image: "/work/gemini3.png",
      benefits: [
        "50+ year lifespan with minimal maintenance",
        "Class 4 impact resistance, highest available",
        "Energy-efficient, reflects solar heat",
      ],
      included: [
        "Full tear-off and decking inspection",
        "Proper underlayment for metal systems",
        "Standing seam or metal shingle installation",
        "All flashings, ridgecaps, and trim in matching metal",
      ],
      process: [
        { num: "01", title: "System Selection", desc: "We walk you through standing seam vs metal shingle options, pros, cons, cost, and aesthetic for your specific home." },
        { num: "02", title: "Material Ordering", desc: "Metal panels are ordered to your home's exact dimensions and colour. Lead time is typically 2 to 3 weeks." },
        { num: "03", title: "Installation", desc: "Metal roofing requires precise installation. Our crew is trained specifically on metal systems, this is not standard shingle work." },
        { num: "04", title: "Final Inspection", desc: "Every seam, fastener, and flashing is inspected before completion. Metal roofing done right is watertight for decades." },
      ],
      faq: [
        { q: "Is metal roofing much more expensive than shingles?", a: "Initial cost is 2 to 3x higher than asphalt shingles, but the 50+ year lifespan means you'll likely never replace it again. Over time it's often more economical." },
        { q: "Is metal roofing noisy in rain?", a: "With proper underlayment, metal roofing is no louder than asphalt inside the home. Many homeowners actually enjoy the sound." },
        { q: "Does metal roofing attract lightning?", a: "No more than any other material. Metal is non-combustible and actually safer in lightning events than wood-based roofing." },
        { q: "Can metal roofing go over existing shingles?", a: "In some cases, yes, but we always recommend a full tear-off to inspect the decking and ensure a proper installation." },
      ],
      related: ["roof-replacement", "new-roof-installation", "roof-inspections"],
    },
  ],

  serviceAreas: [
    "KANSAS CITY", "BLUE SPRINGS", "INDEPENDENCE", "LEE'S SUMMIT", "GRAIN VALLEY",
    "OAK GROVE", "RAYTOWN", "GRANDVIEW", "BELTON", "RAYMORE", "LIBERTY", "GLADSTONE",
    "NORTH KANSAS CITY", "PLEASANT HILL", "HARRISONVILLE", "ST. LOUIS", "CHESTERFIELD",
    "ST. CHARLES",
  ],

  // Trust badges. Each entry's filename is looked up against
  // references/trust-badges/registry.json by the per-client overlay process.
  // For Capstone (smoke-test), files already live in public/badges/.
  trust_badges: [
    { filename: "tamko.png", alt: "TAMKO Pro Certified" },
    { filename: "owens-corning.jpg", alt: "Owens Corning Certified" },
    { filename: "owens-corning-platinum.png", alt: "Owens Corning Platinum Preferred" },
    { filename: "certainteed.png", alt: "CertainTeed Master Shingle Applicator" },
    { filename: "trust-badge-1.png", alt: "Better Business Bureau Accredited" },
    { filename: "trust-badge-2.png", alt: "5-Star Google Verified" },
  ],

  // Previous-projects gallery (OurWork). Filenames live in public/work/ for the
  // per-client build. For Capstone (smoke-test), files already exist there.
  previous_projects: [
    { filename: "action-video.mp4", type: "video", alt: "Capstone crew action footage" },
    { filename: "action1.jpg", type: "image", alt: "Capstone crew on a roof in Kansas City" },
    { filename: "action2.jpg", type: "image", alt: "Capstone crew installing shingles" },
    { filename: "action3.jpg", type: "image", alt: "Capstone crew completing a roof" },
    { filename: "action4.jpg", type: "image", alt: "Capstone team on-site" },
    { filename: "project1.jpg", type: "image", alt: "Completed roof project, Kansas City" },
    { filename: "project2.jpg", type: "image", alt: "Completed roof project, Blue Springs" },
    { filename: "project3.jpg", type: "image", alt: "Completed roof project, Lee's Summit" },
    { filename: "project4.jpg", type: "image", alt: "Completed roof project, Independence" },
    { filename: "project5.jpg", type: "image", alt: "Completed roof project, Grain Valley" },
    { filename: "project6.jpg", type: "image", alt: "Completed roof project, Greater KC Metro" },
    { filename: "gemini1.png", type: "image", alt: "Capstone roofing showcase" },
    { filename: "gemini2.png", type: "image", alt: "Capstone roofing showcase" },
    { filename: "gemini3.png", type: "image", alt: "Capstone roofing showcase" },
  ],

  // Optional team section (renders only if non-empty). Capstone has none currently.
  team_members: [],

  copy: {
    hero: {
      eyebrow: "BUILT ON STRENGTH. BACKED BY INTEGRITY.",
      headline: "THE FINAL CONTRACTOR YOU'LL EVER NEED.",
      subheadline: "Roofing, restoration, and exterior solutions built to protect what matters most.",
    },
    formHeader: "GET MY FREE ESTIMATE",
    formSubtext: "We call you back in 5 minutes!",
    buttonText: "GET MY FREE ESTIMATE",
    submitButton: "SEND MY MESSAGE",
    trustClaims: [
      "Insurance Claim Experts",
      "Premium Quality Materials",
      "Experienced Professionals",
      "Customer Focused",
    ],
    heroTrustChips: [
      "Same-Day Response Available",
      "Insurance Claims Handled",
      "Owner On-Site Every Job",
      "100% Satisfaction Guarantee",
    ],
    services: {
      label: "OUR SERVICES",
      heading: "COMPLETE EXTERIOR SOLUTIONS FOR LASTING PROTECTION.",
      body: "From roof replacement and storm damage restoration to gutters, siding, and windows. Capstone handles every exterior need your home has, managed directly by the owners.",
    },
    reviews: {
      label: "REVIEWS",
      heading: "REAL REVIEWS FROM REAL NEIGHBORS JUST LIKE YOU",
      body: "When you hire a roofing contractor in Kansas City, you want to know they will show up, do the work right, and stand behind it. Here is what our neighbors say.",
      summary: "Rated 5.0 Stars Across 85+ Reviews on Google & Facebook",
    },
    founder: {
      label: "ABOUT CAPSTONE SOLUTIONS",
      heading: "RAISING THE STANDARD IN EXTERIOR SOLUTIONS.",
      para1:
        "At Capstone Solutions, we don't just build roofs, we build trust. Woman-owned and led by Bekka Saettone, Capstone was founded on the belief that integrity and quality are not optional. Every homeowner deserves honesty, clarity, and a contractor who shows up.",
      para2:
        "Bekka Saettone leads every aspect of the business as CEO, from the initial inspection to the final walkthrough. There are no middlemen, no surprise charges, and no salespeople. Just a real owner standing behind every job.",
      visionLabel: "VISION",
      vision:
        "To be the most trusted residential and exterior construction company in Greater Missouri. A brand homeowners call first and recommend without hesitation, built on integrity, quality, and long-term relationships.",
      missionLabel: "MISSION",
      mission:
        "To do it right and lead with integrity. Every project is owner-managed from inspection to final walkthrough, delivering honest assessments, expert craftsmanship, and the clarity every homeowner deserves.",
    },
    process: {
      label: "OUR PROCESS",
      heading: "SIMPLE. TRANSPARENT.",
      body: "From your first call to warranty documentation, you will always know exactly where your project stands, handled directly by Bekka and her team, start to finish.",
      badgeText: "4-Step Roofing Process",
      badgeSubtext: "Transparent. Owner-Managed. No Surprises.",
    },
    whyChoose: {
      label: "WHY CAPSTONE",
      heading: "WHY MORE HOMEOWNERS CHOOSE CAPSTONE",
      body: "Not all roofing companies are created equal. Capstone Contracting Solutions is woman-owned and every project is personally managed by Bekka Saettone. When you hire us, you are working directly with the owner from day one.",
    },
    offers: {
      label: "SPECIAL OFFERS",
      heading: "MAKING QUALITY ROOFING MORE ACCESSIBLE",
      body: "We believe every homeowner deserves quality roofing without financial stress. As a family-owned company, we proudly offer a $100 service discount for:",
      detail: "Plus, take advantage of convenient financing options through our trusted partners.",
    },
    blog: {
      label: "FROM THE ROOFTOP",
      heading: "EXPERT TIPS AND HOMEOWNER INSIGHTS",
      body: "We don't just fix roofs, we educate and empower our customers. Read practical guidance from the Capstone team, written for Kansas City homeowners.",
      featuredLabel: "FEATURED POST",
    },
    gallery: {
      label: "OUR WORK",
      heading: "SEE THE DIFFERENCE IN EVERY SHINGLE",
      body: "Real projects completed across Kansas City, Blue Springs, Lee's Summit, and Greater Missouri. Results speak louder than promises.",
    },
    serviceAreas: {
      label: "SERVICE AREAS",
      heading: "PROUDLY SERVING GREATER MISSOURI",
      body: "Whether you are in Kansas City or the St. Louis metro, our team is ready to help. We proudly serve 20+ communities across Missouri, bringing peace of mind to homeowners throughout the state.",
    },
    cta: {
      label: "GET STARTED TODAY",
      heading: "READY TO GET STARTED?",
      body: "The best time to fix your roof is before the next Kansas City storm hits. Let us inspect, document, and protect your investment.",
    },
    faq: {
      label: "GOT QUESTIONS?",
      heading: "FREQUENTLY ASKED QUESTIONS",
    },
    topBar: {
      cta: "Need roofing help? Call us now!",
    },
    serviceAreaCard: {
      heading: "SERVING GREATER MISSOURI",
      body: "Kansas City Metro & Surrounding Areas",
    },
    copyright: "Copyright 2026 Capstone Contracting Solutions. All Rights Reserved.",
  },

  process_steps: [
    { n: 1, title: "Contact Us", body: "Call, fill out the form, or refer a neighbor. We respond same-day." },
    { n: 2, title: "Free Inspection", body: "Photo documentation and insurance guidance, on-site, no obligation." },
    { n: 3, title: "Detailed Estimate", body: "Material selection and scheduling, transparent pricing, no surprises." },
    { n: 4, title: "Professional Installation", body: "Final walkthrough, warranty docs, and a clean property when we leave." },
  ],

  why_choose_us: [
    "Free Roof Inspection & Same-Day Estimates",
    "Owner-Managed From Start to Finish",
    "Insurance Claims Specialists",
    "Financing Through Trusted Lenders",
    "$100 Discount for First Responders & Educators",
    "5-Star Rated on Google and Facebook",
  ],

  special_offers: [
    { label: "FIRST RESPONDERS", amount: "$100 OFF" },
    { label: "EDUCATORS", amount: "$100 OFF" },
    { label: "MILITARY & VETERANS", amount: "$100 OFF" },
  ],

  faq: [
    {
      q: "HOW FAST CAN YOU COMPLETE A ROOFING PROJECT?",
      a: "Most residential roof replacements can be completed in a single day, weather permitting. Larger or more complex jobs may take 2-3 days. We give you a realistic timeline upfront and stick to it.",
    },
    {
      q: "DO YOU OFFER ROOFING FINANCING?",
      a: "Yes. We offer convenient financing through our trusted lending partners with flexible terms, so you can move forward without waiting on insurance.",
    },
    {
      q: "WHAT AREAS DO YOU SERVICE?",
      a: "We proudly serve the Kansas City Metro Area and surrounding cities including Blue Springs, Lee's Summit, Independence, Grain Valley, and 14+ more communities. We also cover the St. Louis metro for select projects.",
    },
    {
      q: "WHAT ARE THE SIGNS I NEED A ROOF REPAIR?",
      a: "Watch for missing or curling shingles, granules in your gutters, ceiling stains, daylight in your attic, or sagging spots. If you see any of these, schedule a free inspection right away.",
    },
    {
      q: "DO YOU HELP WITH INSURANCE CLAIMS AFTER STORM DAMAGE?",
      a: "Absolutely. Insurance claims assistance is one of our specialties. We document the damage thoroughly, communicate directly with your adjuster, and make sure you get the coverage you are entitled to.",
    },
    {
      q: "IS IT BETTER TO REPAIR OR REPLACE MY ROOF?",
      a: "It depends on the age and extent of damage. Roofs under 15 years old with isolated damage are usually good candidates for repair. Older roofs or widespread damage typically warrant replacement. We give you an honest recommendation either way.",
    },
    {
      q: "CAN A NEW ROOF IMPROVE MY HOME'S VALUE?",
      a: "Absolutely. A new roof is one of the highest ROI home improvements, often returning 60-70% of cost at sale, and it makes your home far more attractive to buyers.",
    },
  ],

  blog_posts: [
    {
      slug: "how-to-tell-if-your-roof-needs-replacing",
      title: "How to Tell If Your Roof Needs Replacing in Missouri",
      excerpt: "The warning signs every Kansas City homeowner should know, plus a checklist to help you decide between repair and replacement.",
      date: "April 2026",
      category: "Roof Health",
      readTime: "5 min read",
      cover: "/work/project1.jpg",
      featured: true,
      content: [
        { type: "p", text: "Most homeowners don't think about their roof until something goes wrong. By the time you notice a leak, the damage is usually well underway. Here are the warning signs to watch for so you can act before a small problem becomes a four-figure repair." },
        { type: "h2", text: "Visible damage from the ground" },
        { type: "list", items: [
          "Curling, cupping, or buckling shingles",
          "Bald patches where granules have washed off",
          "Missing shingles after a wind event",
          "Sagging spots in the roof line",
          "Visible daylight through attic boards",
        ]},
        { type: "p", text: "Any of these is a signal to schedule an inspection. We can usually tell within ten minutes whether you're looking at a repair or a replacement." },
        { type: "h2", text: "Age matters more than appearance" },
        { type: "p", text: "Asphalt shingle roofs typically last 20 to 25 years. If yours is in that range and showing any of the signs above, replacement is usually the right move. Spending money to repair an end-of-life roof rarely pays off." },
        { type: "h2", text: "When in doubt, get a second opinion" },
        { type: "p", text: "We offer free, no-obligation inspections with a written report. If your roof has years of life left, we'll tell you. If it doesn't, you'll have the documentation you need to make an informed decision." },
      ],
    },
    {
      slug: "hail-damage-kansas-city",
      title: "Hail Damage: What Kansas City Homeowners Need to Know",
      excerpt: "Hail season hits hard in Missouri. Here is how to spot damage, document it for insurance, and get repairs handled right.",
      date: "April 2026",
      category: "Storm Damage",
      readTime: "6 min read",
      cover: "/work/project3.jpg",
      featured: false,
      content: [
        { type: "p", text: "Hail damage is sneaky. The dents that compromise your shingles often aren't visible from the ground, and insurance companies rely on that to deny claims. Here's how to protect yourself." },
        { type: "h2", text: "What hail does to a roof" },
        { type: "p", text: "Hail strikes break the granular layer that protects shingles from UV. Once that layer is compromised, the underlying mat degrades fast. A roof that looked fine before a hailstorm can fail in two or three years." },
        { type: "h2", text: "Document everything immediately" },
        { type: "list", items: [
          "Photograph the storm event (if safe)",
          "Note the date, time, and approximate hail size",
          "Save any local news coverage of the storm",
          "Schedule a professional inspection within 30 days",
        ]},
        { type: "h2", text: "Filing the claim" },
        { type: "p", text: "Most insurers have time limits for filing weather-related claims. We help homeowners through every step, from the initial inspection to the adjuster meeting to the final payment. Our documentation has helped neighbours win appeals on initially-denied claims." },
      ],
    },
    {
      slug: "choosing-the-right-shingles",
      title: "Choosing the Right Shingles for Your Missouri Home",
      excerpt: "Architectural vs. 3-tab vs. premium designer shingles. We compare lifespan, cost, and curb appeal.",
      date: "April 2026",
      category: "Materials",
      readTime: "7 min read",
      cover: "/work/gemini1.png",
      featured: false,
      content: [
        { type: "p", text: "The three big shingle categories each have a place. Picking the wrong one can cost you years of life and thousands in early replacement. Here's how we walk homeowners through the choice." },
        { type: "h2", text: "3-tab shingles" },
        { type: "p", text: "The cheapest option, with the shortest lifespan (15 to 20 years). Best for budget-constrained homes you plan to sell within 10 years." },
        { type: "h2", text: "Architectural shingles" },
        { type: "p", text: "The most popular choice today. 25 to 30 year lifespan, much better wind resistance than 3-tab, and dimensional appearance that adds curb appeal. This is what we recommend for most homes." },
        { type: "h2", text: "Premium designer shingles" },
        { type: "p", text: "Slate-look, shake-look, or specialty profiles. 30 to 50 year lifespan with the best warranties. Worth the investment on a forever home or a high-end property where curb appeal matters." },
        { type: "h2", text: "What matters most" },
        { type: "list", items: [
          "Manufacturer (GAF, Owens Corning, CertainTeed lead the pack)",
          "Wind rating (110 mph is the modern standard)",
          "Algae resistance (look for the AR designation)",
          "Warranty length and what it actually covers",
        ]},
      ],
    },
    {
      slug: "roof-insurance-claims-guide",
      title: "Complete Guide to Roof Insurance Claims",
      excerpt: "From first call to final payment. We walk you through every step of a successful insurance claim.",
      date: "March 2026",
      category: "Insurance",
      readTime: "8 min read",
      cover: "/work/project2.jpg",
      featured: false,
      content: [
        { type: "p", text: "Filing a roof insurance claim isn't complicated, but it has to be done in the right order with the right documentation. Skip a step and you can leave thousands on the table." },
        { type: "h2", text: "Before the storm" },
        { type: "list", items: [
          "Photograph your roof annually so you have a baseline",
          "Keep a copy of your homeowner's policy accessible",
          "Know your deductible and your coverage limits",
        ]},
        { type: "h2", text: "After the storm" },
        { type: "p", text: "Document the event, schedule a professional inspection, and file the claim within 30 to 60 days. We provide the photos, measurements, and damage report your insurer needs in a format that adjusters expect." },
        { type: "h2", text: "The adjuster meeting" },
        { type: "p", text: "Always have a roofing professional present. Adjusters miss damage. They sometimes value items below replacement cost. Having someone in your corner who can walk the roof with the adjuster is worth thousands on average." },
        { type: "h2", text: "Supplements" },
        { type: "p", text: "If the initial scope is incomplete, you can file a supplement for additional items. We handle this routinely at no extra cost." },
      ],
    },
    {
      slug: "gutters-101",
      title: "Gutters 101: Everything Homeowners Should Know",
      excerpt: "Gutter sizes, materials, and maintenance basics so you can protect your roof and your foundation.",
      date: "March 2026",
      category: "Gutters",
      readTime: "5 min read",
      cover: "/work/project4.jpg",
      featured: false,
      content: [
        { type: "p", text: "Gutters are the unsung heroes of home protection. When they fail, water gets where it shouldn't, in your basement, behind your siding, under your foundation. Here's what every homeowner should know." },
        { type: "h2", text: "Sizes" },
        { type: "p", text: "Most homes use 5-inch K-style gutters. Larger roofs or high-rainfall areas benefit from 6-inch. Half-round profiles are sometimes used on historic homes for aesthetic reasons." },
        { type: "h2", text: "Materials" },
        { type: "list", items: [
          "Aluminum, the standard, 20 to 30 year lifespan",
          "Steel, more durable, but heavier and pricier",
          "Copper, premium choice, 50+ years, ages beautifully",
          "Vinyl, cheapest but cracks under cold and load",
        ]},
        { type: "h2", text: "Maintenance" },
        { type: "p", text: "Clean gutters at least twice a year, more often if you have overhanging trees. Gutter guards reduce cleaning frequency dramatically and we recommend them for tree-heavy properties." },
      ],
    },
    {
      slug: "preparing-roof-for-missouri-winter",
      title: "Preparing Your Roof for Missouri Winter",
      excerpt: "Ice dams, snow load, and freeze-thaw damage. Here is your Missouri winter roof prep checklist.",
      date: "March 2026",
      category: "Maintenance",
      readTime: "6 min read",
      cover: "/work/project5.jpg",
      featured: false,
      content: [
        { type: "p", text: "Missouri winters are tough on roofs. Freeze-thaw cycles, snow load, and ice dams all conspire against your shingles. A few proactive steps in autumn can save you from a major repair in spring." },
        { type: "h2", text: "Pre-winter inspection" },
        { type: "p", text: "Schedule a professional inspection in October or November. We look for loose shingles, deteriorated flashing, and any place where ice or snow could get under the surface. Small fixes now prevent big problems later." },
        { type: "h2", text: "Attic ventilation matters" },
        { type: "p", text: "Poor ventilation is the #1 cause of ice dams. Warm attic air melts roof snow, which refreezes at the eaves. Proper ridge and soffit venting keeps the attic cold so snow stays snow." },
        { type: "h2", text: "Gutters" },
        { type: "list", items: [
          "Clean before the first hard freeze",
          "Check for sag and proper slope",
          "Make sure downspouts drain at least 5 feet from the foundation",
        ]},
        { type: "h2", text: "Trim overhanging branches" },
        { type: "p", text: "Heavy snow can break branches that fall on your roof. Trim back any branches within 10 feet of your roof line before winter sets in." },
      ],
    },
  ],

  blog_categories: ["All", "Roof Health", "Storm Damage", "Materials", "Insurance", "Gutters", "Maintenance"],

  pages: {
    contact: {
      heading: "CONTACT US",
      intro: "Ready to get started? Reach out by phone, email, or fill out the form below. We get back to you same day.",
      formHeading: "SEND US A MESSAGE",
      formIntro: "Fill out the form below and a member of our team will contact you within 24 hours to schedule your free inspection.",
      contactHeading: "CONTACT INFO",
    },
    blog: {
      label: "KNOWLEDGE & ADVICE",
      heading: "ROOFING KNOWLEDGE & ADVICE",
      intro: "Practical advice from the Capstone team. Real homeowner questions, honest answers, no fluff.",
    },
  },

  // Agency credit at the very bottom of the footer
  credit: {
    agency: "King Contractor",
    url: null,
  },
};
