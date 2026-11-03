import {
  Brain,
  BrainCircuit,
  BriefcaseBusiness,
  Gauge,
  HeartPulse,
  Network,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import type {
  AssessmentCatalogItem,
} from "../types/assessment.types";

export const assessmentCatalog:
  AssessmentCatalogItem[] = [
    {
      id: "big-five",

      title:
        "Big Five Personality",

      eyebrow:
        "Trait-based personality",

      description:
        "The 50-item IPIP Big Five profile across Extraversion, Agreeableness, Conscientiousness, Emotional Stability and Intellect/Imagination.",

      tier: "free",

      duration:
        "8–10 min",

      itemCountLabel:
        "50 items",

      icon: Brain,

      tags: [
        "IPIP",
        "Big Five",
        "Public Domain",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "IPIP-50 via OpenScales",

      licenseLabel:
        "Public Domain",

      resultKind:
        "profile",

      instrumentPath:
        "big-five.json",

      preferredMetricKeys: [
        "extraversion_mean",
        "agreeableness_mean",
        "conscientiousness_mean",
        "emotional_stability_mean",
        "intellect_mean",
        "extraversion",
        "agreeableness",
        "conscientiousness",
        "emotional_stability",
        "intellect",
        "openness",
      ],

      note:
        "Scores stay on the instrument's original 1–5 scale. Pulse does not convert them into fake percentiles.",
    },

    {
      id: "riasec",

      title:
        "RIASEC Career Interests",

      eyebrow:
        "Holland career interests",

      description:
        "A six-domain vocational-interest profile across Realistic, Investigative, Artistic, Social, Enterprising and Conventional interests.",

      tier: "free",

      duration:
        "6–10 min",

      itemCountLabel:
        "30 or 48 items",

      icon:
        BriefcaseBusiness,

      tags: [
        "RIASEC",
        "Career",
        "Evidence-based",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "O*NET Mini-IP / IPIP fallback",

      licenseLabel:
        "Open licensed",

      resultKind:
        "riasec",

      instrumentPath:
        "riasec.json",

      preferredMetricKeys: [
        "R",
        "I",
        "A",
        "S",
        "E",
        "C",
      ],

      note:
        "The sync script prefers the official O*NET Mini-IP when a free O*NET API key is supplied; otherwise it vendors the public-domain IPIP RIASEC markers.",
    },

    {
      id: "eq-quick",

      title:
        "Social / Emotional Intelligence",

      eyebrow:
        "Interpersonal intelligence",

      description:
        "A short public-domain IPIP character-strength scale focused on reading people, social awareness and interpersonal effectiveness.",

      tier: "free",

      duration:
        "2–3 min",

      itemCountLabel:
        "7 items",

      icon:
        HeartPulse,

      tags: [
        "EQ",
        "IPIP-VIA",
        "Public Domain",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "IPIP-VIA Social Intelligence",

      licenseLabel:
        "Public Domain",

      resultKind:
        "scale",

      instrumentPath:
        "eq-quick.json",

      preferredMetricKeys: [
        "social_intelligence_mean",
        "social_intelligence",
      ],
    },

    {
      id:
        "self-efficacy",

      title:
        "General Self-Efficacy",

      eyebrow:
        "Confidence under challenge",

      description:
        "A 10-item measure of perceived ability to cope with difficult demands and unexpected situations.",

      tier: "free",

      duration:
        "3–4 min",

      itemCountLabel:
        "10 items",

      icon:
        ShieldCheck,

      tags: [
        "GSE",
        "Coping",
        "Validated",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "General Self-Efficacy Scale",

      licenseLabel:
        "CC BY 4.0",

      resultKind:
        "scale",

      instrumentPath:
        "self-efficacy.json",

      preferredMetricKeys: [
        "self_efficacy",
      ],
    },

    {
      id:
        "type16-explorer",

      title:
        "16-Type Preference Explorer",

      eyebrow:
        "Jungian-style preferences",

      description:
        "An original preference exercise across E/I, S/N, T/F and J/P for reflecting on work and communication style.",

      tier: "free",

      duration:
        "4–5 min",

      itemCountLabel:
        "8 original items",

      icon:
        BrainCircuit,

      tags: [
        "16-Type",
        "Exploratory",
        "Pulse Original",
      ],

      sourceKind:
        "local",

      sourceLabel:
        "Pulse original",

      licenseLabel:
        "Pulse Original",

      resultKind:
        "type16",

      note:
        "Not the official MBTI® assessment. It is intentionally labeled as an exploratory preference exercise.",
    },

    {
      id:
        "disc-explorer",

      title:
        "DISC-style Work Behavior",

      eyebrow:
        "Exploratory work style",

      description:
        "A lightweight D / I / S / C reflection tool for teamwork and communication conversations.",

      tier: "free",

      duration:
        "3–4 min",

      itemCountLabel:
        "8 original items",

      icon:
        Network,

      tags: [
        "D / I / S / C",
        "Exploratory",
        "Pulse Original",
      ],

      sourceKind:
        "local",

      sourceLabel:
        "Pulse original",

      licenseLabel:
        "Pulse Original",

      resultKind:
        "disc",

      note:
        "Not Everything DiSC® and not a validated selection instrument.",
    },

    {
      id:
        "eq-deep",

      title:
        "Emotional Intelligence Deep Profile",

      eyebrow:
        "Multi-facet emotional intelligence",

      description:
        "A deeper public-domain IPIP emotional-intelligence profile covering multiple emotional and interpersonal facets.",

      tier:
        "premium",

      duration:
        "12–15 min",

      itemCountLabel:
        "68 items",

      icon:
        BrainCircuit,

      tags: [
        "IPIP-EI",
        "Deep profile",
        "Public Domain",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "IPIP Emotional Intelligence",

      licenseLabel:
        "Public Domain",

      resultKind:
        "profile",

      instrumentPath:
        "eq-deep.json",
    },

    {
      id:
        "leadership",

      title:
        "Leadership Strength",

      eyebrow:
        "Leading groups",

      description:
        "A short public-domain IPIP-VIA leadership scale focused on coordination, inclusion and taking charge fairly.",

      tier:
        "premium",

      duration:
        "2–3 min",

      itemCountLabel:
        "7 items",

      icon:
        Users,

      tags: [
        "Leadership",
        "IPIP-VIA",
        "Public Domain",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "IPIP-VIA Leadership",

      licenseLabel:
        "Public Domain",

      resultKind:
        "scale",

      instrumentPath:
        "leadership.json",

      preferredMetricKeys: [
        "leadership_mean",
        "leadership",
      ],
    },

    {
      id:
        "perseverance",

      title:
        "Perseverance & Industriousness",

      eyebrow:
        "Long-term follow-through",

      description:
        "A public-domain IPIP-VIA measure of persistence, industriousness and finishing what you start.",

      tier:
        "premium",

      duration:
        "2–3 min",

      itemCountLabel:
        "8 items",

      icon:
        Target,

      tags: [
        "Persistence",
        "IPIP-VIA",
        "Public Domain",
      ],

      sourceKind:
        "vendored",

      sourceLabel:
        "IPIP-VIA Perseverance",

      licenseLabel:
        "Public Domain",

      resultKind:
        "scale",

      instrumentPath:
        "perseverance.json",

      preferredMetricKeys: [
        "perseverance_mean",
        "industriousness_mean",
        "perseverance",
      ],
    },

    {
      id:
        "cognitive-reasoning",

      title:
        "Cognitive Reasoning Lab",

      eyebrow:
        "Logic and quantitative reasoning",

      description:
        "Original numerical, verbal and logical problems reported as task accuracy without pretending to produce a standardized IQ score.",

      tier:
        "premium",

      duration:
        "6–8 min",

      itemCountLabel:
        "8 original items",

      icon:
        Gauge,

      tags: [
        "IQ-style",
        "Reasoning",
        "Pulse Original",
      ],

      sourceKind:
        "local",

      sourceLabel:
        "Pulse original",

      licenseLabel:
        "Pulse Original",

      resultKind:
        "ability",

      note:
        "Not a standardized IQ test. The result is accuracy on this item set only.",
    },

    {
      id:
        "matrix-reasoning",

      title:
        "Matrix Reasoning Lab",

      eyebrow:
        "Abstract pattern reasoning",

      description:
        "Original pattern-completion problems inspired by the task category without copying Raven® items.",

      tier:
        "premium",

      duration:
        "5–6 min",

      itemCountLabel:
        "6 original items",

      icon:
        BrainCircuit,

      tags: [
        "Raven-style",
        "Patterns",
        "Pulse Original",
      ],

      sourceKind:
        "local",

      sourceLabel:
        "Pulse original",

      licenseLabel:
        "Pulse Original",

      resultKind:
        "ability",

      note:
        "Not Raven's Progressive Matrices and not a standardized intelligence score.",
    },
  ];