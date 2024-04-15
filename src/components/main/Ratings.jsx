import React, { useState } from 'react';

const Ratings = () => {
  const [selectedSide, setSelectedSide] = useState('left');

  const handleClick = (side) => {
    setSelectedSide(side);
  };

  return (
    <div className="ratings">
      <div className="select_pt">
        <div className="select_pt-variant" style={{backgroundColor: selectedSide === 'left' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('left')}>По участникам</div>
        <div className="select_pt-variant" style={{backgroundColor: selectedSide === 'right' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('right')}>По командам</div>
      </div>
    </div>
  );
};

export default Ratings;