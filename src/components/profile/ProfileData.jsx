import React from 'react';

const ProfileData = ({ tempUser, editModeProfile, handleInputChange, handleCancelClickProfile, handleSaveClickProfile, handleEditClickProfile }) => {
  const getColorCode = (bmi) => {
    if (bmi <= 16) return '#6699CC'; 
    else if (bmi > 16 && bmi <= 18.5) return '#339966';
    else if (bmi > 18.5 && bmi <= 25) return '#33CC66'; 
    else if (bmi > 25 && bmi <= 30) return '#00CC00';
    else if (bmi > 30 && bmi <= 35) return '#FF6600';
    else if (bmi > 35 && bmi <= 40) return '#FF3300';
    else return '#FF0000'; 
  };

  return (
    <div className="profile-block-content-data">
      <div className="profile-block-content-data-title">
        <p className="profile-block-content-data-title-name">Мои данные</p> 
        <button onClick={handleEditClickProfile} className="profile-block-content-data-title-pen">
          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <div className="profile-block-content-data-line"/>
      <div className="profile-block-content-data-items">
        <div className="profile-block-content-data-item">
          <p className="profile-block-content-data-item-text">Рост</p>
          <div className="profile-block-content-data-item-oval">
            {editModeProfile ? (
              <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.height} onChange={(event) => handleInputChange(event, 'height')} />
            ) : (
              <p className="profile-block-content-data-item-oval-text">{tempUser.height} см</p>
            )}
          </div>
        </div>
        <div className="profile-block-content-data-item">
          <p className="profile-block-content-data-item-text">Вес</p>
          <div className="profile-block-content-data-item-oval">
            {editModeProfile ? (
              <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.weight} onChange={(event) => handleInputChange(event, 'weight')} />
            ) : (
              <p className="profile-block-content-data-item-oval-text">{tempUser.weight} кг</p>
            )}
          </div>
        </div>
        <div className="profile-block-content-data-item">
          <p className="profile-block-content-data-item-text">Индекс массы тела</p>
          <div className="profile-block-content-data-item-oval" style={{ backgroundColor: getColorCode((tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1)), border: 'none' }}>
            <p className="profile-block-content-data-item-oval-text" style={{ color: '#ffffff' }}>{(tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1)}</p>
          </div>
          <div style={{ color: getColorCode((tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1)), fontSize: '14px' }}>
            {(() => {
              const bmi = (tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1);
              if (bmi <= 16) return 'Выраженный дефицит массы тела';
              else if (bmi > 16 && bmi <= 18.5) return 'Недостаточная масса тела';
              else if (bmi > 18.5 && bmi <= 25) return 'Норма';
              else if (bmi > 25 && bmi <= 30) return 'Избыточная масса тела';
              else if (bmi > 30 && bmi <= 35) return 'Ожирение 1-й степени';
              else if (bmi > 35 && bmi <= 40) return 'Ожирение 2-й степени';
              else return 'Ожирение 3-й степени';
            })()}
          </div>
        </div>
      </div>
      {editModeProfile && (
        <div className="profile-block-content-data-btn">
          <button onClick={handleCancelClickProfile} className="profile-block-content-data-btn-cancel">Отменить</button>
          <button onClick={handleSaveClickProfile} className="profile-block-content-data-btn-save">Сохранить</button>
        </div>
      )}
    </div>
  );
};

export default ProfileData;