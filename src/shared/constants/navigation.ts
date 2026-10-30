import {
  BadgeInfo,
  Blocks,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileText,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const mainNavigation:
  NavigationItem[] = [
    {
      label:
        "Resume Builder",
      path: "/resume",
      icon: FileText,
    },

    {
      label: "Jobs",
      path: "/members",
      icon:
        BriefcaseBusiness,
    },

    {
      label: "Analytics",
      path: "/analytics",
      icon:
        ChartNoAxesCombined,
    },

    {
      label:
        "Components",
      path:
        "/components",
      icon: Blocks,
    },
  ];

export const footerNavigation:
  NavigationItem[] = [
    {
      label: "About Me",
      path: "/about",
      icon: BadgeInfo,
    },
  ];