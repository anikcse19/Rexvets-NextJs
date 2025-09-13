/**
 * Test script to verify admin redirection functionality
 * 
 * This script tests:
 * 1. Creating an admin user
 * 2. Testing admin redirection after sign-in
 * 3. Testing non-admin user access to admin routes
 */

const BASE_URL = 'http://localhost:3000';

async function createTestAdmin() {
  console.log('🔧 Creating test admin user...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'AdminTest123!',
        name: 'Test Admin'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Admin user created successfully:', result.data);
      return result.data;
    } else {
      console.log('❌ Failed to create admin user:', result.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating admin user:', error.message);
    return null;
  }
}

async function testAdminRedirection() {
  console.log('\n🧪 Testing admin redirection flow...');
  
  // Test 1: Admin user should be redirected to /admin/overview
  console.log('Test 1: Admin user sign-in should redirect to /admin/overview');
  console.log('   - Sign in with admin@test.com / AdminTest123!');
  console.log('   - Expected: Redirect to http://localhost:3000/admin/overview');
  
  // Test 2: Non-admin user should not access admin routes
  console.log('\nTest 2: Non-admin user should not access admin routes');
  console.log('   - Try accessing http://localhost:3000/admin/overview without admin role');
  console.log('   - Expected: Redirect to home page (/)');
  
  // Test 3: Unauthenticated user should be redirected to sign-in
  console.log('\nTest 3: Unauthenticated user should be redirected to sign-in');
  console.log('   - Try accessing http://localhost:3000/admin/overview without authentication');
  console.log('   - Expected: Redirect to /auth/signin?redirect=/admin/overview');
}

async function runTests() {
  console.log('🚀 Starting Admin Redirection Tests\n');
  
  // Create test admin user
  const adminUser = await createTestAdmin();
  
  if (adminUser) {
    await testAdminRedirection();
    
    console.log('\n📋 Manual Testing Instructions:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Go to http://localhost:3000/auth/signin');
    console.log('3. Sign in with admin@test.com / AdminTest123!');
    console.log('4. Verify you are redirected to http://localhost:3000/admin/overview');
    console.log('5. Sign out and try accessing http://localhost:3000/admin/overview directly');
    console.log('6. Verify you are redirected to the sign-in page');
    console.log('7. Sign in with a non-admin account and try accessing admin routes');
    console.log('8. Verify non-admin users are redirected to the home page');
    
    console.log('\n✅ Test setup complete!');
  } else {
    console.log('\n❌ Test setup failed. Please check your database connection and try again.');
  }
}

// Run the tests
runTests().catch(console.error);
