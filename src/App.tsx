import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import ContentLibrary from './pages/ContentLibrary';
// @ts-ignore
import Analytics from './pages/Analytics';
import AudienceInsights from './pages/AudienceInsights';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
// import Home from './pages/Home'; // Commented out as it's not currently used
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import SocialDataScraper from './components/SocialDataScraper';
import Loader from './components/Loader';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './contexts/authContext';

const AppRoutes: React.FC = () => {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" exact>
        {userLoggedIn ? <Redirect to="/" /> : <Login />}
      </Route>
      
      <Route path="/signup" exact>
        {userLoggedIn ? <Redirect to="/" /> : <SignUp />}
      </Route>
      
      {/* Protected routes */}
      <Route path="/home">
        <Redirect to="/" />
      </Route>
      
      <Route path="/content-library">
        {userLoggedIn ? (
          <DashboardLayout>
            <ContentLibrary />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/analytics">
        {userLoggedIn ? (
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/audience-insights">
        {userLoggedIn ? (
          <DashboardLayout>
            <AudienceInsights />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/notifications">
        {userLoggedIn ? (
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/profile">
        {userLoggedIn ? (
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/settings">
        {userLoggedIn ? (
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/scrape">
        {userLoggedIn ? (
          <DashboardLayout>
            <SocialDataScraper />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      <Route path="/" exact>
        {userLoggedIn ? (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      {/* Redirect any unknown routes */}
      <Route path="*">
        <Redirect to={userLoggedIn ? "/" : "/login"} />
      </Route>
    </Switch>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader after 1.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  console.log('App rendering with routes');

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {loading && <Loader />}
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
};

export default App;