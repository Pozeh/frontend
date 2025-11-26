# Seller Account Testing Guide

This guide provides comprehensive testing for seller accounts, including creation, login validation, and security verification.

## 🏪 Test Seller Accounts

### Pre-configured Test Sellers

| Seller Name | Email | Password | Status | Business | Location |
|-------------|-------|----------|--------|----------|----------|
| John's Electronics | john@electronics.com | seller123 | ✅ Approved | John's Electronics Store | Nairobi, Kenya |
| Mary Fashion Boutique | mary@fashion.com | seller123 | ⏳ Pending | Mary's Fashion Boutique | Mombasa, Kenya |
| Tech Solutions Ltd | tech@solutions.com | seller123 | ❌ Rejected | Tech Solutions Limited | Kisumu, Kenya |
| Fresh Groceries Market | fresh@groceries.com | seller123 | ✅ Approved | Fresh Groceries Market | Nakuru, Kenya |
| Auto Parts Kenya | autoparts@kenya.com | seller123 | ⏳ Pending | Auto Parts Kenya | Eldoret, Kenya |
| Home Decor Store | decor@home.com | seller123 | ✅ Approved | Home Decor Store | Nairobi, Kenya |
| Sports Equipment | sports@equipment.com | seller123 | ❌ Rejected | Sports Equipment Kenya | Thika, Kenya |
| Book Store Kenya | books@kenya.com | seller123 | ✅ Approved | Book Store Kenya | Nairobi, Kenya |

## 🧪 Testing Options

### 1. Interactive Test Page
Open `create-test-sellers.html` in your browser for a comprehensive seller testing interface.

**Features:**
- ✅ Create all test sellers with one click
- ✅ Individual seller creation (approved/pending/rejected)
- ✅ Test specific seller logins
- ✅ Visual status indicators
- ✅ Detailed test results
- ✅ Seller management (delete/clear)

### 2. In-Website Testing
Use the test buttons in the registration modal:
- **🏪 Create Test Sellers** - Creates all 8 test seller accounts
- **🧪 Test Seller Logins** - Runs comprehensive login tests

### 3. Console Testing
Load `seller-test-suite.js` and run tests programmatically:

```javascript
// Create test sellers
sellerTestSuite.createAllTestSellers();

// Run all seller tests
sellerTestSuite.runAllSellerTests();

// Test specific scenarios
sellerTestSuite.testSpecificScenarios();

// Show current sellers
sellerTestSuite.showCurrentSellers();

// Generate report
sellerTestSuite.generateSellerReport();
```

## 🔍 Test Scenarios

### ✅ Approved Seller Login Tests
**Expected Behavior:** Should login successfully

| Email | Password | Expected Result |
|-------|----------|-----------------|
| john@electronics.com | seller123 | ✅ Login Success |
| fresh@groceries.com | seller123 | ✅ Login Success |
| decor@home.com | seller123 | ✅ Login Success |
| books@kenya.com | seller123 | ✅ Login Success |

### ❌ Pending Seller Login Tests
**Expected Behavior:** Should be blocked with pending message

| Email | Password | Expected Result |
|-------|----------|-----------------|
| mary@fashion.com | seller123 | ❌ Blocked - Pending Approval |
| autoparts@kenya.com | seller123 | ❌ Blocked - Pending Approval |

### ❌ Rejected Seller Login Tests
**Expected Behavior:** Should be blocked with rejection message

| Email | Password | Expected Result |
|-------|----------|-----------------|
| tech@solutions.com | seller123 | ❌ Blocked - Account Rejected |
| sports@equipment.com | seller123 | ❌ Blocked - Account Rejected |

### ❌ Invalid Credential Tests
**Expected Behavior:** Should be blocked

| Email | Password | Expected Result |
|-------|----------|-----------------|
| john@electronics.com | wrongpassword | ❌ Invalid Credentials |
| nonexistent@test.com | seller123 | ❌ Seller Not Found |

## 🚀 Quick Start

