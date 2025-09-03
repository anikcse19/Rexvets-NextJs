const webpush = require('web-push');

try {
  // Generate VAPID keys
  const vapidKeys = webpush.generateVAPIDKeys();
  
  console.log('🔑 VAPID Keys Generated Successfully!');
  console.log('');
  console.log('📋 Add these to your .env.local file:');
  console.log('');
  console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
  console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
  console.log('');
  console.log('📝 Also update the email in src/lib/firebase/sendPush.ts:');
  console.log('   Replace "notifications@rexvet.com" with your actual email');
  console.log('');
  console.log('⚠️  Keep your VAPID_PRIVATE_KEY secret!');
  console.log('✅ The NEXT_PUBLIC_VAPID_PUBLIC_KEY can be shared publicly');
  console.log('');
  console.log('🔄 After adding these to .env.local, restart your development server');
} catch (error) {
  console.error('❌ Error generating VAPID keys:', error.message);
  console.log('');
  console.log('💡 Make sure you have web-push installed:');
  console.log('   npm install web-push');
}
