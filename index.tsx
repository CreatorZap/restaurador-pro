import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';
import { PaymentSuccess } from './src/pages/PaymentSuccess';

function Router() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const paymentId = params.get('payment_id');
  
  // Se tem status de pagamento na URL, mostra página de sucesso/erro
  if (status && (status === 'approved' || status === 'pending' || status === 'failure')) {
    return <PaymentSuccess />;
  }
  
  // Caso contrário, mostra app normal
  return <App />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