### Option 1: Interactive Testing
1. Open `create-test-sellers.html`
2. Click "🏪 Create All Test Sellers"
3. Click "🧪 Test All Seller Logins"
4. Review results

### Option 2: In-Website Testing
1. Open `index.html`
2. Click "Register" to open modal
3. Click "🏪 Create Test Sellers"
4. Click "🧪 Test Seller Logins"
5. Check console for results

### Option 3: Console Testing
1. Open `index.html` in browser
2. Open Developer Console (F12)
3. Run: `sellerTestSuite.runAllSellerTests()`

## 📊 Expected Test Results

### Security Verification
- ✅ **Only approved sellers** can login
- ❌ **Pending sellers** CANNOT login
- ❌ **Rejected sellers** CANNOT login
- ❌ **Invalid credentials** are rejected
- ✅ **Proper error messages** displayed

### Test Summary Example
```
📊 SELLER TEST SUMMARY
Total Tests: 8/8 (100% pass rate)

📈 Detailed Results:
✅ Approved Sellers: 4 tested, 4 logged in
⏳ Pending Sellers: 2 tested, 0 logged in (should be 0)
❌ Rejected Sellers: 2 tested, 0 logged in (should be 0)

🎉 ALL SELLER TESTS PASSED! Security working correctly.
```

## 🔧 Manual Testing Steps

### 1. Create Test Sellers
1. Open registration modal
2. Click "🏪 Create Test Sellers"
3. Verify 8 sellers created in localStorage

### 2. Test Approved Seller Login
1. Open login modal
2. Click "Seller Login" button
3. Enter: john@electronics.com / seller123
4. **Expected:** Login success, redirect to dashboard

### 3. Test Pending Seller Login
1. Open login modal
2. Click "Seller Login" button
3. Enter: mary@fashion.com / seller123
4. **Expected:** "Your seller account is still pending admin approval"

### 4. Test Rejected Seller Login
1. Open login modal
2. Click "Seller Login" button
3. Enter: tech@solutions.com / seller123
4. **Expected:** "Your seller account has been rejected"

### 5. Test Invalid Credentials
1. Open login modal
2. Click "Seller Login" button
3. Enter: john@electronics.com / wrongpassword
4. **Expected:** "Invalid email or password"

## 🛠️ Troubleshooting

### Tests Not Running
- Ensure `seller-test-suite.js` is in the same directory
- Check browser console for JavaScript errors
- Verify `handleSellerLogin` function exists

### Login Not Working
- Check seller status in localStorage
- Verify login type is set to 'seller'
- Check email/password match exactly

### Unexpected Test Results
- Clear localStorage and recreate sellers
- Check for duplicate email addresses
- Verify seller status values

## 📱 Browser Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Check `registeredSellers` array
4. Verify seller objects have correct structure

### Console Commands
```javascript
// Check sellers
JSON.parse(localStorage.getItem('registeredSellers'))

// Check current user
JSON.parse(localStorage.getItem('currentUser'))

// Clear all data
localStorage.clear()
```

## 🔒 Security Verification

### What to Verify
1. **Authentication**: Only approved sellers can login
2. **Authorization**: Proper role assignment (type: 'seller')
3. **Session Management**: Correct localStorage updates
4. **Error Handling**: Appropriate messages for each scenario
5. **Data Integrity**: Seller data preserved correctly

### Success Criteria
- ✅ All approved sellers login successfully
- ✅ All pending sellers are blocked
- ✅ All rejected sellers are blocked
- ✅ Invalid credentials rejected
- ✅ Clear error messages displayed
- ✅ User sessions created correctly
- ✅ Proper UI updates after login

## 🎯 Next Steps

After seller testing:
1. Test admin approval workflow
2. Verify seller dashboard access
3. Test product listing functionality
4. Check order management features
5. Verify cross-browser compatibility

## 📞 Support

For issues with seller testing:
1. Check browser console for errors
2. Verify all test files are present
3. Ensure no conflicting scripts
4. Test in different browsers if needed

---

**Note**: This test suite uses localStorage for data persistence. In production, this would be replaced with a proper backend database and admin approval system.
