import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = ({ onClose }) => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.profile?.address?.street || '',
      city: user?.profile?.address?.city || '',
      state: user?.profile?.address?.state || '',
      zipCode: user?.profile?.address?.zipCode || '',
      country: user?.profile?.address?.country || 'India'
    },
    preferences: {
      dietaryRestrictions: user?.profile?.preferences?.dietaryRestrictions || [],
      spiceLevel: user?.profile?.preferences?.spiceLevel || 'Medium'
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePreferenceChange = (type, value) => {
    if (type === 'dietaryRestrictions') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          dietaryRestrictions: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [type]: value
        }
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setSuccessMessage('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Password change failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'None'];
  const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="profile-header">
          <h2>User Profile</h2>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-content">
            {!isEditing ? (
              <div className="profile-info">
                <div className="info-group">
                  <label>Name:</label>
                  <span>{user?.name}</span>
                </div>
                <div className="info-group">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="info-group">
                  <label>Phone:</label>
                  <span>{user?.phone}</span>
                </div>
                <div className="info-group">
                  <label>Role:</label>
                  <span className="role-badge">{user?.role}</span>
                </div>
                <div className="info-group">
                  <label>Loyalty Points:</label>
                  <span>{user?.profile?.loyaltyPoints || 0}</span>
                </div>
                <div className="info-group">
                  <label>Loyalty Tier:</label>
                  <span className="tier-badge">{user?.profile?.loyaltyTier || 'New'}</span>
                </div>
                
                {user?.profile?.address && (
                  <div className="address-section">
                    <h4>Address</h4>
                    <p>{user.profile.fullAddress}</p>
                  </div>
                )}
                
                {user?.profile?.preferences && (
                  <div className="preferences-section">
                    <h4>Preferences</h4>
                    <p><strong>Spice Level:</strong> {user.profile.preferences.spiceLevel}</p>
                    {user.profile.preferences.dietaryRestrictions?.length > 0 && (
                      <p><strong>Dietary Restrictions:</strong> {user.profile.preferences.dietaryRestrictions.join(', ')}</p>
                    )}
                  </div>
                )}
                
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Spice Level Preference</label>
                  <select
                    value={formData.preferences.spiceLevel}
                    onChange={(e) => handlePreferenceChange('spiceLevel', e.target.value)}
                  >
                    {spiceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Dietary Restrictions</label>
                  <select
                    multiple
                    value={formData.preferences.dietaryRestrictions}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      handlePreferenceChange('dietaryRestrictions', selected);
                    }}
                  >
                    {dietaryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <small>Hold Ctrl/Cmd to select multiple</small>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-content">
            {!isChangingPassword ? (
              <div className="security-info">
                <p>Keep your account secure by regularly updating your password.</p>
                <button 
                  className="change-password-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={errors.currentPassword ? 'error' : ''}
                  />
                  {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={errors.newPassword ? 'error' : ''}
                  />
                  {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="profile-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
