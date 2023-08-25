import React from 'react'

const LogUser = ({ user }) => {
  return (
    <div className="logUser">
      <div className="logUserAvatar">
        <img src={user.img} alt="" />
      </div>
      <div className="logUserName">{user.name}</div>
      {user.action === 'minus' && <div>decreased {user.word} </div>}
      {user.action === 'plus' && <div>increased {user.word} </div>}
    </div>
  )
}

export default LogUser
