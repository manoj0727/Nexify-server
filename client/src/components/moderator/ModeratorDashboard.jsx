import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiPin, FiLock, FiEdit3, FiCheck, FiX, FiAlertTriangle, FiVolume2, FiUserX } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import axios from "axios";

const ModeratorDashboard = ({ communityId }) => {
  const [activeTab, setActiveTab] = useState("queue");
  const [moderationQueue, setModerationQueue] = useState([]);
  const [moderatorActions, setModerationActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  const user = useSelector((state) => state.auth?.userData);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (activeTab === "queue") {
      fetchModerationQueue();
    } else if (activeTab === "actions") {
      fetchModerationActions();
    }
  }, [activeTab, communityId]);

  const fetchModerationQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/moderator/community/${communityId}/queue`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setModerationQueue(response.data.posts);
    } catch (error) {
      console.error("Error fetching moderation queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModerationActions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/moderator/community/${communityId}/actions`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setModerationActions(response.data.actions);
    } catch (error) {
      console.error("Error fetching moderation actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePinPost = async (postId) => {
    try {
      await axios.post(
        `${apiUrl}/moderator/posts/${postId}/pin`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error pinning post:", error);
    }
  };

  const handleUnpinPost = async (postId) => {
    try {
      await axios.delete(
        `${apiUrl}/moderator/posts/${postId}/pin`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error unpinning post:", error);
    }
  };

  const handleLockPost = async (postId, reason = "") => {
    try {
      await axios.post(
        `${apiUrl}/moderator/posts/${postId}/lock`,
        { reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error locking post:", error);
    }
  };

  const handleUnlockPost = async (postId) => {
    try {
      await axios.delete(
        `${apiUrl}/moderator/posts/${postId}/lock`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error unlocking post:", error);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await axios.patch(
        `${apiUrl}/moderator/posts/${postId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleRejectPost = async (postId, reason = "") => {
    try {
      await axios.patch(
        `${apiUrl}/moderator/posts/${postId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  const handleEditTitle = async (postId, newTitle) => {
    try {
      await axios.patch(
        `${apiUrl}/moderator/posts/${postId}/title`,
        { newTitle },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchModerationQueue();
    } catch (error) {
      console.error("Error editing title:", error);
    }
  };

  const PostCard = ({ post }) => {
    const [showActions, setShowActions] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(post.content);

    return (
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{post.user.name}</span>
              {post.isPinned && (
                <FiPin className="text-blue-500" title="Pinned" />
              )}
              {post.isLocked && (
                <FiLock className="text-red-500" title="Locked" />
              )}
            </div>
            
            {editTitle ? (
              <div className="mb-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      handleEditTitle(post._id, newTitle);
                      setEditTitle(false);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditTitle(false);
                      setNewTitle(post.content);
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 mb-2">{post.content}</p>
            )}
            
            {post.fileUrl && (
              <div className="mb-2">
                {post.fileType?.startsWith('image') ? (
                  <img src={post.fileUrl} alt="Post content" className="max-w-xs rounded" />
                ) : (
                  <a href={post.fileUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    View attachment
                  </a>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Status: {post.moderationStatus}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {showActions ? <BsEyeSlash /> : <BsEye />}
          </button>
        </div>
        
        {showActions && (
          <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t">
            <button
              onClick={() => post.isPinned ? handleUnpinPost(post._id) : handlePinPost(post._id)}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                post.isPinned 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiPin />
              {post.isPinned ? 'Unpin' : 'Pin'}
            </button>
            
            <button
              onClick={() => post.isLocked ? handleUnlockPost(post._id) : handleLockPost(post._id)}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                post.isLocked
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiLock />
              {post.isLocked ? 'Unlock' : 'Lock'}
            </button>
            
            <button
              onClick={() => setEditTitle(!editTitle)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm"
            >
              <FiEdit3 />
              Edit Title
            </button>
            
            {post.moderationStatus === 'pending' && (
              <>
                <button
                  onClick={() => handleApprovePost(post._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-sm"
                >
                  <FiCheck />
                  Approve
                </button>
                
                <button
                  onClick={() => handleRejectPost(post._id, 'Inappropriate content')}
                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm"
                >
                  <FiX />
                  Reject
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const ActionLog = ({ action }) => {
    const getActionIcon = (actionType) => {
      switch (actionType) {
        case 'pin_post': return <FiPin className="text-blue-500" />;
        case 'lock_post': return <FiLock className="text-red-500" />;
        case 'warn_user': return <FiAlertTriangle className="text-yellow-500" />;
        case 'mute_user': return <FiVolume2 className="text-orange-500" />;
        case 'temp_ban': return <FiUserX className="text-red-600" />;
        case 'approve_post': return <FiCheck className="text-green-500" />;
        case 'reject_post': return <FiX className="text-red-500" />;
        default: return <FiEdit3 className="text-gray-500" />;
      }
    };

    return (
      <div className="flex items-start gap-3 p-3 border-b last:border-b-0">
        <div className="flex-shrink-0">
          {getActionIcon(action.action)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={action.moderator.avatar}
              alt={action.moderator.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-medium text-sm">{action.moderator.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(action.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            {action.action.replace('_', ' ')} - {action.reason}
          </p>
          {action.details && (
            <div className="text-xs text-gray-500 mt-1">
              {action.details.originalValue && (
                <div>From: "{action.details.originalValue}"</div>
              )}
              {action.details.newValue && (
                <div>To: "{action.details.newValue}"</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!user || user.role !== 'moderator') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        You don't have permission to access this dashboard.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "queue"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Moderation Queue ({moderationQueue.length})
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "actions"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Action Log
          </button>
        </nav>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "queue" && (
              <div>
                {moderationQueue.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No posts in moderation queue
                  </div>
                ) : (
                  moderationQueue.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                )}
              </div>
            )}

            {activeTab === "actions" && (
              <div>
                {moderatorActions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No moderation actions yet
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg">
                    {moderatorActions.map((action) => (
                      <ActionLog key={action._id} action={action} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;