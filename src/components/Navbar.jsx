import React from 'react';
import { useStadium } from '../context/StadiumContext';

export const Navbar = () => {
  const { currentRole, setCurrentRole, authenticatedRoles, logoutRole } = useStadium();
  const currentUser = currentRole !== 'fan' ? authenticatedRoles[currentRole] : null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface-dim backdrop-blur-xl border-b border-outline-variant/20 shadow-sm transition-all duration-300" id="main-nav">
      <div className="flex items-center gap-6">
        <span className="font-display-xl text-headline-md font-extrabold text-primary-fixed-dim tracking-tighter">
          World Cup 2026 GenAI
        </span>
        <div className="hidden md:flex gap-2 font-body-md text-sm">
          <button
            onClick={() => setCurrentRole('fan')}
            aria-label="Navigate to Fans Hub Portal"
            className={`px-4 py-1.5 rounded-lg transition-all duration-300 font-bold text-sm ${
              currentRole === 'fan'
                ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim bg-surface-container-high shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Fans Hub
          </button>
          <button
            onClick={() => setCurrentRole('ops')}
            aria-label="Navigate to Organizers Operations Command Portal"
            className={`px-4 py-1.5 rounded-lg transition-all duration-300 font-bold text-sm ${
              currentRole === 'ops'
                ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim bg-surface-container-high shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Organizers Ops
          </button>
          <button
            onClick={() => setCurrentRole('volunteer')}
            aria-label="Navigate to Volunteer Support Hub Portal"
            className={`px-4 py-1.5 rounded-lg transition-all duration-300 font-bold text-sm ${
              currentRole === 'volunteer'
                ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim bg-surface-container-high shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Volunteer Support
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full border border-primary-fixed-dim/30 text-xs font-label-bold">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse"></span>
            <span className="text-on-surface">{currentUser.name} ({currentUser.title})</span>
            <button
              onClick={() => logoutRole(currentRole)}
              className="ml-2 text-[10px] text-error hover:underline font-bold uppercase"
              title="Sign Out of this role"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/30 text-xs font-label-bold text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse"></span>
            <span>MetLife Stadium 2026 Host Venue</span>
          </div>
        )}
      </div>
    </nav>
  );
};
