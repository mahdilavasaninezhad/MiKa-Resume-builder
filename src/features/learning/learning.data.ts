import { z } from "zod";
import type { Resume } from "../resume/types/resume.types";

export type LearningAccess = "free" | "paid";

const topicIds = [
  "software",
  "data",
  "engineering",
  "business",
  "design",
  "languages",
  "science",
  "humanities",
] as const;

export type LearningTopic = (typeof topicIds)[number];

const topics: Record<LearningTopic, { label: string; keywords: string[] }> = {
  software: {
    label: "Software",
    keywords: [
      "نرم افزار", "برنامه نویسی", "مهندسی کامپیوتر", "فناوری اطلاعات",
      "وردپرس", "computer science", "software", "javascript", "typescript",
      "react", "python", "frontend", "backend", "web development", "wordpress",
    ],
  },
  data: {
    label: "Data & AI",
    keywords: [
      "علم داده", "تحلیل داده", "هوش مصنوعی", "یادگیری ماشین", "آمار",
      "data science", "data analysis", "machine learning",
      "artificial intelligence", "statistics", "sql",
    ],
  },
  engineering: {
    label: "Engineering",
    keywords: [
      "مکانیک", "مهندسی برق", "عمران", "مهندسی صنایع", "معماری",
      "mechanical engineering", "electrical engineering", "civil engineering",
      "autocad", "solidworks", "matlab",
    ],
  },
  business: {
    label: "Business",
    keywords: [
      "مدیریت", "بازاریابی", "حسابداری", "اقتصاد", "مدیریت محصول",
      "سئو", "دیجیتال مارکتینگ", "مذاکره", "marketing", "accounting",
      "finance", "business", "management", "mba", "seo", "negotiation",
    ],
  },
  design: {
    label: "Design",
    keywords: [
      "طراحی گرافیک", "رابط کاربری", "تجربه کاربری", "گرافیک", "طراحی",
      "graphic design", "figma", "photoshop", "illustrator", "ux", "ui",
    ],
  },
  languages: {
    label: "Languages",
    keywords: [
      "آموزش زبان", "زبان انگلیسی", "انگلیسی", "آلمانی", "فرانسوی",
      "english", "german", "french", "ielts", "toefl", "translation",
    ],
  },
  science: {
    label: "Basic Sciences",
    keywords: [
      "ریاضی", "فیزیک", "شیمی", "زیست شناسی",
      "mathematics", "physics", "chemistry", "biology",
    ],
  },
  humanities: {
    label: "Humanities",
    keywords: [
      "روانشناسی", "روان شناسی", "فلسفه", "جامعه شناسی", "ادبیات",
      "psychology", "philosophy", "sociology", "literature",
    ],
  },
};

type LearningProvider = {
  id: string;
  name: string;
  faName: string;
  url: string;
  topics: readonly LearningTopic[];
};

export const learningProviders: LearningProvider[] = [
  {
    id: "faradars",
    name: "Faradars",
    faName: "فرادرس",
    url: "https://faradars.org/",
    topics: [
      "software", "data", "engineering", "business",
      "design", "languages", "science", "humanities",
    ],
  },
  {
    id: "maktabkhooneh",
    name: "Maktabkhooneh",
    faName: "مکتب‌خونه",
    url: "https://maktabkhooneh.org/",
    topics: [
      "software", "data", "engineering", "business",
      "design", "languages", "science", "humanities",
    ],
  },
  {
    id: "quera",
    name: "Quera College",
    faName: "کوئرا کالج",
    url: "https://quera.org/college/",
    topics: ["software", "data"],
  },
  {
    id: "toplearn",
    name: "TopLearn",
    faName: "تاپ‌لرن",
    url: "https://toplearn.com/",
    topics: ["software", "design"],
  },
  {
    id: "sabzlearn",
    name: "Sabzlearn",
    faName: "سبزلرن",
    url: "https://sabzlearn.ir/",
    topics: ["software"],
  },
  {
    id: "roocket",
    name: "Roocket",
    faName: "راکت",
    url: "https://roocket.ir/",
    topics: ["software"],
  },
  {
    id: "7learn",
    name: "7Learn",
    faName: "سون‌لرن",
    url: "https://7learn.com/",
    topics: ["software", "data"],
  },
  {
    id: "sokanacademy",
    name: "Sokan Academy",
    faName: "سکان آکادمی",
    url: "https://sokanacademy.com/",
    topics: ["software"],
  },
  {
    id: "daneshjooyar",
    name: "Daneshjooyar",
    faName: "دانشجویار",
    url: "https://academy.daneshjooyar.com/public/department",
    topics: ["software", "data", "engineering"],
  },
  {
    id: "barnamenevisan",
    name: "Barnamenevisan",
    faName: "برنامه‌نویسان",
    url: "https://barnamenevisan.info/",
    topics: ["software"],
  },
  {
    id: "hamyarwp",
    name: "Hamyar WordPress",
    faName: "همیار وردپرس",
    url: "https://hamyarwp.com/",
    topics: ["software"],
  },
  {
    id: "motamem",
    name: "Motamem",
    faName: "متمم",
    url: "https://motamem.org/",
    topics: ["business"],
  },
  {
    id: "novin",
    name: "Novin Academy",
    faName: "آکادمی نوین",
    url: "https://www.novin.com/academy/",
    topics: ["business"],
  },
  {
    id: "modiresabz",
    name: "Modire Sabz",
    faName: "مدیرسبز",
    url: "https://modiresabz.com/",
    topics: ["business"],
  },
  {
    id: "websima",
    name: "Websima Academy",
    faName: "آکادمی وبسیما",
    url: "https://websima.academy/workshop/semrush/",
    topics: ["business"],
  },
  {
    id: "bamooz",
    name: "B-amooz",
    faName: "بیاموز",
    url: "https://b-amooz.com/",
    topics: ["languages"],
  },
  {
    id: "zabanshenas",
    name: "Zabanshenas",
    faName: "زبانشناس",
    url: "https://zabanshenas.com/",
    topics: ["languages"],
  },
  {
    id: "learnit",
    name: "Learnit",
    faName: "لرنیت",
    url: "https://learnit.ir/",
    topics: ["languages"],
  },
  {
    id: "mft",
    name: "Tehran Institute of Technology",
    faName: "مجتمع فنی تهران",
    url: "https://mftplus.com/",
    topics: ["software", "engineering", "business", "design", "languages"],
  },
  {
    id: "eseminar",
    name: "Eseminar",
    faName: "ایسمینار",
    url: "https://eseminar.tv/",
    topics: ["business"],
  },
];

