# 🚀 Payment Gateway - Quick Start Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 16+ (for local development)
- Maven 3.9+ (for local backend development)
- Java 17 (for local backend development)
- PostgreSQL 15 (optional - included in Docker)
- Redis 7 (optional - included in Docker)

---

## 📦 Project Structure

```
PaymentGateway-with-AsyncAndWebhooks/
├── backend/                    # Spring Boot 3.3.5 API
│   ├── src/
│   │   ├── main/java/com/gateway/
│   │   │   ├── model/         # JPA Entities (5)
│   │   │   ├── repo/          # JPA Repositories (5)
│   │   │   ├── service/       # Business Logic (5)
│   │   │   ├── workers/       # Async Processors (3)
│   │   │   ├── api/           # REST Controllers (5)
│   │   │   └── queue/         # Redis Queue Service
│   │   └── resources/
│   │       ├── application.yml          # Main config
│   │       ├── application-worker.yml   # Worker profile
│   │       └── db/migration/            # Flyway SQL
│   └── pom.xml
├── checkout-widget/            # Webpack SDK Bundle
│   ├── src/
│   │   ├── sdk/               # PaymentGateway.js class
│   │   └── iframe-content/    # React checkout form
│   ├── dist/                  # Built bundles
│   ├── webpack.config.js
│   └── package.json
├── dashboard/                  # Vite React Dashboard
│   ├── src/
│   │   └── App.jsx            # Webhook config UI
│   ├── dist/                  # Built production
│   ├── vite.config.js
│   └── package.json
├── test-merchant/              # Webhook Test Receiver
│   ├── webhook-receiver.js
│   ├── demo.html              # SDK integration demo
│   └── package.json
├── docker-compose.yml          # 6 services
├── .gitignore                  # Git configuration
├── README.md                   # Full documentation
├── BUILD_REPORT.md            # Build verification
└── start.sh / start.bat       # Quick start scripts
```

---

## 🐳 Quick Start with Docker Compose

### 1. Start All Services

**Windows:**
```batch
.\start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

This will:
- ✅ Start PostgreSQL (port 5432)
- ✅ Start Redis (port 6379)
- ✅ Build and start API (port 8000)
- ✅ Build and start Worker
- ✅ Build and start Checkout (port 3001)
- ✅ Build and start Dashboard (port 3000)

### 2. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | http://localhost:8000 | key: `key_test_abc123`<br/>secret: `secret_test_xyz789` |
| **Dashboard** | http://localhost:3000 | None (demo data) |
| **Checkout** | http://localhost:3001 | - |
| **SDK Demo** | http://localhost:3001/demo.html | Test payment |

### 3. Test Payment Flow

1. Open http://localhost:3001/demo.html
2. Click "Pay with Gateway SDK"
3. Enter VPA (e.g., `user@paytm`)
4. Click "Pay"
5. See webhook logs in dashboard

---

## 💻 Local Development

### Backend (Spring Boot)

**Build:**
```bash
cd backend
mvn clean package -DskipTests
```

**Run (API Profile):**
```bash
java -jar target/payment-gateway-0.1.0.jar
```

**Run (Worker Profile):**
```bash
java -jar target/payment-gateway-0.1.0.jar --spring.profiles.active=worker
```

### Frontend (Checkout Widget)

**Install & Build:**
```bash
cd checkout-widget
npm install
npm run build
# Outputs to dist/checkout.js and dist/iframe.js
```

**Development Mode:**
```bash
npm run dev    # Watch mode
npm run serve  # Start Express server on port 3001
```

### Dashboard

**Install & Build:**
```bash
cd dashboard
npm install
npm run build
# Outputs to dist/
```

**Development Mode:**
```bash
npm run dev  # Hot reload on http://localhost:5173
```

---

## 🔐 Test Credentials

**Merchant Account:**
- API Key: `key_test_abc123`
- API Secret: `secret_test_xyz789`
- Webhook URL: `http://localhost:4000/webhook` (test receiver)
- Webhook Secret: `whsec_test_abc123`

**Test Payment:**
- Amount: Fixed ₹500.00 (50000 paise)
- Currency: INR
- Methods: UPI (default), Card

---

## 📡 API Endpoints

### Payment Management
```bash
# Create Payment
POST /api/v1/payments
Authorization: X-Api-Key: key_test_abc123
X-Api-Secret: secret_test_xyz789

{
  "orderId": "order_123",
  "method": "upi",
  "vpa": "user@paytm"
}

# Capture Payment
POST /api/v1/payments/{paymentId}/capture

# Get Payment
GET /api/v1/payments/{paymentId}
```

