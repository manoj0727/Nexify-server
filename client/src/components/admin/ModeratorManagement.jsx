import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getModeratorsAction,
  getCommunitiesAction,
  createModeratorAction,
  deleteModeratorAction,
  addModeratorAction,
  removeModeratorAction,
} from "../../redux/actions/adminActions";
import * as api from "../../redux/api/adminAPI";

const ModeratorManagement = () => {
  const dispatch = useDispatch();
  const moderators = useSelector((state) => state.admin?.moderators);
  const communities = useSelector((state) => state.admin?.communities);

  useEffect(() => {
    dispatch(getModeratorsAction());
    dispatch(getCommunitiesAction());
  }, [dispatch]);

  const [selectedModerator, setSelectedModerator] = useState(null);
  const [moderatorCommunities, setModeratorCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");
  const [selectedCommunityForAssignment, setSelectedCommunityForAssignment] = useState("");

  const handleModeratorSelect = async (moderator) => {
    setSelectedModerator(moderator);
    setIsLoading(true);
    
    try {
      // Fetch communities where this moderator is assigned
      const modCommunities = [];
      
      for (const community of communities) {
        const { data } = await api.getCommunity(community._id);
        if (data && data.moderators && data.moderators.some(mod => mod._id === moderator._id)) {
          modCommunities.push(community);
        }
      }
      
      setModeratorCommunities(modCommunities);
    } catch (error) {
      console.error("Error fetching moderator communities:", error);
    }
    
    setIsLoading(false);
  };

  const handleCreateModerator = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setIsLoading(true);

    try {
      // Create moderator with special @nexify.mod domain
      const moderatorData = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
      };

      await dispatch(createModeratorAction(moderatorData));
      
      setCreateSuccess(`Moderator created successfully! Email: ${formData.username}@nexify.mod`);
      setFormData({ name: "", username: "", password: "" });
      
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess("");
      }, 2000);

    } catch (error) {
      setCreateError("Error creating moderator: " + error.message);
    }

    setIsLoading(false);
  };

  const handleAssignToCommunity = async () => {
    if (!selectedCommunityForAssignment || !selectedModerator) return;
    
    setAssignError("");
    setAssignSuccess("");
    setIsLoading(true);

    try {
      await dispatch(addModeratorAction(selectedCommunityForAssignment, selectedModerator._id));
      setAssignSuccess(`${selectedModerator.name} assigned to community successfully!`);
      setSelectedCommunityForAssignment("");
      
      // Refresh moderator communities
      await handleModeratorSelect(selectedModerator);
      
      setTimeout(() => {
        setAssignSuccess("");
      }, 3000);
    } catch (error) {
      setAssignError("Error assigning moderator: " + error.message);
    }
    
    setIsLoading(false);
  };

  const handleRemoveFromCommunity = async (community) => {
    if (!selectedModerator) return;
    
    setAssignError("");
    setAssignSuccess("");
    setIsLoading(true);

    try {
      await dispatch(removeModeratorAction(community._id, selectedModerator._id));
      setAssignSuccess(`${selectedModerator.name} removed from ${community.name} successfully!`);
      
      // Refresh moderator communities
      await handleModeratorSelect(selectedModerator);
      
      setTimeout(() => {
        setAssignSuccess("");
      }, 3000);
    } catch (error) {
      setAssignError("Error removing moderator: " + error.message);
    }
    
    setIsLoading(false);
  };

  const handleDeleteModerator = async () => {
    if (!selectedModerator) return;
    
    const isConfirmed = window.confirm(
      `Are you sure you want to permanently delete moderator "${selectedModerator.name}"? This will remove them from all communities and delete their account.`
    );
    
    if (!isConfirmed) return;
    
    setAssignError("");
    setAssignSuccess("");
    setIsLoading(true);

    try {
      await dispatch(deleteModeratorAction(selectedModerator._id));
      setAssignSuccess(`Moderator ${selectedModerator.name} deleted successfully!`);
      setSelectedModerator(null);
      setModeratorCommunities([]);
      
      setTimeout(() => {
        setAssignSuccess("");
      }, 3000);
    } catch (error) {
      setAssignError("Error deleting moderator: " + error.message);
    }
    
    setIsLoading(false);
  };


  if (!moderators) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-2 h-[85vh] w-full mt-3 border rounded-md">
      {/* Left column - Moderators list */}
      <div className="flex flex-col w-full bg-white shadow-inner rounded-md border-r">
        <div className="flex justify-between items-center p-4 border-b-2">
          <h1 className="text-lg font-bold text-center">Moderators</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Add New
          </button>
        </div>
        <div className="flex flex-col overflow-y-auto">
          {moderators.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No moderators found. Create one to get started.
            </div>
          ) : (
            moderators.map((moderator) => (
              <div
                key={moderator._id}
                className={`p-4 cursor-pointer hover:bg-background border-b flex flex-col ${
                  selectedModerator?._id === moderator._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleModeratorSelect(moderator)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-red-600">
                    {moderator.name}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    MOD
                  </span>
                </div>
                <span className="text-sm text-gray-500">{moderator.email}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right column - Moderator details */}
      <div className="flex flex-col w-full bg-white rounded-md px-5 py-5 border-l">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="admin-loader"></span>
          </div>
        ) : selectedModerator ? (
          <>
            <div className="border-b border-black pb-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-red-600">{selectedModerator.name}</h1>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    MOD
                  </span>
                </div>
                <button
                  onClick={handleDeleteModerator}
                  disabled={isLoading}
                  className={`bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Delete Moderator
                </button>
              </div>
              <p className="text-sm text-gray-600">{selectedModerator.email}</p>
            </div>

            {(assignSuccess || assignError) && (
              <div className={`p-2 mb-4 rounded ${assignSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {assignSuccess || assignError}
              </div>
            )}

            <div className="mb-4">
              <h2 className="font-medium mb-2">Role</h2>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Moderator
              </span>
            </div>

            <div className="mb-4">
              <h2 className="font-medium mb-2">Assigned Communities</h2>
              {moderatorCommunities.length === 0 ? (
                <p className="text-gray-500">
                  This moderator is not assigned to any communities yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {moderatorCommunities.map((community) => (
                    <div
                      key={community._id}
                      className="border rounded p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={community.banner}
                          alt={community.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium">{community.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCommunity(community)}
                        disabled={isLoading}
                        className={`bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded border">
              <h3 className="font-medium mb-3 text-sm">Assign to New Community</h3>
              <div className="flex gap-2">
                <select
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  value={selectedCommunityForAssignment}
                  onChange={(e) => setSelectedCommunityForAssignment(e.target.value)}
                >
                  <option value="">Select a community</option>
                  {communities?.filter(community => 
                    !moderatorCommunities.some(modCom => modCom._id === community._id)
                  ).map((community) => (
                    <option key={community._id} value={community._id}>
                      {community.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignToCommunity}
                  disabled={!selectedCommunityForAssignment || isLoading}
                  className={`bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 ${
                    !selectedCommunityForAssignment || isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Assign
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-medium text-gray-400">
              Select a moderator to view details
            </span>
          </div>
        )}
      </div>

      {/* Create Moderator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Moderator</h2>
            
            {createError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {createError}
              </div>
            )}
            
            {createSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateModerator}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Username (@nexify.mod)
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    className="flex-1 p-2 border rounded-l"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="moderator"
                  />
                  <span className="bg-gray-100 border border-l-0 rounded-r px-3 py-2 text-sm text-gray-600">
                    @nexify.mod
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email will be: {formData.username}@nexify.mod
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                <p className="text-xs text-green-700">
                  <strong>Note:</strong> Moderators are created instantly without email verification. 
                  They can login immediately after creation.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: "", username: "", password: "" });
                    setCreateError("");
                    setCreateSuccess("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorManagement;