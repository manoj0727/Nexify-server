import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiCheck, FiX } from "react-icons/fi";
import axios from "axios";
import VerifiedBadge from "../shared/VerifiedBadge";
import { useSelector } from "react-redux";

const UserVerification = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, verified, unverified

  const apiUrl = process.env.REACT_APP_API_URL;
  const adminData = useSelector((state) => state.admin?.adminData);
  const adminToken = adminData?.token;
  
  // Debug logging
  console.log("Admin data:", adminData);
  console.log("Admin token:", adminToken);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      
      // Temporary: use test endpoint to show users without auth
      const response = await axios.get(`${apiUrl}/test-users`);
      console.log("Users response:", response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleVerifyUser = async (userId) => {
    try {
      // Temporary: use test endpoint
      await axios.post(`${apiUrl}/test-verify/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const handleUnverifyUser = async (userId) => {
    try {
      // Temporary: create unverify endpoint
      await axios.post(`${apiUrl}/test-unverify/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error removing verification:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" ||
                         (filter === "verified" && user.isVerified) ||
                         (filter === "unverified" && !user.isVerified);
    
    return matchesSearch && matchesFilter;
  });

  const UserCard = ({ user }) => (
    <div className="bg-white border rounded-lg p-3 sm:p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-base sm:text-lg ${user.role === 'moderator' ? 'text-red-600' : ''}`}>
                {user.name}
              </h3>
              {user.isVerified && <VerifiedBadge size="sm" />}
              {user.role === 'moderator' && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  MOD
                </span>
              )}
              {user.role === 'admin' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{user.email}</p>
            <div className="text-xs text-gray-500">
              <p>Role: {user.role}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              {user.verifiedBy && (
                <p>Verified by: Moderator</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          {user.isVerified ? (
            <button
              onClick={() => handleUnverifyUser(user._id)}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs sm:text-sm transition-colors"
            >
              <FiX />
              Remove Verification
            </button>
          ) : (
            <button
              onClick={() => handleVerifyUser(user._id)}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs sm:text-sm transition-colors"
              disabled={user.role === 'admin'}
            >
              <FiCheck />
              Verify User
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Temporarily disabled admin token check
  // if (!adminToken) {
  //   return (
  //     <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
  //       <p>Please sign in as admin to access user verification.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Verification</h2>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex flex-col p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="w-full">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900">Statistics</h3>
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    {users.filter(u => u.isVerified).length}
                  </span>
                  <p className="text-xs sm:text-sm text-blue-700">Verified Users</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-600">
                    {users.filter(u => !u.isVerified).length}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700">Unverified Users</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {users.length}
                  </span>
                  <p className="text-xs sm:text-sm text-green-700">Total Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No users found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                {filteredUsers.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerification;