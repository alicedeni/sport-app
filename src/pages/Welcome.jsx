import React from 'react';
import WelcomeBlock from '../components/WelcomeBlock';
import FullWidthText from '../components/FullWidthText';

const Welcome = () => {
  const welcomeText = 'СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ';

  return (
    <div className="welcome">
      <FullWidthText text={welcomeText} />
      <WelcomeBlock />
      <FullWidthText text={welcomeText} />
    </div>
  );
};

export default Welcome;


