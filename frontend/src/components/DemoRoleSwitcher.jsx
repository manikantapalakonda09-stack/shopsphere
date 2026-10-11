import React from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { Shield, Store, User, Headset, Truck, LogOut } from 'lucide-react';

const DemoRoleSwitcher = ({ onOpenAuth, onNavigate }) => {
  const { user, quickDemoLogin, logout, isAuthenticated } = useAuth();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return <Shield className="w-3.5 h-3.5" />;
      case 'ROLE_SELLER': return <Store className="w-3.5 h-3.5" />;
      case 'ROLE_SUPPORT': return <Headset className="w-3.5 h-3.5" />;
      case 'ROLE_DELIVERY': return <Truck className="w-3.5 h-3.5" />;
      default: return <User className="w-3.5 h-3.5" />;
    }
  };

  const handleSwitchPersona = async (key) => {
    await quickDemoLogin(key);
    if (onNavigate) {
      if (key === 'SELLER') onNavigate('seller-dashboard');
      else if (key === 'ADMIN') onNavigate('admin-dashboard');
      else if (key === 'SUPPORT') onNavigate('support-dashboard');
      else if (key === 'DELIVERY') onNavigate('delivery-dashboard');
      else if (key === 'CUSTOMER') onNavigate('home');
    }
  };

  return (
    <aside aria-label="Demo role quick switcher" className="bg-slate-900 text-white text-xs border-b border-slate-800 py-1.5 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
            Demo Switcher
          </span>
          <span className="text-slate-400 hidden sm:inline">1-Click Test Personas:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(DEMO_ACCOUNTS).map(([key, demo]) => {
            const isActive = user && user.roles && user.roles.includes(demo.role);
            return (
              <button
                key={key}
                onClick={() => handleSwitchPersona(key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-white/50'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title={`Switch to ${demo.label}`}
              >
                {getRoleIcon(demo.role)}
                <span>{demo.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <span className="text-slate-300 truncate max-w-[130px] hidden md:inline">
                {user?.fullName}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-primary-400 hover:text-primary-300 font-medium underline"
            >
              Custom Sign In
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DemoRoleSwitcher;
