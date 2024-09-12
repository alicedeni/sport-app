import React from 'react';
import Header from '../components/main/Header';
import Ratings from '../components/main/Ratings';

const RatingsPage = () => {
  return (
    <div className="container" id="root">
      <Header currentPage="ratings" />
      <div className="main">
        <Ratings />
      </div>
    </div>
  );
};

export default RatingsPage;