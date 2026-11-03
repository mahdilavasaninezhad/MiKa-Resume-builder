import type {
  AssessmentQuestion,
  VendoredInstrument,
} from "../types/assessment.types";

const type16Questions:
  AssessmentQuestion[] = [
    {
      id:
        "type16-1",

      prompt:
        "After a demanding week, which plan sounds more restorative?",

      options: [
        {
          value: 0,

          label:
            "A lively evening with several people and spontaneous conversation.",

          scores: {
            E: 1,
          },
        },

        {
          value: 1,

          label:
            "A quieter evening with one person or time alone.",

          scores: {
            I: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-2",

      prompt:
        "In a new team, what do you usually do first?",

      options: [
        {
          value: 0,

          label:
            "Talk through ideas out loud and learn people by interacting.",

          scores: {
            E: 1,
          },
        },

        {
          value: 1,

          label:
            "Observe first, form a view, then contribute when useful.",

          scores: {
            I: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-3",

      prompt:
        "When learning something difficult, what makes you trust that you understand it?",

      options: [
        {
          value: 0,

          label:
            "Concrete examples, details and a clear sequence.",

          scores: {
            S: 1,
          },
        },

        {
          value: 1,

          label:
            "The underlying pattern, model and possible implications.",

          scores: {
            N: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-4",

      prompt:
        "Which kind of work naturally catches your attention?",

      options: [
        {
          value: 0,

          label:
            "Improving what already exists through precise practical changes.",

          scores: {
            S: 1,
          },
        },

        {
          value: 1,

          label:
            "Imagining a different approach that has not been tried yet.",

          scores: {
            N: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-5",

      prompt:
        "Two good colleagues disagree. What weighs more heavily in your first judgment?",

      options: [
        {
          value: 0,

          label:
            "Which argument is more consistent with the facts and rules.",

          scores: {
            T: 1,
          },
        },

        {
          value: 1,

          label:
            "Which outcome better respects the people and relationships involved.",

          scores: {
            F: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-6",

      prompt:
        "When giving difficult feedback, which instinct is stronger?",

      options: [
        {
          value: 0,

          label:
            "Be direct, specific and logically defensible.",

          scores: {
            T: 1,
          },
        },

        {
          value: 1,

          label:
            "Frame it so the person can hear it without unnecessary damage.",

          scores: {
            F: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-7",

      prompt:
        "How do you prefer to approach an important deadline?",

      options: [
        {
          value: 0,

          label:
            "Decide the plan early and close open decisions as I go.",

          scores: {
            J: 1,
          },
        },

        {
          value: 1,

          label:
            "Keep options open and adjust as new information arrives.",

          scores: {
            P: 1,
          },
        },
      ],
    },

    {
      id:
        "type16-8",

      prompt:
        "A free weekend suddenly opens up. Which feels better?",

      options: [
        {
          value: 0,

          label:
            "Knowing roughly what I will do before the weekend starts.",

          scores: {
            J: 1,
          },
        },

        {
          value: 1,

          label:
            "Choosing in the moment based on energy and opportunities.",

          scores: {
            P: 1,
          },
        },
      ],
    },
  ];

const discQuestions:
  AssessmentQuestion[] = [
    {
      id: "disc-1",

      prompt:
        "A project is blocked and the team is waiting. Which response is most natural for you?",

      options: [
        {
          value: 0,
          label:
            "Make a decision and push toward the outcome.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "Get people talking and rebuild momentum.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "Reduce tension and create a steady next step.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Check the facts and isolate the actual bottleneck.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-2",

      prompt:
        "Which compliment sounds most like feedback you tend to receive?",

      options: [
        {
          value: 0,
          label:
            "You get results quickly.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "You bring energy to the room.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "You are patient and dependable.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "You notice details other people miss.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-3",

      prompt:
        "Priorities change suddenly. What do you instinctively protect first?",

      options: [
        {
          value: 0,
          label:
            "The most important result.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "Team energy and alignment.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "A calm transition with minimal disruption.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Accuracy in the updated plan.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-4",

      prompt:
        "Which work environment is most likely to frustrate you?",

      options: [
        {
          value: 0,
          label:
            "Slow decisions with no clear owner.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "Long periods with almost no human interaction.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "Constant conflict and unpredictable change.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Loose standards and avoidable mistakes.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-5",

      prompt:
        "You are leading a meeting. What do you naturally care about most?",

      options: [
        {
          value: 0,
          label:
            "Leaving with a decision.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "Participation and visible enthusiasm.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "Making sure people feel heard.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Clear facts, agenda and action items.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-6",

      prompt:
        "Under pressure, which strength are you most likely to overuse?",

      options: [
        {
          value: 0,
          label:
            "Becoming too forceful or impatient.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "Talking more than I listen.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "Avoiding a confrontation that needs to happen.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Analyzing longer than the decision requires.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-7",

      prompt:
        "A colleague asks for help. Which response is most characteristic of you?",

      options: [
        {
          value: 0,
          label:
            "Clarify the target and tell them the fastest route.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "Talk it through and raise their confidence.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "Stay with them until the next steps feel manageable.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Review the details and help them avoid errors.",
          scores: {
            C: 1,
          },
        },
      ],
    },

    {
      id: "disc-8",

      prompt:
        "When starting something unfamiliar, what gives you the most confidence?",

      options: [
        {
          value: 0,
          label:
            "Authority to act and adjust quickly.",
          scores: {
            D: 1,
          },
        },

        {
          value: 1,
          label:
            "People I can exchange ideas with.",
          scores: {
            I: 1,
          },
        },

        {
          value: 2,
          label:
            "A stable pace and clear support.",
          scores: {
            S: 1,
          },
        },

        {
          value: 3,
          label:
            "Good information and explicit quality criteria.",
          scores: {
            C: 1,
          },
        },
      ],
    },
  ];

const cognitiveQuestions:
  AssessmentQuestion[] = [
    {
      id: "cog-1",

      prompt:
        "What number comes next? 3, 6, 12, 24, ?",

      options: [
        {
          value: 0,
          label: "30",
        },

        {
          value: 1,
          label: "36",
        },

        {
          value: 2,
          label: "48",
          correct: true,
        },

        {
          value: 3,
          label: "54",
        },
      ],
    },

    {
      id: "cog-2",

      prompt:
        "All Lumes are Varks. No Varks are Tels. Which statement must be true?",

      options: [
        {
          value: 0,
          label:
            "No Lumes are Tels.",
          correct: true,
        },

        {
          value: 1,
          label:
            "All Tels are Lumes.",
        },

        {
          value: 2,
          label:
            "Some Lumes are Tels.",
        },

        {
          value: 3,
          label:
            "Some Varks are Tels.",
        },
      ],
    },

    {
      id: "cog-3",

      prompt:
        "Three identical machines finish a job in 12 hours. At the same constant rate, how long would six machines take?",

      options: [
        {
          value: 0,
          label:
            "2 hours",
        },

        {
          value: 1,
          label:
            "4 hours",
        },

        {
          value: 2,
          label:
            "6 hours",
          correct: true,
        },

        {
          value: 3,
          label:
            "24 hours",
        },
      ],
    },

    {
      id: "cog-4",

      prompt:
        "Which pair has the closest relationship to Blueprint : Building?",

      options: [
        {
          value: 0,
          label:
            "Recipe : Meal",
          correct: true,
        },

        {
          value: 1,
          label:
            "Key : Lock",
        },

        {
          value: 2,
          label:
            "Map : Road",
        },

        {
          value: 3,
          label:
            "Seed : Soil",
        },
      ],
    },

    {
      id: "cog-5",

      prompt:
        "Five notebooks cost the same as two planners. One planner costs 15. What does one notebook cost?",

      options: [
        {
          value: 0,
          label: "5",
        },

        {
          value: 1,
          label: "6",
          correct: true,
        },

        {
          value: 2,
          label: "7.5",
        },

        {
          value: 3,
          label: "10",
        },
      ],
    },

    {
      id: "cog-6",

      prompt:
        "Which number does not fit? 8, 16, 24, 32, 41, 48",

      options: [
        {
          value: 0,
          label: "16",
        },

        {
          value: 1,
          label: "24",
        },

        {
          value: 2,
          label: "41",
          correct: true,
        },

        {
          value: 3,
          label: "48",
        },
      ],
    },

    {
      id: "cog-7",

      prompt:
        "Mina is older than Nika. Nika is older than Sara. Which conclusion is guaranteed?",

      options: [
        {
          value: 0,
          label:
            "Sara is older than Mina.",
        },

        {
          value: 1,
          label:
            "Mina is older than Sara.",
          correct: true,
        },

        {
          value: 2,
          label:
            "Mina and Sara are the same age.",
        },

        {
          value: 3,
          label:
            "There is not enough information.",
        },
      ],
    },

    {
      id: "cog-8",

      prompt:
        "What number comes next? 2, 5, 11, 23, 47, ?",

      options: [
        {
          value: 0,
          label: "71",
        },

        {
          value: 1,
          label: "94",
        },

        {
          value: 2,
          label: "95",
          correct: true,
        },

        {
          value: 3,
          label: "96",
        },
      ],
    },
  ];

const matrixQuestions:
  AssessmentQuestion[] = [
    {
      id:
        "matrix-1",

      prompt:
        "Pattern: ▲ ● ▲● | ■ ● ■● | ◆ ● ?",

      options: [
        {
          value: 0,
          label: "◆",
        },

        {
          value: 1,
          label: "●◆",
        },

        {
          value: 2,
          label: "◆●",
          correct: true,
        },

        {
          value: 3,
          label: "◆◆",
        },
      ],
    },

    {
      id:
        "matrix-2",

      prompt:
        "Each row follows the same rule: 2, 4, 8 | 3, 6, 12 | 5, 10, ?",

      options: [
        {
          value: 0,
          label: "15",
        },

        {
          value: 1,
          label: "18",
        },

        {
          value: 2,
          label: "20",
          correct: true,
        },

        {
          value: 3,
          label: "25",
        },
      ],
    },

    {
      id:
        "matrix-3",

      prompt:
        "Sequence: ○, ◔, ◑, ◕, ?",

      options: [
        {
          value: 0,
          label: "○",
        },

        {
          value: 1,
          label: "●",
          correct: true,
        },

        {
          value: 2,
          label: "◑",
        },

        {
          value: 3,
          label: "◒",
        },
      ],
    },

    {
      id:
        "matrix-4",

      prompt:
        "A symbol rotates 90° clockwise each step: ↑, →, ↓, ←, ?",

      options: [
        {
          value: 0,
          label: "↑",
          correct: true,
        },

        {
          value: 1,
          label: "→",
        },

        {
          value: 2,
          label: "↓",
        },

        {
          value: 3,
          label: "←",
        },
      ],
    },

    {
      id:
        "matrix-5",

      prompt:
        "The same rule applies to every row: 2 + 3 = 5 | 4 + 6 = 10 | 7 + 8 = ?",

      options: [
        {
          value: 0,
          label: "14",
        },

        {
          value: 1,
          label: "15",
          correct: true,
        },

        {
          value: 2,
          label: "16",
        },

        {
          value: 3,
          label: "56",
        },
      ],
    },

    {
      id:
        "matrix-6",

      prompt:
        "Complete the alternating pattern: □, ○, □□, ○○, □□□, ?",

      options: [
        {
          value: 0,
          label:
            "○○○",
          correct: true,
        },

        {
          value: 1,
          label:
            "□□□□",
        },

        {
          value: 2,
          label:
            "○○",
        },

        {
          value: 3,
          label:
            "□□□",
        },
      ],
    },
  ];

function localInstrument(
  id: string,
  title: string,
  questions:
    AssessmentQuestion[],
): VendoredInstrument {
  return {
    schemaVersion: 1,

    id,

    title,

    source: {
      provider:
        "Pulse",

      sourceName:
        "Pulse original item set",

      sourceUrl: "",

      license:
        "Pulse original",

      version:
        "1.0",
    },

    responseScale: {
      min: 0,
      max: 4,
      options: [],
    },

    questions,

    scales: [],
  };
}

export const localAssessmentInstruments:
  Record<
    string,
    VendoredInstrument
  > = {
    "type16-explorer":
      localInstrument(
        "type16-explorer",
        "16-Type Preference Explorer",
        type16Questions,
      ),

    "disc-explorer":
      localInstrument(
        "disc-explorer",
        "DISC-style Work Behavior",
        discQuestions,
      ),

    "cognitive-reasoning":
      localInstrument(
        "cognitive-reasoning",
        "Cognitive Reasoning Lab",
        cognitiveQuestions,
      ),

    "matrix-reasoning":
      localInstrument(
        "matrix-reasoning",
        "Matrix Reasoning Lab",
        matrixQuestions,
      ),
  };