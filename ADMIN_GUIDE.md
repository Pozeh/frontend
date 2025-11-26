# Admin Panel Guide

This guide provides comprehensive information about the EcoLoop Kenya admin panel functionality.

## 🔐 Admin Access

### Admin Credentials
- **Email**: `admin@ecoloop.com`
- **Password**: `admin123`

⚠️ **Security Note**: In production, these credentials should be stored securely on the server and use proper authentication.

### Access Points

1. **Main Website**: Click "Admin" button in header → redirects to `admin.html`
2. **Direct Access**: Navigate to `admin.html` → auto-redirects to login
3. **Login Page**: `admin/admin-login.html` → after login → `admin/admin-dashboard.html`

## 📁 Admin File Structure

```
admin/
├── admin-login.html          # Admin login page
├── admin-dashboard.html      # Main admin dashboard
└── admin.html               # Entry point (redirects to login)
```

## 🚀 Admin Features

### 1. Authentication System
- **Login Validation**: Checks credentials against stored admin data
- **Session Management**: Uses localStorage for admin session
- **Auto-Redirect**: Redirects unauthenticated users to login
- **Logout**: Clears session and redirects to login

### 2. Admin Dashboard
- **Product Management**: Approve/reject seller products
- **Seller Management**: View and manage seller accounts
- **Statistics**: Real-time counts of pending/approved/rejected items
- **Real-time Updates**: Automatic data refresh

### 3. Product Approval Workflow
- **Pending Products**: Queue of products awaiting approval
- **Product Details**: View full product information and seller details
- **Approval Actions**: Approve or reject products with one click
- **Status Tracking**: Track product status changes

### 4. Seller Management
- **Seller Overview**: View all registered sellers
- **Status Management**: See seller approval status
- **Seller Statistics**: Products count and activity
- **Quick Actions**: Approve/reject sellers directly

## 🎯 Admin Workflow

### 1. Access Admin Panel
1. Click "Admin" on main website
2. Enter credentials: `admin@ecoloop.com` / `admin123`
3. Click "Login to Admin Panel"
4. Redirected to admin dashboard

### 2. Review Pending Products
1. Dashboard shows pending count
2. Click "Pending" filter tab
3. Review each product:
   - Product details and images
   - Seller information
   - Pricing and descriptions
4. Approve or reject each product

### 3. Manage Sellers
1. View "Registered Sellers" section
2. Check seller status:
   - **Approved**: Can login and add products
   - **Pending**: Awaiting admin approval
   - **Rejected**: Denied access
3. Approve/reject sellers as needed

### 4. Monitor Statistics
- **Pending Count**: Products awaiting approval
- **Approved Count**: Live products on marketplace
- **Rejected Count**: Denied products
- **Total Sellers**: Active seller accounts

## 🔧 Admin Functions

### Product Management
```javascript
// Approve product
approveProduct(productId)

// Reject product  
rejectProduct(productId)

// Filter products by status
filterProducts(status) // 'all', 'pending', 'approved', 'rejected'
```

### Seller Management
```javascript
// Approve seller
approveSeller(sellerId)

// Reject seller
rejectSeller(sellerId)

// Refresh seller list
refreshSellers()
```

### Dashboard Operations
```javascript
// Manual data refresh
manualRefresh()

// Add test product (for testing)
addTestProduct()

// Run full test workflow
runFullTest()

// Simulate seller workflow
simulateSellerWorkflow()
```

## 📊 Data Storage

The admin panel uses localStorage for data persistence:

### Storage Keys
- `adminUser` - Admin session data
- `registeredSellers` - Seller accounts
- `sellerProducts` - Product listings
- `currentUser` - Current user session

### Data Structures

#### Admin Session
```json
{
  "email": "admin@ecoloop.com",
  "loginTime": "2025-01-25T12:00:00.000Z",
  "role": "admin"
}
```

#### Seller Account
```json
{
  "id": 123456789,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "business": "John's Store",
  "phone": "+254712345678",
  "location": "Nairobi, Kenya",
  "status": "approved",
  "createdAt": "2025-01-25T12:00:00.000Z"
}
```

#### Product Listing
```json
{
  "id": 987654321,
  "sellerId": 123456789,
  "sellerName": "John Doe",
  "sellerEmail": "john@example.com",
  "name": "iPhone 12",
  "category": "Electronics",
  "price": 45000,
  "description": "Excellent condition iPhone 12",
  "status": "pending",
  "createdAt": "2025-01-25T12:00:00.000Z"
}
```

## 🧪 Testing Features

The admin panel includes built-in testing functions:

### Test Functions
- **Full Test**: Creates seller, logs in, adds product, verifies admin panel
- **Simulate Seller**: Tests complete seller registration workflow
- **Add Test Product**: Creates sample product for testing
- **Manual Refresh**: Forces data refresh

### How to Test
1. Login to admin dashboard
2. Click "Full Test" button
3. Watch console for detailed test results
4. Verify test product appears in pending queue

## 🔒 Security Considerations

### Current Implementation
- ✅ Basic authentication
- ✅ Session management
- ✅ Auto-logout protection
- ⚠️ Client-side storage (localStorage)

### Production Recommendations
- 🔄 Server-side authentication
- 🔄 Secure credential storage
- 🔄 Session timeout management
- 🔄 Audit logging
- 🔄 Role-based access control

## 🚨 Troubleshooting

### Common Issues

#### Admin Not Logging In
- **Check**: Correct email/password (`admin@ecoloop.com` / `admin123`)
- **Check**: Browser console for JavaScript errors
- **Fix**: Clear browser localStorage and try again

#### Dashboard Not Loading Data
- **Check**: localStorage for `registeredSellers` and `sellerProducts`
- **Fix**: Click "Refresh" button in dashboard
- **Fix**: Add test products using "Test Product" button

#### Products Not Showing
- **Check**: Product status is "pending"
- **Check**: Seller account is "approved"
- **Fix**: Use "Full Test" to create sample data

#### Session Issues
- **Symptom**: Redirected to login repeatedly
- **Cause**: Admin session expired/cleared
- **Fix**: Login again with admin credentials

### Debug Commands
```javascript
// Check admin session
localStorage.getItem('adminUser')

// Check sellers data
JSON.parse(localStorage.getItem('registeredSellers'))

// Check products data  
JSON.parse(localStorage.getItem('sellerProducts'))

// Clear all data (for testing)
localStorage.clear()
```

## 📱 Browser Compatibility

The admin panel works on all modern browsers:
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🔄 Future Enhancements

### Planned Features
- 📧 Email notifications for sellers
- 📊 Advanced analytics dashboard
- 🖼️ Image moderation
- 💬 Product comments management
- 📦 Order management
- 🎨 Theme customization

### Technical Improvements
- 🔄 Server-side API integration
- 🔐 OAuth authentication
- 📱 Mobile responsive design
- ⚡ Performance optimization
- 🔍 Advanced search and filtering

## 📞 Support

For admin panel issues:
1. Check browser console for errors
2. Verify localStorage data integrity
3. Test with built-in test functions
4. Clear cache and reload page

---

**Note**: This admin panel is designed for demonstration purposes. In production, implement proper server-side authentication and database integration.
