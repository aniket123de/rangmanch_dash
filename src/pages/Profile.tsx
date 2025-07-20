import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  AttachMoney as MoneyIcon,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/authContext';
import { createOrUpdateCreatorProfile, getMyCreatorProfile } from '../firebase/firestore';

const Profile: React.FC = () => {
  const { user, userData, updateUserData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Content Creator',
    bio: '',
    location: '',
    avatarUrl: '',
    niche: '',
    tariff: '',
    categories: [] as string[],
    socialLinks: {
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    },
  });

  // Load profile data when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          setLoading(true);
          // Try to get creator profile
          const creatorProfile = await getMyCreatorProfile(user.uid);
          setIsVerified(!!(creatorProfile as any).isVerified);
          
          setProfileData({
            name: (creatorProfile as any)?.name || user.displayName || '',
            email: userData?.email || user.email || '',
            phone: (creatorProfile as any)?.phone || '',
            role: userData?.role || 'Content Creator',
            bio: (creatorProfile as any)?.bio || '',
            location: (creatorProfile as any)?.location || '',
            avatarUrl: (creatorProfile as any)?.avatarUrl || user.photoURL || '',
            niche: (creatorProfile as any)?.niche || '',
            tariff: (creatorProfile as any)?.tariff || '',
            categories: (creatorProfile as any)?.categories || [],
            socialLinks: {
              twitter: (creatorProfile as any)?.socials?.twitter || '',
              instagram: (creatorProfile as any)?.socials?.instagram || '',
              linkedin: (creatorProfile as any)?.socials?.linkedin || '',
              youtube: (creatorProfile as any)?.socials?.youtube || '',
            },
          });
        } catch (error) {
          console.error('Error loading profile:', error);
          // Set basic data from user
          setProfileData(prev => ({
            ...prev,
            name: user.displayName || '',
            email: user.email || '',
            role: userData?.role || 'Content Creator',
          }));
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfileData();
  }, [user, userData]);

  const handleEditToggle = async () => {
    if (editing) {
      // Save profile data
      try {
        setLoading(true);
        setError('');
        
        const creatorData = {
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          avatarUrl: profileData.avatarUrl,
          niche: profileData.niche,
          tariff: profileData.tariff,
          categories: profileData.categories,
          socials: profileData.socialLinks,
        };

        await createOrUpdateCreatorProfile(user!.uid, creatorData);
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setEditing(false);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setEditing(true);
      setError('');
    }
  };

  const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent as keyof typeof profileData] as Record<string, any>,
          [child]: value
        }
      });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const avatarSrc = (profileData.avatarUrl && profileData.avatarUrl.trim() !== '')
    ? profileData.avatarUrl
    : (user?.photoURL || '');

  if (loading && !profileData.name) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Profile
        {isVerified && <CheckCircle sx={{ color: '#2196f3' }} titleAccess="Verified" />}
      </Typography>
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Personal Information</Typography>
            <Button
              startIcon={editing ? <SaveIcon /> : <EditIcon />}
              onClick={handleEditToggle}
              variant={editing ? "contained" : "outlined"}
              color={editing ? "primary" : "secondary"}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : editing ? (
                "Save Changes"
              ) : (
                "Edit Profile"
              )}
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatarSrc}
                  alt={profileData.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                {isVerified && (
                  <CheckCircle sx={{ color: '#2196f3', position: 'absolute', bottom: 8, right: 8, fontSize: 32, bgcolor: 'white', borderRadius: '50%' }} titleAccess="Verified" />
                )}
              </Box>
              
              {editing && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<UploadIcon />}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Upload
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Member since
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={profileData.role}
                    disabled={true}
                    variant="outlined"
                    helperText="Role cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    disabled={true}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Niche"
                    name="niche"
                    value={profileData.niche}
                    onChange={handleProfileDataChange}
                    disabled={!editing}
                    variant="outlined"
                    placeholder="e.g., Lifestyle, Fashion, Tech"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tariff (₹)"
                    name="tariff"
                    type="number"
                    value={profileData.tariff}
                    onChange={handleProfileDataChange}
                    disabled={!editing}
                    variant="outlined"
                    placeholder="e.g., 5000"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Amount charged per project/collaboration"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileDataChange}
                    disabled={!editing}
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder="Tell us about yourself and your content..."
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Social Media Profiles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  name="socialLinks.instagram"
                  value={profileData.socialLinks.instagram}
                  onChange={handleProfileDataChange}
                  disabled={!editing}
                  variant="outlined"
                  placeholder="@username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InstagramIcon color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="YouTube"
                  name="socialLinks.youtube"
                  value={profileData.socialLinks.youtube}
                  onChange={handleProfileDataChange}
                  disabled={!editing}
                  variant="outlined"
                  placeholder="@channel"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <YouTubeIcon sx={{ color: '#FF0000' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  name="socialLinks.twitter"
                  value={profileData.socialLinks.twitter}
                  onChange={handleProfileDataChange}
                  disabled={!editing}
                  variant="outlined"
                  placeholder="@username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TwitterIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="socialLinks.linkedin"
                  value={profileData.socialLinks.linkedin}
                  onChange={handleProfileDataChange}
                  disabled={!editing}
                  variant="outlined"
                  placeholder="profile-url"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon sx={{ color: '#0077B5' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 