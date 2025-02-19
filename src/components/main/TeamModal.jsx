import React from 'react'

const TeamModal = ({ team, onClose, participants, teamColor }) => {
  if (!team) return null

  const getParticipantsText = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return `${count} участник`
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return `${count} участника`
    } else {
      return `${count} участников`
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/closeDefault.svg"
            className="close-img"
          />
        </span>
        <div
          className="profile-block-content-comands-items-rect"
          style={{ background: teamColor }}
        ></div>
        <div
          className="profile-block-content-comands-items-circle"
          style={{ background: teamColor }}
        >
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/cat1.svg"
            alt="Team Icon"
            className="team-icon"
          />
        </div>
        <h2 className="modal-content__title">{team.name}</h2>
        <div className="modal-content__description">
          <div className="modal-content__description-info">
            <p className="modal-content__description-info-part">
              {getParticipantsText(team.members)}
            </p>
            <div className="modal-content__description-info-fire">
              <div>
                <div className="modal-content__description-info-fire-count">
                  {team.totalProgress}
                </div>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.4006 27.6937C17.2411 28.0524 17.5086 28.4685 17.8968 28.411C22.6002 27.7139 25.5 23.5418 25.5 18.4992C25.5 15.9861 25.0965 12.13 22.3843 10.1754C22.2387 10.0705 22.0486 10.2362 22.1055 10.407C22.4411 11.4139 22.5 13.5 21.5 13.5C20.5 13.5 20.89 12.4781 20.6806 11.3092C20.5567 10.6172 20.4079 9.78662 20.0714 8.94027C19.2108 6.7753 17.5314 3.78656 12.6971 3.50027C12.5065 3.48898 12.3798 3.83213 12.4962 3.9845C13.9003 5.82401 14.5101 11.5 12.5 11.5C11.2779 11.5 11.4041 9.37078 12.1256 7.67401C12.1963 7.50762 12.0142 7.34151 11.8633 7.44003C6.92323 10.6652 6.5 15.9253 6.5 18.4992C6.5 23.5418 9.39983 27.7139 14.1032 28.411C14.4914 28.4685 14.7589 28.0524 14.5994 27.6937C14.1613 26.7084 13.7381 25.3583 13.7381 23.8689C13.7381 20.32 15.3235 18.7871 15.7965 18.044C15.8945 17.89 16.1055 17.89 16.2035 18.044C16.6765 18.7871 18.2619 20.32 18.2619 23.8689C18.2619 25.3583 17.8387 26.7084 17.4006 27.6937Z"
                    fill="url(#paint0_linear_1096_2207)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1096_2207"
                      x1="6.5"
                      y1="28.5"
                      x2="27.9857"
                      y2="26.1412"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9D9DE6" />
                      <stop offset="0.427083" stopColor="#567FE3" />
                      <stop offset="0.885417" stopColor="#9664C8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <h3>Участники:</h3>
          <ul>
            {participants
              .filter((participant) => participant.team === team.name)
              .map((participant) => (
                <li key={participant.id}>
                  {participant.lastName} {participant.firstName}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TeamModal
