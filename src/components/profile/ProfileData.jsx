import React from 'react';

const ProfileData = ({ tempUser, editModeProfile, handleInputChange, handleCancelClickProfile, handleSaveClickProfile, handleEditClickProfile }) => {
  const getColorCode = (bmi) => {
    if (bmi > 18.5 && bmi <= 25) return 'rgba(5, 232, 117, 0.2)'; 
    else return 'rgba(255, 204, 56, 0.2)'; 
  };

  const getColorCodeText = (bmi) => {
    if (bmi > 18.5 && bmi <= 25) return 'rgb(5, 232, 117)'; 
    else return 'rgb(255, 204, 56)'; 
  };

  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  // Расчет ИМТ
  const calculateBMI = () => {
    const { height, weight } = tempUser;
    console.log(weight, height);
    if (!height || !weight || height === '0' || weight === '0') {
      return null; 
    }
    return (weight / ((height / 100) * (height / 100))).toFixed(1); 
  };

  const bmi = calculateBMI(); 
  console.log(bmi);

  return (
    <div className="profile-block-content-data">
      <div className="profile-block-content-data-title">
        <p className="profile-block-content-data-title-name">Мои данные</p> 

        {editModeProfile ? (
            <>
            <button onClick={handleEditClickProfile} className="profile-block-content-data-title-pen">
            <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" fill="url(#paint0_linear_580_1299)" stroke="url(#paint1_linear_580_1299)" stroke-width="2"/>
            <defs>
            <linearGradient id="paint0_linear_580_1299" x1="-3.00024" y1="19.5061" x2="3.7211" y2="25.7123" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9D9DE6"/>
            <stop offset="0.427083" stopColor="#567FE3"/>
            <stop offset="0.885417" stopColor="#9664C8"/>
            </linearGradient>
            <linearGradient id="paint1_linear_580_1299" x1="-3.00024" y1="19.5061" x2="3.7211" y2="25.7123" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9D9DE6"/>
            <stop offset="0.427083" stopColor="#567FE3"/>
            <stop offset="0.885417" stopColor="#9664C8"/>
            </linearGradient>
            </defs>
            </svg>
            </button>
            </>
        ):(
          <>
            <button onClick={handleEditClickProfile} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
              </svg>
            </button>
            </>
        )}
      </div>
      <div className="profile-block-content-data-line"/>
      <div className="profile-block-content-data-items">
        <div className="profile-block-content-data-item">
          <p className="profile-block-content-data-item-text">Рост</p>
          <div className="profile-block-content-data-item-oval">
            {editModeProfile ? (
              <input className="profile-block-content-data-item-oval-input" 
              type="number" 
              value={tempUser.height} 
              onChange={(event) => handleInputChange(event, 'height')}
              onKeyPress={handleKeyPress}
              min="1" />
            ) : (
              <p className="profile-block-content-data-item-oval-text">{tempUser.height}</p>
            )}
            <label className="profile-label">см</label>
          </div>
        </div>
        <div className="profile-block-content-data-item">
          <p className="profile-block-content-data-item-text">Вес</p>
          <div className="profile-block-content-data-item-oval">
            {editModeProfile ? (
              <input className="profile-block-content-data-item-oval-input" 
              type="number" value={tempUser.weight} 
              onChange={(event) => handleInputChange(event, 'weight')}
              onKeyPress={handleKeyPress}
              min="1" />
            ) : (
              <p className="profile-block-content-data-item-oval-text">{tempUser.weight}</p>
            )}
            <label className="profile-label">кг</label>
          </div>
        </div>
        <div className="profile-block-content-data-item">
          <p className="profile-block-content-data-item-text">Индекс массы тела</p>
          <div className="profile-block-content-data-item-oval" style={{ backgroundColor: bmi ? getColorCode(bmi) : '#B0B0B0', borderColor:  bmi ? getColorCodeText(bmi) : '#B0B0B0'  }}>
            {(bmi !== null && bmi != 0) ? (
              <p className="profile-block-content-data-item-oval-text" style={{ color: getColorCodeText(bmi) }}>{bmi}</p>
            ) : (
              <p className="profile-block-content-data-item-oval-text" style={{ color: '#B0B0B0' }}>-</p>
            )}
          </div>
          <div style={{ color: bmi ? getColorCodeText(bmi) : '#B0B0B0', fontSize: '14px' }}>
            {(bmi === null) ? 'Индекс массы тела не определен' : (() => {
              if (bmi > 18.5 && bmi <= 25) return 'Норма';
              else return 'Выше нормы';
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