'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiCall } from '@/utils/api';
import { Box, Typography, Avatar, Button, TextField, Autocomplete, Switch, IconButton, CircularProgress, Tooltip, Alert } from '@mui/material';
import {
    EmailOutlined,
    LocationOnOutlined,
    CalendarTodayOutlined,
    ExitToAppOutlined,
    RecyclingOutlined,
    EmojiEventsOutlined,
    EditOutlined,
    PersonOutline,
    WorkspacesOutlined,
    Delete,
    VolunteerActivism,
    Filter3,
    CameraAlt,
} from '@mui/icons-material';
import { styles } from './profile.styles';
import withAuth from '@/components/auth/withAuth';

const ProfilePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    // User profile state
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        location: '',
        bio: '',
        profileImage: '',
        totalItemsCollected: 0,
        totalChallenges: 0,
        impactScore: 0,
        badges: [],
        joinedChallenges: [],
        createdAt: null,
    });

    // Recent achievements state
    const [achievements, setAchievements] = useState([]);
    const [achievementsLoading, setAchievementsLoading] = useState(true);
    const [hasAchievements, setHasAchievements] = useState(false);

    // Location autocomplete state
    const [locationOptions, setLocationOptions] = useState([]);
    const [locationInputValue, setLocationInputValue] = useState('');
    const autocompleteService = useRef(null);

    // Temporary edit state
    const [editProfile, setEditProfile] = useState({ ...userProfile });

    // Settings state
    const [settings, setSettings] = useState({
        emailNotifications: true,
        weeklySummary: true,
        achievementAlerts: true,
        profileVisibility: true,
        showStatsOnLeaderboard: true,
    });

    // Track original settings to detect changes
    const [originalSettings, setOriginalSettings] = useState({
        emailNotifications: true,
        weeklySummary: true,
        achievementAlerts: true,
        profileVisibility: true,
        showStatsOnLeaderboard: true,
    });

    // Check if settings have changed
    const hasSettingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    // Initialize Google Places Autocomplete
    useEffect(() => {
        if (typeof window !== 'undefined' && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    }, []);

    async function fetchProfile() {
        try {
            const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
            if (res?.data) {
                // Ensure profile image URL is properly formatted
                const profileImage = res.data.profileImage 
                    ? (res.data.profileImage.startsWith('http') 
                        ? res.data.profileImage 
                        : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`)
                    : '';
                
                setUserProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    location: res.data.location || '',
                    bio: res.data.bio || '',
                    profileImage: profileImage,
                    totalItemsCollected: res.data.totalItemsCollected || 0,
                    totalChallenges: res.data.totalChallenges || 0,
                    impactScore: res.data.impactScore || 0,
                    badges: res.data.badges || [],
                    joinedChallenges: res.data.joinedChallenges || [],
                    createdAt: res.data.createdAt || null,
                });
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    }

    async function fetchRecentAchievements() {
        try {
            setAchievementsLoading(true);
            const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/achievements/recent`);
            if (res?.data) {
                setHasAchievements(res.data.hasAchievements);
                if (res.data.achievements && res.data.achievements.length > 0) {
                    // Format achievements for display
                    const formattedAchievements = res.data.achievements.map(achievement => {
                        // Validate and format date
                        let formattedDate = 'Recently';
                        if (achievement.date) {
                            try {
                                const date = new Date(achievement.date);
                                if (!isNaN(date.getTime())) {
                                    formattedDate = date.toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                    });
                                }
                            } catch (error) {
                                console.error('Error formatting achievement date:', error);
                            }
                        }
                        
                        return {
                            name: achievement.name,
                            date: formattedDate,
                            rarity: achievement.rarity,
                            color: achievement.color,
                            icon: achievement.icon,
                        };
                    });
                    setAchievements(formattedAchievements);
                } else {
                    setAchievements([]);
                }
            }
        } catch (error) {
            console.error('Failed to load recent achievements:', error);
            setAchievements([]);
            setHasAchievements(false);
        } finally {
            setAchievementsLoading(false);
        }
    }

    // Fetch user profile from backend on mount
    useEffect(() => {
        fetchProfile();
        fetchRecentAchievements();
    }, []);

    // Update editProfile if userProfile changes
    useEffect(() => {
        setEditProfile({ ...userProfile });
        setLocationInputValue(userProfile.location);
    }, [userProfile]);

    // Handle location search
    useEffect(() => {
        if (!locationInputValue || locationInputValue.length < 2) {
            setLocationOptions([]);
            return;
        }

        if (autocompleteService.current) {
            autocompleteService.current.getPlacePredictions(
                {
                    input: locationInputValue,
                    types: ['(cities)'],
                },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setLocationOptions(predictions.map(prediction => prediction.description));
                    } else {
                        setLocationOptions([]);
                    }
                }
            );
        }
    }, [locationInputValue]);

    // Format join date
    const formatJoinDate = (date) => {
        if (!date) return 'Recently';
        return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleSignOut = async () => {
        try {
            // Clear all local storage and state before signing out
            localStorage.clear();
            sessionStorage.clear();
            
            await signOut(auth);
            router.push('/landing');
        } catch (error) {
            console.error('Error signing out:', error);
            // Even if signout fails, clear storage and redirect
            localStorage.clear();
            sessionStorage.clear();
            router.push('/landing');
        }
    };

    const handleEditProfile = () => {
        if (isEditing) {
            setEditProfile({ ...userProfile });
            setLocationInputValue(userProfile.location);
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        try {
            const updateData = {
                name: editProfile.name,
                location: editProfile.location,
                bio: editProfile.bio,
            };
            await apiCall('patch', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`, updateData);
            await fetchProfile(); // Refetch profile to sync latest data
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleProfileInputChange = (field, value) => {
        setEditProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLocationChange = (event, newValue) => {
        setEditProfile(prev => ({
            ...prev,
            location: newValue || ''
        }));
    };

    const handleSettingToggle = (settingName) => {
        setSettings(prev => ({
            ...prev,
            [settingName]: !prev[settingName]
        }));
    };

    const handleSaveSettings = () => {
        // TODO: Implement settings save to backend
        setOriginalSettings(settings);
    };

    const handleCancelSettings = () => {
        setSettings(originalSettings);
    };

    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Clear previous messages
        setUploadError('');
        setUploadSuccess('');

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB');
            return;
        }

        try {
            setUploadingImage(true);

            // Create FormData and append the image
            const formData = new FormData();
            formData.append('image', file);

            // Upload to backend
            const res = await apiCall('post', `${process.env.NEXT_PUBLIC_API_URL}/api/profile/upload-image`, formData);

            if (res?.data?.profileImage) {
                // Update user profile with new image URL
                // The backend returns the path, prepend the API URL
                const imageUrl = res.data.profileImage.startsWith('http') 
                    ? res.data.profileImage 
                    : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`;
                setUserProfile(prev => ({
                    ...prev,
                    profileImage: imageUrl
                }));
                setUploadSuccess('Profile picture updated successfully!');
                // Clear success message after 3 seconds
                setTimeout(() => setUploadSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to upload profile image:', error);
            setUploadError('Failed to upload profile picture. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const getAchievementIcon = (iconString) => {
        // If it's an emoji string, display it directly
        if (iconString && /\p{Emoji}/u.test(iconString)) {
            return <Typography sx={{ fontSize: '32px' }}>{iconString}</Typography>;
        }
        
        // Legacy icon type support
        switch (iconString) {
            case 'plastic':
                return <Delete sx={styles.achievementIconSvg} />;
            case 'volunteer':
                return <VolunteerActivism sx={styles.achievementIconSvg} />;
            case 'century':
                return <Filter3 sx={styles.achievementIconSvg} />;
            default:
                return <EmojiEventsOutlined sx={styles.achievementIconSvg} />;
        }
    };

    return (
        <Box sx={styles.container}>
            {/* Header */}
            <Box sx={styles.header}>
                <Typography sx={styles.title}>Profile Settings</Typography>
                <Typography sx={styles.subtitle}>
                    Manage your account and track your environmental impact
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={styles.mainContent}>
                {/* Left Sidebar */}
                <Box sx={styles.sidebar}>
                    {/* Avatar */}
                    <Box sx={styles.avatarSection}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfileImageChange}
                        />
                        <Box sx={styles.avatarWrapper}>
                            <Avatar sx={styles.avatar} src={userProfile.profileImage}>
                                <PersonOutline sx={styles.avatarIcon} />
                            </Avatar>
                            <Tooltip title="Upload profile picture" placement="right">
                                <IconButton 
                                    sx={styles.avatarUploadButton}
                                    onClick={handleProfileImageClick}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <CircularProgress size={16} sx={{ color: '#ffffff' }} />
                                    ) : (
                                        <CameraAlt sx={styles.uploadIcon} />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography sx={styles.userName}>{userProfile.name}</Typography>
                        <Typography sx={styles.userLocation}>{userProfile.location || 'Location not set'}</Typography>
                        <Typography sx={styles.userBio}>{userProfile.bio || 'No bio yet'}</Typography>
                        
                        {/* Upload status messages */}
                        {uploadError && (
                            <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }} onClose={() => setUploadError('')}>
                                {uploadError}
                            </Alert>
                        )}
                        {uploadSuccess && (
                            <Alert severity="success" sx={{ mt: 2, fontSize: '13px' }} onClose={() => setUploadSuccess('')}>
                                {uploadSuccess}
                            </Alert>
                        )}
                    </Box>

                    {/* User Info */}
                    <Box sx={styles.userInfo}>
                        <Box sx={styles.infoItem}>
                            <EmailOutlined sx={styles.infoIcon} />
                            <Typography sx={styles.infoText}>{userProfile.email}</Typography>
                        </Box>
                        <Box sx={styles.infoItem}>
                            <CalendarTodayOutlined sx={styles.infoIcon} />
                            <Typography sx={styles.infoText}>Joined {formatJoinDate(userProfile.createdAt)}</Typography>
                        </Box>
                    </Box>

                    {/* Sign Out Button - Desktop only */}
                    <Button sx={{ ...styles.signOutButton, display: { xs: 'none', md: 'flex' } }} onClick={handleSignOut}>
                        <ExitToAppOutlined sx={styles.signOutIcon} />
                        Sign Out
                    </Button>

                    {/* Quick Stats */}
                    <Box sx={styles.quickStats}>
                        <Typography sx={styles.quickStatsTitle}>Quick Stats</Typography>
                        <Box sx={styles.statItem}>
                            <RecyclingOutlined sx={{ ...styles.statIcon, color: '#0ea5e9' }} />
                            <Typography sx={styles.statLabel}>Total Items</Typography>
                            <Typography sx={styles.statValue}>{userProfile.totalItemsCollected.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={styles.statItem}>
                            <WorkspacesOutlined sx={{ ...styles.statIcon, color: '#10b981' }} />
                            <Typography sx={styles.statLabel}>Challenges</Typography>
                            <Typography sx={styles.statValue}>{userProfile.totalChallenges}</Typography>
                        </Box>
                        <Box sx={styles.statItem}>
                            <EmojiEventsOutlined sx={{ ...styles.statIcon, color: '#f59e0b' }} />
                            <Typography sx={styles.statLabel}>Rank</Typography>
                            <Typography sx={styles.statValue}>#{userProfile.impactScore || 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Right Content */}
                <Box sx={styles.rightContent}>
                    {/* Tabs */}
                    <Box sx={styles.tabs}>
                        <Box
                            sx={{
                                ...styles.tab,
                                ...(activeTab === 'profile' ? styles.activeTab : {}),
                            }}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </Box>
                        <Box
                            sx={{
                                ...styles.tab,
                                ...(activeTab === 'settings' ? styles.activeTab : {}),
                            }}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </Box>
                    </Box>

                    {/* Tab Content */}
                    {activeTab === 'profile' && (
                        <Box sx={styles.tabContent}>
                            {/* Personal Information */}
                            <Box sx={styles.section}>
                                <Box sx={styles.sectionHeader}>
                                    <Typography sx={styles.sectionTitle}>Personal Information</Typography>
                                    <Button sx={styles.editButton} onClick={handleEditProfile}>
                                        <EditOutlined sx={styles.editIcon} />
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </Button>
                                </Box>

                                <Box sx={styles.formGrid}>
                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Full Name</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                value={editProfile.name}
                                                onChange={(e) => handleProfileInputChange('name', e.target.value)}
                                                sx={styles.input}
                                            />
                                        ) : (
                                            <Typography sx={styles.value}>{userProfile.name}</Typography>
                                        )}
                                    </Box>

                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Email Address</Typography>
                                        <Typography sx={styles.value}>{userProfile.email}</Typography>
                                    </Box>

                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Location</Typography>
                                        {isEditing ? (
                                            <Autocomplete
                                                freeSolo
                                                options={locationOptions}
                                                value={editProfile.location}
                                                onChange={handleLocationChange}
                                                inputValue={locationInputValue}
                                                onInputChange={(event, newInputValue) => {
                                                    setLocationInputValue(newInputValue);
                                                    handleProfileInputChange('location', newInputValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        placeholder="Enter your city or province"
                                                        sx={styles.input}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <LocationOnOutlined sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />
                                                            ),
                                                        }}
                                                    />
                                                )}
                                                sx={{
                                                    '& .MuiAutocomplete-inputRoot': {
                                                        paddingLeft: '8px',
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Typography sx={styles.value}>{userProfile.location || 'Not set'}</Typography>
                                        )}
                                    </Box>

                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Joined</Typography>
                                        <Typography sx={styles.value}>{formatJoinDate(userProfile.createdAt)}</Typography>
                                    </Box>

                                    <Box sx={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                                        <Typography sx={styles.label}>Bio</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={editProfile.bio}
                                                onChange={(e) => handleProfileInputChange('bio', e.target.value)}
                                                sx={styles.input}
                                                placeholder="Tell us about yourself and your passion for ocean conservation"
                                            />
                                        ) : (
                                            <Typography sx={styles.bioValue}>{userProfile.bio || 'No bio yet'}</Typography>
                                        )}
                                    </Box>
                                </Box>

                                {isEditing && (
                                    <Box sx={styles.buttonGroup}>
                                        <Button sx={styles.cancelButton} onClick={handleEditProfile}>
                                            Cancel
                                        </Button>
                                        <Button sx={styles.saveButton} onClick={handleSaveProfile}>
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            {/* Recent Achievements */}
                            <Box sx={styles.section}>
                                <Typography sx={styles.sectionTitle}>Recent Achievements</Typography>
                                {achievementsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress size={40} />
                                    </Box>
                                ) : !hasAchievements || achievements.length === 0 ? (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 6,
                                        px: 3,
                                        backgroundColor: '#f0f9ff',
                                        borderRadius: '16px',
                                        border: '2px dashed #0ea5e9',
                                    }}>
                                        <Typography sx={{ fontSize: '4rem', mb: 2 }}>🏆</Typography>
                                        <Typography variant="h6" sx={{ color: '#0284c7', fontWeight: 700, mb: 1 }}>
                                            Start Your Achievement Journey!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                            Upload your first cleanup, join challenges, and unlock amazing achievements!
                                        </Typography>
                                        <Button 
                                            variant="contained"
                                            onClick={() => router.push('/challenges')}
                                            sx={{
                                                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                                },
                                            }}
                                        >
                                            Browse Challenges
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <Box sx={styles.achievementsList}>
                                            {achievements.map((achievement, index) => (
                                                <Box key={index} sx={styles.achievementItem}>
                                                    <Box sx={styles.achievementLeft}>
                                                        <Box
                                                            sx={{
                                                                ...styles.achievementIcon,
                                                                backgroundColor: `${achievement.color}20`,
                                                            }}
                                                        >
                                                            {getAchievementIcon(achievement.icon)}
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={styles.achievementName}>
                                                                {achievement.name}
                                                            </Typography>
                                                            <Typography sx={styles.achievementDate}>
                                                                {achievement.date}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            ...styles.rarityBadge,
                                                            backgroundColor:
                                                                achievement.rarity === 'Legendary' ? '#f3e8ff' :
                                                                achievement.rarity === 'Epic' ? '#fef3c7' :
                                                                achievement.rarity === 'Rare' ? '#dbeafe' : '#f1f5f9',
                                                            color:
                                                                achievement.rarity === 'Legendary' ? '#6b21a8' :
                                                                achievement.rarity === 'Epic' ? '#92400e' :
                                                                achievement.rarity === 'Rare' ? '#1e40af' : '#475569',
                                                        }}
                                                    >
                                                        {achievement.rarity}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button 
                                            sx={styles.viewAllButton}
                                            onClick={() => router.push('/achievements')}
                                        >
                                            View All Achievements
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}

                    {activeTab === 'settings' && (
                        <Box sx={styles.tabContent}>
                            {/* Account Settings */}
                            <Box sx={styles.section}>
                                <Typography sx={styles.sectionTitle}>Account Settings</Typography>

                                {/* Notification Preferences */}
                                <Box sx={styles.settingsGroup}>
                                    <Typography sx={styles.settingsGroupTitle}>Notification Preferences</Typography>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Email Notifications</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Receive updates about your cleanups and achievements
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onChange={() => handleSettingToggle('emailNotifications')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Weekly Summary</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Get a weekly summary of your environmental impact
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.weeklySummary}
                                            onChange={() => handleSettingToggle('weeklySummary')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Achievement Alerts</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Be notified when you unlock new achievements
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.achievementAlerts}
                                            onChange={() => handleSettingToggle('achievementAlerts')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                </Box>

                                {/* Privacy Settings */}
                                <Box sx={styles.settingsGroup}>
                                    <Typography sx={styles.settingsGroupTitle}>Privacy Settings</Typography>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Profile Visibility</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Make your profile visible to other volunteers
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.profileVisibility}
                                            onChange={() => handleSettingToggle('profileVisibility')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Show Stats on Leaderboard</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Display your cleanup stats on the community leaderboard
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.showStatsOnLeaderboard}
                                            onChange={() => handleSettingToggle('showStatsOnLeaderboard')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                </Box>

                                {/* Account Actions */}
                                <Box sx={styles.settingsGroup}>
                                    <Typography sx={styles.settingsGroupTitle}>Account Actions</Typography>
                                    <Button sx={styles.changePasswordButton}>
                                        Change Password
                                    </Button>
                                    <Button sx={styles.deleteAccountButton}>
                                        Delete Account
                                    </Button>
                                </Box>

                                {/* Save Changes Button - Appears when settings are modified */}
                                {hasSettingsChanged && (
                                    <Box sx={styles.buttonGroup}>
                                        <Button sx={styles.cancelButton} onClick={handleCancelSettings}>
                                            Cancel
                                        </Button>
                                        <Button sx={styles.saveButton} onClick={handleSaveSettings}>
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default withAuth(ProfilePage);