import React from 'react';
import { createRoot } from 'react-dom/client';
import CheckoutForm from './CheckoutForm';

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <CheckoutForm 
      orderId={getParam('order_id') || 'order_demo'} 
      apiKey={getParam('key') || 'key_test_abc123'} 
    />
  );
}
