const express = require('express');
const crypto = require('crypto');

const app = express();
// capture raw body so HMAC matches the exact bytes sent by the gateway
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
}));

const SECRET = 'whsec_test_abc123';

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payloadBuffer = req.rawBody || Buffer.from(JSON.stringify(req.body));

  // Verify signature against raw bytes
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadBuffer)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.log('❌ Invalid signature');
    console.log('Expected:', expectedSignature);
    console.log('Received:', signature);
    return res.status(401).send('Invalid signature');
  }

  console.log('✅ Webhook verified:', req.body.event);
  console.log('Timestamp:', new Date(req.body.timestamp * 1000).toISOString());
  
  if (req.body.data.payment) {
    console.log('Payment ID:', req.body.data.payment.id);
    console.log('Status:', req.body.data.payment.status);
    console.log('Amount:', req.body.data.payment.amount / 100, req.body.data.payment.currency);
  }
  
  if (req.body.data.refund) {
    console.log('Refund ID:', req.body.data.refund.id);
    console.log('Amount:', req.body.data.refund.amount / 100);
  }
  
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🎯 Test merchant webhook receiver running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`Secret: ${SECRET}\n`);
});
