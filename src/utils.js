export function checkEndTime (secondsLeft) {
    const now = new Date()
      const time = now.getTime()
      const remainingTime = time + (secondsLeft * 1000)
      const endTime = new Date()
      endTime.setTime(remainingTime)
      return( endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        }) )
  }


export function formatTime(time) {
    const minute = Math.floor(time / 60)
    const seconds = time % 60
    return(`${minute}:${seconds.toString().padStart(2, '0')}`)
  }
  