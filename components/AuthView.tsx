
import React, { useState } from 'react';
import { Language, User, UserRole, SubscriptionTier } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
  lang: Language;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = lang === Language.AR;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // محاكاة نظام الدخول مع بيانات الأدمن المحددة
    setTimeout(() => {
      const isAdmin = email.toLowerCase() === 'ayoubwassima78@gmail.com' && password === 'ABCD@14059466';
      
      // إذا حاول الدخول كأدمن بكلمة مرور خاطئة (اختياري للواقعية)
      if (email.toLowerCase() === 'ayoubwassima78@gmail.com' && password !== 'ABCD@14059466') {
        setError(isAr ? 'كلمة المرور غير صحيحة للحساب الإداري' : 'Incorrect password for admin account');
        setLoading(false);
        return;
      }

      onAuthSuccess({
        id: isAdmin ? 'admin-master-1' : Math.random().toString(36).substr(2, 9),
        email: email,
        name: name || (isAdmin ? 'Admin Ayoub' : email.split('@')[0]),
        role: isAdmin ? UserRole.ADMIN : UserRole.EDITOR,
        subscriptionTier: isAdmin ? SubscriptionTier.ENTERPRISE : SubscriptionTier.FREE,
        createdAt: new Date().toISOString().split('T')[0],
        provider: 'email'
      });
      setLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onAuthSuccess({
        id: 'google-123',
        email: 'user@google.com',
        name: 'Google User',
        role: UserRole.VIEWER,
        subscriptionTier: SubscriptionTier.FREE,
        createdAt: new Date().toISOString().split('T')[0],
        provider: 'google'
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Decoration / Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-dayone-orange rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-bold text-xl">TL</div>
            <span className="text-2xl font-bold text-white tracking-tighter">TenderLogic Global</span>
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
            {isAr ? 'الذكاء الاصطناعي للمحترفين في المناقصات.' : 'Enterprise AI for Bidding Professionals.'}
          </h2>
          <p className="text-slate-400 text-lg max-w-md font-medium">
            {isAr ? 'لوحة تحكم موحدة لإدارة العروض وتحليل المخاطر والامتثال القانوني.' : 'Unified dashboard for bid management, risk analysis, and legal compliance.'}
          </p>
          
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl inline-block backdrop-blur-sm">
             <div className="flex items-center space-x-2 mb-2 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-dayone-orange animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Admin Portal</p>
             </div>
             <p className="text-xs text-slate-400 font-medium leading-relaxed">
               Secure login for <span className="text-dayone-orange font-bold">ayoubwassima78@gmail.com</span>. 
               System-wide administrative privileges enabled.
             </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-8 text-slate-500 text-sm font-bold uppercase tracking-widest rtl:space-x-reverse">
          <span>99% Compliance</span>
          <span>ISO 27001 SECURE</span>
          <span>Admin Access Only</span>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-700">
          <button 
            onClick={onBack}
            className="mb-8 flex items-center text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors rtl:flex-row-reverse"
          >
            <svg className="w-4 h-4 mr-2 rtl:ml-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            {isAr ? 'العودة' : 'Back to Home'}
          </button>

          <div className={isAr ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {isLogin ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب جديد' : 'Join the Elite')}
            </h1>
            <p className="text-slate-500 font-medium mb-10">
              {isLogin 
                ? (isAr ? 'أدخل بياناتك للوصول إلى مركز القيادة.' : 'Access your enterprise command center.') 
                : (isAr ? 'ابدأ رحلتك في السيطرة على قطاع المناقصات.' : 'Start dominating your procurement sector today.')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange outline-none transition-all font-bold ${isAr ? 'text-right' : 'text-left'}`}
                  placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}
                  required={!isLogin}
                />
              </div>
            )}

            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange outline-none transition-all font-bold ${isAr ? 'text-right' : 'text-left'}`}
                placeholder="ayoubwassima78@gmail.com"
                required
              />
            </div>

            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange outline-none transition-all font-bold ${isAr ? 'text-right' : 'text-left'}`}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-100 flex items-center justify-center space-x-3 active:scale-[0.98]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <span>{isLogin ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب' : 'Sign Up')}</span>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">{isAr ? 'أو تابع بواسطة' : 'Or continue with'}</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span>{isLogin ? (isAr ? 'الدخول بواسطة Google' : 'Sign in with Google') : (isAr ? 'التسجيل بواسطة Google' : 'Sign up with Google')}</span>
          </button>

          <p className="mt-10 text-center text-slate-500 font-bold text-sm">
            {isLogin ? (isAr ? 'ليس لديك حساب؟' : "Don't have an account?") : (isAr ? 'لديك حساب بالفعل؟' : "Already have an account?")}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-dayone-orange hover:underline ml-1"
            >
              {isLogin ? (isAr ? 'أنشئ حساباً الآن' : 'Create one now') : (isAr ? 'سجل الدخول' : 'Sign In')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
