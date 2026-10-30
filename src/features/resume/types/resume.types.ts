export type ResumeTemplate =
  | "modern"
  | "minimal"
  | "professional"
  | "creative"
  | "compact";

export type ResumeSectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "languages"
  | "certifications"
  | "links";

export type ResumeFont =
  | "sans"
  | "serif"
  | "mono";

export type ResumeDensity =
  | "compact"
  | "comfortable"
  | "spacious";

export type ResumeSectionFont =
  | "sans"
  | "serif"
  | "mono"
  | "system"
  | "cursive";

export type ResumeTextAlign =
  | "left"
  | "center"
  | "right";

export type ResumeBorderStyle =
  | "solid"
  | "dashed"
  | "dotted"
  | "double";

export interface ResumeSectionAppearance {
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  iconColor?: string;

  fontFamily?: ResumeSectionFont;

  fontSize?: number;

  lineHeight?: number;

  letterSpacing?: number;

  textAlign?: ResumeTextAlign;

  borderEnabled?: boolean;

  borderColor?: string;

  borderStyle?: ResumeBorderStyle;

  borderWidth?: number;

  padding?: number;

  imageUrl?: string | null;
}

export type ResumeSectionStyles =
  Partial<
    Record<
      ResumeSectionType,
      ResumeSectionAppearance
    >
  >;

export interface ResumeAppearance {
  accentColor: string;
  fontFamily: ResumeFont;
  density: ResumeDensity;
  showAvatar: boolean;

  sectionStyles?: ResumeSectionStyles;
}

export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  jobTitle: string;
  avatarUrl: string | null;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  order: number;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
  order: number;
}

export interface ResumeSkill {
  id: string;
  name: string;

  level:
    | "beginner"
    | "intermediate"
    | "advanced"
    | "expert";

  order: number;
}

export interface ResumeLanguage {
  id: string;
  name: string;

  level:
    | "basic"
    | "conversational"
    | "professional"
    | "native";

  order: number;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  order: number;
}

export interface ResumeLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface Resume {
  id: string;
  userId: string;

  title: string;
  targetJobTitle: string;
  summary: string;

  personal: ResumePersonalInfo;

  experiences: ResumeExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  languages: ResumeLanguage[];
  certifications: ResumeCertification[];
  links: ResumeLink[];

  template: ResumeTemplate;

  createdAt: string;
  updatedAt: string;

  appearance: ResumeAppearance;
}

export type CreateResumeInput =
  Omit<
    Resume,
    "id" | "createdAt" | "updatedAt"
  >;

export type UpdateResumeInput =
  Partial<
    Omit<
      Resume,
      | "id"
      | "userId"
      | "personal"
      | "appearance"
      | "createdAt"
      | "updatedAt"
    >
  > & {
    personal?: Partial<ResumePersonalInfo>;

    appearance?: Partial<ResumeAppearance>;
  };