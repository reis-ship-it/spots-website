/**
 * PITCH DECK CONTENT CONFIGURATION
 * 
 * This is the ONLY file you need to edit to update pitch deck content!
 * All text content for the pitch deck is stored here.
 * 
 * To edit: Just change the text in this file and save.
 * No coding knowledge needed - just edit the text strings!
 */

export const pitchDeckContent = {
  // Slide 1: Hero / Cover
  hero: {
    title: "SPOTS",
    tagline: "Opening doors to experiences, communities, people, meaning",
  },

  // Slide 2: The Problem
  problem: {
    title: "The Problem",
    points: [
      "Finding your spots, your people, your community is hard",
      "Current solutions are either too generic or too gamified",
      "People want authentic connections, not badges",
    ],
  },

  // Slide 3: The Philosophy
  philosophy: {
    title: "The Philosophy",
    quote: "Doors, Not Badges",
    subtitle: "Every spot is a door:",
    points: [
      "To experiences",
      "To communities",
      "To people",
      "To meaning",
    ],
    closing: "SPOTS is the key that helps you open doors when you're ready",
  },

  // Slide 4: The Journey
  journey: {
    title: "The Journey",
    flow: "Spots → Community → Events → Your People → LIFE",
    timeline: [
      {
        week: "Week 1",
        description: "\"Find me a coffee shop near work\"",
        outcome: "SPOTS suggests one matching your vibe",
      },
      {
        week: "Week 3",
        description: "SPOTS learns you return Tuesday mornings",
        outcome: "\"Hey, there's a writers' group here Wednesday evenings\"",
      },
      {
        week: "Week 5",
        description: "You attend, meet your people",
        outcome: "Your spot becomes your community",
      },
      {
        week: "Week 10",
        description: "Through SPOTS, you've opened doors to:",
        outcomes: [
          "A favorite spot (third place)",
          "A community (your people)",
          "Regular events (meaning)",
          "Connections (belonging)",
          "Life enrichment",
        ],
      },
    ],
  },

  // Slide 5: How It Works
  howItWorks: {
    title: "How It Works",
    sections: [
      {
        heading: "AI-Powered Learning",
        points: [
          "Learns which doors resonate with you",
          "Knows when you're ready for new doors",
          "Understands how you like to open doors",
        ],
      },
      {
        heading: "Effortless Discovery",
        points: [
          "No check-ins, no hassle",
          "Passive tracking (with consent)",
          "Seamless experience",
        ],
      },
    ],
  },

  // Slide 6: Key Features
  features: {
    title: "Key Features",
    items: [
      {
        title: "Personalized Recommendations",
        description: "Based on your vibe, not algorithms",
      },
      {
        title: "Community Discovery",
        description: "Every spot is a door to community",
      },
      {
        title: "Event Integration",
        description: "Find events at your spots",
      },
      {
        title: "Privacy-First",
        description: "Your data, your control",
      },
      {
        title: "Authentic Feedback",
        description: "Real, balanced reviews matter",
      },
    ],
  },

  // Slide 7: What Makes SPOTS Different
  different: {
    title: "What Makes SPOTS Different",
    points: [
      {
        title: "No Agenda",
        description: "No pay-to-play, no politics",
      },
      {
        title: "Authenticity Over Algorithms",
        description: "Real data, not advertising dollars",
      },
      {
        title: "Belonging First",
        description: "Helping people find where they belong",
      },
      {
        title: "Privacy & Control",
        description: "Non-negotiable",
      },
    ],
  },

  // Slide 8: The Technology
  technology: {
    title: "The Technology",
    points: [
      "AI2AI Network - Distributed intelligence",
      "ONNX-based Inference - Efficient ML models",
      "Real-time Learning - Always improving",
      "Offline-First - Works everywhere",
    ],
  },

  // Slide 9: Market Opportunity
  market: {
    title: "Market Opportunity",
    points: [
      "The \"third place\" problem",
      "Community connection gap",
      "Authentic discovery vs. gamification",
    ],
  },

  // Slide 10: Vision
  vision: {
    title: "Vision",
    quote: "SPOTS gives you LIFE",
    description: "Building authentic connections",
    subtitle: "Opening doors for everyone, everywhere",
  },

  // Slide 11: Call to Action
  cta: {
    title: "Join Us",
    message: "Building the future of community discovery",
    contact: "Get in touch to learn more",
    // Add your contact information here:
    email: "hello@spots.app", // EDIT THIS
    // You can add more contact info:
    // phone: "+1 (555) 123-4567",
    // website: "https://spots.app",
  },
} as const;

// Type export for TypeScript (optional - helps with autocomplete)
export type PitchDeckContent = typeof pitchDeckContent;

