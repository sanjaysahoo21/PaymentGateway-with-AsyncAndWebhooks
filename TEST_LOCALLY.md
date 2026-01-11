# 🚀 LOCAL TESTING WITHOUT DOCKER

## ✅ Backend is Ready!

Your Spring Boot backend can now run in **local test mode** with:
- ✅ **H2 In-Memory Database** (no PostgreSQL needed)
- ✅ **Local Redis** (still required but standalone)
- ✅ **Test Data Pre-loaded** (test merchant auto-created)

---

## 📋 QUICK START (4 Terminals)

### Terminal 1: Start Backend API (Local H2 Mode)

```bash
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

**Expected Output:**
```
Started ApiApplication in X seconds
✅ Test merchant created: key_test_abc123
```

**Access:** http://localhost:8000

### Terminal 2: Start Checkout Widget

```bash
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\checkout-widget
npm run serve
```

**Access:** http://localhost:3001  
**SDK Demo:** http://localhost:3001/demo.html

### Terminal 3: Start Dashboard

```bash
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\dashboard
npm run dev
```

**Access:** http://localhost:5173

### Terminal 4 (Optional): Start Worker

```bash
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local,worker"
```

---

## 🔍 TEST THE SYSTEM

### 1. Check Backend Health

```bash
curl http://localhost:8000/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

### 2. View H2 Console (Database)

```
http://localhost:8000/h2-console
```

**Login:**
- Driver: `org.h2.Driver`
- URL: `jdbc:h2:mem:testdb;MODE=PostgreSQL`
- User: `sa`
- Password: (leave blank)

**Queries to run:**
```sql
SELECT * FROM merchants;
SELECT * FROM payments;
SELECT * FROM webhook_logs;
```

### 3. Test Payment API

```bash
curl -X POST http://localhost:8000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -d '{"orderId": "order_123", "method": "upi", "vpa": "user@paytm"}'
```

**Expected Response:**
```json
{
  "id": "pay_abc123...",
  "merchantId": "...",
  "amount": 50000,
  "currency": "INR",
  "status": "pending",
  "orderId": "order_123",
  "method": "upi",
  "vpa": "user@paytm",
  "captured": false,
  "createdAt": "2026-01-11T..."
}
```

### 4. Test SDK Demo

1. Open: http://localhost:3001/demo.html
2. Click "Pay with Gateway SDK"
3. Enter VPA: `user@paytm`
4. Click "Pay"
5. See success message
6. Check database for new payment record

### 5. Check Database Records

```bash
curl http://localhost:8000/h2-console
```

Run query:
```sql
SELECT id, status, amount, order_id FROM payments ORDER BY created_at DESC LIMIT 5;
```

---

## ⚠️ IMPORTANT: Redis Requirement

The local setup **still requires Redis** (for job queues).

### Option A: Run Redis in WSL2 (Windows)

```bash
# Open WSL2 terminal
wsl

# Install Redis
sudo apt-get update
sudo apt-get install redis-server

# Start Redis
redis-server
```

Then in another terminal, verify:
```bash
redis-cli ping
# Should return: PONG
```

### Option B: Use Memurai (Windows Redis)

https://www.memurai.com/

### Option C: Skip Worker (In-Memory Queues)

If you don't have Redis, the **payment worker won't process payments asynchronously**. You can:
1. Just test API endpoints (they work fine)
2. Not run Terminal 4 (Worker is optional for testing API)
3. Check dashboards and logs

---

## 📊 WHAT WORKS WITHOUT REDIS

✅ **With Local H2 Mode:**
- Create payments
- View payment details
- Capture payments
- Create refunds
- View refunds
- View database records
- Test APIs

❌ **Requires Redis:**
- Async payment processing (worker queue)
- Webhook delivery (webhook queue)
- Job metrics

---

## 🎯 EXPECTED BEHAVIOR

### Payment Flow (H2 Mode)

1. **Create Payment**
   ```
   POST /api/v1/payments → Status: PENDING
   (Stored in H2 database immediately)
   ```

2. **Worker Processing** (if running & Redis available)
   ```
   Worker reads from queue → Changes status to SUCCESS/FAILED
   (Without Redis, this is skipped)
   ```

3. **Webhook Delivery** (if Redis available)
   ```
   WebhookWorker sends webhook → Retries on failure
   (Without Redis, webhook queue operations are skipped)
   ```

### Test Mode Settings

When running with `--spring.profiles.active=local`:
- ✅ Test merchant auto-created
- ✅ H2 database (in-memory)
- ✅ Flyway disabled (uses Hibernate DDL)
- ✅ Payment success rate: 95%
- ✅ Processing delay: 2 seconds

---

## 🧪 FULL TESTING SCRIPT

Create file: `test-local.ps1`

```powershell
# Windows PowerShell Script

Write-Host "🚀 Starting Payment Gateway Local Test" -ForegroundColor Green

# Check Java
Write-Host "`n✅ Checking Java..." -ForegroundColor Cyan
java -version

