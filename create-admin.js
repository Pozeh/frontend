// Script to create admin credentials in MongoDB
// Run this with: node create-admin.js

const ADMIN_CREDENTIALS = {
    email: 'pmuiruri9657@gmail.com',
    password: 'paul965757',
    name: 'Paul Muiruri'
};

async function createAdmin() {
    try {
        console.log('Creating admin account...');
        console.log('Credentials:', { email: ADMIN_CREDENTIALS.email, name: ADMIN_CREDENTIALS.name });
        
        const response = await fetch('https://my-backend-1-jk7w.onrender.com/api/admin/setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ADMIN_CREDENTIALS)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Admin account created successfully!');
            console.log('Admin ID:', result.adminId);
            console.log('Email:', ADMIN_CREDENTIALS.email);
            console.log('Password:', ADMIN_CREDENTIALS.password);
            console.log('\nYou can now login at: frontend/admin/admin-login.html');
        } else {
            if (result.error.includes('already exists')) {
                console.log('ℹ️ Admin account already exists');
                console.log('Email:', ADMIN_CREDENTIALS.email);
                console.log('Password:', ADMIN_CREDENTIALS.password);
                console.log('\nYou can login at: frontend/admin/admin-login.html');
            } else {
                console.error('❌ Failed to create admin:', result.error);
            }
        }
        
        // Test login
        console.log('\n🔍 Testing admin login...');
        const loginResponse = await fetch('https://my-backend-1-jk7w.onrender.com/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: ADMIN_CREDENTIALS.email,
                password: ADMIN_CREDENTIALS.password
            })
        });
        
        const loginResult = await loginResponse.json();
        
        if (loginResult.success) {
            console.log('✅ Login test successful!');
            console.log('Admin name:', loginResult.admin.name);
            console.log('Session created:', loginResult.session.loginTime);
        } else {
            console.error('❌ Login test failed:', loginResult.error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createAdmin();
