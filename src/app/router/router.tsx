import { Navigate, createHashRouter } from "react-router-dom";

import { AppErrorBoundary } from "../errors/AppErrorBoundary";
import { CompleteProfileRoute } from "../guards/CompleteProfileRoute";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AboutPage } from "../../features/about/pages/AboutPage";
import { AssessmentsPage } from "../../features/assessments/pages/AssessmentsPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { JobsPage } from "../../features/jobs/pages/JobsPage";
import { LearningPage } from "../../features/learning/LearningPage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";
import { ResumeBuilderPage } from "../../features/resume/pages/ResumeBuilderPage";

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <AppErrorBoundary />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <AppErrorBoundary />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        errorElement: <AppErrorBoundary />,
        children: [
          {
            element: <CompleteProfileRoute />,
            children: [
              { path: "resume", element: <ResumeBuilderPage /> },
            ],
          },
          { path: "members", element: <JobsPage /> },
          { path: "analytics", element: <AssessmentsPage /> },
          { path: "components", element: <LearningPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "about", element: <AboutPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
    errorElement: <AppErrorBoundary />,
  },
]);