import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationProvider, useNavigation } from './router/NavigationContext';
import SiteHeader from './SiteHeader';
import App from './App';
import WebsiteDesignPage from './WebsiteDesignPage';
import PricingPage from './PricingPage';
import AdminPage from './AdminPage';

function RouterContent() {
  const { currentPath } = useNavigation();

  if (currentPath === '/admin' || currentPath === '/admin/') {
    return <AdminPage />;
  }

  const isPricing = currentPath === '/pricing' || currentPath === '/services/website-rental';
  const isService = currentPath === '/services/website-design';

  return (
    <>
      <SiteHeader />
      {isService ? (
        <WebsiteDesignPage />
      ) : isPricing ? (
        <PricingPage />
      ) : (
        <App />
      )}
    </>
  );
}

export default function AppRouter() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationProvider>
          <RouterContent />
        </NavigationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
