import React from 'react'
import copy from 'clipboard-copy'
const CopyLink = () => {
  const CopyLinkFunction = () => {
    copy(window.location.href)
  }
  return (
    <div className="copy">
      <button onClick={CopyLinkFunction}>
        Copy link{' '}
        <img
          src="https://cdn-icons-png.flaticon.com/128/4660/4660165.png"
          alt=""
        />
      </button>
    </div>
  )
}

export default CopyLink
