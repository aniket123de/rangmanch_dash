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
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13rem;
    overflow: hidden;
    height: 3rem;
    background-size: 300% 300%;
    cursor: pointer;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
    transition: 0.5s;
    animation: gradient_301 5s ease infinite;
    border: double 4px transparent;
    background-image: linear-gradient(#212121, #212121),
      linear-gradient(
        137.48deg,
        #ffdb3b 10%,
        #fe53bb 45%,
        #8f51ea 67%,
        #0044ff 87%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

  @media (max-width: 768px) {
    .btn {
      width: 9rem;
      height: 2.5rem;
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .btn {
      width: 7rem;
      height: 2.2rem;
      font-size: 0.7rem;
    }
  }

  #container-stars {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.5s;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
  }

  strong {
    z-index: 2;
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    font-size: 16px;
    letter-spacing: 5px;
    color: #ffffff;
    text-shadow: 0 0 4px white;
  }

  @media (max-width: 768px) {
    strong {
      font-size: 12px;
      letter-spacing: 3px;
    }
  }

  @media (max-width: 480px) {
    strong {
      font-size: 10px;
      letter-spacing: 2px;
    }
  }

  .desktop-text {
    display: inline;
  }

  .mobile-text {
    display: none;
  }

  @media (max-width: 768px) {
    .desktop-text {
      display: none;
    }
    
    .mobile-text {
      display: inline;
    }
  }

  #glow {
    position: absolute;
    display: flex;
    width: 12rem;
  }

  @media (max-width: 768px) {
    #glow {
      width: 9rem;
    }
  }

  @media (max-width: 480px) {
    #glow {
      width: 7rem;
    }
  }

  .circle {
    width: 100%;
    height: 30px;
    filter: blur(2rem);
    animation: pulse_3011 4s infinite;
    z-index: -1;
  }

  .circle:nth-of-type(1) {
    background: rgba(254, 83, 186, 0.636);
  }

  .circle:nth-of-type(2) {
    background: rgba(142, 81, 234, 0.704);
  }

  .btn:hover #container-stars {
    z-index: 1;
    background-color: #212121;
  }

  .btn:hover {
    transform: scale(1.1);
  }

  .btn:active {
    border: double 4px #fe53bb;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: none;
  }

  .btn:active .circle {
    background: #fe53bb;
  }

  #stars {
    position: relative;
    background: transparent;
    width: 200rem;
    height: 200rem;
  }

  #stars::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -100rem;
    width: 100%;
    height: 100%;
    animation: animStarRotate 90s linear infinite;
  }

  #stars::after {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
  }

  #stars::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 170%;
    height: 500%;
    animation: animStar 60s linear infinite;
  }

  #stars::before {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
    opacity: 0.5;
  }

  @keyframes animStar {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(-135rem);
    }
  }

  @keyframes animStarRotate {
    from {
      transform: rotate(360deg);
    }

    to {
      transform: rotate(0);
    }
  }

  @keyframes gradient_301 {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes pulse_3011 {
    0% {
      transform: scale(0.75);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }

    100% {
      transform: scale(0.75);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
`;

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

  const handleCreatorHubClick = () => {
    history.push('/creator-hub');
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

        {/* Right side - Creator Hub button */}
        <StyledWrapper>
          <button type="button" className="btn" onClick={handleCreatorHubClick}>
            <strong className="desktop-text">CREATOR HUB</strong>
            <strong className="mobile-text">CREATE</strong>
            <div id="container-stars">
              <div id="stars" />
            </div>
            <div id="glow">
              <div className="circle" />
              <div className="circle" />
            </div>
          </button>
        </StyledWrapper>
      </Toolbar>
    </AppBar>
  );
};

export default Header;