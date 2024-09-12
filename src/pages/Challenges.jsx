import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../components/main/Header';
import Posts from '../components/main/Posts';
import Challenges from '../components/main/Challenges';
import Ratings from '../components/main/Ratings';
import Activity from '../components/main/Activity';
import Preview from '../components/main/Preview';
import axios from 'axios';

const ChallengesPage = () => {
  const { id } = useParams();
  return (
    <div className="container" id="root">
      <Header currentPage="challenges" />
      <div className="main">
        <Challenges />
      </div>
    </div>
  );
};

export default ChallengesPage;