# Backend
Write-Host "`n✅ Building Backend..." -ForegroundColor Cyan
cd backend
mvn clean package -DskipTests -q

Write-Host "`n✅ Starting Backend (H2 Mode)..." -ForegroundColor Cyan
$backend = Start-Process -PassThru -FilePath "cmd.exe" -ArgumentList "/k mvn spring-boot:run -Dspring-boot.run.arguments=`"--spring.profiles.active=local`""

Write-Host "✅ Backend starting on port 8000"
Start-Sleep -Seconds 5

# Checkout Widget
Write-Host "`n✅ Starting Checkout Widget..." -ForegroundColor Cyan
cd ../checkout-widget
$checkout = Start-Process -PassThru -FilePath "cmd.exe" -ArgumentList "/k npm run serve"

Write-Host "✅ Checkout starting on port 3001"
Start-Sleep -Seconds 3

# Dashboard
Write-Host "`n✅ Starting Dashboard..." -ForegroundColor Cyan
cd ../dashboard
$dashboard = Start-Process -PassThru -FilePath "cmd.exe" -ArgumentList "/k npm run dev"

Write-Host "✅ Dashboard starting on port 5173"

Write-Host "`n" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ ALL SERVICES STARTED" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "`n📍 Access Points:`n" -ForegroundColor Cyan
Write-Host "  Backend API:   http://localhost:8000" -ForegroundColor Yellow
Write-Host "  H2 Console:    http://localhost:8000/h2-console" -ForegroundColor Yellow
Write-Host "  Checkout SDK:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "  SDK Demo:      http://localhost:3001/demo.html" -ForegroundColor Yellow
Write-Host "  Dashboard:     http://localhost:5173" -ForegroundColor Yellow
Write-Host "`n🔑 Test Credentials:`n" -ForegroundColor Cyan
Write-Host "  API Key:    key_test_abc123" -ForegroundColor Yellow
Write-Host "  API Secret: secret_test_xyz789" -ForegroundColor Yellow
Write-Host "`n⏸️  Press Ctrl+C to stop all services`n" -ForegroundColor Magenta
```

Run it:
```bash
.\test-local.ps1
```

---

## 🔑 API Testing with cURL

### Create Payment
```bash
curl -X POST http://localhost:8000/api/v1/payments `
  -H "Content-Type: application/json" `
  -H "X-Api-Key: key_test_abc123" `
  -H "X-Api-Secret: secret_test_xyz789" `
  -H "Idempotency-Key: order_001" `
  -d '{"orderId":"order_001","method":"upi","vpa":"user@paytm"}'
```

### Capture Payment
```bash
# Replace {paymentId} with actual ID from create response
curl -X POST http://localhost:8000/api/v1/payments/{paymentId}/capture `
  -H "X-Api-Key: key_test_abc123" `
  -H "X-Api-Secret: secret_test_xyz789"
```

### Create Refund
```bash
curl -X POST http://localhost:8000/api/v1/refunds `
  -H "Content-Type: application/json" `
  -H "X-Api-Key: key_test_abc123" `
  -H "X-Api-Secret: secret_test_xyz789" `
  -d '{"paymentId":"{paymentId}","amount":25000}'
```

### Get Payment
```bash
curl http://localhost:8000/api/v1/payments/{paymentId} `
  -H "X-Api-Key: key_test_abc123" `
  -H "X-Api-Secret: secret_test_xyz789"
```

---

## ✅ VERIFICATION CHECKLIST

Once running:

- [ ] Backend starts with "✅ Test merchant created"
- [ ] http://localhost:8000 responds
- [ ] H2 Console accessible at /h2-console
- [ ] Checkout loads at http://localhost:3001
- [ ] SDK Demo works at http://localhost:3001/demo.html
- [ ] Dashboard loads at http://localhost:5173
- [ ] Payment API responds with valid payment JSON
- [ ] H2 console shows payment records in DB

---

## 🚫 TROUBLESHOOTING

### Backend won't start

```bash
# Clean rebuild
cd backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

### Port 8000 already in use

```bash
# Find process
netstat -ano | findstr :8000

# Kill it
taskkill /PID <PID> /F
```

### H2 Console won't load

- Wait 5 seconds after backend starts
- H2 needs initialization time
- Check browser console for errors

### SDK Demo not working

```bash
# Rebuild checkout widget
cd checkout-widget
npm run build
npm run serve
```

---

## 📝 WHAT'S DIFFERENT FROM DOCKER

| Feature | Docker | Local H2 |
|---------|--------|----------|
| Database | PostgreSQL (disk) | H2 (in-memory) |
| Redis | Real Redis | Required separately |
| Worker | Auto-runs | Optional in Terminal 4 |
| Data Persistence | Yes | No (lost on restart) |
| Setup Time | 10 seconds | Instant |
| Cleanup | docker down | Kill terminals |

---

**Ready to test?** Open 3-4 terminals and follow the Quick Start above! 🚀
