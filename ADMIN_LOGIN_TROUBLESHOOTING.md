# Admin Login Setup & Troubleshooting Guide

## 🔐 Admin Credentials
- **Email:** `pmuiruri9657@gmail.com`
- **Password:** `paul965757`
- **Name:** Paul Muiruri

## 🚀 Quick Setup Steps

### Step 1: Check Backend Status
1. Open `test-admin-setup.html` in your browser
2. Click "3. Check Backend Status" 
3. Verify you see "✅ Backend is running and MongoDB is connected!"

### Step 2: Create Admin Account
1. If backend is connected, click "1. Create Admin Account"
2. You should see "✅ Admin account created successfully!" or "ℹ️ Admin account already exists"

### Step 3: Test Login
1. Click "2. Test Login"
2. You should see "✅ Login test successful!"

### Step 4: Login to Admin Panel
1. Open `frontend/admin/admin-login.html`
2. The form is pre-filled with correct credentials
3. Click "Login to Admin Panel"
4. You should be redirected to admin dashboard

## 🔧 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
- Make sure the backend server is running
- Check that `https://my-backend-1-jk7w.onrender.com` is accessible
- Try opening the URL directly in browser

### Issue: "Invalid email or password"
**Solution:**
1. Click "🔍 Test Backend Connection" on admin login page
2. If backend is connected, click "🗑️ Clear Saved Session"
3. Try creating admin account again using `test-admin-setup.html`
4. Verify credentials are exactly: `pmuiruri9657@gmail.com` / `paul965757`

### Issue: "Admin account already exists but login fails"
**Solution:**
1. Clear localStorage session: Click "🗑️ Clear Saved Session"
2. Test backend connection: Click "🔍 Test Backend Connection"
3. Try login again with exact credentials

### Issue: Backend not responding
**Solution:**
1. Check if Render backend is deployed and running
2. Visit `https://my-backend-1-jk7w.onrender.com/api/test` directly
3. If not working, redeploy the backend to Render

## 📱 Testing Tools Created

### 1. `test-admin-setup.html`
- **Purpose:** Complete admin setup and testing
- **Features:** 
  - Backend connection test
  - Admin account creation
  - Login testing
  - Detailed error reporting

### 2. Enhanced Admin Login Page
- **Pre-filled credentials** for easy testing
- **Backend connection test** button
- **Clear session** button
- **Auto-connection testing** on page load

## 🔍 Debugging Steps

### 1. Check Browser Console
1. Open admin login page
2. Press F12 to open developer tools
3. Check Console tab for any error messages
4. Look for "Admin login attempt:" messages

### 2. Test Backend Directly
Open these URLs in browser:
- `https://my-backend-1-jk7w.onrender.com/api/test` - Should show MongoDB connection status
- `https://my-backend-1-jk7w.onrender.com/api/admin/setup` (POST) - Creates admin account
- `https://my-backend-1-jk7w.onrender.com/api/admin/login` (POST) - Tests login

### 3. Verify MongoDB Collection
If you have MongoDB Atlas access:
1. Check `admins` collection exists
2. Look for document with email `pmuiruri9657@gmail.com`
3. Verify status is "active"

## 🛠️ Manual Setup (if automated fails)

### Using MongoDB Shell
```javascript
// Connect to your MongoDB database
use your_database_name

// Insert admin document manually
db.admins.insertOne({
  email: "pmuiruri9657@gmail.com",
  password: "paul965757",
  name: "Paul Muiruri",
  role: "admin",
  status: "active",
  createdAt: new Date(),
  createdBy: "system"
});
```

### Using Backend API
```bash
# Create admin account
curl -X POST https://my-backend-1-jk7w.onrender.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pmuiruri9657@gmail.com",
    "password": "paul965757",
    "name": "Paul Muiruri"
  }'

# Test login
curl -X POST https://my-backend-1-jk7w.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pmuiruri9657@gmail.com",
    "password": "paul965757"
  }'
```

## ✅ Success Indicators

### Backend Working
- [ ] `test-admin-setup.html` shows "✅ Backend is running and MongoDB is connected!"
- [ ] Direct visit to `https://my-backend-1-jk7w.onrender.com/api/test` returns JSON

### Admin Account Created
- [ ] `test-admin-setup.html` shows "✅ Admin account created successfully!"
- [ ] Or "ℹ️ Admin account already exists"

### Login Working
- [ ] `test-admin-setup.html` shows "✅ Login test successful!"
- [ ] Admin login page redirects to dashboard
- [ ] Dashboard shows admin interface

### Session Management
- [ ] Login creates session in localStorage
- [ ] Session persists for 24 hours
- [ ] Logout clears session
- [ ] Expired sessions auto-logout

## 🆘 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid email or password" | Admin not created in MongoDB | Use `test-admin-setup.html` to create account |
| "Cannot connect to backend" | Backend not running | Deploy/restart backend on Render |
| "Session expired" | 24-hour timeout | Login again |
| "Redirect loop" | Invalid session data | Clear localStorage session |

## 📞 Support

If issues persist:
1. Check browser console for detailed errors
2. Verify all URLs are accessible
3. Confirm MongoDB Atlas connection
4. Test with `test-admin-setup.html` first
5. Check backend logs on Render dashboard

---

**Remember:** The admin credentials are stored in MongoDB, not localStorage. The frontend only stores temporary session tokens for authentication.
