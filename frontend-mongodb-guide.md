# MongoDB Atlas Integration Guide for EcoLoop Kenya

This guide shows how to integrate your existing EcoLoop Kenya frontend with the new MongoDB Atlas backend.

## Backend Setup

### 1. MongoDB Atlas Configuration

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with username and password
4. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 2. Backend Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and paste your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://ecoloop:paul965757@cluster0.osksekt.mongodb.net/?appName=Cluster0
   PORT=3000
   ```

3. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

The backend will run on `http://localhost:3000`

## Frontend Integration

### API Endpoints Available

- **GET** `/api/test` - Test MongoDB connection
- **POST** `/api/save` - Save data to `windsurfdata` collection
- **GET** `/api/data` - Get all data from `windsurfdata` collection

### Sample Code for Frontend Integration

#### 1. Save Data to MongoDB

Replace your `localStorage.setItem()` calls with this:

```javascript
async function saveDataToMongo(data) {
  try {
    const response = await fetch('http://localhost:3000/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Data saved successfully:', result.id);
      return result;
    } else {
      console.error('Save failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return null;
  }
}

// Example usage:
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  cart: [{ id: 1, title: 'Product 1', price: 1000 }],
  wishlist: [{ id: 2, title: 'Product 2', price: 2000 }]
};

saveDataToMongo(userData);
```

#### 2. Get Data from MongoDB

Replace your `localStorage.getItem()` calls with this:

```javascript
async function getDataFromMongo() {
  try {
    const response = await fetch('http://localhost:3000/api/data');
    const result = await response.json();
    
    if (result.success) {
      console.log('Data retrieved successfully:', result.data);
      return result.data;
    } else {
      console.error('Retrieve failed:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return [];
  }
}

// Example usage:
getDataFromMongo().then(data => {
  // Process your data here
  const userData = data.find(item => item.email === 'john@example.com');
  if (userData) {
    console.log('User cart:', userData.cart);
    console.log('User wishlist:', userData.wishlist);
  }
});
```

#### 3. Test MongoDB Connection

```javascript
async function testMongoConnection() {
  try {
    const response = await fetch('http://localhost:3000/api/test');
    const result = await response.json();
    
    if (result.connected) {
      console.log('✅ MongoDB is connected:', result.message);
      return true;
    } else {
      console.error('❌ MongoDB connection failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing connection:', error);
    return false;
  }
}

// Test connection on page load
testMongoConnection();
```

## Replacing localStorage Logic

### Cart Management

**Current localStorage code:**
```javascript
// Save cart
localStorage.setItem('userCart', JSON.stringify(cartItems));

// Get cart
const cartItems = JSON.parse(localStorage.getItem('userCart') || '[]');
```

**New MongoDB code:**
```javascript
// Save cart
async function saveCart(cartItems) {
  const userData = await getCurrentUserData();
  await saveDataToMongo({
    ...userData,
    cart: cartItems,
    lastUpdated: new Date()
  });
}

// Get cart
async function getCart() {
  const data = await getDataFromMongo();
  const userData = data.find(item => item.email === currentUser.email);
  return userData ? userData.cart || [] : [];
}
```

### Wishlist Management

**Current localStorage code:**
```javascript
// Save wishlist
localStorage.setItem('userWishlist', JSON.stringify(wishlistItems));

// Get wishlist
const wishlistItems = JSON.parse(localStorage.getItem('userWishlist') || '[]');
```

**New MongoDB code:**
```javascript
// Save wishlist
async function saveWishlist(wishlistItems) {
  const userData = await getCurrentUserData();
  await saveDataToMongo({
    ...userData,
    wishlist: wishlistItems,
    lastUpdated: new Date()
  });
}

// Get wishlist
async function getWishlist() {
  const data = await getDataFromMongo();
  const userData = data.find(item => item.email === currentUser.email);
  return userData ? userData.wishlist || [] : [];
}
```

### User Management

**Current localStorage code:**
```javascript
// Save user
localStorage.setItem('currentUser', JSON.stringify(user));

// Get user
const user = JSON.parse(localStorage.getItem('currentUser'));
```

**New MongoDB code:**
```javascript
// Save user
async function saveUser(user) {
  await saveDataToMongo({
    ...user,
    type: 'user',
    lastUpdated: new Date()
  });
}

// Get user
async function getUser(email) {
  const data = await getDataFromMongo();
  return data.find(item => item.email === email && item.type === 'user');
}
```

## Implementation Steps

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Test the connection:**
   - Open `http://localhost:3000/api/test` in your browser
   - You should see: `{"connected": true, "message": "MongoDB Atlas is working!"}`

3. **Update your frontend code:**
   - Replace localStorage calls with the MongoDB functions above
   - Add error handling for network requests
   - Test all functionality

4. **Gradual migration:**
   - Start with one feature (e.g., cart management)
   - Test thoroughly before moving to the next feature
   - Keep localStorage as a fallback initially

## Error Handling

Always include proper error handling:

```javascript
async function safeMongoOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error('MongoDB operation failed:', error);
    // Fallback to localStorage if MongoDB fails
    return localStorageFallback();
  }
}
```

## Security Notes

1. Never expose your MongoDB connection string in frontend code
2. Use environment variables for sensitive data
3. Implement proper authentication and authorization
4. Validate all incoming data on the backend
5. Use HTTPS in production

## Testing

Use these commands to test your backend:

```bash
# Test connection
curl http://localhost:3000/api/test

# Save data
curl -X POST http://localhost:3000/api/save -H "Content-Type: application/json" -d '{"name":"test","email":"test@example.com"}'

# Get data
curl http://localhost:3000/api/data
```

## Troubleshooting

1. **MongoDB connection fails**: Check your connection string and credentials
2. **CORS errors**: Ensure the backend has CORS enabled (it is by default)
3. **Port conflicts**: Change the PORT in your `.env` file
4. **Network issues**: Ensure both frontend and backend are running

## Next Steps

1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Start the backend server
4. Test API endpoints
5. Gradually replace localStorage calls
6. Add proper error handling
7. Test thoroughly before deployment

Happy coding! 🚀
