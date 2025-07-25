import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
<<<<<<< HEAD
=======
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
>>>>>>> 4db6d3fdc230f4a724c7864624b8108044048415

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
