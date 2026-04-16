import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/api';
import { StatCard, Card, Button } from '../../components/ui';
import { RoleWorkspaceShell } from '../../components/RoleWorkspaceShell';
import type { User } from '../../types';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    ust_employee_id: '',
    role: 'Program Manager',
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUsers();
      setUsers(response || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.ust_employee_id ||
      !formData.role
    ) {
      setError('All fields are required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.createUser(
        formData.full_name,
        formData.email,
        formData.ust_employee_id,
        formData.role
      );

      if (response) {
        setSuccess(
          `User created successfully! Temporary password: ${response.temporary_password}`
        );
        setTempPassword(response.temporary_password);
        setSelectedUser(response.user);
        setFormData({
          full_name: '',
          email: '',
          ust_employee_id: '',
          role: 'Program Manager',
        });

        // Refresh users list
        await fetchUsers();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setIsLoading(true);
      await apiClient.deleteUser(userId);
      setSuccess('User deleted successfully');
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopiedId(selectedUser ? selectedUser.id.toString() : null);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendEmail = async () => {
    if (!selectedUser) return;

    try {
      await apiClient.sendUserCredentials(selectedUser.id.toString(), tempPassword);
      setSuccess('Credentials sent to user email');
    } catch (err) {
      setError('Failed to send email');
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

  const content = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-neutral-900">👥 User Management</h1>
        <p className="text-neutral-600">Create and manage users in the system</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard
          label="Total Users"
          value={users.length.toString()}
          icon="👥"
          color="primary"
        />
        <StatCard
          label="Active Users"
          value={users.filter((u) => u.is_password_changed).length.toString()}
          icon="✓"
          color="green"
        />
        <StatCard
          label="New Users"
          value={users.filter((u) => !u.is_password_changed).length.toString()}
          icon="🆕"
          color="accent"
        />
      </motion.div>

      {/* Messages */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700"
        >
          {success}
        </motion.div>
      )}

      {/* Create User Form */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">
              {showForm ? '➕ Create New User' : 'Create New User'}
            </h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? 'secondary' : 'primary'}
            >
              {showForm ? 'Cancel' : '+ Add User'}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none bg-white focus:bg-primary-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@ust.com"
                    className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none bg-white focus:bg-primary-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    UST ID
                  </label>
                  <input
                    type="text"
                    value={formData.ust_employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, ust_employee_id: e.target.value })
                    }
                    placeholder="UST001234"
                    className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none bg-white focus:bg-primary-50"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none bg-white focus:bg-primary-50"
                  >
                    <option value="Program Manager">Program Manager</option>
                    <option value="Batch Owner">Batch Owner</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </motion.div>

      {/* Password Display Modal */}
      {selectedUser && tempPassword && (
        <motion.div
          variants={itemVariants}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedUser(null);
            setTempPassword('');
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              User Created Successfully! 🎉
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Email</p>
                <p className="font-mono bg-neutral-100 p-2 rounded border border-neutral-300">
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Temporary Password</p>
                <div className="flex gap-2 items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={tempPassword}
                    readOnly
                    className="flex-1 font-mono bg-neutral-100 p-2 rounded border border-neutral-300"
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    variant="secondary"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyPassword}
                  variant="primary"
                  className="flex-1"
                >
                  {copiedId === selectedUser.id.toString() ? '✓ Copied!' : '📋 Copy'}
                </Button>
                <Button
                  onClick={handleSendEmail}
                  variant="secondary"
                  className="flex-1"
                >
                  📧 Send Email
                </Button>
              </div>
            </div>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setTempPassword('');
              }}
              variant="secondary"
              className="w-full mt-4"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Users List */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900">Users List</h2>
            <p className="text-sm text-neutral-600">
              {users.length} user{users.length !== 1 ? 's' : ''} in total
            </p>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
                />
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">
              No users yet. Create your first user to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                      UST ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {user.ust_employee_id}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_password_changed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {user.is_password_changed ? 'Active' : 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Button
                          onClick={() => handleDeleteUser(user.id.toString())}
                          variant="secondary"
                          className="text-xs"
                        >
                          Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <RoleWorkspaceShell
      title="User Management"
      description="Create platform users, share temporary credentials, and keep role assignments organized in one place."
    >
      {content}
    </RoleWorkspaceShell>
  );
}
