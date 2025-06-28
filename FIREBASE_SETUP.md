# Firebase Setup for Rangmanch Creators

This guide will help you set up Firebase for the Rangmanch Creators app.

## 🔥 Firebase Configuration

The Firebase configuration has been set up with your project credentials:
- **Project ID**: `rangmanch-95e7d`
- **Auth Domain**: `rangmanch-95e7d.firebaseapp.com`

## 📁 Files Created

1. **`src/firebase/firebase.js`** - Main Firebase configuration
2. **`src/firebase/auth.js`** - Authentication functions
3. **`src/firebase/auth.ts`** - TypeScript version of auth functions
4. **`src/firebase/firestore.js`** - Firestore database functions
5. **`src/examples/creatorUsage.js`** - Usage examples
6. **`firestore.rules`** - Security rules for Firestore

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd rangmanch_creators
npm install
```

Firebase has been added to your `package.json` dependencies.

### 2. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `rangmanch-95e7d`
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password authentication
   - Enable Google authentication (optional)

4. Set up Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Copy the security rules from `firestore.rules` to the Rules tab

### 3. Database Structure

The following collections will be created automatically:

```
/users/{uid}
├── email: string
├── role: "brand" | "creator"
├── displayName: string
├── createdAt: timestamp
└── uid: string

/creators/{creatorId}
├── name: string
├── niche: string
├── bio: string
├── socials: object
├── categories: array
├── location: string
├── followers: object
├── createdAt: timestamp
└── updatedAt: timestamp

/brands/{brandId}
├── name: string
├── description: string
├── website: string
├── socials: object
├── category: string
├── createdAt: timestamp
└── updatedAt: timestamp

/collaborations/{collabId}
├── brandId: string
├── creatorId: string
├── proposal: string
├── budget: number
├── timeline: string
├── requirements: string
├── status: "pending" | "accepted" | "rejected"
├── createdAt: timestamp
└── updatedAt: timestamp
```

## 🎯 Usage Examples

### Creator Signup

```javascript
import { signUp } from './src/firebase/auth';
import { createOrUpdateCreatorProfile } from './src/firebase/firestore';

const handleCreatorSignup = async (email, password, creatorName, niche) => {
  try {
    // Sign up with creator role
    const { user, role } = await signUp(email, password, 'creator', creatorName);
    
    // Create creator profile
    await createOrUpdateCreatorProfile(user.uid, {
      name: creatorName,
      niche: niche,
      bio: 'Creator bio',
      socials: {
        instagram: '@creatorname',
        youtube: '@creatorname'
      }
    });
    
    console.log('Creator account created successfully!');
  } catch (error) {
    console.error('Error creating creator account:', error);
  }
};
```

### Discover Brands

```javascript
import { getAllBrands } from './src/firebase/firestore';

const fetchBrands = async () => {
  try {
    const brands = await getAllBrands();
    console.log('Available brands:', brands);
    return brands;
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
};
```

### Send Collaboration Request

```javascript
import { createCollaboration } from './src/firebase/firestore';
import { getCurrentUser } from './src/firebase/auth';

const sendCollaborationRequest = async (brandId, proposal) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const collaboration = await createCollaboration({
      brandId: brandId,
      creatorId: currentUser.uid,
      proposal: proposal,
      budget: 1000,
      timeline: '2 weeks',
      requirements: 'Create 3 Instagram posts'
    });
    
    console.log('Collaboration request sent!', collaboration);
  } catch (error) {
    console.error('Error sending collaboration request:', error);
  }
};
```

## 🔒 Security Features

- **Role-based Access**: Users can only access data based on their role
- **Authentication Required**: All database operations require authentication
- **Data Isolation**: Creators can only modify their own profiles
- **Collaboration Security**: Users can only see collaborations they're involved in

## 🚨 Important Notes

1. **Shared Backend**: This Firebase project will be shared with the Rangmanch Brands app
2. **Role Assignment**: Users must select a role during signup
3. **Profile Creation**: Creator profiles are created automatically after signup
4. **Security Rules**: Copy the security rules to your Firebase console

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase not initialized"**: Make sure you've imported the Firebase config
2. **"Permission denied"**: Check that security rules are properly set
3. **"User not found"**: Ensure the user document exists in Firestore

### Debug Mode

Enable Firebase debug mode in your browser console:

```javascript
localStorage.setItem('debug', 'firebase:*');
```

## 📞 Support

If you encounter any issues, check:
1. Firebase Console for error logs
2. Browser console for JavaScript errors
3. Network tab for failed requests

---

**Next Steps**: Set up the same Firebase configuration in your `Rangmanch_brands` project to complete the shared backend setup. 