import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <h1>Hello, wordle</h1>
  </React.StrictMode>,
);
