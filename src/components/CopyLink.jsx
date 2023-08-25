import React from 'react'
import copy from 'clipboard-copy'
import { useTranslation } from 'react-i18next'
const CopyLink = () => {
  const { t } = useTranslation()
  const CopyLinkFunction = () => {
    copy(window.location.href)
  }
  return (
    <div className="copy">
      <button onClick={CopyLinkFunction}>
        {t('main.copy')}
        <img
          src="https://cdn-icons-png.flaticon.com/128/4660/4660165.png"
          alt=""
        />
      </button>
    </div>
  )
}

export default CopyLink
