import * as React from 'react'

const TimerContext = React.createContext({
    selectedTimer: 0,
    setSelectedTimer: () => {},
    pomodorosCompleted: 0,
    setPomodorosCompleted: () => {},
  })

export default TimerContext