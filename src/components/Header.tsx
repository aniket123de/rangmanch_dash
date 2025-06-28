import React from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { user, userLoggedIn, logout } = useAuth();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
      handleMenuClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileClick = () => {
    history.push('/profile');
    handleMenuClose();
  };

  const handleLoginClick = () => {
    history.push('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(90deg, rgba(33,33,46,1) 0%, rgba(15,23,42,1) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }
      }}
    >
      {/* Subtle grid pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(237, 228, 228, 0.03) 1px, transparent 0)',
        backgroundSize: '20px 20px',
        pointerEvents: 'none',
      }} />
      
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: 2,
          height: 2,
          borderRadius: '50%',
          background: `rgba(255,255,255,${Math.random() * 0.2 + 0.05})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: 'float 15s ease infinite',
          animationDelay: `${Math.random() * 5}s`,
          '@keyframes float': {
            '0%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: `translateY(${Math.random() * 20 - 10}px) translateX(${Math.random() * 20 - 10}px)` },
            '100%': { transform: 'translateY(0) translateX(0)' }
          }
        }} />
      ))}

      <Toolbar 
        sx={{ 
          px: { xs: 2, sm: 3 },
          minHeight: { xs: '64px', sm: '74px' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left side - Menu button and title */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flex: 1
        }}>
          {onSidebarToggle && (
            <IconButton
              onClick={onSidebarToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
                color: 'white',
                '&:hover': {
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.3s ease-in-out',
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              letterSpacing: '0.5px',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              background: `linear-gradient(45deg, 
                #9d4edd,
                #c77dff,
                #ff9e00,
                #ddff00
              )`,
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 10s ease infinite',
              textShadow: '0 0 10px rgba(157, 78, 221, 0.3)',
              position: 'relative',
              padding: '0 16px',
              '&:before': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -4,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(157, 78, 221, 0.5), transparent)',
                borderRadius: '50%',
              },
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
            }}
          >
            Rangmanch
          </Typography>
        </Box>

        {/* Right side - User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {userLoggedIn ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                  }}
                >
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }
                }}
              >
                <MenuItem onClick={handleProfileClick} sx={{ color: 'white' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;