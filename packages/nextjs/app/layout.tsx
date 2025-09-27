import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { ErrorBoundary } from "~~/components/ErrorBoundary";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import "~~/utils/dev"; // Import development utilities

export const metadata = getMetadata({
  title: "SafeNest - Decentralized Help Platform",
  description: "Connect with experts, get help with your projects, and build your reputation in the decentralized community. SafeNest is the premier platform for blockchain developers and enthusiasts.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <body>
        <ErrorBoundary>
          <ThemeProvider enableSystem>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
