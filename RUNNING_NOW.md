# ✅ PAYMENT GATEWAY - PROJECT RUNNING!

## 🎉 Status: LIVE & TESTING

**Date:** January 11, 2026  
**Time:** 12:00 IST  
**Backend:** ✅ **RUNNING ON PORT 8000**

---

## 🚀 What's Currently Running

### Backend API (Spring Boot)
```
Status:     ✅ ACTIVE
Port:       8000
Database:   PostgreSQL (payment_gateway)
Migrations: ✅ Applied (V1 + V2)
```

**Started with:**
```bash
java -jar target/payment-gateway-0.1.0.jar
```

---

## 📋 Next Steps: Start Other Services

### 1️⃣ Checkout Widget Server (Port 3001)
```bash
cd checkout-widget
npm run serve
```

### 2️⃣ Dashboard (Port 3000)
```bash
cd dashboard
npm run build  # First time only
npx serve -s dist -l 3000
```

### 3️⃣ Test Webhook Receiver (Port 4000)
```bash
cd test-merchant
npm start
```

---

## 🧪 Test the API Endpoints

### Test 1: Health Check
```bash
curl http://localhost:8000/actuator/health
```
**Expected Response:**
```json
{"status":"UP"}
```

### Test 2: Create Payment
```bash
curl -X POST http://localhost:8000/api/v1/payments \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_123",
    "method": "upi",
    "vpa": "user@paytm"
  }'
```

**Expected Response:**
```json
{
  "id": "pay_xxx",
  "orderId": "order_123",
  "amount": 50000,
  "status": "pending",
  "captured": false
}
```

### Test 3: Capture Payment
```bash
curl -X POST http://localhost:8000/api/v1/payments/{paymentId}/capture \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789"
```

---

## 🔌 Connection Details

**PostgreSQL:**
- Host: localhost
- Port: 5432
- Database: payment_gateway
- User: postgres
- Password: vinay2122@

**API:**
- URL: http://localhost:8000
- API Key: key_test_abc123
- API Secret: secret_test_xyz789

---

## 📊 Project Structure

All services are in:
```
C:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\
```

| Service | Port | Command |
|---------|------|---------|
| Backend API | 8000 | `java -jar backend/target/payment-gateway-0.1.0.jar` |
| Checkout Widget | 3001 | `cd checkout-widget && npm run serve` |
| Dashboard | 3000 | `cd dashboard && npx serve -s dist -l 3000` |
| Webhook Receiver | 4000 | `cd test-merchant && npm start` |

---

## ✨ Quick Access URLs

- **API Health:** http://localhost:8000/actuator/health
- **Checkout Widget:** http://localhost:3001
- **Dashboard:** http://localhost:3000
- **SDK Demo:** http://localhost:3001/demo.html
- **Webhook Test:** http://localhost:4000/webhook

---

## 📝 Database Migrations Applied

✅ **V1__init_schema.sql**
- Created all tables (merchants, payments, refunds, webhook_logs, idempotency_keys)
- Created indexes
- Loaded pgcrypto extension

✅ **V2__seed_test_merchant.sql**
- Inserted test merchant
- API credentials ready

---

## 🎯 What to Do Next

1. ✅ **Backend is running** - Test the API endpoints above
2. ⏭️ **Start Checkout Widget** - Run `npm run serve` in checkout-widget/
3. ⏭️ **Start Dashboard** - Run `npx serve -s dist -l 3000` in dashboard/
4. ⏭️ **Start Webhook Receiver** - Run `npm start` in test-merchant/
5. ⏭️ **Test full flow** - Use SDK demo page at http://localhost:3001/demo.html

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check PostgreSQL is running
- Verify password is `vinay2122@`
- Check port 8000 is not in use

**API returning errors?**
- Check `X-Api-Key` and `X-Api-Secret` headers
- Verify backend is running (`curl http://localhost:8000/actuator/health`)
- Check backend logs for error messages

**Database connection failed?**
- Ensure `payment_gateway` database exists in PostgreSQL
- Verify password in `application.yml` matches your PostgreSQL setup
- Check PostgreSQL service is running

---

**Project is LIVE and ready for testing!** 🚀
