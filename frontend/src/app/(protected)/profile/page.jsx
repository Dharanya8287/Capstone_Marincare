'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiCall } from '@/utils/api';
import { Box, Typography, Avatar, Button, TextField, Autocomplete, Switch, IconButton, CircularProgress } from '@mui/material';
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

    // Local achievements data (can be synced with backend badges later)
    const achievements = [
        {
            name: 'Plastic Warrior',
            date: 'Oct 4, 2025',
            rarity: 'Rare',
            color: '#0ea5e9',
            icon: 'plastic',
        },
        {
            name: 'Dedicated Volunteer',
            date: 'Oct 3, 2025',
            rarity: 'Rare',
            color: '#0ea5e9',
            icon: 'volunteer',
        },
        {
            name: 'Century Club',
            date: 'Sep 28, 2025',
            rarity: 'Uncommon',
            color: '#0ea5e9',
            icon: 'century',
        },
    ];

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
            const res = await apiCall('get', 'http://localhost:5000/api/profile');
            if (res?.data) {
                setUserProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    location: res.data.location || '',
                    bio: res.data.bio || '',
                    profileImage: res.data.profileImage || '',
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

    // Fetch user profile from backend on mount
    useEffect(() => {
        fetchProfile();
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
            await signOut(auth);
            localStorage.removeItem('user');
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            router.push('/login');
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
                email: editProfile.email,
                location: editProfile.location,
                bio: editProfile.bio,
                profileImage: editProfile.profileImage,
            };
            await apiCall('patch', 'http://localhost:5000/api/profile', updateData);
            await fetchProfile(); // Refetch profile to sync latest data
            setIsEditing(false);
            console.log('Profile saved successfully');
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
        // Save settings logic here (e.g., API call)
        console.log('Saving settings:', settings);
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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.error('File size must be less than 5MB');
            return;
        }

        try {
            setUploadingImage(true);

            // Create FormData and append the image
            const formData = new FormData();
            formData.append('image', file);

            // Upload to backend
            const res = await apiCall('post', 'http://localhost:5000/api/profile/upload-image', formData);

            if (res?.data?.profileImage) {
                // Update user profile with new image URL
                setUserProfile(prev => ({
                    ...prev,
                    profileImage: `http://localhost:5000${res.data.profileImage}`
                }));
                console.log('Profile image updated successfully');
            }
        } catch (error) {
            console.error('Failed to upload profile image:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    const getAchievementIcon = (iconType) => {
        switch (iconType) {
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
                        </Box>
                        <Typography sx={styles.userName}>{userProfile.name}</Typography>
                        <Typography sx={styles.userLocation}>{userProfile.location || 'Location not set'}</Typography>
                        <Typography sx={styles.userBio}>{userProfile.bio || 'No bio yet'}</Typography>
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
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                value={editProfile.email}
                                                onChange={(e) => handleProfileInputChange('email', e.target.value)}
                                                sx={styles.input}
                                            />
                                        ) : (
                                            <Typography sx={styles.value}>{userProfile.email}</Typography>
                                        )}
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
                                                        achievement.rarity === 'Rare' ? '#dbeafe' : '#fef3c7',
                                                    color: achievement.rarity === 'Rare' ? '#1e40af' : '#92400e',
                                                }}
                                            >
                                                {achievement.rarity}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Button sx={styles.viewAllButton}>View All Achievements</Button>
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