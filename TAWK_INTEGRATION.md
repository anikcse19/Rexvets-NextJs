# Tawk.to Integration

This document describes the Tawk.to chat widget integration in the Rex Vets Next.js application.

## Overview

Tawk.to is a live chat widget that allows visitors to chat with support agents in real-time. The integration has been implemented to match the functionality from the original React project.

## Files Added/Modified

### New Files
- `src/components/TawkTo/TawkToScript.tsx` - Main Tawk.to component
- `src/app/test-tawk/page.tsx` - Test page for verifying integration
- `TAWK_INTEGRATION.md` - This documentation file

### Modified Files
- `src/lib/Layoutes/RootLayoutProvider.tsx` - Added TawkToScript component
- `global.d.ts` - Added TypeScript declarations for Tawk.to API

## Features

### 1. Conditional Rendering
The Tawk.to widget is conditionally rendered based on the current route:

**Routes where Tawk.to is SHOWN:**
- Home page (`/`)
- All public pages
- Contact pages
- About pages
- Blog pages
- etc.

**Routes where Tawk.to is HIDDEN:**
- Video call pages (`/VideoCall`, `/join-video-call`, `/video-call`)
- Admin dashboard (`/admin`)
- User dashboards (`/dashboard`)
- Authentication pages (`/auth`)

### 2. Smart Loading
- Prevents multiple script injections
- Shows/hides widget dynamically based on route changes
- Handles cleanup when component unmounts
- Includes error handling for script loading failures

### 3. TypeScript Support
- Full TypeScript declarations for Tawk.to API
- Type-safe access to window.Tawk_API methods

## Configuration

### Widget ID
The integration uses the same Tawk.to widget ID from the original project:
- Widget ID: `66b2449e1601a2195ba16d74/1i4k5o34n`
- Script URL: `https://embed.tawk.to/66b2449e1601a2195ba16d74/1i4k5o34n`

### Customization
To modify the widget behavior, edit the `TawkToScript.tsx` component:

```typescript
// Add or remove routes from the excluded list
const excludedRoutes = [
  "/VideoCall",
  "/join-video-call", 
  "/video-call",
  "/admin",
  "/dashboard",
  "/auth",
];
```

## Testing

### Test Page
Visit `/test-tawk` to test the integration:
- Shows Tawk.to API loading status
- Provides navigation links to test conditional rendering
- Displays current URL for debugging

### Manual Testing
1. Navigate to the home page - Tawk.to widget should appear
2. Navigate to dashboard - Tawk.to widget should be hidden
3. Navigate back to home - Tawk.to widget should reappear
4. Test the chat functionality by clicking the widget

## API Methods

The integration provides access to Tawk.to API methods:

```typescript
// Hide the widget
window.Tawk_API?.hideWidget();

// Show the widget  
window.Tawk_API?.showWidget();

// Set custom attributes
window.Tawk_API?.setAttributes({
  name: 'John Doe',
  email: 'john@example.com'
});

// Add event listeners
window.Tawk_API?.addEvent('chat:started', () => {
  console.log('Chat started');
});
```

## Troubleshooting

### Widget Not Appearing
1. Check browser console for errors
2. Verify the widget ID is correct
3. Ensure you're on a route that should show the widget
4. Check if ad blockers are blocking the script

### TypeScript Errors
1. Ensure `global.d.ts` is properly configured
2. Restart TypeScript server in your IDE
3. Check that the Tawk.to API declarations are correct

### Performance Issues
1. The script loads asynchronously to avoid blocking page load
2. Widget is only loaded on routes that need it
3. Cleanup is handled automatically when navigating away

## Migration from Old Project

This integration maintains compatibility with the original React project:
- Same widget ID and configuration
- Similar conditional rendering logic
- Same excluded routes (VideoCall, dashboards, auth)
- Enhanced with Next.js-specific optimizations

## Support

For issues related to:
- **Tawk.to widget functionality**: Contact Tawk.to support
- **Integration issues**: Check the test page at `/test-tawk`
- **Code problems**: Review the component files and TypeScript declarations
