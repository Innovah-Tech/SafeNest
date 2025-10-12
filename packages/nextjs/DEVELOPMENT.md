# Development Guide for MicroSavings Platform

## Console Warnings and Errors

The following console warnings and errors are normal in development and have been configured to be suppressed:

### Coinbase Wallet SDK Warnings

- `Content Script Bridge: Sending response back to page context`
- `TSS: Received response from checkDomainAndRun`
- `POST https://cca-lite.coinbase.com/metrics net::ERR_ABORTED 401`

These are related to Coinbase Wallet's security features and analytics. They don't affect functionality.

### React Development Warnings

- `Download the React DevTools for a better development experience`
- `Lit is in dev mode. Not recommended for production!`

These are development-only warnings that don't affect the application.

## Configuration

### Suppressing Warnings

Warnings are automatically suppressed in development mode. To configure which warnings to suppress, edit `config/development.ts`:

```typescript
export const developmentConfig = {
  suppressWarnings: true, // Set to false to see all warnings
  suppressedWarnings: [
    "Coinbase Wallet SDK",
    "TSS: Received response",
    // Add more warning patterns here
  ],
};
```

### Environment Variables

Create a `.env.local` file in the `packages/nextjs` directory:

```env
# Network Configuration
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_CHAIN_ID=31337

# Contract Addresses (update after deployment)
NEXT_PUBLIC_SIMPLE_MICRO_SAVINGS_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_INCL_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_COMMUNITY_POOLS_ADDRESS=0x0000000000000000000000000000000000000000

# Development Settings
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_SUPPRESS_WARNINGS=true
```

## Error Handling

The application includes a comprehensive error boundary that:

- Catches React errors gracefully
- Shows user-friendly error messages
- Displays detailed error information in development
- Provides recovery options

## Development Tools

### Debug Logging

Use the development logging utilities:

```typescript
import { devError, devLog } from "~~/utils/dev";

devLog("User action", { userId: "123" });
devError("Something went wrong", error);
```

### Error Boundary

The error boundary is automatically included in the app layout and will catch any unhandled errors.

## Production Build

In production builds:

- Console warnings are automatically removed
- Error reporting can be enabled
- Performance monitoring can be enabled
- Analytics can be configured

## Troubleshooting

### If warnings still appear:

1. Check that `suppressWarnings` is set to `true` in `config/development.ts`
2. Ensure the warning pattern is included in `suppressedWarnings` array
3. Restart the development server

### If errors occur:

1. Check the browser console for detailed error information
2. Use the error boundary's "Try Again" button
3. Check the network tab for failed requests
4. Verify contract addresses are correct

## Best Practices

1. **Always test in both development and production modes**
2. **Use the error boundary for graceful error handling**
3. **Configure environment variables properly**
4. **Keep the suppressed warnings list up to date**
5. **Use development logging for debugging**
