import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Alert, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Refresh as RefreshIcon, Launch as LaunchIcon, Code as CodeIcon } from '@mui/icons-material';

const IframeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'calc(100vh - 120px)',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 140px)',
    borderRadius: theme.spacing(0.5),
  },
}));

const StyledIframe = styled('iframe')(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: theme.spacing(1),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60vh',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    height: '50vh',
    padding: theme.spacing(1),
    gap: theme.spacing(1.5),
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3, 4),
  borderBottom: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 3),
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1.5, 2),
  },
}));

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& .title-icon': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  '& .title-text': {
    fontWeight: 700,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  '& .subtitle': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 400,
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  '& .MuiButton-root': {
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  },
  '& .refresh-btn': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: 'white',
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    },
  },
  '& .external-btn': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  },
}));

const CreatorHub: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  // Creator Hub URL - supports both local development and production
  const creatorHubUrl = process.env.NODE_ENV === 'production' 
    ? 'https://rangamanch-creatorhub.vercel.app/dashboard' // Replace with your actual Vercel URL
    : 'http://localhost:3001/dashboard';

  useEffect(() => {
    // Set a timeout to hide loading after 10 seconds and show setup instructions
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setShowSetupInstructions(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [iframeKey, isLoading]);

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    setIsLoading(false);
    setError(null);
    setShowSetupInstructions(false);
  };

  const handleIframeError = (event: any) => {
    console.error('Iframe error:', event);
    setIsLoading(false);
    setError('Failed to load Creator Hub. Please make sure the Creator Hub server is running on port 3001.');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setShowSetupInstructions(false);
    setIframeKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(creatorHubUrl, '_blank');
  };

  if (error || showSetupInstructions) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <HeaderContainer>
          <TitleSection>
            <CodeIcon className="title-icon" />
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                className="title-text"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                Creator Hub
              </Typography>
              <Typography className="subtitle">
                Content creation and management platform
              </Typography>
            </Box>
          </TitleSection>
          <ActionButtonsContainer>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              onClick={handleOpenExternal}
              className="external-btn"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '8px 16px', sm: '10px 20px' }
              }}
            >
              Open in New Tab
            </Button>
          </ActionButtonsContainer>
        </HeaderContainer>
        
        <LoadingContainer>
          {error && (
            <Alert severity="error" sx={{ maxWidth: 600, mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Card sx={{ maxWidth: 800, width: '100%', mx: { xs: 1, sm: 2 } }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
                🚀 Creator Hub Setup Instructions
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                To run Creator Hub locally and integrate it with your dashboard:
              </Typography>
              
              <Box component="ol" sx={{ pl: 2, '& li': { mb: 1 } }}>
                <li>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Open PowerShell/Command Prompt</strong> and navigate to the Creator Hub folder:
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    mt: 1,
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    overflow: 'auto',
                    wordBreak: 'break-all'
                  }}>
                    cd "d:\Programming\Rangmanch-Dashboard\Creator Hub"
                  </Box>
                </li>
                
                <li>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Install dependencies:</strong>
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    mt: 1,
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    npm install
                  </Box>
                </li>
                
                <li>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Start the development server:</strong>
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    mt: 1,
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    npm run dev
                  </Box>
                </li>
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Once the server is running, click the "Retry" button below to load it in this dashboard.
              </Typography>
            </CardContent>
          </Card>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
            px: { xs: 2, sm: 0 }
          }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1.5, sm: 1 }
              }}
            >
              Retry
            </Button>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              onClick={handleOpenExternal}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1.5, sm: 1 }
              }}
            >
              Open in New Tab
            </Button>
          </Box>
        </LoadingContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderContainer>
        <TitleSection>
          <CodeIcon className="title-icon" />
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              className="title-text"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
              }}
            >
              Creator Hub
            </Typography>
            <Typography className="subtitle">
              Content creation and management platform
            </Typography>
          </Box>
        </TitleSection>
        <ActionButtonsContainer>
          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
            onClick={handleRefresh}
            className="refresh-btn"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 2, sm: 3 }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Refresh</Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>↻</Box>
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LaunchIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
            onClick={handleOpenExternal}
            className="external-btn"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 2, sm: 3 }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Open in New Tab</Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>↗</Box>
          </Button>
        </ActionButtonsContainer>
      </HeaderContainer>
      
      {isLoading && (
        <LoadingContainer>
          <CircularProgress size={60} sx={{ width: { xs: 40, sm: 60 }, height: { xs: 40, sm: 60 } }} />
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              textAlign: 'center'
            }}
          >
            Loading Creator Hub...
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center',
              px: 2
            }}
          >
          </Typography>
        </LoadingContainer>
      )}
      
      <IframeContainer sx={{ display: isLoading ? 'none' : 'block' }}>
        <StyledIframe
          key={iframeKey}
          src={creatorHubUrl}
          title="Creator Hub"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="clipboard-read; clipboard-write; web-share"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation allow-modals"
        />
      </IframeContainer>
    </Box>
  );
};

export default CreatorHub;
