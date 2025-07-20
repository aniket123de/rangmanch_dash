import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Badge,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  TrendingUp as IndustryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { CheckCircle } from '@mui/icons-material';
import bluetickIcon from '../assets/bluetick.png';
import { useNotifications } from '../contexts/NotificationsContext';
import { useAuth } from '../contexts/authContext';
import { getBrandInfo } from '../firebase/notifications';

const Notifications: React.FC = () => {
  const theme = useTheme();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    connected,
    markAsRead, 
    updateStatus, 
    refreshNotifications 
  } = useNotifications();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'new' | 'viewed' | 'accepted' | 'rejected'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [brandVerifiedMap, setBrandVerifiedMap] = useState<{[brandId: string]: boolean}>({});

  // Debug logs
  console.log('DEBUG: currentUserId:', user?.uid);
  console.log('DEBUG: notifications count:', notifications.length);
  console.log('DEBUG: connected to Firestore:', connected);

  useEffect(() => {
    // Fetch verification status for all unique brands in notifications
    const fetchAllBrands = async () => {
      const validNotifications = notifications.filter(n => n && n.senderId);
      
      const uniqueBrandIds = Array.from(new Set(
        validNotifications
          .map(n => n.senderId)
          .filter(id => id && typeof id === 'string' && id.trim() !== '')
      ));
      
      if (uniqueBrandIds.length === 0) {
        return;
      }
      
      const map: {[brandId: string]: boolean} = {};
      await Promise.all(uniqueBrandIds.map(async (brandId) => {
        try {
          const brand = await getBrandInfo(brandId);
          map[brandId] = !!(brand && (brand as any).isVerified);
        } catch (error) {
          console.error(`Error fetching brand info for ID ${brandId}:`, error);
          map[brandId] = false; // Default to not verified on error
        }
      }));
      setBrandVerifiedMap(map);
    };
    if (notifications.length) fetchAllBrands();
  }, [notifications]);

  const handleStatusChange = async (id: string, newStatus: 'accepted' | 'rejected' | 'viewed') => {
    setProcessingId(id);
    try {
      if (newStatus === 'viewed') {
        await markAsRead(id);
        setSnackbar({ open: true, message: 'Notification marked as read', severity: 'success' });
      } else {
        await updateStatus(id, newStatus);
        setSnackbar({ 
          open: true, 
          message: `Notification ${newStatus}`, 
          severity: 'success' 
        });
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to update notification status', 
        severity: 'error' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return theme.palette.info.main;
      case 'viewed': return theme.palette.warning.main;
      case 'accepted': return theme.palette.success.main;
      case 'rejected': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'New';
      case 'viewed': return 'Viewed';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <InstagramIcon sx={{ color: '#E4405F' }} />;
      case 'twitter': return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'linkedin': return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      case 'facebook': return <FacebookIcon sx={{ color: '#1877F2' }} />;
      default: return <BusinessIcon sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || notification.status === filter
  );

  const handleRefresh = () => {
    refreshNotifications();
    setSnackbar({ open: true, message: 'Notifications refreshed', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ fontSize: 32, mr: 2, color: theme.palette.primary.main }} />
          </Badge>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
        {!connected && (
          <Alert severity="warning" sx={{ ml: 2 }}>
            Disconnected from server. Click refresh to reconnect.
          </Alert>
        )}
      </Box>

      {/* Filter Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Filter by Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {(['all', 'new', 'viewed', 'accepted', 'rejected'] as const).map((status) => (
            <Chip
              key={status}
              label={status === 'all' ? 'All' : getStatusText(status)}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'filled' : 'outlined'}
              color={filter === status ? 'primary' : 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Box>
      </Box>

      {/* Notifications List */}
      <Box>
        {filteredNotifications.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: alpha(theme.palette.primary.main, 0.05),
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <NotificationsIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filter === 'all' ? 'You have no notifications yet.' : `No ${filter} notifications.`}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredNotifications.map((notification) => (
              <Grid item xs={12} key={notification.id}>
                <Card
                  sx={{
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: notification.status === 'new' ? 4 : 1,
                    border: notification.status === 'new' ? `2px solid ${theme.palette.info.main}` : 'none',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  {/* Status Badge */}
                  <Chip
                    label={getStatusText(notification.status)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: getStatusColor(notification.status),
                      color: 'white',
                      fontWeight: 600,
                      zIndex: 1,
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Avatar
                        src={notification.brandLogo}
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          boxShadow: 2,
                        }}
                      >
                        <BusinessIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          {notification.brandName}
                          {notification.senderId && brandVerifiedMap[notification.senderId] && (
                            <img 
                              src={bluetickIcon} 
                              alt="Verified" 
                              style={{ 
                                width: 20, 
                                height: 20, 
                                marginLeft: 4 
                              }} 
                              title="Verified"
                            />
                          )}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <IndustryIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {notification.industry}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {notification.formattedTimestamp}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Message */}
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {notification.message}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Brand Details */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WebsiteIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                            Website:
                          </Typography>
                          <Typography
                            variant="body2"
                            component="a"
                            href={notification.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {notification.website}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                            Location:
                          </Typography>
                          <Typography variant="body2">{notification.location}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Social Media:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {notification.socials && Object.entries(notification.socials)
                            .filter(([platform, handle]) => handle && handle.trim() !== '')
                            .map(([platform, handle]) => (
                            <Chip
                              key={platform}
                              icon={getSocialIcon(platform)}
                              label={handle}
                              size="small"
                              variant="outlined"
                              sx={{ '& .MuiChip-icon': { fontSize: 16 } }}
                            />
                          ))}
                          {(!notification.socials || Object.keys(notification.socials || {}).length === 0) && (
                            <Typography variant="body2" color="text.secondary">
                              No social media links available
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    {notification.status === 'new' || notification.status === 'viewed' ? (
                      <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          startIcon={processingId === notification.id ? <CircularProgress size={16} /> : <ViewIcon />}
                          onClick={() => handleStatusChange(notification.id, 'viewed')}
                          disabled={notification.status === 'viewed' || processingId === notification.id}
                        >
                          Mark as Viewed
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={processingId === notification.id ? <CircularProgress size={16} /> : <CheckIcon />}
                          onClick={() => handleStatusChange(notification.id, 'accepted')}
                          disabled={processingId === notification.id}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={processingId === notification.id ? <CircularProgress size={16} /> : <CancelIcon />}
                          onClick={() => handleStatusChange(notification.id, 'rejected')}
                          disabled={processingId === notification.id}
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: getStatusColor(notification.status),
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {notification.status === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;
