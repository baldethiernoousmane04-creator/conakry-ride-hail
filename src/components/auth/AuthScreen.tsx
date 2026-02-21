import React, { useState } from 'react';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';

type AuthView = 'login' | 'signup' | 'forgot-password';

export const AuthScreen: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');

  const loginBg = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/login-background-2fddef98-1771697019053.webp";
  const signupBg = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/signup-background-7be58150-1771697024945.webp";

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with Blur/Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${view === 'signup' ? signupBg : loginBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center animate-in fade-in zoom-in duration-500">
        {view === 'login' && (
          <Login 
            onSignUp={() => setView('signup')} 
            onForgotPassword={() => setView('forgot-password')} 
          />
        )}
        {view === 'signup' && (
          <SignUp onLogin={() => setView('login')} />
        )}
        {view === 'forgot-password' && (
          <ForgotPassword onBack={() => setView('login')} />
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 p-10 hidden lg:block opacity-20 pointer-events-none">
        <div className="text-[120px] font-black text-white leading-none tracking-tighter">WONGAYE</div>
      </div>
      <div className="absolute bottom-0 left-0 p-10 hidden lg:block opacity-20 pointer-events-none">
        <div className="text-[80px] font-black text-yellow-400 leading-none tracking-tighter">CONAKRY</div>
      </div>
    </div>
  );
};