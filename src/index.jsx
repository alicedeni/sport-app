import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Welcome from '@pages/Welcome.jsx'
import PreviewPage from '@pages/Preview.jsx'
import Feed from '@pages/Feed.jsx'
import ChallengesPage from '@pages/Challenges.jsx'
import RatingsPage from '@pages/Ratings.jsx'
import ActivityPage from '@pages/Activity.jsx'
import ActivityMakePage from '@pages/ActivityMake.jsx'
import Profile from '@pages/Profile.jsx'
import Registration from '@pages/Registration.jsx'
import ErrorPage404 from '@pages/ErrorPage404.jsx'
import GlobalGoal from '@pages/GlobalGoal.jsx'
import Admin from '@pages/Admin.jsx'
import { ROUTES } from '@constants'

import './scss/main.scss'

const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '*',
    element: <ErrorPage404 />,
  },
  {
    path: ROUTES.HOME,
    element: <Welcome />,
  },
  {
    path: ROUTES.ABOUT,
    element: <GlobalGoal />,
  },
  {
    path: ROUTES.MAIN,
    element: <Feed />,
  },
  {
    path: ROUTES.CHALLENGES,
    element: <ChallengesPage />,
  },
  {
    path: ROUTES.RATINGS,
    element: <RatingsPage />,
  },
  {
    path: ROUTES.ACTIVITY,
    element: <ActivityPage />,
  },
  {
    path: ROUTES.ACTIVITY_MAKE,
    element: <ActivityMakePage />,
  },
  {
    path: ROUTES.PREVIEW,
    element: <PreviewPage />,
  },
  {
    path: ROUTES.REGISTRATION,
    element: <Registration />,
  },
  {
    path: ROUTES.PROFILE,
    element: <Profile />,
  },
  {
    path: ROUTES.ADMIN,
    element: <Admin />,
  },
])

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
