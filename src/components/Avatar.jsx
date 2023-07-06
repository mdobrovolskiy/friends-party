import React from 'react'
import { db } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'
const Avatar = ({ img, avatarIndex, i, setAvatarIndex, params, client }) => {
  const updateAvatar = async () => {
    if (client) {
      const userRef = doc(db, `usersId=${params.id}`, client.id)
      await updateDoc(userRef, {
        avatar: img,
      })
      setAvatarIndex(i)
    } else {
      setAvatarIndex(i)
    }
  }
  return (
    <div onClick={updateAvatar} className="avatarWrapperItem">
      {avatarIndex === i && <div className="activeAvatar"></div>}
      <img src={img} alt="avatar" />
    </div>
  )
}

export default Avatar
