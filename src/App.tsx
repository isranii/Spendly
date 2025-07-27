import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen luxury-bg">
      <header className="luxury-glass sticky top-0 z-50 h-20 flex justify-between items-center border-b border-gold/20 px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 luxury-gradient rounded-lg flex items-center justify-center">
            <span className="text-pearl font-bold text-xl">S</span>
          </div>
          <h1 className="luxury-title text-3xl font-bold text-pearl">Spendly</h1>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      
      <main className="flex-1">
        <Content />
      </main>
      
      <footer className="luxury-glass border-t border-gold/20 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gold/70 luxury-text text-sm">
            Made with ❤️ by <span className="text-gold font-medium">Jahnavi</span> • All rights reserved
          </p>
        </div>
      </footer>
      
      <Toaster 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: '#f8f6f0',
          }
        }}
      />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="luxury-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <Authenticated>
        <div className="mb-12">
          <h2 className="luxury-title text-4xl font-bold text-pearl mb-4">
            Welcome back, {loggedInUser?.email?.split('@')[0] || 'Distinguished Member'}
          </h2>
          <p className="text-gold/80 text-lg luxury-text">
            Your exclusive financial sanctuary awaits
          </p>
        </div>
        <Dashboard />
      </Authenticated>

      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
          <div className="text-center space-y-6">
            <h2 className="luxury-title text-6xl font-bold text-pearl mb-6 leading-tight bg-gradient-to-r from-pearl via-gold/20 to-pearl bg-clip-text">
              Elevate Your Wealth
            </h2>
            <p className="text-gold/90 text-xl luxury-text max-w-3xl leading-relaxed font-medium tracking-wide">
              Master the art of sophisticated wealth orchestration through our meticulously engineered sanctuary, 
              where financial mastery converges with timeless elegance for the most distinguished connoisseurs
            </p>
          </div>
          
          <div className="w-full max-w-md">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
