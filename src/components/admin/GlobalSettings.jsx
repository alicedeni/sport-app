import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'

const GlobalSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState(null)
  const [featureFlags, setFeatureFlags] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      try {
        const [settingsRes, flagsRes] = await Promise.all([
          adminService.getSettings(),
          adminService.getFeatureFlags(),
        ])

        if (settingsRes.data.status === 200) {
          const apiSettings = settingsRes.data.data
          setSettings({
            appName: 'Team2Go',
            appVersion: '1.1.0',
            maintenanceMode:
              apiSettings.maintenance_mode === 'true' || apiSettings.maintenance_mode === true,
            registrationEnabled: apiSettings.new_registration !== false,
            apiTimeout: parseInt(apiSettings.api_timeout) || 30000,
            maxRetries: parseInt(apiSettings.max_retries) || 3,
            cacheEnabled: apiSettings.cache_enabled !== false,
            cacheTimeout: parseInt(apiSettings.cache_timeout) || 300000,
            pointsPerActivity: parseInt(apiSettings.points_per_activity) || 10,
            bonusPoints: parseInt(apiSettings.bonus_points) || 5,
            maxDailyPoints: parseInt(apiSettings.max_daily_points) || 100,
            maxTeamSize: parseInt(apiSettings.max_team_size) || 50,
            minTeamSize: parseInt(apiSettings.min_team_size) || 2,
            teamCreationEnabled: apiSettings.team_creation_enabled !== false,
            emailNotifications: apiSettings.email_notifications !== false,
            pushNotifications: apiSettings.push_notifications !== false,
            weeklyDigest: apiSettings.weekly_digest !== false,
            defaultTheme: apiSettings.app_theme || 'light',
            allowThemeChange: apiSettings.allow_theme_change !== false,
            sessionTimeout: parseInt(apiSettings.session_timeout) || 3600000,
            maxLoginAttempts: parseInt(apiSettings.max_login_attempts) || 5,
            passwordMinLength: parseInt(apiSettings.password_min_length) || 8,
          })
        }

        if (flagsRes.data.status === 200) {
          setFeatureFlags(flagsRes.data.data)
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Ошибка загрузки настроек')
        console.error('Ошибка загрузки настроек:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSaveSettings = async () => {
    if (!settings) return

    setSaving(true)
    setError(null)
    try {
      const apiSettings = {
        maintenance_mode: settings.maintenanceMode,
        new_registration: settings.registrationEnabled,
        api_timeout: settings.apiTimeout,
        max_retries: settings.maxRetries,
        cache_enabled: settings.cacheEnabled,
        cache_timeout: settings.cacheTimeout,
        points_per_activity: settings.pointsPerActivity,
        bonus_points: settings.bonusPoints,
        max_daily_points: settings.maxDailyPoints,
        max_team_size: settings.maxTeamSize,
        min_team_size: settings.minTeamSize,
        team_creation_enabled: settings.teamCreationEnabled,
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        weekly_digest: settings.weeklyDigest,
        app_theme: settings.defaultTheme,
        allow_theme_change: settings.allowThemeChange,
        session_timeout: settings.sessionTimeout,
        max_login_attempts: settings.maxLoginAttempts,
        password_min_length: settings.passwordMinLength,
      }

      const response = await adminService.updateSettings(apiSettings)
      if (response.data.status === 200) {
        alert('Настройки сохранены!')
      } else {
        setError(response.data.error || response.data.message || 'Ошибка сохранения')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка при сохранении настроек')
      console.error('Ошибка сохранения настроек:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки?')) {
      window.location.reload()
    }
  }

  const tabs = [
    { id: 'general', label: 'Общие', icon: '⚙️' },
    { id: 'api', label: 'API', icon: '🔌' },
    { id: 'points', label: 'Баллы', icon: '⭐' },
    { id: 'teams', label: 'Команды', icon: '👥' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔' },
    { id: 'theme', label: 'Тема', icon: '🎨' },
    { id: 'security', label: 'Безопасность', icon: '🔒' },
  ]

  const renderGeneralSettings = () => (
    <div className="admin-settings-section">
      <h3>Общие настройки приложения</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__label">Название приложения</label>
          <input
            type="text"
            value={settings.appName}
            onChange={(e) => handleSettingChange('appName', e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Версия приложения</label>
          <input
            type="text"
            value={settings.appVersion}
            onChange={(e) => handleSettingChange('appVersion', e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            />
            Режим обслуживания
          </label>
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.registrationEnabled}
              onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
            />
            Разрешить регистрацию
          </label>
        </div>
      </div>
    </div>
  )

  const renderApiSettings = () => (
    <div className="admin-settings-section">
      <h3>Настройки API и загрузки данных</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__label">Таймаут API (мс)</label>
          <input
            type="number"
            value={settings.apiTimeout}
            onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Максимум попыток</label>
          <input
            type="number"
            value={settings.maxRetries}
            onChange={(e) => handleSettingChange('maxRetries', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.cacheEnabled}
              onChange={(e) => handleSettingChange('cacheEnabled', e.target.checked)}
            />
            Включить кэширование
          </label>
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Таймаут кэша (мс)</label>
          <input
            type="number"
            value={settings.cacheTimeout}
            onChange={(e) => handleSettingChange('cacheTimeout', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
      </div>
    </div>
  )

  const renderPointsSettings = () => (
    <div className="admin-settings-section">
      <h3>Настройки баллов и наград</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__label">Баллов за активность</label>
          <input
            type="number"
            value={settings.pointsPerActivity}
            onChange={(e) => handleSettingChange('pointsPerActivity', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Бонусные баллы</label>
          <input
            type="number"
            value={settings.bonusPoints}
            onChange={(e) => handleSettingChange('bonusPoints', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Максимум баллов в день</label>
          <input
            type="number"
            value={settings.maxDailyPoints}
            onChange={(e) => handleSettingChange('maxDailyPoints', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
      </div>
    </div>
  )

  const renderTeamSettings = () => (
    <div className="admin-settings-section">
      <h3>Настройки команд</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__label">Максимальный размер команды</label>
          <input
            type="number"
            value={settings.maxTeamSize}
            onChange={(e) => handleSettingChange('maxTeamSize', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Минимальный размер команды</label>
          <input
            type="number"
            value={settings.minTeamSize}
            onChange={(e) => handleSettingChange('minTeamSize', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.teamCreationEnabled}
              onChange={(e) => handleSettingChange('teamCreationEnabled', e.target.checked)}
            />
            Разрешить создание команд
          </label>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="admin-settings-section">
      <h3>Настройки уведомлений</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            />
            Email уведомления
          </label>
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
            />
            Push уведомления
          </label>
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.weeklyDigest}
              onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
            />
            Еженедельная сводка
          </label>
        </div>
      </div>
    </div>
  )

  const renderThemeSettings = () => (
    <div className="admin-settings-section">
      <h3>Настройки темы</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__label">Тема по умолчанию</label>
          <select
            value={settings.defaultTheme}
            onChange={(e) => handleSettingChange('defaultTheme', e.target.value)}
            className="admin-select"
          >
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
            <option value="auto">Автоматически</option>
          </select>
        </div>
        <div className="admin-setting">
          <label className="admin-setting__checkbox">
            <input
              type="checkbox"
              checked={settings.allowThemeChange}
              onChange={(e) => handleSettingChange('allowThemeChange', e.target.checked)}
            />
            Разрешить смену темы пользователям
          </label>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="admin-settings-section">
      <h3>Настройки безопасности</h3>
      <div className="admin-settings-grid">
        <div className="admin-setting">
          <label className="admin-setting__label">Таймаут сессии (мс)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Максимум попыток входа</label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
        <div className="admin-setting">
          <label className="admin-setting__label">Минимальная длина пароля</label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
            className="admin-input"
          />
        </div>
      </div>
    </div>
  )

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'api':
        return renderApiSettings()
      case 'points':
        return renderPointsSettings()
      case 'teams':
        return renderTeamSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'theme':
        return renderThemeSettings()
      case 'security':
        return renderSecuritySettings()
      default:
        return renderGeneralSettings()
    }
  }

  if (loading) {
    return (
      <div className="admin-settings">
        <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка настроек...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="admin-settings">
        <div style={{ color: 'red', padding: '20px' }}>
          {error || 'Не удалось загрузить настройки'}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-settings">
      <div className="admin-settings__header">
        <h1 className="admin-settings__title">Глобальные настройки</h1>
        {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
        <div className="admin-settings__actions">
          <button className="admin-btn admin-btn--secondary" onClick={handleResetSettings}>
            Сбросить
          </button>
          <button
            className="admin-btn admin-btn--primary"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      <div className="admin-settings__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-settings__tab ${activeTab === tab.id ? 'admin-settings__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="admin-settings__tab-icon">{tab.icon}</span>
            <span className="admin-settings__tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-settings__content">{renderSettingsContent()}</div>
    </div>
  )
}

export default GlobalSettings
