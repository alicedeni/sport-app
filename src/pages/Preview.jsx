import React from 'react';
import Header from '../components/main/Header';
import Preview from '../components/main/Preview';

const PreviewPage = () => {
  return (
    <div className="container" id="root">
      <Header currentPage="view" />
      <div className="main">
        <Preview />
      </div>
    </div>
  );
};

export default PreviewPage;