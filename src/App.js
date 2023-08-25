import Home from './pages/Home'
import CreateGame from './pages/CreateGame'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import i18next from 'i18next'

function App() {
  useEffect(() => {
    document.documentElement.lang = i18next.language
  }, [])
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<CreateGame />} />
        <Route path=":id" element={<Home />} />
      </Routes>
    </Suspense>
  )
}

export default App
