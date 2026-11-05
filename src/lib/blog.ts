export type BlogPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  minutes: number;
  img: string;
  accent: "emerald" | "blue";
  featured?: boolean;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "brushing-right",
    tag: "Daily Habits",
    title: "Brushing Right: The 2x2 Rule Every Family Should Know",
    excerpt:
      "Twice a day, two minutes each. The right angle and the right pressure make all the difference.",
    author: "Dr. Farhana Islam",
    date: "Nov 2, 2026",
    minutes: 4,
    img: "/images/products/p04.png",
    accent: "emerald",
    featured: true,
    body: [
      "The 2x2 rule — brush twice a day, two minutes each time — is the single most repeatable habit dentists ask for. Two minutes sounds short, but most people finish in under 45 seconds.",
      "Hold the brush at a 45-degree angle to the gumline and use short, gentle strokes. Hard scrubbing wears enamel and recedes gums. Let the bristles do the work.",
      "Split the mouth into four quadrants and spend 30 seconds on each. A timer or an electric brush with a built-in interval cue makes this automatic.",
      "Swap your brush every 3 months, or sooner if the bristles splay. Worn bristles clean about half as well as a fresh head.",
    ],
  },
  {
    slug: "whitening-sensitivity",
    tag: "Whitening",
    title: "Whitening Without Sensitivity: What Really Works",
    excerpt:
      "Purple pastes, PAP+ formulas, LED kits - here's how to pick what's safe for you.",
    author: "Dr. Farhana Islam",
    date: "Oct 28, 2026",
    minutes: 6,
    img: "/images/products/p03.png",
    accent: "blue",
    body: [
      "Sensitivity during whitening comes from peroxide opening the enamel tubules temporarily. Modern formulas use lower peroxide concentrations plus desensitising agents to avoid that.",
      "Purple toothpastes don't bleach — they neutralise yellow tones optically. Use them for a gentle, cumulative lift without any sensitivity trade-off.",
      "PAP+ (phthalimidoperoxycaproic acid) is a peroxide-free oxidiser that whitens without opening enamel tubules. It's a good fit for people who've reacted to classic whitening gels.",
      "If you use an LED kit, follow the schedule exactly. Doubling up sessions is where sensitivity usually starts.",
    ],
  },
  {
    slug: "right-mouthwash",
    tag: "Fresh Breath",
    title: "Choosing the Right Mouthwash for Your Routine",
    excerpt: "Alcohol-free vs antiseptic rinses - and when to use each kind.",
    author: "OralCare Team",
    date: "Oct 24, 2026",
    minutes: 5,
    img: "/images/products/p11.png",
    accent: "emerald",
    body: [
      "Alcohol-free rinses are gentler on sensitive mouths and safe for daily long-term use. They freshen breath and support gum health without drying out the oral tissues.",
      "Antiseptic rinses (chlorhexidine, essential-oil based) are stronger and meant for short courses — after a dental procedure or during a flare-up. Daily use can stain teeth over time.",
      "Fluoride rinses add extra enamel protection and are useful if you're prone to cavities or wear braces. Use after brushing, not instead of.",
      "Match the rinse to the job. For most people, an alcohol-free daily rinse plus occasional antiseptic use is the right combination.",
    ],
  },
  {
    slug: "kids-oral-care",
    tag: "Kids",
    title: "Making Brushing Fun for Kids",
    excerpt:
      "Four simple tricks that turn tooth-brushing into a game your child will ask for.",
    author: "OralCare Team",
    date: "Oct 18, 2026",
    minutes: 3,
    img: "/images/cat-kids.png",
    accent: "blue",
    body: [
      "Let them pick the brush. Colour, character, flashing lights — ownership makes kids reach for their brush on their own.",
      "Play a 2-minute song. Pick the same song every day and brushing becomes a ritual with a clear start and end.",
      "Brush together. Kids copy what they see. Doing it side-by-side teaches the technique better than any explanation.",
      "Celebrate streaks. A simple sticker chart for a week of morning-and-night brushing turns habit-building into a win.",
    ],
  },
  {
    slug: "dentist-recommended",
    tag: "Expert Picks",
    title: "Dentist-Recommended Toothpastes for Sensitive Teeth",
    excerpt:
      "The specific formulations your dentist reaches for and why they work.",
    author: "Dr. Farhana Islam",
    date: "Oct 12, 2026",
    minutes: 7,
    img: "/images/products/p13.png",
    accent: "emerald",
    body: [
      "Potassium nitrate works by calming the nerve inside the tooth. Formulas with 5% KNO3 are the daily-driver recommendation for most people with cold-air sensitivity.",
      "Stannous fluoride both desensitises and protects enamel. It's especially good for people whose sensitivity comes from receded gums or acid wear.",
      "NovaMin (calcium sodium phosphosilicate) builds a mineral layer over exposed dentin. It's the pick for people who need fast relief alongside long-term repair.",
      "Give any sensitivity paste at least two weeks of twice-daily use before judging the result. The effect is cumulative.",
    ],
  },
  {
    slug: "coffee-tea-stains",
    tag: "Whitening",
    title: "Beating Coffee & Tea Stains Naturally",
    excerpt: "Three everyday habits that cut stain build-up by up to 60% in six weeks.",
    author: "OralCare Team",
    date: "Oct 5, 2026",
    minutes: 5,
    img: "/images/products/p08.png",
    accent: "blue",
    body: [
      "Rinse with water after coffee or tea. A simple swish before the tannins set shifts most surface staining before it grabs on.",
      "Drink through a straw when you can. It bypasses the front teeth entirely and dramatically slows staining on the visible surfaces.",
      "Add a whitening paste twice a week. Daily use is overkill and can be abrasive — twice a week is enough to stay on top of new stains.",
      "A professional clean every six months lifts anything that's slipped through the daily routine.",
    ],
  },
  {
    slug: "dental-floss-vs-interdental",
    tag: "Daily Habits",
    title: "Floss vs Interdental Brushes: Which is Better?",
    excerpt:
      "A simple guide to picking the right between-teeth tool for your mouth.",
    author: "Dr. Farhana Islam",
    date: "Sep 28, 2026",
    minutes: 4,
    img: "/images/cat-floss.png",
    accent: "emerald",
    body: [
      "Floss wins for tight contacts. If your teeth are packed closely, traditional floss slides in without pushing gums.",
      "Interdental brushes win for wider gaps, braces, or crowns. They clear more plaque per pass in those spaces than floss ever can.",
      "Many mouths want both. Use floss at the front where teeth are tight, and small interdental brushes at the back where gaps open up.",
      "Consistency matters more than tool choice. One mindful pass every night beats sporadic deep sessions.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
