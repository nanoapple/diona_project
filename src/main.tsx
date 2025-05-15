
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Find the root element and render the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
