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
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
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
      <Box sx={{ p: 3 }}>
        <HeaderContainer>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon />
            Creator Hub
          </Typography>
          <Button
            variant="outlined"
            startIcon={<LaunchIcon />}
            onClick={handleOpenExternal}
            sx={{ ml: 2 }}
          >
            Open in New Tab
          </Button>
        </HeaderContainer>
        
        <LoadingContainer>
          {error && (
            <Alert severity="error" sx={{ maxWidth: 600, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Card sx={{ maxWidth: 800, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Creator Hub Setup Instructions
              </Typography>
              
              <Typography variant="body1" paragraph>
                To run Creator Hub locally and integrate it with your dashboard:
              </Typography>
              
              <Box component="ol" sx={{ pl: 2, '& li': { mb: 1 } }}>
                <li>
                  <Typography variant="body2">
                    <strong>Open PowerShell/Command Prompt</strong> and navigate to the Creator Hub folder:
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    mt: 1,
                    mb: 1
                  }}>
                    cd "d:\Programming\Rangmanch-Dashboard\Creator Hub"
                  </Box>
                </li>
                
                <li>
                  <Typography variant="body2">
                    <strong>Install dependencies:</strong>
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    mt: 1,
                    mb: 1
                  }}>
                    npm install
                  </Box>
                </li>
                
                <li>
                  <Typography variant="body2">
                    <strong>Start the development server:</strong>
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    mt: 1,
                    mb: 1
                  }}>
                    npm run dev
                  </Box>
                </li>
                
                <li>
                  <Typography variant="body2">
                    <strong>The Creator Hub dashboard will be available at:</strong> http://localhost:3001/dashboard
                  </Typography>
                </li>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Once the server is running, click the "Retry" button below to load it in this dashboard.
              </Typography>
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Retry
            </Button>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              onClick={handleOpenExternal}
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
        <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon />
          Creator Hub
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LaunchIcon />}
            onClick={handleOpenExternal}
          >
            Open in New Tab
          </Button>
        </Box>
      </HeaderContainer>
      
      {isLoading && (
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading Creator Hub...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Make sure Creator Hub is running on port 3001
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
