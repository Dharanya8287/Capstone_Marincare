# Location Feature User Guide

## Overview

WaveGuard now uses live location verification to ensure that cleanup activities are logged at the correct locations. This guide explains how the location feature works and what you need to know.

---

## 🎯 Why We Need Your Location

### Data Accuracy
Location verification ensures that:
- ✅ Trash is logged to the correct challenge location
- ✅ You're actually at the cleanup site when participating
- ✅ Our data accurately reflects real-world impact
- ✅ Challenges remain meaningful and localized

### When Location is Required

Your browser will request location permission when you:
1. **Join a Challenge** - Must be within 5 km of the challenge location
2. **Upload Trash Photo** - Must be at the challenge location
3. **Log Manual Cleanup** - Must be at the challenge location

---

## 📱 How to Enable Location Access

### On Mobile (iOS/Android)

#### Chrome/Safari
1. When prompted, tap **"Allow"** to share your location
2. If you accidentally denied permission:
   - **iOS**: Settings → Safari → Location → Allow
   - **Android**: Settings → Apps → Chrome → Permissions → Location → Allow

#### Location Must Be Enabled
- Make sure your device's location services are turned on
- For best accuracy, enable **High Accuracy** mode (uses GPS)

### On Desktop

#### Chrome
1. Click the **🔒** icon in the address bar
2. Find "Location" and set it to **"Allow"**
3. Refresh the page if needed

#### Firefox
1. Click the **🔒** icon in the address bar
2. Click **"×"** next to "Blocked Temporarily"
3. Allow location access when prompted again

#### Edge
1. Click the **🔒** icon in the address bar
2. Click **"Site permissions"**
3. Set Location to **"Allow"**

---

## ✅ What Happens When You Grant Permission

1. **One-Time Request**: We only ask when you join a challenge or upload trash
2. **Quick Validation**: Your location is checked against the challenge location
3. **Privacy Protected**: Location is NOT stored or tracked
4. **Instant Feedback**: You'll know immediately if you're in range

### Success Example
```
✓ Location verified (2.3 km from challenge)
✓ Successfully joined the challenge!
```

### Out of Range Example
```
✗ You are 8.5 km from the challenge location (max allowed: 5 km)
```

---

## ❌ What If You Deny Permission?

If you deny location access:
- ❌ Cannot join challenges
- ❌ Cannot upload trash photos
- ❌ Cannot log manual cleanups

**To fix this:**
1. Follow the steps above to enable location in your browser
2. Refresh the page
3. Try again - you'll be prompted for permission

---

## 🔒 Privacy & Security

### What We Collect
- ✅ **Only when needed**: Location is requested only for join/upload actions
- ✅ **Not stored**: Location is validated and discarded immediately
- ✅ **No tracking**: We don't track your movements or location history

### What We DON'T Do
- ❌ Store your location coordinates
- ❌ Share your location with third parties
- ❌ Track you continuously
- ❌ Use location for marketing

### How It Works
```
Your Device → Browser Gets GPS → Sends to WaveGuard → 
Validates Distance → Discards Location → Shows Result
```

---

## 🛠️ Troubleshooting

### "Location permission denied"
**Fix:** Enable location access in your browser settings (see above)

### "Location information is unavailable"
**Possible causes:**
- Device GPS is turned off
- Poor GPS signal (try moving outdoors)
- Browser doesn't support geolocation

**Fix:** 
1. Enable location services on your device
2. Try refreshing the page
3. Move to an area with better GPS signal

### "Location request timed out"
**Possible causes:**
- Weak GPS signal
- Device taking too long to get location

**Fix:**
1. Make sure you're outdoors or near a window
2. Wait a moment and try again
3. Restart your browser if the issue persists

### "You are too far from the challenge location"
**This is expected behavior!**
- You must be within 5 km of the challenge location
- This ensures you're actually at the cleanup site
- Try a different challenge closer to you

---

## 💡 Tips for Best Experience

### For Accurate Location
1. **Enable High Accuracy Mode** on mobile devices
2. **Allow location permission** when prompted
3. **Be outdoors** for better GPS signal
4. **Wait a few seconds** for GPS to lock

### For Faster Processing
1. Grant location permission on first use
2. Stay at the challenge location while uploading
3. Have a stable internet connection

### For Privacy
- Location is only used for verification
- You can revoke permission anytime in browser settings
- No location data is stored in your profile

---

## 🧪 For Developers & Testers

If you're a developer or tester, you can bypass location verification:

### Option 1: Testing Mode (Global Bypass)
Add to backend `.env`:
```
TESTING_MODE=true
```

### Option 2: Email Whitelist (Specific Users)
Add your email to bypass list in backend `.env`:
```
TESTING_MODE=false
TESTING_BYPASS_EMAILS=dev@waveguard.com,tester@example.com
```

### Option 3: Disable Location Verification
Add to backend `.env`:
```
LOCATION_VERIFICATION_ENABLED=false
```

**Note:** These options are for development only and should NOT be used in production.

---

## ❓ Frequently Asked Questions

### Q: Why do you need my exact location?
**A:** We calculate the distance between you and the challenge location to ensure data accuracy. We only verify you're within 5 km - we don't need or store your exact coordinates.

### Q: Can I fake my location?
**A:** While technically possible with developer tools, it defeats the purpose of the app which is to create real environmental impact. Please help us keep our data accurate!

### Q: What if I'm at the location but get rejected?
**A:** This could happen if:
- GPS accuracy is poor (try moving outdoors)
- You're at the edge of the 5 km radius
- The challenge location coordinates are slightly off

If you believe you're at the correct location, please contact support.

### Q: Does this drain my battery?
**A:** No. We only request location once per action (join/upload), not continuously. This has minimal battery impact.

### Q: Is this feature required?
**A:** Yes, for participating in challenges. Location verification is essential to ensure the integrity of our cleanup data and create real environmental impact.

---

## 🆘 Still Having Issues?

If you're experiencing problems with location features:

1. **Check Browser Compatibility**: Use Chrome, Firefox, Safari, or Edge (latest versions)
2. **Check Device Settings**: Ensure location services are enabled
3. **Check Network**: Stable internet connection required
4. **Clear Browser Cache**: Sometimes helps resolve permission issues
5. **Contact Support**: Reach out to the development team with details

---

## 📚 Additional Resources

- [Browser Geolocation API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [WaveGuard API Documentation](./API_DOCUMENTATION.md)
- [Location Feature Technical Analysis](./LOCATION_FEATURE_ANALYSIS.md)

---

**Last Updated:** November 2024  
**Version:** 1.0.0
