import {
  Navigate,
  createBrowserRouter,
} from "react-router-dom";

import {
  ProtectedRoute,
} from "../guards/ProtectedRoute";

import {
  AppLayout,
} from "../layouts/AppLayout";

import {
  AboutPage,
} from "../../features/about/pages/AboutPage";

import {
  LoginPage,
} from "../../features/auth/pages/LoginPage";

import {
  DashboardPage,
} from "../../features/dashboard/pages/DashboardPage";

import {
  JobsPage,
} from "../../features/jobs/pages/JobsPage";

import {
  PlaceholderPage,
} from "../../features/playground/pages/PlaceholderPage";

import {
  ProfilePage,
} from "../../features/profile/pages/ProfilePage";

import {
  ResumeBuilderPage,
} from "../../features/resume/pages/ResumeBuilderPage";

import {
  AppErrorBoundary,
} from "../errors/AppErrorBoundary";

import {
  CompleteProfileRoute,
} from "../guards/CompleteProfileRoute";

export const router =
  createBrowserRouter([
    {
      path: "/login",

      element:
        <LoginPage />,

      errorElement:
        <AppErrorBoundary />,
    },

    {
      element:
        <ProtectedRoute />,

      errorElement:
        <AppErrorBoundary />,

      children: [
        {
          path: "/",

          element:
            <AppLayout />,

          errorElement:
            <AppErrorBoundary />,

          children: [
            {
              element:
                <CompleteProfileRoute />,

              children: [
                {
                  path:
                    "resume",

                  element:
                    <ResumeBuilderPage />,
                },
              ],
            },

            {
              path:
                "members",

              element:
                <JobsPage />,
            },

            {
              path:
                "analytics",

              element:
                <PlaceholderPage
                  title="Analytics"
                  description="Analytics and charts will be implemented here."
                />,
            },

            {
              path:
                "components",

              element:
                <PlaceholderPage
                  title="Components"
                  description="UI components and experiments will live here."
                />,
            },

            {
              path:
                "profile",

              element:
                <ProfilePage />,
            },

            {
              path:
                "about",

              element:
                <AboutPage />,
            },
          ],
        },
      ],
    },

    {
      path: "*",

      element: (
        <Navigate
          to="/dashboard"
          replace
        />
      ),

      errorElement:
        <AppErrorBoundary />,
    },
  ]);