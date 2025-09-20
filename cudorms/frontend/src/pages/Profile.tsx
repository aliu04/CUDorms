import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { updateProfile, changePassword, logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    year: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        year: user.year || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error as string
      }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      dispatch(addNotification({
        type: 'error',
        message: 'New passwords do not match'
      }));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      dispatch(addNotification({
        type: 'error',
        message: 'New password must be at least 6 characters long'
      }));
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: 'Password changed successfully!'
      }));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error as string
      }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({
      type: 'info',
      message: 'Logged out successfully'
    }));
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>@{user.username}</p>
            <p className="user-email">{user.email}</p>
            <p className="user-role">{user.role}</p>
          </div>

          <div className="profile-nav">
            <button
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button
              className={activeTab === 'password' ? 'active' : ''}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="year">Academic Year</label>
                  <select
                    id="year"
                    name="year"
                    value={profileData.year}
                    onChange={handleProfileChange}
                    disabled={isLoading}
                  >
                    <option value="">Select your year</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="graduate">Graduate</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="avatar">Avatar URL (Optional)</label>
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    value={profileData.avatar}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/avatar.jpg"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-section">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current
                      })}
                    >
                      {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new
                      })}
                    >
                      {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm
                      })}
                    >
                      {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