### Refund Management
```bash
# Create Refund
POST /api/v1/refunds
{
  "paymentId": "pay_abc123",
  "amount": 25000  # optional (full if omitted)
}

# Get Refund
GET /api/v1/refunds/{refundId}
```

### Webhook Management
```bash
# List Webhooks
GET /api/v1/webhooks

# Retry Webhook
POST /api/v1/webhooks/{webhookId}/retry

# Get Webhook Details
GET /api/v1/webhooks/{webhookId}
```

### Job Status
```bash
# Get Queue Metrics
GET /api/v1/jobs/status
```

---

## 🧪 Testing Webhooks Locally

**Start Test Receiver:**
```bash
cd test-merchant
npm install
npm start
# Listens on http://localhost:4000/webhook
```

**Verify Webhook Delivery:**
```bash
# Console will show:
✅ Webhook received: payment.created
   Signature: HMAC-SHA256 verified
   Event: {payload...}
```

---

## 📊 Monitoring

### View Logs

**API Logs:**
```bash
docker-compose logs -f api
```

**Worker Logs:**
```bash
docker-compose logs -f worker
```

**All Services:**
```bash
docker-compose logs -f
```

### Database Access

**PostgreSQL:**
```bash
psql -h localhost -U postgres -d payment_gateway
# Password: vinay2122@

# Check tables:
\dt
select * from merchants;
select * from payments;
select * from webhook_logs;
```

**Redis CLI:**
```bash
redis-cli -h localhost -p 6379
> KEYS *
> GET queue:payment.process
> GET metrics:jobs:pending
```

---

## 🚨 Common Issues & Solutions

### Docker Issues

**Port already in use:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

**Services won't start:**
```bash
# Clean Docker environment
docker-compose down -v  # Remove volumes
docker system prune     # Clean unused images

# Rebuild
docker-compose build --no-cache
```

### Database Issues

**Connection refused:**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres
```

**Migrations failed:**
```bash
# Clear migrations and restart
docker-compose down -v
docker-compose up -d postgres
# Wait 10 seconds
docker-compose up
```

### Frontend Issues

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port 3000/3001 in use:**
```bash
# Change in docker-compose.yml
ports:
  - "3002:3000"  # Dashboard
  - "3003:3001"  # Checkout
```

---

## 📈 Performance Tuning

### Redis Optimization
```bash
# Clear old queues
redis-cli FLUSHDB

# Monitor real-time
redis-cli MONITOR
```

### Database Optimization
```sql
-- Check slow queries
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC;

-- Analyze payment queries
EXPLAIN ANALYZE SELECT * FROM payments WHERE status = 'pending';
```

### Worker Tuning
Set in `application-worker.yml`:
```yaml
app:
  worker:
    enabled: true
    payment-processing-delay: 3000  # 3 seconds
    webhook-retry-intervals:
      - 60        # 1 minute
      - 300       # 5 minutes
      - 1800      # 30 minutes
      - 7200      # 2 hours
```

---

## 🔄 Deployment

### Production Checklist

- [ ] Update database password (not `vinay2122@`)
- [ ] Update API credentials (not test keys)
- [ ] Update webhook secrets
- [ ] Configure real payment gateway integration
- [ ] Set `TEST_MODE=false` in environment
- [ ] Enable HTTPS for webhook URLs
- [ ] Set up monitoring/alerting
- [ ] Configure backups for PostgreSQL
- [ ] Set up Redis persistence
- [ ] Review security headers
- [ ] Load test (async job queue)

### Docker Production Build

```bash
# Build optimized images
docker-compose -f docker-compose.yml build --no-cache

# Push to registry
docker tag payment-gateway-api:latest registry/payment-gateway-api:latest
docker push registry/payment-gateway-api:latest
```

---

## 📚 Additional Resources

- **Backend Documentation:** See [README.md](README.md)
- **API Documentation:** http://localhost:3000 (Dashboard)
- **Webhook Integration:** See Dashboard API docs tab
- **Build Report:** See [BUILD_REPORT.md](BUILD_REPORT.md)

---

## 🎯 Next Steps

1. ✅ Run `./start.bat` or `./start.sh`
2. ✅ Visit http://localhost:3000 (Dashboard)
3. ✅ Visit http://localhost:3001/demo.html (SDK Demo)
4. ✅ Test payment flow end-to-end
5. ✅ Review webhook logs in Dashboard
6. ✅ Initialize Git and create commits
7. ✅ Push to https://github.com/sanjaysahoo21/PaymentGateway-with-AsyncAndWebhooks

---

**Last Updated:** 2026-01-11  
**Status:** ✅ Ready for Production
