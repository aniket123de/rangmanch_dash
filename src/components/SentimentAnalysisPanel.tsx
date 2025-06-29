import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const SentimentAnalysisPanel: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    // Validate Instagram URL format
    const instagramUrlRegex = /https:\/\/www\.instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/;
    if (!instagramUrlRegex.test(url)) {
      setError('Please enter a valid Instagram post or reel URL');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://sentiment-api-iop3.onrender.com/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_url: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Transform the Python API response to match our React component's expected format
      const transformedResults = {
        overallSentiment: (data.stats?.sentiment_strength || '').toLowerCase().includes('positive') ? 'positive' :
                          (data.stats?.sentiment_strength || '').toLowerCase().includes('negative') ? 'negative' : 'neutral',
        sentimentScore: Math.round((data.stats?.positive_pct || 0) * 100) / 100,
        totalComments: data.stats?.total_comments || 0,
        comments: (data.comments || []).map((comment: any) => ({
          text: comment.text || '',
          sentiment: (comment.sentiment || 'Neutral').toLowerCase(),
          author: comment.username || 'Unknown',
        })),
      };

      setResults(transformedResults);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze sentiment. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <InsertEmoticonIcon sx={{ color: theme.palette.success.main }} />;
      case 'neutral':
        return <SentimentNeutralIcon sx={{ color: theme.palette.warning.main }} />;
      case 'negative':
        return <SentimentVeryDissatisfiedIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(52, 58, 85, 0.85)',
              borderRadius: 3,
              px: 2,
              py: 2,
              mb: 2,
              boxShadow: '0 2px 8px 0 rgba(157, 78, 221, 0.08)',
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#E1306C', borderRadius: 2, p: 1 }}>
              <InstagramIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <TextField
              placeholder="Enter Instagram post URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
              fullWidth
              size="medium"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { color: 'white', fontSize: 18 },
              }}
              sx={{
                bgcolor: 'transparent',
                borderRadius: 2,
                input: { color: 'white', fontSize: 18 },
              }}
              required
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 2,
              fontWeight: 700,
              fontSize: '1.2rem',
              background: 'linear-gradient(90deg, #b983ff 0%, #9d4edd 50%, #5f2eea 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 2px 8px 0 rgba(157, 78, 221, 0.12)',
              textTransform: 'none',
              letterSpacing: 1,
              transition: 'background 0.3s',
              '&:hover': {
                background: 'linear-gradient(90deg, #9d4edd 0%, #b983ff 100%)',
              },
            }}
            disabled={isLoading}
            endIcon={<ArrowForwardIcon />}
          >
            {isLoading ? <CircularProgress size={28} color="inherit" /> : 'Analyze Sentiment'}
          </Button>
        </Box>
      </form>
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText, borderRadius: 2 }}>
          {error}
        </Box>
      )}
      {results && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {getSentimentIcon(results.overallSentiment)}
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Overall Sentiment: {results.overallSentiment.charAt(0).toUpperCase() + results.overallSentiment.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Score: {results.sentimentScore}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Total Comments: <b>{results.totalComments}</b>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Comments Analysis
          </Typography>
          <List dense sx={{ maxHeight: 260, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
            {results.comments.map((comment: any, idx: number) => (
              <ListItem key={idx} alignItems="flex-start" sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.grey[200], color: theme.palette.text.primary }}>
                    {getSentimentIcon(comment.sentiment)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.text}
                  secondary={<>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {comment.author}
                    </Typography>
                  </>}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SentimentAnalysisPanel; 