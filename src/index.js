import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Welcome from './pages/Welcome';
import PreviewPage from './pages/Preview';
import Feed from './pages/Feed';
import ChallengesPage from './pages/Challenges';
import RatingsPage from './pages/Ratings';
import ActivityPage from './pages/Activity';
import ActivityMakePage from './pages/ActivityMake';
import Profile from './pages/Profile';
import Registration from './pages/Registration';
import ErrorPage404 from './pages/ErrorPage404';
import GlobalGoal from './pages/GlobalGoal';
import { BeatLoader } from "react-spinners";

import "./scss/main.scss";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage404 />
  },
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/about",
    element: <GlobalGoal />,
  },
  {
    path: "/main",
    element: <Feed />,
  },
  {
    path: "/challenges",
    element: <ChallengesPage />,
  },
  {
    path: "/ratings",
    element: <RatingsPage />,
  },
  {
    path: "/activity",
    element: <ActivityPage />,
  },
  {
    path: "/activity_make",
    element: <ActivityMakePage />,
  },
  {
    path: "/preview",
    element: <PreviewPage />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);