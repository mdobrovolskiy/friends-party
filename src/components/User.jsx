import React from 'react'

const User = ({
  clientId,
  user,
  isGameStarted,
  nextMove,
  currentTeamMove,
  isRoundStarted,
  isRoundEnded,
}) => {
  return (
    <div className={`player ${user.isOnline ? '' : 'offline'}`}>
      <div className="iconLeft">
        {isGameStarted && nextMove === user.id && (
          <svg
            className="currentMove"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              d="M8.5 19.5l7-7-7-7"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
      <div className="userAvatar">
        <img className="avatarItem" src={user.avatar} alt="" />
      </div>
      <div
        className={`name ${user?.localId === clientId?.localId && 'client'}`}
      >
        {user.userName}
      </div>
      <div>
        {isGameStarted &&
          !isRoundEnded &&
          currentTeamMove === user.team &&
          !isRoundStarted &&
          (!user.isReady ? (
            <img
              src="https://cdn-icons-png.flaticon.com/128/2774/2774755.png"
              alt=""
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
              alt=""
            />
          ))}
      </div>
    </div>
  )
}

export default User
