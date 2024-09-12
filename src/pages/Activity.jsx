import React from 'react';
import Header from '../components/main/Header';
import Activity from '../components/main/Activity';

const ActivityPage = () => {
  return (
    <div className="container" id="root">
      <Header currentPage="activity" />
      <div className="main">
        <Activity />
      </div>
    </div>
  );
};

export default ActivityPage;