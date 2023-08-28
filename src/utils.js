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

export function checkDueDate (dueDate) {
  const now = new Date()
  const due = new Date(dueDate + "T00:00:00")
  const remainingTime = due - now
  const daysLeft = Math.ceil(remainingTime / 86400000)
  const hoursLeft = remainingTime / 3600000
  return {
    date: dueDate,
    daysLeft: daysLeft,
    hoursLeft: hoursLeft
  }
  //if day < 0 day > -1, then due today. if day < -1, then overdue
}

export function getTodaysDate() {
  let objectDate = new Date();
  let day = objectDate.getDate();
  let month = objectDate.getMonth() + 1;
  let year = objectDate.getFullYear();

  if (month < 10) {
    month = `0${month}`;
}
  const todaysDate = year + "-" + month + "-" + day
  return todaysDate
}


export function formatTime(time) {
    const minute = Math.floor(time / 60)
    const seconds = time % 60
    return(`${minute}:${seconds.toString().padStart(2, '0')}`)
  }
  