import React from 'react'
import LogUser from './LogUser'
import { useEffect } from 'react'
import { useRef } from 'react'
const LogInfo = ({ roundLogs }) => {
  const logRef = useRef()
  useEffect(() => {
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [roundLogs])
  return (
    <div ref={logRef} className="logWrapper">
      {roundLogs.length > 0
        ? roundLogs.map((user) => <LogUser key={user.id} user={user} />)
        : 'No logs available'}
    </div>
  )
}

export default LogInfo
