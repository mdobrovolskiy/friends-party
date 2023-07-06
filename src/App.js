import Home from './pages/Home'
import CreateGame from './pages/CreateGame'
import { Route, Routes } from 'react-router-dom'
import Memes from './pages/Memes'
function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateGame />} />
      <Route path=":id" element={<Home />} />
    </Routes>
  )
}

export default App
