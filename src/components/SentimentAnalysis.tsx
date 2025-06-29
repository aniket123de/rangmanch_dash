import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Instagram, 
  PieChart, 
  Chat, 
  SentimentSatisfied, 
  SentimentNeutral, 
  SentimentDissatisfied 
} from '@mui/icons-material';

interface Comment {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  author: string;
}

interface SentimentResults {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  totalComments: number;
  comments: Comment[];
}

const SentimentAnalysis: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SentimentResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      const transformedResults: SentimentResults = {
        overallSentiment: (data.stats?.sentiment_strength || '').toLowerCase().includes('positive') ? 'positive' :
                          (data.stats?.sentiment_strength || '').toLowerCase().includes('negative') ? 'negative' : 'neutral',
        sentimentScore: Math.round((data.stats?.positive_pct || 0) * 100) / 100,
        totalComments: data.stats?.total_comments || 0,
        comments: (data.comments || []).map((comment: any) => ({
          text: comment.text || '',
          sentiment: (comment.sentiment || 'Neutral').toLowerCase() as 'positive' | 'neutral' | 'negative',
          author: comment.username || 'Unknown'
        }))
      };

      setResults(transformedResults);
    } catch (err: any) {
      console.error('Error analyzing sentiment:', err);
      setError(err.message || 'Failed to analyze sentiment. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <SentimentSatisfied sx={{ color: theme.palette.success.main, fontSize: '1.25rem' }} />;
      case 'neutral':
        return <SentimentNeutral sx={{ color: theme.palette.warning.main, fontSize: '1.25rem' }} />;
      case 'negative':
        return <SentimentDissatisfied sx={{ color: theme.palette.error.main, fontSize: '1.25rem' }} />;
      default:
        return null;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return theme.palette.success.main;
      case 'neutral':
        return theme.palette.warning.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      mb: 3
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
              fontWeight: 'bold',
              mb: 1,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Instagram Sentiment Analysis
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
            Discover how people feel about your Instagram posts through comprehensive comment analysis
          </Typography>
        </Box>

        {/* URL Input Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            p: 2,
            borderRadius: 2,
            mb: 2
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              p: 1,
              borderRadius: 1
            }}>
              <Instagram sx={{ color: 'white', fontSize: '1.5rem' }} />
            </Box>
            <TextField
              fullWidth
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Instagram post URL"
              variant="standard"
              required
              sx={{
                '& .MuiInput-root': {
                  color: 'white',
                  fontSize: '1.125rem',
                  '&::before': { borderBottom: 'none' },
                  '&::after': { borderBottom: 'none' },
                  '&:hover::before': { borderBottom: 'none' },
                },
                '& .MuiInput-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1.125rem',
              fontWeight: 'medium',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <span>Analyzing comments...</span>
              </Box>
            ) : (
              <span>Analyze Sentiment</span>
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
            {error}
          </Alert>
        )}

        {results && (
          <Box sx={{ mt: 3 }}>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      p: 1,
                      borderRadius: 1
                    }}>
                      <PieChart sx={{ color: 'white', fontSize: '1.25rem' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Overall Sentiment
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getSentimentIcon(results.overallSentiment)}
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                        {results.sentimentScore}%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'capitalize' }}>
                        {results.overallSentiment} sentiment
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      p: 1,
                      borderRadius: 1
                    }}>
                      <Chat sx={{ color: 'white', fontSize: '1.25rem' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Comments Analyzed
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {results.totalComments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total comments processed
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Comments Analysis */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Comment Analysis
              </Typography>
              
              <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {results.comments.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', opacity: 0.7 }}>
                    No comments available for analysis
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {results.comments.map((comment, index) => (
                      <Paper
                        key={index}
                        sx={{ 
                          p: 2,
                          background: `rgba(${comment.sentiment === 'positive' ? '76, 175, 80' : 
                                               comment.sentiment === 'neutral' ? '255, 152, 0' : 
                                               '244, 67, 54'}, 0.1)`,
                          border: `1px solid rgba(${comment.sentiment === 'positive' ? '76, 175, 80' : 
                                                    comment.sentiment === 'neutral' ? '255, 152, 0' : 
                                                    '244, 67, 54'}, 0.3)`,
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ 
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: `rgba(${comment.sentiment === 'positive' ? '76, 175, 80' : 
                                             comment.sentiment === 'neutral' ? '255, 152, 0' : 
                                             '244, 67, 54'}, 0.1)`
                          }}>
                            {getSentimentIcon(comment.sentiment)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 'medium', mb: 1 }}>
                              {comment.text}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ 
                                width: 24, 
                                height: 24, 
                                fontSize: '0.75rem',
                                bgcolor: 'rgba(255, 255, 255, 0.2)'
                              }}>
                                {comment.author.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {comment.author}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Get valuable insights into how your audience reacts to your Instagram content
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis; 