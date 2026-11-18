export type BlogPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole?: string;
  date: string;
  minutes: number;
  img: string;
  accent: "emerald" | "blue";
  featured?: boolean;
  recommendedProductSlugs?: string[];
  sections: {
    heading: string;
    content: string;
    tip?: string;
  }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "brushing-right",
    tag: "Daily Habits",
    title: "Brushing Right: The 2x2 Rule Every Family Should Know",
    excerpt:
      "Twice a day, two full minutes each time. The right angle and gentle pressure protect your enamel and gums for life.",
    author: "Dr. Farhana Islam",
    authorRole: "BDS, MPH, Dental Surgeon",
    date: "Nov 15, 2026",
    minutes: 4,
    img: "/images/products/p04.png",
    accent: "emerald",
    featured: true,
    recommendedProductSlugs: ["sensodyne-rapid-relief", "oral-b-pro-100-crossaction"],
    sections: [
      {
        heading: "1. What is the 2x2 Rule?",
        content:
          "The 2x2 rule is universally recommended by Australian and global dental associations: brush twice every single day, for two whole minutes each session. Most people believe they brush long enough, but clinical timers show the average person stops in under 45 seconds! Two minutes gives the fluoride in your toothpaste sufficient contact time to remineralize enamel and loosen sticky bacterial plaque from hard-to-reach tooth surfaces.",
        tip: "Set a 2-minute timer on your phone or use an electric toothbrush with a built-in vibration quadrant timer.",
      },
      {
        heading: "2. The 45-Degree Angle Technique",
        content:
          "Never scrub back and forth like you're scrubbing a floor tile. Hold the bristles at a 45-degree angle pointing gently towards the gumline. Use circular, vibrating motions to sweep away plaque without cutting into the delicate gingival margin. Heavy scrubbing causes irreversible gum recession and root exposure, which is the number one cause of cold sensitivity.",
      },
      {
        heading: "3. Quadrant Division",
        content:
          "Mentally divide your mouth into four quadrants: upper right, upper left, lower left, and lower right. Spend 30 focused seconds on each quadrant. Clean the outer chewing surfaces, the inner tongue-facing surfaces, and the deep chewing grooves of your molars.",
        tip: "Don't rinse vigorously with water immediately after brushing! Just spit out the excess toothpaste. Leaving a thin veil of fluoride boosts overnight cavity protection.",
      },
      {
        heading: "4. When to Replace Your Toothbrush",
        content:
          "Toothbrush bristles splay and lose elasticity after 90 days. Worn bristles clean 45% less plaque and harbor bacteria. If you have been sick with a cold or throat infection, always replace your toothbrush head immediately to prevent reinfection.",
      },
    ],
  },
  {
    slug: "whitening-sensitivity",
    tag: "Whitening",
    title: "Whitening Without Sensitivity: What Really Works",
    excerpt:
      "Purple optical pastes, PAP+ peroxide-free formulas, and LED kits. Here is how to achieve a radiant white smile safely without pain.",
    author: "Dr. Farhana Islam",
    authorRole: "BDS, MPH, Dental Surgeon",
    date: "Nov 08, 2026",
    minutes: 6,
    img: "/images/products/p03.png",
    accent: "blue",
    featured: false,
    recommendedProductSlugs: ["white-glo-pure-white-kit", "white-glo-deep-stain-remover"],
    sections: [
      {
        heading: "1. Why Does Classic Teeth Whitening Hurt?",
        content:
          "Traditional peroxide whitening gels work by penetrating deep into the microscopic pores of your tooth enamel. While breaking up stubborn organic stains, they temporarily dehydrate the tooth and expose microscopic dentinal tubules, allowing temperature sensations to hit the internal tooth nerve directly.",
        tip: "If you have experienced sensitivity before, avoid high-percentage hydrogen peroxide gels and opt for PAP+ (phthalimidoperoxycaproic acid) technology.",
      },
      {
        heading: "2. The Magic of PAP+ Whitening",
        content:
          "Developed in Australia, PAP+ is a revolutionary non-peroxide whitening agent that oxidizes tooth stains without releasing free radicals that degrade enamel or trigger neural sensitivity. It whitens extrinsic coffee and tea stains safely with zero downtime.",
      },
      {
        heading: "3. How Purple Optical Correctors Work",
        content:
          "Purple toothpastes utilize color theory (purple and yellow are direct opposites on the color wheel). Applying a purple hue directly neutralizes yellowish tones on the enamel surface, giving an immediate, visible optical brightening effect ideal before events, weddings, or photoshoots.",
      },
      {
        heading: "4. Daily Post-Whitening Maintenance",
        content:
          "During the first 48 hours after whitening, avoid dark curries, turmeric, black tea, espresso, and red sauces. Use a fluoride-rich remineralizing toothpaste to seal the enamel surface.",
      },
    ],
  },
  {
    slug: "dentist-recommended",
    tag: "Expert Picks",
    title: "Dentist-Recommended Toothpastes for Sensitive Teeth",
    excerpt:
      "The specific active ingredients dentists look for: Potassium Nitrate, NovaMin, and Stannous Fluoride explained.",
    author: "Dr. Farhana Islam",
    authorRole: "BDS, Dental Surgeon",
    date: "Oct 30, 2026",
    minutes: 5,
    img: "/images/products/p13.png",
    accent: "emerald",
    recommendedProductSlugs: ["sensodyne-rapid-relief", "sensodyne-pronamel-daily-protection"],
    sections: [
      {
        heading: "1. Understanding Tooth Sensitivity",
        content:
          "Dentinal hypersensitivity happens when enamel wears thin or the gumline recedes, exposing thousands of microscopic fluid-filled tubules leading directly to the tooth nerve. Cold water, ice cream, or even a gust of winter air causes rapid fluid movement, which triggers a sharp nerve shock.",
      },
      {
        heading: "2. How Potassium Nitrate Calms the Nerve",
        content:
          "Potassium nitrate works by desensitizing the nerve fibers inside the pulp. With consistent twice-daily use, potassium ions accumulate around the sensory nerve endings, preventing them from firing pain signals to your brain.",
        tip: "Allow 10 to 14 days of regular use for potassium nitrate toothpastes to reach maximum clinical effectiveness.",
      },
      {
        heading: "3. NovaMin: Rebuilding Tooth Enamel",
        content:
          "NovaMin (calcium sodium phosphosilicate) releases bio-available calcium and phosphate ions when exposed to saliva. It forms a resilient hydroxyapatite-like protective mineral layer directly over the open tubules, essentially creating a new artificial shield over your teeth.",
      },
    ],
  },
  {
    slug: "right-mouthwash",
    tag: "Fresh Breath",
    title: "Choosing the Right Mouthwash for Your Routine",
    excerpt:
      "Alcohol-free vs antiseptic rinses: understand when and how to rinse for 24-hour fresh breath and healthy gums.",
    author: "OralCare Editorial Team",
    date: "Oct 24, 2026",
    minutes: 5,
    img: "/images/products/p11.png",
    accent: "blue",
    recommendedProductSlugs: ["therabreath-fresh-breath-oral-rinse", "listerine-total-care-zero"],
    sections: [
      {
        heading: "1. Why Alcohol-Free is Superior for Daily Use",
        content:
          "Traditional drugstore mouthwashes often contain up to 20% denatured alcohol. While this creates a stinging burn that feels 'clean', alcohol is an astringent that severely dehydrates your oral tissues. A dry mouth (xerostomia) allows anaerobic bacteria to flourish, paradoxically worsening morning breath hours later!",
        tip: "Look for oxygenating compounds like Sodium Chlorite (OXYD-8 in TheraBreath) which destroy sulfur compounds without drying your mouth.",
      },
      {
        heading: "2. Antiseptic vs Fluoride Rinses",
        content:
          "Chlorhexidine antiseptic rinses are medical grade prescriptions meant for short 1-2 week courses following tooth extractions or severe gingivitis. For daily use, choose an alcohol-free fluoride or oxygenating rinse.",
      },
      {
        heading: "3. When in Your Routine Should You Rinse?",
        content:
          "Do not rinse immediately after brushing, or you will wash away the concentrated fluoride from your toothpaste. Instead, use your mouthwash at mid-day after lunch or 30 minutes after your morning brush.",
      },
    ],
  },
  {
    slug: "kids-oral-care",
    tag: "Kids",
    title: "Making Brushing Fun for Kids: A Parent's Guide",
    excerpt:
      "Turn twice-daily tooth brushing from a bedtime battle into an exciting adventure your children look forward to.",
    author: "Dr. Farhana Islam",
    authorRole: "BDS, Paediatric Oral Health",
    date: "Oct 18, 2026",
    minutes: 4,
    img: "/images/cat-kids.png",
    accent: "emerald",
    recommendedProductSlugs: ["colgate-kids-fruit-toothpaste", "oral-b-stages-power-kids"],
    sections: [
      {
        heading: "1. Give Them Agency and Ownership",
        content:
          "Take your child shopping or browse online together and let them pick their own toothbrush color, favorite cartoon character, and mild fruit-flavored toothpaste. Ownership transforms brushing from a chore forced by parents into a fun personal tool.",
      },
      {
        heading: "2. The Two-Minute Dance Track",
        content:
          "Pick a cheerful 2-minute song on YouTube or Spotify. When the music plays, everybody brushes! Tell your child to brush until the song ends. This naturally removes the time battle.",
        tip: "Use a simple sticker chart on the bathroom mirror. 7 consecutive days of brushing morning and night earns a weekend reward!",
      },
      {
        heading: "3. Brush Side-by-Side",
        content:
          "Children are visual imitators. Standing beside them and brushing your own teeth demonstrates the correct angle and enthusiasm far better than verbal instructions.",
      },
    ],
  },
  {
    slug: "coffee-tea-stains",
    tag: "Whitening",
    title: "Beating Coffee & Tea Stains Naturally",
    excerpt:
      "How to enjoy your daily cha and coffee while keeping your enamel bright and stain-free.",
    author: "OralCare Editorial Team",
    date: "Oct 10, 2026",
    minutes: 4,
    img: "/images/products/p08.png",
    accent: "blue",
    recommendedProductSlugs: ["white-glo-coffee-tea-stain-paste", "white-glo-activated-charcoal"],
    sections: [
      {
        heading: "1. The Science of Tannins",
        content:
          "Black tea and coffee are rich in natural polyphenols called tannins. Tannins make it easy for chromogens (pigment compounds) to latch onto the microscopic proteins of dental pellicle on your teeth, leading to dull yellow and brown staining.",
      },
      {
        heading: "2. The 30-Second Water Swish",
        content:
          "After finishing your tea or coffee, immediately take a sip of plain water and swish it around your mouth before swallowing or spitting. This simple 10-second habit rinses away 70% of tannins before they have time to bind with your enamel.",
        tip: "Drink iced coffees or cold teas through a glass or stainless steel straw to bypass your front teeth altogether.",
      },
      {
        heading: "3. Micro-Wax Enamel Coating",
        content:
          "Specialized coffee & tea toothpastes formulate micro-polishing particles with Carnauba wax micro-shields that leave an invisible barrier on enamel, repelling new beverage stains throughout the working day.",
      },
    ],
  },
  {
    slug: "dental-floss-vs-interdental",
    tag: "Daily Habits",
    title: "Floss vs Interdental Brushes: Which is Better?",
    excerpt:
      "A clinical comparison of string floss, water flossers, and interdental brushes to help you clean between teeth.",
    author: "Dr. Farhana Islam",
    date: "Oct 02, 2026",
    minutes: 5,
    img: "/images/cat-floss.png",
    accent: "emerald",
    recommendedProductSlugs: ["oral-b-essential-floss", "piksters-interdental-brushes"],
    sections: [
      {
        heading: "1. Why Your Toothbrush Only Cleans 60% of Your Teeth",
        content:
          "Even the most advanced electric toothbrush can only reach the front, back, and biting surfaces of teeth. The 40% of surface area between tightly packed teeth remains completely untouched by bristles, which is where 80% of adult cavities and gum infections start.",
      },
      {
        heading: "2. When Traditional String Floss Wins",
        content:
          "String floss is unmatched for tight contact points where teeth overlap or press closely together. It hugs the side of the tooth in a 'C' shape, sliding below the gumline to lift plaque without trauma.",
        tip: "Never snap floss downwards into the gums! Gently saw it through the contact point, then curve it around the tooth.",
      },
      {
        heading: "3. Why Interdental Brushes Win for Gum Health",
        content:
          "For spaces where gums have slightly receded, around dental implants, bridges, or orthodontic braces, interdental brushes clean significantly more plaque per stroke than string floss.",
      },
    ],
  },
  {
    slug: "bleeding-gums-prevention",
    tag: "Gum Health",
    title: "Bleeding Gums: Causes, Treatment & Prevention",
    excerpt:
      "Gums should never bleed when brushing. Learn how to reverse early gingivitis before it progresses to permanent bone loss.",
    author: "Dr. Farhana Islam",
    authorRole: "BDS, Periodontal Care",
    date: "Sep 22, 2026",
    minutes: 6,
    img: "/images/products/p05.png",
    accent: "emerald",
    recommendedProductSlugs: ["parodontax-gum-protection-paste", "therabreath-periodontist-rinse"],
    sections: [
      {
        heading: "1. Bleeding is an Alarm Bell",
        content:
          "If your hands bled when you washed them, you would seek medical attention immediately! Yet millions of people ignore bleeding gums when brushing. Gums bleed because bacterial plaque toxins irritate the gingival tissue, causing micro-ulcerations and inflammation (gingivitis).",
      },
      {
        heading: "2. The Common Mistake: Stopping Brushing",
        content:
          "When people see blood, their instinct is to stop brushing that area. This makes the infection worse because more plaque accumulates! You must gently continue brushing with an ultra-soft bristle brush to clear the bacteria.",
        tip: "Switch to a specialized gum-repair toothpaste containing sodium bicarbonate or stannous fluoride.",
      },
      {
        heading: "3. Reversibility in 14 Days",
        content:
          "The wonderful news about early gingivitis is that it is 100% reversible. Consistent daily brushing and flossing can restore firm, pink, healthy gums in as little as two weeks.",
      },
    ],
  },
  {
    slug: "electric-vs-manual-brush",
    tag: "Expert Picks",
    title: "Electric Toothbrush vs Manual: Is It Worth the Upgrade?",
    excerpt:
      "Clinical studies demonstrate 21% more plaque removal and 11% gum inflammation reduction. Here is what makes electric brushes worth it.",
    author: "Dr. Farhana Islam",
    date: "Sep 15, 2026",
    minutes: 5,
    img: "/images/cat-electric-brush.png",
    accent: "blue",
    recommendedProductSlugs: ["oral-b-pro-100-crossaction", "oral-b-vitality-precision-clean"],
    sections: [
      {
        heading: "1. Oscillating vs Manual Speed",
        content:
          "A manual toothbrush delivers roughly 300 brush strokes per minute. A modern rechargeable electric brush oscillates, rotates, and pulsates up to 48,000 times per minute! This micro-vibration creates dynamic fluid action that pushes toothpaste between teeth.",
      },
      {
        heading: "2. Pressure Sensors Protect Your Gums",
        content:
          "The biggest advantage of quality electric brushes is the smart pressure sensor. If you push too hard, the sensor lights up red and slows down the motor speed, preventing enamel abrasion and gum recession.",
        tip: "Simply guide the brush head gently along each tooth without scrubbing. Let the motor do 100% of the work.",
      },
      {
        heading: "3. Long-term Value",
        content:
          "While an electric brush has a higher initial investment, replacement heads last 3 months just like manual brushes, and avoiding one costly dental filling pays for the brush many times over.",
      },
    ],
  },
  {
    slug: "bad-breath-halitosis-cure",
    tag: "Fresh Breath",
    title: "The Ultimate Guide to Curing Chronic Bad Breath",
    excerpt:
      "Chewing gum only masks odor. Here is how to eliminate volatile sulfur compounds (VSCs) at the root source for all-day confidence.",
    author: "OralCare Editorial Team",
    date: "Sep 05, 2026",
    minutes: 5,
    img: "/images/products/p11.png",
    accent: "emerald",
    recommendedProductSlugs: ["therabreath-fresh-breath-oral-rinse", "white-glo-deep-stain-remover"],
    sections: [
      {
        heading: "1. Where Does Bad Breath Truly Originate?",
        content:
          "90% of chronic bad breath (halitosis) originates in the mouth, not the stomach. Anaerobic bacteria living under the tongue papillae and deep in periodontal pockets feed on leftover proteins and release foul-smelling Volatile Sulfur Compounds (VSCs) like hydrogen sulfide (rotten egg smell) and methyl mercaptan.",
      },
      {
        heading: "2. The Power of Tongue Scraping",
        content:
          "Your tongue has a textured surface with thousands of tiny crevices. Gently scraping your tongue from back to front each morning removes millions of bacteria and food residue that no toothbrush bristle can effectively clear.",
        tip: "Use a dedicated stainless steel or silicone tongue cleaner every morning before eating.",
      },
      {
        heading: "3. Neutralizing Sulfur with Chlorine Dioxide",
        content:
          "Instead of covering breath with artificial mint perfume, advanced oxygenating rinses break the chemical bonds of sulfur molecules on contact, turning odor into odorless, harmless compounds.",
      },
    ],
  },
  {
    slug: "braces-and-ortho-care",
    tag: "Daily Habits",
    title: "How to Keep Teeth Clean & Plaque-Free with Braces",
    excerpt:
      "Braces create dozens of plaque traps. How to clean around brackets and wires to avoid white spot lesions after removal.",
    author: "Dr. Farhana Islam",
    authorRole: "BDS, Orthodontic Dental Surgeon",
    date: "Aug 28, 2026",
    minutes: 6,
    img: "/images/cat-toothpaste.png",
    accent: "blue",
    recommendedProductSlugs: ["sensodyne-pronamel-daily-protection", "oral-b-essential-floss"],
    sections: [
      {
        heading: "1. The Danger of Decalcification (White Spots)",
        content:
          "When brackets and wires are cemented on teeth, plaque clings tightly around the metal boundaries. If plaque is left untouched, acids eat away minerals, leaving chalky white squares (decalcification) that are permanently visible once braces are removed.",
      },
      {
        heading: "2. Essential Tools for Braces Wearers",
        content:
          "1. Orthodontic V-cut toothbrush.<br />2. Interdental brushes for sliding underneath the archwires.<br />3. Floss threaders or Ortho-picks designed to navigate around brackets.<br />4. Alcohol-free fluoride rinse for remineralizing enamel.",
        tip: "Always carry a portable travel toothbrush kit to rinse and brush after lunch at work or school.",
      },
      {
        heading: "3. Foods to Avoid",
        content:
          "Hard nuts, sticky toffee, chewing gum, and biting into whole raw apples can snap brackets and bend archwires. Cut fruits into bite-sized wedges and chew gently with your back molars.",
      },
    ],
  },
  {
    slug: "night-grinding-bruxism",
    tag: "Expert Picks",
    title: "Teeth Grinding (Bruxism): Symptoms, Damage & Protection",
    excerpt:
      "Waking up with jaw pain, dull headaches, or flattening tooth edges? You might be clenching and grinding in your sleep.",
    author: "Dr. Farhana Islam",
    date: "Aug 15, 2026",
    minutes: 5,
    img: "/images/products/p01.png",
    accent: "emerald",
    recommendedProductSlugs: ["sensodyne-rapid-relief", "sensodyne-pronamel-daily-protection"],
    sections: [
      {
        heading: "1. The Hidden Epidemic of Sleep Bruxism",
        content:
          "Up to 30% of adults clench or grind their teeth during deep sleep without realizing it. Stress, caffeine, screen time, and bite misalignment can cause nighttime jaw clenching with up to 250 pounds of force per square inch!",
      },
      {
        heading: "2. How to Identify the Symptoms",
        content:
          "Common warning signs include: waking up with a dull tension headache, sore jaw muscles (masseter), flat or chipped front teeth edges, and unexplained enamel sensitivity to cold liquids.",
        tip: "Look at your lower front teeth in the mirror. If the top biting edge looks flat, shiny, and yellow dentin is exposed, you are likely grinding.",
      },
      {
        heading: "3. How a Dental Night Guard Protects You",
        content:
          "A cushioned dental night guard acts as a protective shock absorber between your upper and lower arches. It absorbs grinding pressure, relaxes jaw muscles, and prevents catastrophic tooth fracture.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
