import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Registration from './pages/Registration';
import ErrorPage404 from './pages/ErrorPage404';
import { BeatLoader } from "react-spinners";

import "./scss/main.scss";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage404/>
  },
  {
    path: "/",
    element: <Welcome/>,
    loader: async()=>{
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7}/>;
    }
  },
  {
    path: "/main",
    element: <Main page={"feed"}/>,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/registration",
    element: <Registration />,
    loader: async () => {
      return <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />;
    }
  },
  {
    path: "/profile",
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