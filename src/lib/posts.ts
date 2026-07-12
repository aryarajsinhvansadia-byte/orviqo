export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readingTime: string;
  tag: string;
  body: { h?: string; p?: string; list?: string[]; quote?: string }[];
};

export const posts: Post[] = [
  {
    slug: "speed-is-a-brand-value",
    title: "Speed is a brand value",
    excerpt:
      "Nobody has ever described a slow website as luxurious. Performance isn't an engineering metric — it's how your brand behaves under pressure.",
    date: "2026-06-18",
    dateLabel: "June 2026",
    readingTime: "6 min",
    tag: "Craft",
    body: [
      {
        p: "Walk into a good hotel and someone opens the door before your hand reaches it. That's what a fast website feels like. Walk into a bad one and you stand in a queue watching a spinner — and no amount of marble in the lobby fixes the memory of the wait.",
      },
      {
        p: "We've audited dozens of premium brands whose sites take four seconds to show a headline. Four seconds of nothing, wearing a luxury logo. The industry calls this a performance problem. It's a brand problem wearing a lab coat.",
      },
      { h: "What slowness says" },
      {
        p: "Visitors don't experience milliseconds; they experience implications. A hesitant site implies a hesitant company. Research keeps confirming what intuition already knew: perceived quality collapses as load time grows, and the effect is strongest for brands positioned as premium — because the gap between promise and behaviour is widest.",
      },
      {
        p: "The inverse is also true, and it's the cheapest brand upgrade available. A site that responds instantly reads as competence before a single word is read. Speed is the one aesthetic every culture, language and age group agrees on.",
      },
      { h: "Budgets, not audits" },
      {
        p: "Most teams treat performance as a cleanup phase: build the thing, then run an audit and negotiate with the damage. By then the expensive decisions — the hero video, the font zoo, the tag manager buffet — are load-bearing.",
      },
      {
        p: "The fix is boring and works: set the budget before the first pixel. At ORVIQO every project starts with three numbers — largest contentful paint under 1.2 seconds, interaction latency under 100 milliseconds, zero layout shift. Design proposals that can't meet the numbers don't get built. It's astonishing how creative constraints make you when they're non-negotiable.",
      },
      {
        quote:
          "A site that hesitates feels cheap, whatever it looks like.",
      },
      { h: "Where the seconds hide" },
      {
        list: [
          "Fonts: two families, subset and preloaded, beat five families every time — aesthetically too.",
          "Third-party scripts: every marketing tag is a small tax on every visitor forever. Audit quarterly; delete generously.",
          "Images: art-direct per breakpoint. A 4K hero cropped by CSS on mobile is money burned twice.",
          "JavaScript: most marketing pages need almost none. Ship HTML; hydrate only what moves.",
        ],
      },
      {
        p: "None of this is exotic. It's discipline, applied early, held throughout. Which — not coincidentally — is also a working definition of craft.",
      },
    ],
  },
  {
    slug: "your-ai-should-be-invisible",
    title: "Your AI should be invisible",
    excerpt:
      "The best AI on a website is the kind visitors never notice. A field guide to adding intelligence without adding a gimmick.",
    date: "2026-05-02",
    dateLabel: "May 2026",
    readingTime: "7 min",
    tag: "AI",
    body: [
      {
        p: "There's a new ritual in web design: the floating chat bubble, bottom right, pulsing for attention like a needy pet. It's the most visible way to add AI to a website — and usually the least valuable.",
      },
      {
        p: "After two years of building AI into client sites, our strongest finding is almost a paradox: the value of AI on the web is inversely proportional to how much it looks like AI.",
      },
      { h: "The visibility trap" },
      {
        p: "Visible AI makes a promise: talk to me like a person. Most implementations then break that promise within three messages, and the visitor leaves with a worse impression than if the feature never existed. The demo was the product; the product is the disappointment.",
      },
      {
        p: "Invisible AI makes no promises. It just quietly makes things better: the search that understands 'that blue vase from the spring drop', the form that's already filled in what it can know, the support reply that arrives in ninety seconds because a model drafted it and a human approved it.",
      },
      { h: "Three questions before you build" },
      {
        list: [
          "What work disappears? If you can't name the hours saved — for the customer or your team — you're buying a demo, not a system.",
          "What happens when it's wrong? Every AI is sometimes wrong. Wrong with an escalation path is a feature; wrong with confidence is a lawsuit.",
          "Would this survive without the label? If the feature is only impressive because it says 'AI', it won't be impressive for long.",
        ],
      },
      { h: "A pattern that works" },
      {
        p: "The healthcare network we work with wanted a chatbot. What they needed was for a third of their phone calls — hours, parking, insurance — to answer themselves. We built a narrow assistant with a verified knowledge base, live calendar booking and a hard rule: anything clinical goes to a human, instantly.",
      },
      {
        p: "It has no personality. It tells no jokes. It answers correctly, cites its sources, and books appointments at 2am. Call volume fell 63%, and patient satisfaction went up. Nobody has ever complimented the chatbot — which is exactly the point. They compliment the clinic.",
      },
      {
        quote: "Your customers should feel the speed, never the machinery.",
      },
      {
        p: "The web's best interfaces have always been the ones that get out of the way. AI doesn't change that rule. It just raises the ceiling on how much can get out of the way.",
      },
    ],
  },
  {
    slug: "against-the-redesign-cycle",
    title: "The case against the redesign cycle",
    excerpt:
      "Every three years, companies burn their website down and start over. There's a better way to spend that money — and it compounds.",
    date: "2026-03-20",
    dateLabel: "March 2026",
    readingTime: "5 min",
    tag: "Strategy",
    body: [
      {
        p: "Somewhere in your company's future there's a meeting where someone says the website feels dated, and a six-figure redesign is born. Eighteen months after it launches, the cycle begins again. This is the standard rhythm of corporate web design, and it's a bonfire with a project plan.",
      },
      { h: "Why redesigns keep failing" },
      {
        p: "The big-bang redesign resets everything at once: information architecture, URLs, content, analytics baselines and all the small hard-won fixes nobody documented. Rankings dip. Muscle memory breaks. And because the whole budget went to launch day, there's nothing left for the year of small corrections every launch needs.",
      },
      {
        p: "Worst of all, redesigns optimise for the internal audience — the board sees a shiny new thing — while customers, who were mid-relationship with the old site, get their furniture rearranged overnight.",
      },
      { h: "What compounding looks like" },
      {
        p: "The alternative isn't neglect. It's tending: a continuous cadence of measurement, experiment and refinement on a foundation built to evolve. Change the hero, watch the numbers, keep what works. Fix the checkout step where 30% quietly leave. Add the page that answers the question sales hears every week.",
      },
      {
        list: [
          "Month-over-month improvements survive; big bangs reset.",
          "Experiments teach you about your customers; redesigns teach you about your agency.",
          "A tended site never 'feels dated' — because it never stops absorbing the present.",
        ],
      },
      {
        quote: "Websites are gardens, not statues.",
      },
      { h: "When a rebuild is honest" },
      {
        p: "Sometimes the foundation really is the problem — a platform that fights every change, a brand that pivoted, debt that costs more to carry than to clear. Then rebuild, once, properly: on foundations designed for the next decade of small changes, with a care plan budgeted from day one.",
      },
      {
        p: "The goal isn't to never redesign. It's to make this redesign your last one — and everything after it, gardening.",
      },
    ],
  },
  {
    slug: "winning-the-answer-box",
    title: "SEO when nobody clicks",
    excerpt:
      "AI answers are eating search clicks. The brands that survive will be the ones machines quote — here's how citation-worthiness gets built.",
    date: "2026-02-06",
    dateLabel: "February 2026",
    readingTime: "6 min",
    tag: "Growth",
    body: [
      {
        p: "For twenty years, SEO had one deal: rank, get the click, make the click count. That deal is being renegotiated without your signature. A growing share of searches now end on the results page — answered by a machine that read your website and summarised it, byline optional.",
      },
      {
        p: "Panic is optional too. The brands losing here are the ones that optimised for the click alone. The ones winning built something machines find quotable — and that turns out to be the same thing humans find trustworthy.",
      },
      { h: "How machines choose their sources" },
      {
        p: "AI answer engines favour pages that state facts plainly, structure them semantically, and corroborate them elsewhere. They quote the site that says 'installation takes 45 minutes and costs between X and Y' over the one that says 'our world-class team delivers seamless solutions'. Vague copy isn't just weak marketing anymore; it's invisible to the machines doing your customers' reading.",
      },
      { h: "The new checklist" },
      {
        list: [
          "Answer real questions in full sentences a machine could lift verbatim — then earn the deeper visit with what surrounds them.",
          "Structured data everywhere it's honest: products, FAQs, locations, people. Schema is how you introduce yourself to a crawler.",
          "Be the primary source for something. Machines cite originals; publish the data, teardown or pricing honesty your industry avoids.",
          "Keep classic SEO hygiene — speed, semantics, sitemaps — because answer engines inherit their reading lists from search indexes.",
        ],
      },
      { h: "Clicks were never the point" },
      {
        p: "The uncomfortable, liberating truth: traffic was always a proxy. The point was to be chosen. When a machine tells a thousand people 'Ondo is the boutique hotel in Kyoto with the private onsen rooms', no click occurred — and the only brand that lost is the one that wasn't mentioned.",
      },
      {
        quote: "Be the answer, not the ad.",
      },
      {
        p: "Write for the reader, structure for the machine, and be genuinely the best source for something specific. That strategy has now survived every algorithm era since the web began. It will survive this one.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
