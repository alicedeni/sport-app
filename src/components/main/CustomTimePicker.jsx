import React, { useState, useEffect, useRef } from 'react'

function pad(num) {
  return num.toString().padStart(2, '0')
}

export default function CustomTimePicker({
  value = '',
  onChange,
  minuteStep = 1,
  placeholder = 'чч:мм',
  error = false,
  onBlur,
}) {
  const [inputValue, setInputValue] = useState(value)
  const [hours, setHours] = useState(value ? Number(value.slice(0, 2)) : 0)
  const [minutes, setMinutes] = useState(value ? Number(value.slice(3, 5)) : 0)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value)
      if (value && /^\d{2}:\d{2}$/.test(value)) {
        setHours(Number(value.slice(0, 2)))
        setMinutes(Number(value.slice(3, 5)))
      }
    }
  }, [value])
  useEffect(() => {
    const timeStr = `${pad(hours)}:${pad(minutes)}`
    setInputValue(timeStr)
    if (onChange) onChange(timeStr)
  }, [hours, minutes])

  const handleInputChange = (e) => {
    const val = e.target.value
    if (/^(\d{0,2})(:)?(\d{0,2})?$/.test(val)) {
      setInputValue(val)
      if (/^\d{2}:\d{2}$/.test(val)) {
        const h = Number(val.slice(0, 2))
        const m = Number(val.slice(3, 5))
        if (h >= 0 && h < 24 && m >= 0 && m < 60) {
          setHours(h)
          setMinutes(m)
        }
      }
    }
  }

  const handleBlur = (e) => {
    setOpen(false)
    if (onBlur) onBlur(e)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i)
  const minutesOptions = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep)

  return (
    <div className="custom-timepicker" ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        className={error ? 'error' : ''}
      />
      {open && (
        <div className="dropdown">
          <ul className="hours-list">
            {hoursOptions.map((h) => (
              <li
                key={h}
                onClick={() => setHours(h)}
                className={h === hours ? 'selected' : ''}
                onMouseDown={(e) => e.preventDefault()}
              >
                {pad(h)}
              </li>
            ))}
          </ul>
          <ul className="minutes-list">
            {minutesOptions.map((m) => (
              <li
                key={m}
                onClick={() => setMinutes(m)}
                className={m === minutes ? 'selected' : ''}
                onMouseDown={(e) => e.preventDefault()}
              >
                {pad(m)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
