# Registration Test Flow Guide

This guide explains how to test the user registration functionality of the shopping website.

## 🧪 Test Options

### 1. Interactive Test Page
Open `test-registration.html` in your browser to access a comprehensive test interface.

**Features:**
- ✅ Automated test suite with 6 test cases
- ✅ Manual registration testing
- ✅ Real-time localStorage inspection
- ✅ Visual test results with pass/fail indicators
- ✅ Test data clearing functionality

### 2. In-Website Testing
Use the "🧪 Run Registration Tests" button in the registration modal on the main website.

### 3. Console Testing
Load `registration-test.js` in the browser console and run tests programmatically.

## 📋 Test Cases

The test suite covers the following scenarios:

| Test Case | Email | Password | Expected Result |
|-----------|-------|----------|-----------------|
| Valid User | validuser@test.com | password123 | ✅ PASS |
| Short Password | short@test.com | 123 | ❌ FAIL (too short) |
| Password Mismatch | mismatch@test.com | password123 / different123 | ❌ FAIL (mismatch) |
| Duplicate Email | validuser@test.com | password123 | ❌ FAIL (duplicate) |
| Empty Name | emptyname@test.com | password123 | ❌ FAIL (validation) |
| Invalid Email | invalid-email-format | password123 | ❌ FAIL (invalid format) |

## 🚀 Quick Start

### Option 1: Interactive Testing
1. Open `test-registration.html` in your browser
2. Click "🚀 Run All Tests"
3. Review the results and localStorage contents

### Option 2: In-Website Testing
1. Open `index.html`
2. Click "Register" to open the registration modal
3. Click "🧪 Run Registration Tests"
4. Check browser console for detailed results

### Option 3: Console Testing
1. Open `index.html` in browser
2. Open Developer Console (F12)
3. Paste and run: `const testSuite = new RegistrationTestSuite(); testSuite.runAllTests();`

## 🔍 What Tests Verify

### ✅ Registration Validation
- **Password Length**: Minimum 6 characters required
- **Password Match**: Password and confirm password must match
- **Email Format**: Valid email format validation
- **Email Uniqueness**: No duplicate emails across users and sellers
- **Required Fields**: All required fields must be filled

### ✅ Data Storage
- **localStorage Integration**: Users saved to `registeredUsers` array
- **User Object Structure**: Proper user data format with timestamps
- **Data Persistence**: Users persist across page refreshes

### ✅ User Experience
- **Form Clearing**: Form clears after successful registration
- **Success Messages**: Appropriate success notifications
- **Error Handling**: Clear error messages for validation failures
- **Modal Navigation**: Proper flow to login after registration

## 📊 Test Results Interpretation

### ✅ PASS Indicators
- Test case behaved as expected
- User created/not created appropriately
- Validation worked correctly
- Proper error/success messages shown

### ❌ FAIL Indicators
- Unexpected behavior occurred
- User created when shouldn't have been
- User not created when should have been
- Validation bypassed or incorrect

## 🛠️ Advanced Testing

### Custom Test Cases
Run custom registration tests from console:
```javascript
testSuite.testCustomRegistration('Custom Name', 'custom@test.com', 'password123', 'password123');
```

### Email Validation Testing
Test email format validation:
```javascript
testSuite.testEmailValidation();
```

### Generate Test Report
Get detailed test report:
```javascript
const report = testSuite.generateReport();
console.log(report);
```

## 📱 Manual Testing Checklist

### Registration Form Testing
- [ ] Fill all fields correctly → Should succeed
- [ ] Leave name empty → Should fail
- [ ] Use invalid email → Should fail
- [ ] Use password < 6 chars → Should fail
- [ ] Mismatch passwords → Should fail
- [ ] Use existing email → Should fail

### Post-Registration Testing
- [ ] Check localStorage for new user
- [ ] Verify user object structure
- [ ] Test login with new credentials
- [ ] Verify form cleared after registration
- [ ] Check success message display

## 🔧 Troubleshooting

### Tests Not Running
- Ensure `registration-test.js` is in the same directory
- Check browser console for JavaScript errors
- Verify `handleRegister` function exists

### Inconsistent Results
- Clear localStorage between test runs
- Check for conflicting scripts
- Verify test data is correct

### localStorage Issues
- Use browser DevTools → Application → Local Storage
- Clear all data: `localStorage.clear()`
- Check specific keys: `localStorage.getItem('registeredUsers')`

## 📈 Success Criteria

A successful registration system should:
1. ✅ Validate all input fields correctly
2. ✅ Store valid users in localStorage
3. ✅ Prevent duplicate registrations
4. ✅ Provide clear user feedback
5. ✅ Handle all edge cases gracefully
6. ✅ Maintain data integrity
7. ✅ Support subsequent login attempts

## 🎯 Next Steps

After registration testing:
1. Test login functionality with registered users
2. Verify seller registration workflow
3. Test session persistence
4. Validate admin approval process for sellers
5. Check cross-browser compatibility

## 📞 Support

For issues with the test flow:
1. Check browser console for errors
2. Verify all files are present and accessible
3. Ensure no conflicting scripts
4. Test in different browsers if needed

---

**Note**: This test suite uses localStorage for data persistence. In a production environment, this would be replaced with a proper backend database.
