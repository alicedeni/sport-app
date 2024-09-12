import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Main from './pages/Main';
import Feed from './pages/Feed';
import ChallengesPage from './pages/Challenges';
import RatingsPage from './pages/Ratings';
import ActivityPage from './pages/Activity';
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
    path: "/:id",
    element: <Welcome />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/about/:id",
    element: <GlobalGoal />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/main/:id",
    element: <Feed />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/challenges/:id",
    element: <ChallengesPage />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/ratings/:id",
    element: <RatingsPage />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/activity/:id",
    element: <ActivityPage />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/registration/:id",
    element: <Registration />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/profile/:id",
    element: <Profile />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
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