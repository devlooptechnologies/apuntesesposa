import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import CrearCulto from './pages/CrearCulto'
import CultoDetalle from './pages/CultoDetalle'
import CultoEditar from './pages/CultoEditar'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo" element={<CrearCulto />} />
          <Route path="/culto/:id" element={<CultoDetalle />} />
          <Route path="/culto/:id/editar" element={<CultoEditar />} />
        </Routes>
      </main>
      <footer className="footer">Mis Apuntes</footer>
    </BrowserRouter>
  )
}

export default App