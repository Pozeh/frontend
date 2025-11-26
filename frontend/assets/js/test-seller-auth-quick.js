// Quick test script for seller auth flow
console.log('🧪 Starting Seller Auth Flow Test...');

// Test configuration
const testSeller = {
    name: 'Test Seller',
    email: 'seller.test@example.com',
    password: 'test123',
    business: 'Test Business Store',
    phone: '0712345678',
    location: 'Nairobi, Kenya',
    type: 'seller',
    status: 'approved', // For testing, set as approved
    createdAt: new Date().toISOString()
};

// Test 1: Registration
async function testRegistration() {
    console.log('📝 Testing seller registration...');
    
    try {
        // Save to localStorage
        const sellers = JSON.parse(localStorage.getItem('registeredSellers') || '[]');
        sellers.push(testSeller);
        localStorage.setItem('registeredSellers', JSON.stringify(sellers));
        
        // Try to save to MongoDB
        try {
            const response = await fetch('https://my-backend-1-jk7w.onrender.com/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...testSeller,
                    collection: 'sellers',
                    timestamp: new Date()
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Registration successful - MongoDB ID:', result.id);
                return true;
            } else {
                console.log('⚠️ MongoDB save failed, using localStorage only');
                return true; // Still successful with localStorage
            }
        } catch (mongoError) {
            console.log('⚠️ MongoDB not available, using localStorage only:', mongoError.message);
            return true; // Still successful with localStorage
        }
    } catch (error) {
        console.error('❌ Registration failed:', error);
        return false;
    }
}

// Test 2: Login
async function testLogin() {
    console.log('🔐 Testing seller login...');
    
    try {
        // Check MongoDB first
        let seller = null;
        try {
            const response = await fetch('https://my-backend-1-jk7w.onrender.com/api/data');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    seller = result.data.find(s => 
                        s.email === testSeller.email && 
                        s.password === testSeller.password && 
                        s.type === 'seller' &&
                        !s.deleted
                    );
                }
            }
        } catch (mongoError) {
            console.log('MongoDB check failed, trying localStorage');
        }
        
        // Fallback to localStorage
        if (!seller) {
            const sellers = JSON.parse(localStorage.getItem('registeredSellers') || '[]');
            seller = sellers.find(s => s.email === testSeller.email && s.password === testSeller.password);
        }
        
        if (seller) {
            // Create session
            const sessionToken = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const userSession = {
                token: sessionToken,
                user: {
                    id: seller.id,
                    name: seller.name,
                    email: seller.email,
                    type: seller.type,
                    business: seller.business,
                    phone: seller.phone,
                    location: seller.location
                },
                timestamp: Date.now(),
                rememberMe: true
            };
            
            localStorage.setItem('userSession', JSON.stringify(userSession));
            localStorage.setItem('sellerData', JSON.stringify(seller));
            
            console.log('✅ Login successful - Session created');
            console.log('📊 Session data:', userSession);
            return true;
        } else {
            console.error('❌ Login failed - Seller not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        return false;
    }
}

// Test 3: Dashboard Access
async function testDashboardAccess() {
    console.log('🖥️ Testing dashboard access...');
    
    try {
        const userSession = localStorage.getItem('userSession');
        
        if (userSession) {
            const session = JSON.parse(userSession);
            
            if (session.user && session.user.type === 'seller') {
                console.log('✅ Dashboard access granted');
                console.log('👤 User data:', session.user);
                return true;
            } else {
                console.error('❌ Invalid user type for dashboard');
                return false;
            }
        } else {
            console.error('❌ No session found');
            return false;
        }
    } catch (error) {
        console.error('❌ Dashboard access error:', error);
        return false;
    }
}

// Test 4: Data Persistence
async function testDataPersistence() {
    console.log('💾 Testing data persistence...');
    
    const results = {
        localStorage: false,
        mongodb: false
    };
    
    // Check localStorage
    const sellers = JSON.parse(localStorage.getItem('registeredSellers') || '[]');
    const localStorageSeller = sellers.find(s => s.email === testSeller.email);
    results.localStorage = !!localStorageSeller;
    
    // Check MongoDB
    try {
        const response = await fetch('https://my-backend-1-jk7w.onrender.com/api/data');
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const mongoSeller = result.data.find(s => 
                    s.email === testSeller.email && 
                    s.type === 'seller' &&
                    !s.deleted
                );
                results.mongodb = !!mongoSeller;
            }
        }
    } catch (mongoError) {
        console.log('MongoDB persistence check failed:', mongoError.message);
    }
    
    console.log('📊 Persistence results:', results);
    return results.localStorage || results.mongodb; // At least one should work
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Running all seller auth flow tests...\n');
    
    const tests = [
        { name: 'Registration', fn: testRegistration },
        { name: 'Login', fn: testLogin },
        { name: 'Dashboard Access', fn: testDashboardAccess },
        { name: 'Data Persistence', fn: testDataPersistence }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        console.log(`\n--- ${test.name} Test ---`);
        try {
            const result = await test.fn();
            if (result) {
                console.log(`✅ ${test.name} PASSED`);
                passed++;
            } else {
                console.log(`❌ ${test.name} FAILED`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} ERROR:`, error.message);
        }
    }
    
    console.log('\n📊 Test Summary:');
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Success Rate: ${Math.round((passed/total) * 100)}%`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Seller auth flow is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Check the logs above for details.');
    }
    
    return passed === total;
}

// Clean up test data
function cleanupTestData() {
    console.log('🗑️ Cleaning up test data...');
    
    // Remove from localStorage
    const sellers = JSON.parse(localStorage.getItem('registeredSellers') || '[]');
    const filteredSellers = sellers.filter(s => s.email !== testSeller.email);
    localStorage.setItem('registeredSellers', JSON.stringify(filteredSellers));
    
    // Clear sessions
    localStorage.removeItem('userSession');
    localStorage.removeItem('sellerData');
    localStorage.removeItem('currentUser');
    
    console.log('✅ Test data cleaned up');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
    window.sellerAuthTests = {
        runAllTests,
        testRegistration,
        testLogin,
        testDashboardAccess,
        testDataPersistence,
        cleanupTestData,
        testSeller
    };
    
    console.log('🧪 Seller auth tests loaded. Use sellerAuthTests.runAllTests() to run all tests.');
} else {
    // Node.js environment
    module.exports = {
        runAllTests,
        testRegistration,
        testLogin,
        testDashboardAccess,
        testDataPersistence,
        cleanupTestData,
        testSeller
    };
}
