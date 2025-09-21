import React from 'react';
import { createRoot } from 'react-dom/client';

const Popup: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Smart Resume Editor</h3>
      <p>Extension popup</p>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}