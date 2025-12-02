const axios = require('axios');

async function testLogin() {
    console.log('🧪 Testing Login Endpoint...');
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@adekisplus.com',
            password: 'admin123'
        });

        console.log('✅ Login Successful!');
        console.log('   Status:', response.status);
        console.log('   User:', response.data.user.email);
        console.log('   Token:', response.data.token ? 'Received' : 'Missing');

    } catch (error) {
        console.error('❌ Login Failed!');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else if (error.request) {
            console.error('   No response received (Network Error)');
            console.error('   Is the server running on port 5000?');
        } else {
            console.error('   Error:', error.message);
        }
    }
}

testLogin();
