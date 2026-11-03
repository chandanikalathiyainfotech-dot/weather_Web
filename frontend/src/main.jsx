import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('SW registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </BrowserRouter >,
)
