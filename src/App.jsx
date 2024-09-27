import './App.css'

import Editor from './views/editor/editor'
import Lobby from './views/lobby/lobby'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './views/game/game'
import { WebsocketContextProvider } from './context/WebsocketContext'

function App() {
  return (
    <>
    <Router>
      <div className="App">
        <WebsocketContextProvider>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
        </WebsocketContextProvider>
      </div>
    </Router>
    </>
  )
}

export default App
