// ============================================================================
// PONTO DE ENTRADA DA APLICAÇÃO
// ============================================================================
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Inicializa o React dentro da div principal (#root)
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

