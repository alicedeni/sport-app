import React, { useState } from 'react';
import axios from 'axios';
import '@aws-amplify/ui-react/styles.css';
import { link } from '../../consts.js';

const AccountSection = ({
  tempUser,
  editModeAccount,
  handleInputChange,
  handleCancelClickAccount,
  handleSaveClickAccount,
  handleEditClickAccount
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(tempUser.avatar);
  const [file, setFile] = useState(null);

  const getImgKeys = async () => {
    try {
      const response = await axios.get(`${link}/img_keys`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadedImageUrl(URL.createObjectURL(selectedFile));
      handleInputChange({ target: { value: `https://storage.yandexcloud.net/team2go/users/uploads/${selectedFile?.name}` } }, 'avatar'); 
    }
  };

  const uploadFile = async (file) => {
    const presignedFields = await getImgKeys();
    const formData = new FormData();
    formData.append('key', `users/uploads/${file.name}`);
    formData.append('X-Amz-Credential', presignedFields["fields"]["x-amz-credential"]);
    formData.append('acl', 'public-read');
    formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    formData.append('X-Amz-Date', presignedFields["fields"]["x-amz-date"]);
    formData.append('policy', presignedFields["fields"]["policy"]);
    formData.append('X-Amz-Signature', presignedFields["fields"]["x-amz-signature"]);
    formData.append('file', file);

    try {
      const response = await axios.post('https://storage.yandexcloud.net/team2go', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedImageUrl(`https://storage.yandexcloud.net/team2go/users/uploads/${file?.name}`);

      return `https://storage.yandexcloud.net/team2go/users/uploads/${file?.name}`;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  };
{/*  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const response = await axios.post('https://storage.yandexcloud.net/team2go', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Файл успешно загружен:', `https://storage.yandexcloud.net/team2go/users/uploads/${file?.name}`);
      setUploadedImageUrl(`https://storage.yandexcloud.net/team2go/users/uploads/${file?.name}`);

    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  };
*/}
  
  const handleSaveClick = async () => {
    if (imageFile) {
      try {
        const uploadedUrl = await uploadFile(imageFile);
        setUploadedImageUrl(uploadedUrl); 
        handleInputChange({ target: { value: uploadedUrl } }, 'avatar'); 
      } catch (error) {
        alert("Ошибка при загрузке изображения. Пожалуйста, попробуйте еще раз.");
      }
    }

    await handleSaveClickAccount();
  };

  return (
    <div className="profile-block-content-data">
      <div className="profile-block-content-data-title">
        <p className="profile-block-content-data-title-name">Мой аккаунт</p>
        <button onClick={() => handleEditClickAccount(true)} className="profile-block-content-data-title-pen">
          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <div className="profile-block-content-data-line"/>
      <div className="profile-block-content-data-profile">
      <div className="profile-block-content-data-item-column">
        <div className="profile-block-content-data-item-value">
          <img 
            src={tempUser.avatar}
            alt={tempUser.name} 
            className="profile-block-content-data-item-image" 
          />
          {editModeAccount && (
            <>
              <input type="file" name="file" onChange={handleImageUpload} required /> <br />
            </>
          )}
        </div>
      </div>
        <div className="profile-block-content-data-profile-column">
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Имя</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                style={{
                    borderRadius: '20px',
                    height: '38px',
                    fontSize: '16px',
                    padding: '0 10px',
                    boxSizing: 'border-box'
                }}
                  type="text"
                  value={tempUser.firstName}
                  onChange={(event) => handleInputChange(event, 'firstName')}
                />
              ) : (
                <p>{tempUser.firstName}</p>
              )}
            </div>
          </div>
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Фамилия</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                style={{
                    borderRadius: '20px',
                    height: '38px',
                    fontSize: '16px',
                    padding: '0 10px',
                    boxSizing: 'border-box'
                }}
                  type="text"
                  value={tempUser.lastName}
                  onChange={(event) => handleInputChange(event, 'lastName')}
                />
              ) : (
                <p>{tempUser.lastName}</p>
              )}
            </div>
          </div>
        </div>
        <div className="profile-block-content-data-profile-column">
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Электронная почта</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                style={{
                    borderRadius: '20px',
                    height: '38px',
                    fontSize: '16px',
                    padding: '0 10px',
                    boxSizing: 'border-box'
                }}
                  type="email"
                  value={tempUser.email}
                  onChange={(event) => handleInputChange(event, 'email')}
                />
              ) : (
                <p>{tempUser.email}</p>
              )}
            </div>
          </div>
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Пароль</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                className='profile-block-content-data-item-value-input'
                type="password"
                value={tempUser.password}
                onChange={(event) => handleInputChange(event, 'password')}
                style={{
                    borderRadius: '20px',
                    height: '38px',
                    fontSize: '16px',
                    padding: '0 10px',
                    boxSizing: 'border-box'
                }}
            />
              ) : (
                <p>*******</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {editModeAccount && (
        <div className="profile-block-content-data-btn">
          <button onClick={handleCancelClickAccount} className="profile-block-content-data-btn-cancel">Отменить</button>
          <button onClick={(event) => { event.preventDefault(); handleSaveClick(); }}  type="submit" className="profile-block-content-data-btn-save">Сохранить</button>
        </div>
      )}
    </div>
  );
};

export default AccountSection;