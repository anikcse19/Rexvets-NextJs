// Test script for the updated Veterinarian API with next available slots
// Run this script to test the API functionality

const testVeterinarianAPI = async () => {
  try {
    console.log('🧪 Testing Veterinarian API with Next Available Slots...\n');

    // Test 1: Basic API call
    console.log('📋 Test 1: Basic API call');
    const response1 = await fetch('http://localhost:3000/api/veterinarian?limit=3');
    const data1 = await response1.json();
    
    if (data1.success) {
      console.log(`✅ Success: Found ${data1.data.length} veterinarians`);
      
      // Check if nextAvailableSlots field exists
      data1.data.forEach((vet, index) => {
        console.log(`\n👨‍⚕️ Veterinarian ${index + 1}: ${vet.name}`);
        console.log(`   Specialization: ${vet.specialization || 'N/A'}`);
        console.log(`   Location: ${vet.city || 'N/A'}, ${vet.state || 'N/A'}`);
        
        if (vet.nextAvailableSlots && vet.nextAvailableSlots.length > 0) {
          console.log(`   📅 Next Available Slots: ${vet.nextAvailableSlots.length}`);
          vet.nextAvailableSlots.forEach((slot, slotIndex) => {
            const date = new Date(slot.date).toLocaleDateString();
            console.log(`      Slot ${slotIndex + 1}: ${date} at ${slot.startTime}-${slot.endTime} (${slot.timezone})`);
            if (slot.notes) console.log(`         Notes: ${slot.notes}`);
          });
        } else {
          console.log('   📅 No available slots found');
        }
      });
    } else {
      console.log('❌ Failed:', data1.message);
    }

    // Test 2: Search by name
    console.log('\n\n🔍 Test 2: Search by name');
    const response2 = await fetch('http://localhost:3000/api/veterinarian?q=john&limit=2');
    const data2 = await response2.json();
    
    if (data2.success) {
      console.log(`✅ Success: Found ${data2.data.length} veterinarians with name containing "john"`);
    } else {
      console.log('❌ Failed:', data2.message);
    }

    // Test 3: Filter by specialization
    console.log('\n\n🏥 Test 3: Filter by specialization');
    const response3 = await fetch('http://localhost:3000/api/veterinarian?specialization=Small%20Animal%20Medicine&limit=2');
    const data3 = await response3.json();
    
    if (data3.success) {
      console.log(`✅ Success: Found ${data3.data.length} veterinarians with specialization "Small Animal Medicine"`);
    } else {
      console.log('❌ Failed:', data3.message);
    }

    // Test 4: Check pagination
    console.log('\n\n📄 Test 4: Pagination');
    const response4 = await fetch('http://localhost:3000/api/veterinarian?page=1&limit=5');
    const data4 = await response4.json();
    
    if (data4.success) {
      console.log(`✅ Success: Page 1 with ${data4.data.length} veterinarians`);
    } else {
      console.log('❌ Failed:', data4.message);
    }

    console.log('\n\n🎉 All tests completed!');
    console.log('\n📚 API Response Structure:');
    console.log('Each veterinarian now includes:');
    console.log('- All standard veterinarian fields');
    console.log('- nextAvailableSlots: Array of up to 2 available appointment slots');
    console.log('- Each slot includes: date, startTime, endTime, timezone, status, notes');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your Next.js development server is running on localhost:3000');
    console.log('💡 Run: npm run dev or yarn dev');
  }
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testVeterinarianAPI();
} else {
  // Browser environment
  console.log('🌐 Running in browser - tests will execute automatically');
  testVeterinarianAPI();
}
