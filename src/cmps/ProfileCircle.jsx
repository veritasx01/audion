import { useState, useEffect } from 'react';
import { userService } from '../services/user/user.service.js';
import profileImageFallback from '../assets/images/profile-image-fallback.webp';

export function ProfileCircle() {
  const [defaultUser, setDefaultUser] = useState(null);

  useEffect(() => {
    async function loadDefaultUser() {
      try {
        const user = await userService.getDefaultUser();
        setDefaultUser(user);
      } catch (error) {
        console.error('Failed to load default user:', error);
      }
    }
    loadDefaultUser();
  }, []);

  return (
    <button className="profile-button">
      <img
        src={defaultUser?.profileImg || profileImageFallback}
        alt="User profile"
        className="profile-image"
        title={defaultUser?.fullName || 'Profile'}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    </button>
  );
}
