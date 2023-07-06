import React from 'react'
import '../Memes.css'
import { useSelector } from 'react-redux'
const Memes = () => {
  const lightTheme = useSelector((state) => state.themeSlice.lightTheme)
  return (
    <div
      className="createGame"
      style={{
        background: lightTheme
          ? 'linear-gradient(0deg, rgba(27,33,92,1) 0%, rgba(0,0,0,1) 100%)'
          : 'linear-gradient(0deg, rgba(246,245,208,1) 0%, rgba(133,243,246,1) 100%)',
        color: lightTheme ? '#fff' : '#000',
      }}
    ></div>
  )
}

export default Memes
