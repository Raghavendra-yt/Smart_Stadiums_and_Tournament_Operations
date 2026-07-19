import React from 'react';
import { StadiumProvider, useStadium } from './context/StadiumContext';
import { Navbar } from './components/Navbar';
import { FanView } from './components/FanView/FanView';
import { OpsView } from './components/OpsView/OpsView';
import { StaffView } from './components/StaffView/StaffView';
import { LoginPage } from './components/Auth/LoginPage';

const MainContent = () => {
  const { currentRole, authenticatedRoles } = useStadium();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-background">
      <Navbar />

      <div className="pt-20 flex-grow">
        {currentRole === 'fan' && <FanView />}
        
        {currentRole === 'ops' && (
          authenticatedRoles.ops ? <OpsView /> : <LoginPage targetRole="ops" />
        )}
        
        {currentRole === 'volunteer' && (
          authenticatedRoles.volunteer ? <StaffView /> : <LoginPage targetRole="volunteer" />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StadiumProvider>
      <MainContent />
    </StadiumProvider>
  );
}
