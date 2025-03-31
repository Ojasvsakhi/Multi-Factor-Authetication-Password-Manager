import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export const useNavigationProtection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Block browser back button
    const preventNavigation = (e: PopStateEvent) => {
      e.preventDefault();
      
      // Show confirmation dialog
      const confirmLogout = window.confirm(
        'Are you sure you want to logout? This action will end your session.'
      );

      if (confirmLogout) {
        // Perform logout
        authApi.logout()
          .then(() => {
            navigate('/', { replace: true });
          })
          .catch((error) => {
            console.error('Logout failed:', error);
            // Force navigate to login anyway for security
            navigate('/', { replace: true });
          });
      } else {
        // If user cancels, push current path back to history to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);

    // Add event listener for back button
    window.addEventListener('popstate', preventNavigation);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', preventNavigation);
    };
  }, [navigate]);
};