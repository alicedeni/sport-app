import React from 'react'
import { ButtonEnter } from '@components/Buttons.jsx'

const ActivitySubmitButton = () => {
  return (
    <div className="activity-submit_btn">
      <ButtonEnter
        className="welcome-block__btn"
        text="Далее"
        type="submit"
        textContent={'Далее'}
      />
    </div>
  )
}

export default ActivitySubmitButton

