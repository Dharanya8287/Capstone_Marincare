# Profile Picture Upload - Quick Start Guide

## Overview
This feature allows users to upload and update their profile picture on the WaveGuard profile page.

## Features at a Glance
🎨 **Camera icon overlay** on avatar for easy access
📁 **File validation**: Images only, max 5MB
⏳ **Loading feedback**: Spinner during upload
✅ **Success/Error alerts**: Auto-dismiss notifications
🔒 **Secure storage**: GridFS in MongoDB
🚀 **Fast & responsive**: Immediate preview after upload

## User Flow
1. Navigate to `/profile` page
2. Click the camera icon on the profile picture
3. Select an image from your device
4. Wait for upload (shows spinner)
5. See success message and new profile picture

## For Developers

### Backend Endpoints
```
POST /api/profile/upload-image
- Requires: Firebase authentication token
- Accepts: multipart/form-data with 'image' field
- Returns: { profileImage: "/api/images/{id}", message: "..." }
- Validation: 5MB max, images only

GET /api/images/:id
- Serves images from GridFS
- No authentication required (public images)
- Returns: Image binary data
```

### Frontend Components
- **Location**: `frontend/src/app/(protected)/profile/page.jsx`
- **Styling**: `frontend/src/app/(protected)/profile/profile.styles.js`
- **State Management**: React hooks (useState, useRef)
- **API Client**: Uses `apiCall` utility with FormData support

### Key Dependencies
- **Backend**: multer (file upload), GridFS (storage)
- **Frontend**: Material-UI (components), axios (HTTP)

### File Structure
```
backend/
  src/
    controllers/
      profileController.js    # uploadProfileImage function
      imageController.js      # getImage function (new)
    routes/
      profileRoutes.js       # /upload-image endpoint
      imageRoutes.js         # /images/:id endpoint (new)
    services/
      imageService.js        # uploadImage function (existing)

frontend/
  src/
    app/(protected)/profile/
      page.jsx              # Profile page with upload UI
      profile.styles.js     # Styling for avatar upload button
```

## Testing Locally

### Backend
```bash
cd backend
npm install
npm run dev  # Starts on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Starts on port 3000
```

### Test Cases
1. **Happy Path**: Upload a valid JPG/PNG under 5MB ✅
2. **File Type**: Try uploading a PDF or TXT ❌ (should show error)
3. **File Size**: Try uploading >5MB image ❌ (should show error)
4. **Loading State**: Verify spinner shows during upload ✅
5. **Error Handling**: Disconnect network and try upload ❌ (should show error)

## Error Messages
- "Please select an image file" - Invalid file type
- "File size must be less than 5MB" - File too large
- "Failed to upload profile picture. Please try again." - Upload error

## Future Enhancements (Optional)
- [ ] Add image cropping before upload
- [ ] Support drag-and-drop upload
- [ ] Add profile picture removal option
- [ ] Image compression on client-side before upload
- [ ] Multiple image formats preview
- [ ] Upload progress bar (for large files)

## Troubleshooting

**Upload not working?**
- Verify MongoDB connection is active
- Check Firebase authentication token is valid
- Ensure GridFS bucket is initialized
- Check browser console for errors

**Image not displaying?**
- Verify `/api/images/:id` endpoint is accessible
- Check image was saved to GridFS (check MongoDB)
- Verify CORS settings allow image requests

## Documentation
- **Full Documentation**: See `PROFILE_ENHANCEMENTS.md`
- **Security Analysis**: See `SECURITY_SUMMARY.md`
- **API Reference**: See `API_DOCUMENTATION.md`

---

**Questions?** Contact the development team or check the documentation files.
