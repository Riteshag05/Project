import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  // Fetch user data
  const { isLoading, error } = useQuery('userData', fetchUserData, {
    // Skip query if we already have user data from context
    enabled: !user,
    onSuccess: (data) => {
      console.log('User data fetched:', data);
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-red-600">
            <p>Error loading user data. Please try again.</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${isAdmin ? 'bg-purple-100' : 'bg-blue-100'}`}>
              {isAdmin ? (
                <Shield className="h-8 w-8 text-purple-600" />
              ) : (
                <User className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome, {user?.username}!</h2>
              <p className="text-gray-600">User ID: {user?.id}</p>
              <p className={`text-sm font-medium ${isAdmin ? 'text-purple-600' : 'text-blue-600'}`}>
                Role: {user?.role}
              </p>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium">Your Account Information</h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.role}</dd>
              </div>
            </dl>
          </div>
          
          {isAdmin && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-purple-600">Admin Panel</h3>
              <p className="mt-2 text-gray-600">
                As an admin, you have access to additional features and controls.
              </p>
              <div className="mt-4 bg-purple-50 p-4 rounded-md">
                <p className="text-purple-700">
                  You can access the admin-only endpoint at:
                </p>
                <code className="mt-2 block bg-gray-800 text-white p-2 rounded text-sm">
                  GET /auth/admin
                </code>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;