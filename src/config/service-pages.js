/**
 * SERVICE_PAGES — hand-authored service copy decks.
 *
 * brand-dna.js is machine-generated, so these four services live here and are
 * appended to `brandDNA.services` at the foot of that file. Everything that
 * reads the services list — the /services/:slug routes and their getStaticPaths,
 * the header dropdown, the footer column, the quote-form select and the
 * services index — therefore picks them up with no further wiring.
 *
 * Shape (a superset of the generated services; every field is optional except
 * name/slug, and the template degrades gracefully when one is missing):
 *   name, slug                 identity + route
 *   heroTitle                  <h1> in the banner (frontmatter hero.title)
 *   metaTitle, description     <title> and meta description (frontmatter seo.*)
 *   description_short          one-line summary for the services index card
 *   body                       INTRODUCTION, as the copy-deck markdown the
 *                              shared SiloBody renderer understands (## + - )
 *   benefits[{title, body}]    one card per "### " under WHY CHOOSE HIGH POINT
 *   included[]                 WHAT'S INCLUDED bullets
 *   process[{num,title,desc}]  the five OUR PROCESS steps
 *   faq[{q,a}]                 FAQ accordion items
 *   whereWeWork                the service-specific WHERE WE WORK paragraph
 *   related[]                  frontmatter related_services (slugs)
 */
