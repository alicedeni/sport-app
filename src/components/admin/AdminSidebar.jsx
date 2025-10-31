import React from 'react'

const AdminSidebar = ({ activeTab, onTabChange, isMobile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Панель управления', icon: '📊' },
    { id: 'users', label: 'Пользователи', icon: '👤' },
    { id: 'teams', label: 'Команды', icon: '👥‍' },
    { id: 'challenges', label: 'Челленджи', icon: '🏆' },
    { id: 'posts', label: 'Модерация постов', icon: '📝' },
    { id: 'comments', label: 'Модерация комментариев', icon: '💬' },
    { id: 'statistics', label: 'Статистика', icon: '📈' },
  ]

  return (
    <div className={`admin-sidebar ${isMobile ? 'admin-sidebar--mobile' : ''}`}>
      <div className="admin-sidebar__header">
        <h2 className="admin-sidebar__title">Админ-панель</h2>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`admin-sidebar__item ${activeTab === item.id ? 'admin-sidebar__item--active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="admin-sidebar__icon">{item.icon}</span>
            <span className="admin-sidebar__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default AdminSidebar
