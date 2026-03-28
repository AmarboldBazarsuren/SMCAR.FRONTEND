// Файл: frontend/src/main.jsx
// Үүрэг: React аппыг эхлүүлэх үндсэн файл

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {/* Toast мэдэгдэл - амжилт/алдааны мэдэгдэл харуулна */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1C1C1C',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: { primary: '#E31E24', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)