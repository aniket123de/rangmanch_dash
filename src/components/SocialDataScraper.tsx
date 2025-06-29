import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Tab, 
  Tabs, 
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { YouTube, Instagram } from '@mui/icons-material';
import api, { Task } from '../services/api';
import { useAuth } from '../contexts/authContext';
import { getMyCreatorProfile } from '../firebase/firestore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`social-tabpanel-${index}`}
      aria-labelledby={`social-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Utility function to extract Instagram username from URL
const extractInstagramUsername = (input: string): string => {
  if (!input) return '';
  
  // If it's already just a username (no URL), return as is (remove @ if present)
  if (!input.includes('/') && !input.includes('.')) {
    return input.replace('@', '');
  }
  
  // Handle Instagram URLs
  const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/;
  const match = input.match(instagramRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // If no match found, assume it's a username and clean it
  return input.replace('@', '').replace(/[^a-zA-Z0-9._]/g, '');
};

const SocialDataScraper: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (polling) {
        clearInterval(polling);
      }
    };
  }, [polling]);

  // Fetch profile data on component mount
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Auto-populate fields when profile data is loaded
  useEffect(() => {
    if (profileData) {
      // Auto-populate Instagram username
      if (profileData.socials?.instagram) {
        const username = extractInstagramUsername(profileData.socials.instagram);
        setInstagramUsername(username);
      }
      
      // Auto-populate YouTube URL
      if (profileData.socials?.youtube) {
        setYoutubeUrl(profileData.socials.youtube);
      }
    }
  }, [profileData]);

  // Fetch profile data
  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      const profile = await getMyCreatorProfile(user.uid);
      setProfileData(profile);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to fetch profile data. Please ensure your social media URLs are saved in your profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const startPolling = (taskId: string) => {
    // Stop any existing polling
    if (polling) {
      clearInterval(polling);
    }

    // Start new polling
    const interval = setInterval(async () => {
      try {
        const taskStatus = await api.getTaskStatus(taskId);
        setCurrentTask(taskStatus);

        if (taskStatus.status !== 'running') {
          // Task completed or errored - stop polling
          clearInterval(interval);
          setPolling(null);
          setLoading(false);

          if (taskStatus.status === 'completed') {
            setSuccess(`Successfully scraped data: ${taskStatus.message}`);
          } else if (taskStatus.status === 'error') {
            setError(`Error: ${taskStatus.message}`);
          }
        }
      } catch (err) {
        clearInterval(interval);
        setPolling(null);
        setLoading(false);
        setError('Failed to fetch task status');
      }
    }, 2000);

    setPolling(interval);
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setCurrentTask(null);

    try {
      const task = await api.scrapeYouTube(youtubeUrl);
      setCurrentTask(task);
      startPolling(task.task_id);
    } catch (err) {
      setLoading(false);
      setError('Failed to start YouTube scraping');
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instagramUsername) return;

    // Extract username from URL if needed
    const cleanUsername = extractInstagramUsername(instagramUsername);
    if (!cleanUsername) {
      setError('Please enter a valid Instagram username or URL');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setCurrentTask(null);

    try {
      const task = await api.scrapeInstagram(cleanUsername);
      setCurrentTask(task);
      startPolling(task.task_id);
    } catch (err) {
      setLoading(false);
      setError('Failed to start Instagram scraping process');
    }
  };

  return (
    <Card sx={{ height: '100%', bgcolor: theme.palette.background.paper }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Social Media Data Scraper
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Scrape data from your social media platforms using URLs from your profile
          {loadingProfile && (
            <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
              Loading your social media URLs...
            </Box>
          )}
          {!loadingProfile && !profileData && user && (
            <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: 'warning.main' }}>
              Please add your social media URLs in your profile settings
            </Box>
          )}
        </Typography>

        {!user ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please log in to access your social media URLs
          </Alert>
        ) : loadingProfile ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="social media tabs"
                variant="fullWidth"
              >
                <Tab 
                  label="YouTube" 
                  icon={<YouTube />} 
                  iconPosition="start"
                  disabled={!youtubeUrl}
                  sx={{ 
                    minHeight: 60,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                />
                <Tab 
                  label="Instagram" 
                  icon={<Instagram />} 
                  iconPosition="start"
                  disabled={!instagramUsername}
                  sx={{ 
                    minHeight: 60,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                />
              </Tabs>
            </Box>

            {/* Rest of the component content */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  YouTube Channel URL from your profile
                </Typography>
              </Box>
              <form onSubmit={handleYoutubeSubmit}>
                <TextField
                  fullWidth
                  label="YouTube Channel URL"
                  variant="outlined"
                  placeholder="YouTube URL will be loaded from your profile"
                  value={youtubeUrl}
                  disabled={true}
                  sx={{ mb: 2 }}
                  helperText={youtubeUrl ? "URL loaded from your profile" : "Please add your YouTube URL in your profile settings"}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading || !youtubeUrl}
                  sx={{ height: 48 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Scrape YouTube Data'}
                </Button>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Instagram Username extracted from your profile
                </Typography>
              </Box>
              <form onSubmit={handleInstagramSubmit}>
                <TextField
                  fullWidth
                  label="Instagram Username"
                  variant="outlined"
                  placeholder="Instagram username will be extracted from your profile URL"
                  value={instagramUsername}
                  disabled={true}
                  sx={{ mb: 2 }}
                  helperText={instagramUsername ? "Username extracted from your profile URL" : "Please add your Instagram URL in your profile settings"}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading || !instagramUsername}
                  sx={{ height: 48 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Scrape Instagram Data'}
                </Button>
              </form>
            </TabPanel>
          </>
        )}

        {currentTask && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Task Status
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="body2">
                  {currentTask.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                <Chip 
                  label={currentTask.status} 
                  color={
                    currentTask.status === 'completed' ? 'success' : 
                    currentTask.status === 'error' ? 'error' : 'primary'
                  }
                  size="small"
                />
              </Grid>
            </Grid>

            {currentTask.status === 'running' && (
              <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <CircularProgress size={30} />
              </Box>
            )}

            {currentTask.data && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Results
                </Typography>
                <List dense>
                  {currentTask.status === 'completed' && currentTask.data.channel_name && (
                    <ListItem>
                      <ListItemText 
                        primary={`Channel: ${currentTask.data.channel_name}`} 
                        secondary={`Items: ${currentTask.data.item_count}`}
                      />
                    </ListItem>
                  )}
                  {currentTask.status === 'completed' && currentTask.data.username && (
                    <ListItem>
                      <ListItemText 
                        primary={`Username: ${currentTask.data.username}`} 
                        secondary={`Items: ${currentTask.data.item_count}`}
                      />
                    </ListItem>
                  )}
                  {currentTask.status === 'completed' && currentTask.data.file_path && (
                    <ListItem>
                      <ListItemText 
                        primary="Data saved"
                        secondary={currentTask.data.file_path}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </Box>
        )}

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar 
          open={!!success} 
          autoHideDuration={6000} 
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default SocialDataScraper; 