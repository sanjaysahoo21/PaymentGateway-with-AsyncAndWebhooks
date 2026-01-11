# 🚀 LOCAL DEVELOPMENT SETUP (Without Docker)

## ⚠️ Current System Status

**PostgreSQL:** Not installed ❌  
**Redis:** Not installed ❌  
**Java 17:** ✅ Available  
**Node.js:** ✅ Available  

---

## 📋 OPTIONS FOR LOCAL TESTING

### **Option 1: Docker for Databases Only (RECOMMENDED)**
Run only PostgreSQL + Redis in Docker, everything else locally

### **Option 2: Install PostgreSQL & Redis Locally**
Direct system installation (requires admin access)

### **Option 3: WSL2 with PostgreSQL & Redis**
Run databases in Windows Subsystem for Linux

---

## 🐳 **OPTION 1: DOCKER FOR DATABASES ONLY** ⭐ (EASIEST)

This keeps your system clean and isolates databases.

### Step 1: Start PostgreSQL & Redis Only

```bash
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks

# Create a minimal docker-compose file for just databases
# OR run individual containers:

docker run -d --name postgres-dev `
  -e POSTGRES_PASSWORD=vinay2122@ `
  -e POSTGRES_DB=payment_gateway `
  -p 5432:5432 `
  postgres:15-alpine

docker run -d --name redis-dev `
  -p 6379:6379 `
  redis:7-alpine
```

### Step 2: Verify Databases Are Running

```bash
docker ps
```

Expected output: 2 containers running (postgres + redis)

### Step 3: Start Backend API (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

**Output:** "Started ApiApplication in X seconds"  
**Access:** http://localhost:8000

### Step 4: Start Checkout Widget Server (Terminal 2)

```bash
cd checkout-widget
npm run serve
```

**Access:** http://localhost:3001  
**SDK Demo:** http://localhost:3001/demo.html

### Step 5: Start Dashboard (Terminal 3)

```bash
cd dashboard
npm run dev
```

**Access:** http://localhost:5173

### Step 6: (Optional) Start Worker in Separate JVM (Terminal 4)

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=worker"
```

---

## 🔧 **OPTION 2: LOCAL INSTALLATION** (Advanced)

### **For Windows - PostgreSQL**

1. Download: https://www.postgresql.org/download/windows/
2. Install with password `vinay2122@`
3. Verify: `psql -U postgres -d payment_gateway`

### **For Windows - Redis**

Option A: Windows Subsystem for Linux (WSL2)
```bash
wsl
sudo apt-get install redis-server
redis-server
```

Option B: Use Memurai (Windows Redis port)
- Download: https://www.memurai.com/
- Install and run

Option C: Use this executable
- https://github.com/microsoftarchive/redis/releases

---

## 🎯 **QUICKSTART: DOCKER DATABASES + LOCAL SERVICES**

**Copy this into a PowerShell terminal:**

```powershell
# Terminal 1: Start Docker Databases
docker run -d --name postgres-dev `
  -e POSTGRES_PASSWORD=vinay2122@ `
  -e POSTGRES_DB=payment_gateway `
  -p 5432:5432 `
  postgres:15-alpine

docker run -d --name redis-dev `
  -p 6379:6379 `
  redis:7-alpine

Write-Host "✅ Waiting 10 seconds for databases to start..."
Start-Sleep -Seconds 10

# Terminal 2: Backend API
cd backend
mvn spring-boot:run

# In another terminal:
# Terminal 3: Checkout Widget
cd checkout-widget
npm run serve

# In another terminal:
# Terminal 4: Dashboard
cd dashboard
npm run dev

# In another terminal (optional):
# Terminal 5: Worker
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=worker"
```

---

## 🧪 TEST THE SETUP

### Check All Services Running

```bash
# In new terminal:

# Test PostgreSQL
psql -h localhost -U postgres -d payment_gateway -c "SELECT * FROM merchants;"

# Test Redis
redis-cli ping

# Test API
curl http://localhost:8000

# Test Dashboard
curl http://localhost:5173

# Test Checkout
curl http://localhost:3001
```

### Test Payment Flow

1. Open: http://localhost:3001/demo.html
2. Click "Pay with Gateway SDK"
3. Enter VPA (e.g., `user@paytm`)
4. Click Pay button
5. Check logs in dashboard: http://localhost:5173

### Check Database

```bash
psql -h localhost -U postgres -d payment_gateway

# Inside psql:
\dt                                    # List tables
SELECT * FROM merchants;               # View test merchant
SELECT * FROM payments;                # View payments
SELECT * FROM webhook_logs;            # View webhooks
\q                                     # Exit
```

### Check Redis Queues

```bash
redis-cli

