import "@rainbow-me/rainbowkit/styles.css";
import { ErrorBoundary } from "~~/components/ErrorBoundary";
import { HydrationBoundary } from "~~/components/HydrationBoundary";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import "~~/utils/dev";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

// Import development utilities

export const metadata = getMetadata({
  title: "SafeNest - Decentralized Help Platform",
  description:
    "Connect with experts, get help with your projects, and build your reputation in the decentralized community. SafeNest is the premier platform for blockchain developers and enthusiasts.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <body suppressHydrationWarning>
        <HydrationBoundary
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          }
        >
          <ErrorBoundary>
            <ThemeProvider enableSystem>
              <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
            </ThemeProvider>
          </ErrorBoundary>
        </HydrationBoundary>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
