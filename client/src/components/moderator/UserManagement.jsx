import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiAlertTriangle, FiVolume2, FiUserX, FiSearch, FiEye, FiShield } from "react-icons/fi";
import axios from "axios";
import VerifiedBadge from "../shared/VerifiedBadge";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'warn', 'mute', 'ban', 'verify'
  const [loading, setLoading] = useState(false);
  
  const user = useSelector((state) => state.auth?.userData);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    reason: "",
    severity: "medium",
    duration: 60, // minutes for mute, hours for ban
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWarnUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/moderator/users/${selectedUser._id}/warn`,
        {
          reason: formData.reason,
          severity: formData.severity
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error warning user:", error);
    }
  };

  const handleMuteUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/moderator/users/${selectedUser._id}/mute`,
        {
          duration: formData.duration,
          reason: formData.reason
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error muting user:", error);
    }
  };

  const handleUnmuteUser = async (userId) => {
    try {
      await axios.delete(`${apiUrl}/moderator/users/${userId}/mute`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Error unmuting user:", error);
    }
  };

  const handleTempBanUser = async () => {
    try {
      await axios.post(
        `${apiUrl}/moderator/users/${selectedUser._id}/tempban`,
        {
          duration: formData.duration,
          reason: formData.reason
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error temp banning user:", error);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await axios.post(
        `${apiUrl}/moderator/users/${userId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const handleUnverifyUser = async (userId) => {
    try {
      await axios.delete(
        `${apiUrl}/moderator/users/${userId}/verify`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error removing verification:", error);
    }
  };

  const openModal = (type, selectedUser) => {
    setModalType(type);
    setSelectedUser(selectedUser);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType("");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      reason: "",
      severity: "medium",
      duration: modalType === 'mute' ? 60 : 24,
    });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStatusBadge = (user) => {
    const badges = [];
    
    if (user.isMuted) {
      badges.push(
        <span key="muted" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <FiVolume2 className="mr-1" />
          Muted
        </span>
      );
    }
    
    if (user.isTempBanned) {
      badges.push(
        <span key="banned" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FiUserX className="mr-1" />
          Temp Banned
        </span>
      );
    }
    
    if (user.isVerified) {
      badges.push(
        <span key="verified" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FiShield className="mr-1" />
          Verified
        </span>
      );
    }
    
    if (user.warnings && user.warnings.length > 0) {
      badges.push(
        <span key="warnings" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FiAlertTriangle className="mr-1" />
          {user.warnings.length} Warning{user.warnings.length > 1 ? 's' : ''}
        </span>
      );
    }
    
    return badges;
  };

  const UserCard = ({ user: targetUser }) => (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${targetUser.role === 'moderator' ? 'text-red-600' : ''}`}>
                {targetUser.name}
              </h3>
              {targetUser.isVerified && <VerifiedBadge size="sm" />}
              {targetUser.role === 'moderator' && (
                <span className="ml-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                  MOD
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{targetUser.email}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {getUserStatusBadge(targetUser)}
            </div>
            <div className="text-xs text-gray-500">
              <p>Joined: {new Date(targetUser.createdAt).toLocaleDateString()}</p>
              <p>Role: {targetUser.role}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => openModal('warn', targetUser)}
            className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-sm"
            disabled={targetUser.role === 'moderator' || targetUser.role === 'admin'}
          >
            <FiAlertTriangle />
            Warn
          </button>
          
          {targetUser.isMuted ? (
            <button
              onClick={() => handleUnmuteUser(targetUser._id)}
              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-sm"
            >
              <FiVolume2 />
              Unmute
            </button>
          ) : (
            <button
              onClick={() => openModal('mute', targetUser)}
              className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded text-sm"
              disabled={targetUser.role === 'moderator' || targetUser.role === 'admin'}
            >
              <FiVolume2 />
              Mute
            </button>
          )}
          
          <button
            onClick={() => openModal('ban', targetUser)}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm"
            disabled={targetUser.role === 'moderator' || targetUser.role === 'admin' || targetUser.isTempBanned}
          >
            <FiUserX />
            Temp Ban
          </button>
          
          {targetUser.isVerified ? (
            <button
              onClick={() => handleUnverifyUser(targetUser._id)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm"
            >
              <FiShield />
              Unverify
            </button>
          ) : (
            <button
              onClick={() => handleVerifyUser(targetUser._id)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm"
            >
              <FiShield />
              Verify
            </button>
          )}
        </div>
      </div>
      
      {targetUser.warnings && targetUser.warnings.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Recent Warnings:</h4>
          <div className="space-y-1">
            {targetUser.warnings.slice(-3).map((warning, index) => (
              <div key={index} className="text-xs bg-yellow-50 p-2 rounded">
                <p className="font-medium">{warning.reason}</p>
                <p className="text-gray-500">
                  {new Date(warning.issuedAt).toLocaleDateString()} - Severity: {warning.severity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!user || user.role !== 'moderator') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        You don't have permission to access user management.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              filteredUsers.map((targetUser) => (
                <UserCard key={targetUser._id} user={targetUser} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {modalType === 'warn' && 'Warn User'}
              {modalType === 'mute' && 'Mute User'}
              {modalType === 'ban' && 'Temporarily Ban User'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Explain the reason for this action..."
                  required
                />
              </div>
              
              {modalType === 'warn' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              )}
              
              {(modalType === 'mute' || modalType === 'ban') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration ({modalType === 'mute' ? 'minutes' : 'hours'})
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max={modalType === 'mute' ? 10080 : 8760} // max 1 week for mute, 1 year for ban
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {modalType === 'mute' 
                      ? `User will be muted for ${formData.duration} minutes`
                      : `User will be banned for ${formData.duration} hours`
                    }
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modalType === 'warn') handleWarnUser();
                  else if (modalType === 'mute') handleMuteUser();
                  else if (modalType === 'ban') handleTempBanUser();
                }}
                className={`px-4 py-2 text-white rounded-lg ${
                  modalType === 'warn' ? 'bg-yellow-500 hover:bg-yellow-600' :
                  modalType === 'mute' ? 'bg-orange-500 hover:bg-orange-600' :
                  'bg-red-500 hover:bg-red-600'
                }`}
                disabled={!formData.reason.trim()}
              >
                {modalType === 'warn' && 'Issue Warning'}
                {modalType === 'mute' && 'Mute User'}
                {modalType === 'ban' && 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;