import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      
      // Check if password needs to be changed
      if (!response.user.is_password_changed) {
        navigate('/reset-password', { state: { user: response.user } });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Login failed. Please check your credentials.'
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

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Infinity },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.15, duration: 0.6 },
    }),
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Lively Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-10 right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Campus Hire Tracker
            </h1>
            <p className="text-xl text-white/90 font-light">
              Streamlined Hiring & Training Management
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-6">
          {[
            {
              icon: '📊',
              title: 'Track Hiring Progress',
              desc: 'Real-time monitoring of candidates and batches',
            },
            {
              icon: '🎓',
              title: 'Manage Training Phases',
              desc: 'Pre-onboarding, bootcamp, and post-onboarding',
            },
            {
              icon: '👥',
              title: 'Batch Coordination',
              desc: 'Assign and track candidates across batches',
            },
            {
              icon: '📈',
              title: 'Performance Analytics',
              desc: 'Comprehensive insights and reporting',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              custom={idx}
              className="flex items-start space-x-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                className="text-4xl flex-shrink-0"
              >
                {feature.icon}
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/20"
        >
          {[
            { number: '500+', label: 'Candidates' },
            { number: '50+', label: 'Batches' },
            { number: '100%', label: 'Uptime' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
                className="text-2xl font-bold text-white"
              >
                {stat.number}
              </motion.p>
              <p className="text-white/70 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 flex items-center justify-center p-6"
      >
        <motion.div variants={itemVariants} className="w-full max-w-md">
          {/* Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-2xl p-8 border border-primary-100"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🎓
              </motion.div>
              <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
              <p className="text-neutral-600 text-sm mt-2">
                Sign in to your account
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@ust.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-all bg-primary-50 focus:bg-white"
                  required
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-all bg-primary-50 focus:bg-white"
                  required
                />
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
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-neutral-200"
            >
              <p className="text-xs text-neutral-600 text-center">
                Secure hiring and training management system
              </p>
              <div className="flex justify-center gap-4 mt-4">
                {['🔐', '🌍', '⚡'].map((icon, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    className="text-2xl"
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Help Text */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-neutral-500 mt-6"
          >
            Contact your administrator if you need assistance
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