export const SERVICE_PAGES = [
  // ────────────────────────────────────────────────────────────── Roof Replacement
  {
    name: 'Roof Replacement',
    slug: 'roof-replacement',
    heroTitle: 'Roof Replacement',
    metaTitle: 'Roof Replacement in Kennewick, WA | High Point',
    description:
      'High Point replaces roofs across Kennewick, Pasco, and Richland with honest assessments, quality materials, and careful installation. Free estimate.',
    description_short:
      'A complete roof replacement from the deck upward, with a careful inspection first and a straightforward recommendation based on the roof’s condition.',
    body: [
      '## Complete Roof Replacement Built for Long-Term Protection',
      '',
      'A worn-out or badly damaged roof can lead to recurring leaks, rising repair costs, damaged insulation, and problems inside your home. When isolated repairs are no longer the responsible solution, a complete roof replacement gives the property a fresh, dependable roofing system from the deck upward.',
      '',
      'High Point Renovation & Roofing provides professional roof replacement for homeowners throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities. We begin with a careful inspection, explain what we find, and give you a straightforward recommendation based on the roof’s condition, not a high-pressure sales pitch.',
      '',
      'Trusted subcontractor crews complete the roof replacement, installing the full system with close attention to underlayment, flashing, ventilation, valleys, eaves, penetrations, and final shingle alignment. Terry Preston personally manages and oversees the project, including quality, communication, and cleanup. The goal is a roof that looks clean, sheds water correctly, and protects your home for years.',
      '',
      '## Signs It May Be Time to Replace Your Roof',
      '',
      'A replacement may be appropriate when the roof has widespread curling or missing shingles, repeated leaks in different areas, extensive granule loss, soft or damaged decking, aging materials, or storm damage that affects too much of the system for a limited repair.',
      '',
      '## Repair or Replacement?',
      '',
      'Not every roofing issue requires a new roof. We inspect the full system and explain whether a targeted repair can reasonably extend its life or whether replacement provides the safer and more cost-effective long-term result.',
      '',
      '## A Complete Roofing System',
      '',
      'A dependable replacement involves more than installing new shingles. We evaluate the decking and install the required protective layers, flashing details, ventilation components, and finish materials so the system works together. High Point is an IKO ROOFPRO Select Contractor and also installs Owens Corning shingles.',
    ].join('\n'),
    benefits: [
      { title: 'Straightforward Roof Assessments', body: 'We explain the roof’s condition clearly and recommend replacement only when it is the responsible solution.' },
      { title: 'Careful Tear-Off and Deck Inspection', body: 'Removing the worn materials allows the underlying roof deck to be checked before the new system is installed.' },
      { title: 'Quality Roofing Components', body: 'We focus on the complete assembly, including underlayment, protective membrane in vulnerable areas, flashing, ventilation, and finish roofing.' },
      { title: 'Detailed Installation', body: 'Our trusted subcontractor crews pay close attention to alignment, fastening, transitions, penetrations, ridges, valleys, and other details that affect performance, and the owner personally inspects the finished work.' },
      { title: 'Clean and Respectful Worksites', body: 'We organize the project carefully, protect the surrounding property, and the owner personally oversees a thorough cleanup when the work is finished.' },
      { title: 'Clear Project Communication', body: 'The owner personally handles communication, so you receive practical information about the scope, material choices, schedule, and next steps throughout the replacement.' },
    ],
    included: [
      'Removal and disposal of existing roofing materials',
      'Inspection of the exposed roof decking',
      'Replacement of damaged decking when included in the approved scope',
      'Installation of underlayment and protection in vulnerable areas',
      'New flashing, ventilation components, and selected roofing material',
      'Final inspection and jobsite cleanup',
    ],
    process: [
      { num: 1, title: 'Schedule Your Roof Inspection', desc: 'We evaluate the roofing system, discuss active concerns, and determine whether replacement is appropriate.' },
      { num: 2, title: 'Review the Scope and Options', desc: 'We explain the recommended work, material choices, estimate, and expected project sequence.' },
      { num: 3, title: 'Prepare and Remove the Old Roof', desc: 'The crew protects the work area and removes the existing roofing materials so the deck can be examined.' },
      { num: 4, title: 'Install the New Roofing System', desc: 'We address approved deck repairs and install the protective layers, flashing, ventilation, and finish roofing.' },
      { num: 5, title: 'Complete the Final Walkthrough', desc: 'We inspect the completed roof, clean the property, and review the finished work with you.' },
    ],
    faq: [
      { q: 'How do I know whether I need roof replacement or repair?', a: 'The decision depends on the roof’s age, the extent and location of damage, the number of recurring problems, and the condition of the underlying system. High Point inspects the roof and explains both options when a repair remains practical.' },
      { q: 'Do you remove the old roofing before installing the new roof?', a: 'The project scope will state how the existing system is handled. A full tear-off allows the deck and concealed problem areas to be inspected before the new materials are installed.' },
      { q: 'What happens if damaged decking is found?', a: 'We document the affected area, explain the required correction, and address it according to the approved project scope before covering the deck with the new roofing system.' },
      { q: 'How long does roof replacement take?', a: 'Timing depends on roof size, design, material selection, weather, access, and any deck repairs discovered after tear-off. Your project schedule will be discussed before work begins.' },
      { q: 'Can you replace a storm-damaged roof through an insurance claim?', a: 'We can inspect and document storm-related roofing damage and provide a repair or replacement estimate. Coverage and claim decisions remain with your insurance carrier and depend on your policy.' },
    ],
    whereWeWork:
      'High Point Renovation & Roofing provides roof replacement throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities, with service also available in surrounding Washington communities listed within our service area.',
    related: ['roof-repairs', 'roof-inspections', 'storm-damage-repair', 'insurance-claims'],
  },

  // ────────────────────────────────────────────────────────────── Emergency Roofing
  {
    name: 'Emergency Roofing',
    slug: 'emergency-roofing',
    heroTitle: 'Emergency Roofing',
    metaTitle: 'Emergency Roofing in Kennewick, WA | High Point',
    description:
      'High Point Renovation & Roofing responds to urgent roof leaks and storm damage across Kennewick, Pasco, Richland, and the Tri-Cities with inspections, temporary protection, and repair planning.',
    description_short:
      'Urgent help for active leaks, lifted shingles, and exposed roof sections: assessment, temporary protection where appropriate, then a permanent repair plan.',
    body: [
      '## Fast Help When Your Roof Can No Longer Wait',
      '',
      'An active leak, wind-lifted shingles, fallen debris, or an exposed section of roof can quickly allow water into ceilings, insulation, walls, and electrical areas. The first priority is protecting people and limiting additional property damage without putting anyone at risk.',
      '',
      'High Point Renovation & Roofing provides urgent roofing assistance throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities. We assess the affected area, identify the likely entry point, and recommend the safest practical next step.',
      '',
      'When conditions allow and it is appropriate for the damage, temporary protection such as roof tarping may be used to reduce further water intrusion until permanent repairs can be completed. Temporary protection is not the final repair; we also explain what must be done to restore the roofing system correctly.',
      '',
      '## Roofing Problems That Need Prompt Attention',
      '',
      'Call for help when you notice active interior leaking, missing or lifted shingles, visible openings, damaged flashing, punctures from branches or debris, sagging areas, water near electrical fixtures, or storm damage that has left the roof exposed.',
      '',
      '## What to Do Before the Roofer Arrives',
      '',
      'Stay off the roof, move people and valuables away from the leaking area, use containers to catch water when safe, and avoid touching wet electrical fixtures. Take ground-level photos only when it can be done safely.',
      '',
      '## Temporary Protection and Permanent Repairs',
      '',
      'The immediate goal is to reduce exposure. After the roof is stabilized, we inspect the surrounding system and prepare a repair or replacement plan that addresses the actual cause rather than covering only the visible symptom.',
    ].join('\n'),
    benefits: [
      { title: 'Prompt, Practical Communication', body: 'We gather the essential details quickly and explain what you should do while roofing assistance is being arranged.' },
      { title: 'Safety-First Assessment', body: 'Our team evaluates access, weather, roof condition, and the affected area before recommending temporary or permanent work.' },
      { title: 'Leak Source Investigation', body: 'We look beyond the interior stain to identify damaged shingles, flashing, penetrations, seams, or other likely entry points.' },
      { title: 'Temporary Weather Protection', body: 'When appropriate and conditions permit, we can use temporary protective measures to help limit additional water intrusion.' },
      { title: 'Clear Permanent Repair Plan', body: 'Once the immediate risk is controlled, we explain the repair scope needed to restore dependable protection.' },
      { title: 'Storm Documentation Support', body: 'For weather-related incidents, we can photograph visible roofing damage and provide roofing documentation for your records.' },
    ],
    included: [
      'Initial assessment of the urgent roofing problem',
      'Inspection of the visible damage and likely leak source',
      'Temporary protection or tarping when appropriate and safe',
      'Photo documentation of accessible damaged areas',
      'Written repair or replacement recommendation',
      'Scheduling and completion of the permanent roofing work',
    ],
    process: [
      { num: 1, title: 'Contact High Point', desc: 'Tell us what happened, where water is entering, and whether the damage followed wind, rain, or falling debris.' },
      { num: 2, title: 'Protect the Interior Safely', desc: 'We provide practical safety guidance while the roofing visit is being arranged.' },
      { num: 3, title: 'Inspect and Stabilize', desc: 'The affected area is assessed and temporary protection is installed when appropriate, safe, and feasible.' },
      { num: 4, title: 'Prepare the Permanent Solution', desc: 'We identify the responsible repair scope and explain whether a focused repair or broader replacement is needed.' },
      { num: 5, title: 'Restore and Recheck the Roof', desc: 'The approved work is completed and the repaired area is reviewed for proper protection.' },
    ],
    faq: [
      { q: 'Do you provide 24-hour emergency roofing?', a: 'High Point provides urgent roofing assistance, but this page does not promise round-the-clock availability. Call as soon as you notice damage, and the team will explain the earliest available response and immediate safety steps.' },
      { q: 'Is an emergency tarp a permanent roof repair?', a: 'No. A tarp is temporary weather protection used in suitable situations to reduce additional water entry until a permanent repair can be completed.' },
      { q: 'What should I do when water is coming through the ceiling?', a: 'Keep people away from the affected area, move valuables when safe, place a container below the leak, and avoid wet electrical fixtures. Do not climb onto the roof.' },
      { q: 'Can you help after wind or storm damage?', a: 'Yes. High Point can inspect storm-related roof damage, document visible conditions, provide temporary protection when appropriate, and prepare the permanent repair scope.' },
      { q: 'Should I contact my insurance company immediately?', a: 'Follow the reporting requirements in your policy. A roofing inspection and dated photos can help document the condition, but your insurance carrier determines coverage and claim handling.' },
    ],
    whereWeWork:
      'High Point Renovation & Roofing provides emergency roofing assistance throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities, with service also available in surrounding Washington communities listed within our service area.',
    related: ['roof-repairs', 'storm-damage-repair', 'insurance-claims', 'roof-inspections'],
  },

  // ────────────────────────────────────────────────────────────── Insurance Claims
  {
    name: 'Insurance Claims',
    slug: 'insurance-claims',
    heroTitle: 'Insurance Claims',
    metaTitle: 'Roofing Insurance Claims in the Tri-Cities',
    description:
      'High Point guides Tri-Cities homeowners through every roofing insurance claim: storm-damage photos, repair estimates, and clear answers from inspection',
    description_short:
      'Roof inspections, damage documentation, and detailed estimates to support your claim. Coverage decisions stay between you and your carrier.',
    body: [
      '## Clear Roofing Support During the Insurance Claim Process',
      '',
      'Dealing with roof damage is stressful enough without also trying to understand repair scopes, photographs, estimates, adjuster appointments, and insurance paperwork. A qualified roofing contractor can help you understand the physical condition of the roof and provide organized roofing information for your records.',
      '',
      'High Point Renovation & Roofing assists homeowners throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities with roof inspections, storm-damage documentation, and repair or replacement estimates. We explain what we find in plain language and outline the roofing work required to restore the property.',
      '',
      'High Point is a roofing contractor, not an insurance carrier or public adjuster. We do not determine coverage, interpret policy rights, promise approval, or make claim decisions. Those decisions remain between you and your insurance company. Our role is to provide accurate roofing observations and complete the approved roofing work professionally.',
      '',
      '## Start With a Professional Roof Inspection',
      '',
      'A roof can have wind, impact, flashing, or water-entry damage that is difficult to evaluate from the ground. We inspect the accessible roofing system and identify conditions that may require repair or replacement.',
      '',
      '## Organized Damage Documentation',
      '',
      'Clear photos, notes, and a detailed roofing estimate can make it easier for homeowners and adjusters to understand the observed damage and recommended scope.',
      '',
      '## Repair or Replacement After Approval',
      '',
      'Once the homeowner has authorized the project and any required claim decisions have been made, High Point schedules the roofing work and restores the affected system using quality materials and careful installation.',
    ].join('\n'),
    benefits: [
      { title: 'Thorough Roofing Inspections', body: 'We examine the roof for visible storm damage, water-entry points, affected flashing, missing materials, and other relevant conditions.' },
      { title: 'Clear Photo Documentation', body: 'Accessible damage can be photographed and organized so you have a dated visual record of the roof’s condition.' },
      { title: 'Detailed Roofing Estimates', body: 'We outline the recommended repair or replacement work using a clear scope rather than vague descriptions.' },
      { title: 'Straightforward Explanations', body: 'Our team explains the roofing findings, material needs, and construction process without making unsupported promises about coverage.' },
      { title: 'Adjuster Coordination When Requested', body: 'When appropriate, we can answer roofing questions and discuss the proposed construction scope while insurance decisions remain with the carrier.' },
      { title: 'Professional Roofing Completion', body: 'After authorization, High Point completes the approved repair or replacement and performs a final quality review.' },
    ],
    included: [
      'Inspection of accessible roofing areas and storm-related concerns',
      'Photos and notes documenting visible roof damage',
      'A repair or replacement recommendation',
      'A detailed roofing estimate for the proposed scope',
      'Roofing-related communication or site coordination when appropriate',
      'Professional completion and final review of the authorized work',
    ],
    process: [
      { num: 1, title: 'Schedule the Roof Inspection', desc: 'We inspect the roofing system and identify visible damage, leak sources, and affected components.' },
      { num: 2, title: 'Document the Conditions', desc: 'We prepare photos, observations, and a clear record of the accessible damage.' },
      { num: 3, title: 'Review the Roofing Scope', desc: 'We explain whether repair or replacement is recommended and provide an estimate for the work.' },
      { num: 4, title: 'Coordinate the Authorized Project', desc: 'You handle policy and coverage decisions with your carrier while High Point addresses roofing questions related to the proposed work.' },
      { num: 5, title: 'Complete and Inspect the Work', desc: 'After authorization, we perform the roofing project, clean the site, and review the finished result.' },
    ],
    faq: [
      { q: 'Can High Point inspect my roof before I open a claim?', a: 'Yes. An inspection can help you understand whether visible storm-related roofing damage is present before you decide how to proceed.' },
      { q: 'Do you decide whether my roof damage is covered?', a: 'No. High Point can identify and document roofing conditions, but your insurance carrier determines whether a loss is covered under your policy.' },
      { q: 'Are you a public adjuster?', a: 'No. High Point is a roofing contractor. We provide construction expertise, roof documentation, and estimates; we do not represent homeowners as a public adjuster or interpret insurance policy rights.' },
      { q: 'Can you meet or communicate with the insurance adjuster?', a: 'When scheduling and circumstances allow, High Point can discuss roofing observations and the proposed construction scope. The homeowner remains responsible for the claim, and the carrier remains responsible for claim decisions.' },
      { q: 'What happens after the roofing work is authorized?', a: 'We confirm the scope, materials, and schedule, complete the approved repair or replacement, clean the property, and perform a final quality review.' },
    ],
    whereWeWork:
      'High Point Renovation & Roofing provides roofing insurance claim assistance throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities, with service also available in surrounding Washington communities listed within our service area.',
    related: ['storm-damage-repair', 'emergency-roofing', 'roof-repairs', 'roof-inspections'],
  },

  // ────────────────────────────────────────────────────────── Storm Damage Repair
  {
    name: 'Storm Damage Repair',
    slug: 'storm-damage-repair',
    heroTitle: 'Storm Damage Repair',
    metaTitle: 'Storm Damage Roof Repair | Tri-Cities, WA',
    description:
      'High Point Renovation & Roofing inspects and repairs roof damage caused by wind, hail, rain, and debris throughout Kennewick, Pasco, Richland, and the greater Tri-Cities.',
    description_short:
      'Inspection, documentation, and repair of wind, hail, rain, and impact damage, with an honest call on whether a repair or a replacement is the dependable fix.',
    body: [
      '## Storm Damage Roof Repair That Restores Real Protection',
      '',
      'Strong wind, hail, heavy rain, and falling debris can loosen or remove shingles, damage flashing, puncture roofing materials, and create openings that allow water into the structure. Some problems are obvious immediately, while others remain hidden until the next rainfall or until moisture reaches the interior.',
      '',
      'High Point Renovation & Roofing provides storm damage roof inspections and repairs throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities. We inspect the affected roof, document visible conditions, and explain whether the property needs a targeted repair, temporary protection, or a more extensive replacement.',
      '',
      'Our approach is straightforward: identify the actual damage, prevent avoidable deterioration, and restore the roof with materials and workmanship suited to the existing system.',
      '',
      '## Common Signs of Storm Damage',
      '',
      'Look for missing or lifted shingles, exposed underlayment, bent or loose flashing, punctures, fallen branches, granules collecting near downspouts, new ceiling stains, damaged vents, or debris scattered around the property.',
      '',
      '## Visible and Hidden Roofing Problems',
      '',
      'Storm damage is not always easy to see from the ground. Wind can break shingle seals, impact can weaken materials, and water can travel away from the entry point before appearing inside. A professional inspection helps determine the true scope.',
      '',
      '## Repair, Temporary Protection, or Replacement',
      '',
      'A localized issue may require a focused repair. An actively exposed area may need temporary protection before permanent work. Widespread or severe damage may make replacement the more dependable solution.',
    ].join('\n'),
    benefits: [
      { title: 'Detailed Storm Inspections', body: 'We evaluate the roofing surface, flashing, penetrations, edges, valleys, and other accessible areas for storm-related damage.' },
      { title: 'Prompt Damage Control', body: 'When urgent exposure is present, we explain the safest practical steps and provide temporary protection when appropriate and conditions permit.' },
      { title: 'Photo Documentation', body: 'Visible damage can be photographed to create a clear record for the homeowner and, when needed, the insurance process.' },
      { title: 'Honest Repair Recommendations', body: 'We explain whether a focused repair is sufficient or whether the extent of damage makes replacement the responsible option.' },
      { title: 'Quality-Matched Repairs', body: 'We select suitable repair materials and pay attention to integration with the existing roof so the repaired area performs correctly.' },
      { title: 'Local Tri-Cities Service', body: 'High Point serves the local region and understands the need for prompt, dependable communication after damaging weather.' },
    ],
    included: [
      'Inspection for wind, hail, rain, impact, and debris damage',
      'Evaluation of shingles, flashing, vents, valleys, and roof penetrations',
      'Photo documentation of accessible affected areas',
      'Temporary weather protection when appropriate and safe',
      'A detailed repair or replacement recommendation',
      'Professional restoration and final quality inspection',
    ],
    process: [
      { num: 1, title: 'Schedule a Storm Inspection', desc: 'Tell us what happened and whether you have active leaking, missing materials, or visible debris damage.' },
      { num: 2, title: 'Inspect and Document the Roof', desc: 'We evaluate accessible areas and photograph visible storm-related conditions.' },
      { num: 3, title: 'Review the Recommended Scope', desc: 'We explain whether the roof needs temporary protection, a focused repair, or broader replacement.' },
      { num: 4, title: 'Complete the Authorized Work', desc: 'Our crew restores the damaged roofing components using appropriate materials and careful installation.' },
      { num: 5, title: 'Perform the Final Quality Check', desc: 'We inspect the completed work, clean the work area, and confirm the roof is properly protected.' },
    ],
    faq: [
      { q: 'What types of storm damage do you repair?', a: 'High Point addresses roofing damage associated with wind, hail, heavy rain, fallen branches, and other debris or impact events.' },
      { q: 'Should I schedule an inspection even when I do not see a leak?', a: 'Yes. Lifted shingles, broken seals, damaged flashing, or impact marks may not create an immediate interior leak but can reduce the roof’s ability to protect the home.' },
      { q: 'How quickly should storm damage be repaired?', a: 'Damage should be assessed promptly, especially when materials are missing or water is entering the property. Delays can allow moisture to affect insulation, decking, ceilings, and walls.' },
      { q: 'Can you help document damage for an insurance claim?', a: 'Yes. High Point can inspect accessible roofing areas, photograph visible conditions, and provide a roofing estimate. Your insurance carrier determines coverage and claim approval.' },
      { q: 'Will storm damage require a complete roof replacement?', a: 'Not always. The answer depends on the severity, distribution, age, and repairability of the damage. We explain whether a targeted repair or replacement is the more dependable solution.' },
    ],
    whereWeWork:
      'High Point Renovation & Roofing provides storm damage roof repair throughout Kennewick, Pasco, Richland, West Richland, and the greater Tri-Cities, with service also available in surrounding Washington communities listed within our service area.',
    related: ['emergency-roofing', 'roof-repairs', 'roof-inspections', 'insurance-claims'],
  },
];