export function topicLabel(topic: LearningTopic) {
  return topics[topic].label;
}

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[^\p{L}\p{N}+#]+/gu, " ")
    .trim();
}

export function getLearningMatches(
  resume: Resume | null,
  interests: string,
  strengths: string,
) {
  const groups = [
    {
      label: "Education",
      weight: 4,
      values: resume?.educations.flatMap((item) => [
        item.field,
        item.degree,
        item.description,
      ]) ?? [],
    },
    { label: "Interests", weight: 4, values: [interests] },
    { label: "Strengths", weight: 3, values: [strengths] },
    {
      label: "Skills",
      weight: 3,
      values: resume?.skills.map((item) => item.name) ?? [],
    },
    {
      label: "Projects",
      weight: 2,
      values: resume?.projects.flatMap((item) => [
        item.name,
        item.description,
        ...item.technologies,
      ]) ?? [],
    },
    {
      label: "Experience",
      weight: 2,
      values: resume?.experiences.flatMap((item) => [
        item.position,
        item.description,
      ]) ?? [],
    },
    {
      label: "Career goals",
      weight: 2,
      values: resume
        ? [resume.targetJobTitle, resume.personal.jobTitle, resume.summary]
        : [],
    },
    {
      label: "Certificates",
      weight: 1,
      values: resume?.certifications.map((item) => item.name) ?? [],
    },
    {
      label: "Languages",
      weight: 1,
      values: resume?.languages.map((item) => item.name) ?? [],
    },
  ].map((group) => ({
    ...group,
    values: group.values.map((value) => ` ${normalize(value)} `),
  }));

  return topicIds
    .flatMap((id) => {
      const keywords = topics[id].keywords.map(
        (word) => ` ${normalize(word)} `,
      );

      const matches = groups.filter((group) =>
        group.values.some((value) =>
          keywords.some((word) => value.includes(word)),
        ),
      );

      if (!matches.length) return [];

      return [{
        id,
        label: topics[id].label,
        reasons: matches.map((group) => group.label),
        weight: matches.reduce((sum, group) => sum + group.weight, 0),
      }];
    })
    .sort((a, b) => b.weight - a.weight);
}

const courseSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  title: z.string().trim().min(1),
  url: z.url(),
  access: z.enum(["free", "paid"]),
  topics: z.array(z.enum(topicIds)).min(1),
  verifiedAt: z.iso.datetime({ offset: true }),
});

const responseSchema = z.object({
  items: z.array(courseSchema),
});

export type LearningCourse = z.infer<typeof courseSchema>;

const endpoint = import.meta.env.VITE_LEARNING_SEARCH_URL?.trim();

export const learningApiEnabled = Boolean(endpoint);

export async function searchLearningCourses(
  access: LearningAccess,
  selectedTopics: LearningTopic[],
  signal: AbortSignal,
): Promise<LearningCourse[]> {
  if (!endpoint) return [];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ access, topics: selectedTopics }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Learning search failed (${response.status}).`);
  }

  const { items } = responseSchema.parse(await response.json());
  const seen = new Set<string>();

  return items.filter((course) => {
    const provider = learningProviders.find(
      (item) => item.id === course.providerId,
    );

    if (!provider || course.access !== access || seen.has(course.id)) {
      return false;
    }

    if (!course.topics.some((topic) => selectedTopics.includes(topic))) {
      return false;
    }

    const url = new URL(course.url);
    const host = new URL(provider.url).hostname;

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.hostname !== host && !url.hostname.endsWith(`.${host}`))
    ) {
      return false;
    }

    seen.add(course.id);
    return true;
  });
}