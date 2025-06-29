import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentAnalysisPanel from '../components/SentimentAnalysisPanel';

const SentimentAnalysis: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 6,
      }}
    >
      <Typography
        variant="h2"
        fontWeight={800}
        sx={{
          mb: 2,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #b983ff 0%, #9d4edd 50%, #5f2eea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 1,
        }}
      >
        Instagram Sentiment Analysis
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mb: 5,
          color: 'text.secondary',
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        Discover how people feel about your Instagram posts through comprehensive comment analysis
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          bgcolor: 'rgba(36, 41, 61, 0.85)',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(157, 78, 221, 0.15)',
          p: { xs: 2, sm: 4 },
          mb: 4,
        }}
      >
        <SentimentAnalysisPanel />
      </Box>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}
      >
        Get valuable insights into how your audience reacts to your Instagram content
      </Typography>
    </Box>
  );
};

export default SentimentAnalysis; 