# Inside redis-cli:
KEYS *                                 # List all keys
GET queue:payment.process              # Check payment queue
GET metrics:jobs:pending               # Check metrics
GET metrics:jobs:completed             # Check completed jobs
QUIT                                   # Exit
```

---

## 📝 TERMINAL SETUP (Recommended Order)

Open 5 PowerShell windows in this order:

```
Terminal 1 (Databases):
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks
docker run -d --name postgres-dev -e POSTGRES_PASSWORD=vinay2122@ -e POSTGRES_DB=payment_gateway -p 5432:5432 postgres:15-alpine
docker run -d --name redis-dev -p 6379:6379 redis:7-alpine
echo "✅ Databases started. Waiting for initialization..."
Start-Sleep -Seconds 10

Terminal 2 (Backend API):
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\backend
mvn spring-boot:run

Terminal 3 (Checkout Widget):
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\checkout-widget
npm run serve

Terminal 4 (Dashboard):
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\dashboard
npm run dev

Terminal 5 (Worker - Optional):
cd c:\Users\LENOVO\Desktop\GppTasks\PaymentGateway-with-asyncAndWebhooks\backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=worker"
```

---

## 🌐 ACCESS URLS (LOCAL SETUP)

| Service | URL | Port |
|---------|-----|------|
| **Backend API** | http://localhost:8000 | 8000 |
| **Dashboard** | http://localhost:5173 | 5173 |
| **Checkout** | http://localhost:3001 | 3001 |
| **SDK Demo** | http://localhost:3001/demo.html | 3001 |
| **PostgreSQL** | localhost:5432 | 5432 |
| **Redis** | localhost:6379 | 6379 |

---

## 🔑 TEST CREDENTIALS

```
API Key:           key_test_abc123
API Secret:        secret_test_xyz789
DB User:           postgres
DB Password:       vinay2122@
DB Name:           payment_gateway
```

---

## 🐛 TROUBLESHOOTING

### Port Already in Use

**Port 8000 (Backend):**
```bash
# Find process using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
taskkill /PID <PID> /F  # Windows
```

**Port 3001 (Checkout):**
```bash
# Change in checkout-widget/server.js
# Change app.listen(3001, ...) to app.listen(3002, ...)
```

**Port 5173 (Dashboard):**
```bash
# Change in vite.config.js
# Add server: { port: 5174 }
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# If not running:
docker start postgres-dev

# Check Redis is running
docker ps | grep redis

# If not running:
docker start redis-dev
```

### API Doesn't Start

```bash
# Check Java version
java -version  # Should be 17.x

# Check Maven
mvn -v

# If issues, clean rebuild
cd backend
mvn clean install
mvn spring-boot:run
```

### Checkout Widget Errors

```bash
# Rebuild
cd checkout-widget
rm -rf node_modules package-lock.json
npm install
npm run build
npm run serve
```

### Dashboard Won't Load

```bash
# Rebuild
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 EXPECTED LOGS

### Backend API Starting
```
Started ApiApplication in X.XXX seconds (JVM running for Y.YYY)
Tomcat started on port(s): 8000
Application 'payment-gateway' is running!
```

### Checkout Widget Starting
```
Server listening on port 3001
Visit http://localhost:3001
```

### Dashboard Starting
```
VITE v5.x.x  building for development...
➜  Local:   http://localhost:5173/
```

### Worker Starting
```
Started WorkerApplication in X.XXX seconds
app.worker.enabled=true
Processing payment jobs...
Processing refund jobs...
Delivering webhooks...
```

---

## ✅ VERIFICATION CHECKLIST

Once everything is running:

- [ ] PostgreSQL running (docker ps shows postgres-dev)
- [ ] Redis running (docker ps shows redis-dev)
- [ ] Backend API running (http://localhost:8000 accessible)
- [ ] Dashboard running (http://localhost:5173 accessible)
- [ ] Checkout running (http://localhost:3001 accessible)
- [ ] Test merchant exists (psql shows it)
- [ ] Can create payment (test API)
- [ ] Worker processes payments (logs show activity)
- [ ] Webhooks appear in database (webhook_logs table)

---

## 🚀 NEXT STEPS

1. ✅ Start all services (use setup above)
2. ✅ Verify they're all running
3. ✅ Test payment flow (http://localhost:3001/demo.html)
4. ✅ Check database records (psql queries)
5. ✅ Review webhooks in dashboard
6. ✅ Proceed to Git commits when satisfied

---

## 📝 CLEANUP

When done testing locally:

```bash
# Stop Docker containers
docker stop postgres-dev redis-dev
docker rm postgres-dev redis-dev

# Kill any Maven processes (Ctrl+C in terminals)
# Kill any npm servers (Ctrl+C in terminals)
```

---

**Ready to test? Which option would you like to use?**
- Option 1 (Docker DBs): Run databases in Docker, everything else locally
- Option 2 (Full Local): Install PostgreSQL & Redis locally
