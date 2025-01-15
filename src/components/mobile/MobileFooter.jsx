import React from 'react'
import { Link } from 'react-router-dom'

const MobileFooter = () => {
  const navItems = [
    {
      to: '/main',
      label: 'Лента',
      defaultIcon: 'https://storage.yandexcloud.net/team2go/users/base/feedDefault.svg',
      filledIcon: 'https://storage.yandexcloud.net/team2go/users/base/feedFilled.svg',
    },
    {
      to: '/challenges',
      label: 'Челленджи',
      defaultIcon: 'https://storage.yandexcloud.net/team2go/users/base/challengesDefault.svg',
      filledIcon: 'https://storage.yandexcloud.net/team2go/users/base/challengesFilled.svg',
    },
    {
      to: '/activity',
      label: 'Активность',
      defaultIcon: 'https://storage.yandexcloud.net/team2go/users/base/activityDefault.svg',
      filledIcon: 'https://storage.yandexcloud.net/team2go/users/base/activityFilled.svg',
    },
    {
      to: '/ratings',
      label: 'Рейтинги',
      defaultIcon: 'https://storage.yandexcloud.net/team2go/users/base/ratingDefault.svg',
      filledIcon: 'https://storage.yandexcloud.net/team2go/users/base/ratingFilled.svg',
    },
    {
      to: '/profile',
      label: 'Профиль',
      defaultIcon: 'https://storage.yandexcloud.net/team2go/users/base/profileDefault.svg',
      filledIcon: 'https://storage.yandexcloud.net/team2go/users/base/profileFilled.svg',
    },
  ]

  return (
    <div className="mobile-footer">
      <ul className="mobile-footer__list">
        {navItems.map((item) => (
          <li key={item.to} className="mobile-footer__list-item">
            <Link to={item.to} className="mobile-footer__list-link">
              <img
                src={item.defaultIcon}
                alt={item.label}
                className="mobile-footer__icon default"
              />
              <img
                src={item.filledIcon}
                alt={`${item.label} Filled`}
                className="mobile-footer__icon filled"
              />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileFooter
