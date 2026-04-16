import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export function PasswordReset() {
  const navigate = useNavigate();
  const { changePassword, updateAuthToken, user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get password strength
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(newPassword);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (strength < 3) {
      setError('Password is too weak. Include uppercase, numbers, and symbols.');
      return;
    }

    setIsLoading(true);

    try {
      // Call the change password endpoint
      if (!user?.email) {
        throw new Error('User session not found');
      }

      const response = await changePassword(user.email, currentPassword, newPassword);

      if (response) {
        setSuccess(true);
        // Update the token if a new one is returned
        if (response.access_token) {
          updateAuthToken(response.access_token);
        }
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.message === 'User session not found'
          ? err.message
          :
        err.response?.data?.detail ||
        'Failed to change password. Please check your current password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      {/* Animated Background */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 right-10 w-60 h-60 bg-primary-200/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-10 left-10 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🔐
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900">Set Your Password</h1>
          <p className="text-neutral-600 mt-2">
            This is your first login. Please set a secure password to continue.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100"
        >
          {success ? (
            // Success Message
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1 }}
                className="text-6xl mb-4"
              >
                ✓
              </motion.div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
              <p className="text-neutral-600">
                Your password has been updated successfully.
              </p>
              <p className="text-sm text-neutral-500 mt-4">
                Redirecting to dashboard...
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto mt-4"
              />
            </motion.div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Temporary/Current Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-all bg-white focus:bg-primary-50"
                  required
                />
              </motion.div>

              {/* New Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  New Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-all bg-white focus:bg-primary-50"
                  required
                />
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: idx < strength ? 1 : 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className={`h-2 flex-1 rounded-full ${
                            idx < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                          }`}
                          style={{ transformOrigin: 'left' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600">
                      {strength === 0 && 'Too weak'}
                      {strength === 1 && 'Weak'}
                      {strength === 2 && 'Fair'}
                      {strength === 3 && 'Good'}
                      {strength === 4 && 'Strong'}
                    </p>
                  </motion.div>
                )}

                <p className="text-xs text-neutral-500 mt-2">
                  At least 8 characters with uppercase, numbers, and symbols
                </p>
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-all bg-white focus:bg-primary-50"
                  required
                />
                {newPassword && confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs mt-2 ${
                      newPassword === confirmPassword
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </motion.p>
                )}
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  variants={itemVariants}
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  isLoading ||
                  !currentPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword ||
                  strength < 3
                }
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Updating Password...
                  </>
                ) : (
                  <>
                    Update Password
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          variants={itemVariants}
          className="mt-6 p-4 rounded-lg bg-primary-50 border border-primary-100"
        >
          <p className="text-sm text-primary-900">
            <span className="font-semibold">💡 Tip:</span> Use a combination of uppercase letters, numbers, and symbols for a strong password.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
