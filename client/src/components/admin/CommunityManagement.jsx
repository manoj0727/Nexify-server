import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunitiesAction,
  getModeratorsAction,
  addModeratorAction,
  removeModeratorAction,
  getCommunityAction,
  createCommunityAction,
  updateCommunityAction,
  deleteCommunityAction,
} from "../../redux/actions/adminActions";

const CommunityManagement = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const moderators = useSelector((state) => state.admin?.moderators);
  const community = useSelector((state) => state.admin?.community);

  useEffect(() => {
    dispatch(getCommunitiesAction());
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCommunityData, setSelectedCommunityData] = useState(null);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [newModerator, setNewModerator] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingCommunity, setIsChangingCommunity] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: "",
  });

  const handleCommunitySelect = async (community) => {
    setSelectedCommunity(community);
    setIsChangingCommunity(true);
    await dispatch(getCommunityAction(community._id));
    setIsChangingCommunity(false);
  };

  useEffect(() => {
    setSelectedCommunityData(community);
  }, [community]);

  const handleModeratorSelect = (moderator) => {
    setSelectedModerator(moderator);
  };

  const handleRemoveModerator = async (moderator) => {
    setIsUpdating(true);
    await dispatch(
      removeModeratorAction(selectedCommunityData._id, moderator._id)
    );
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setIsUpdating(false);
  };

  const handleAddModerator = async () => {
    setIsUpdating(true);
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setNewModerator("");
    setIsUpdating(false);
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await dispatch(createCommunityAction(formData));
    setShowCreateModal(false);
    setFormData({ name: "", description: "", banner: "" });
    setIsUpdating(false);
  };

  const handleEditCommunity = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await dispatch(updateCommunityAction(selectedCommunityData._id, formData));
    await dispatch(getCommunityAction(selectedCommunityData._id));
    setShowEditModal(false);
    setIsUpdating(false);
  };

  const handleDeleteCommunity = async () => {
    if (window.confirm("Are you sure you want to delete this community?")) {
      setIsUpdating(true);
      await dispatch(deleteCommunityAction(selectedCommunityData._id));
      setSelectedCommunity(null);
      setSelectedCommunityData(null);
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setFormData({
      name: selectedCommunityData.name,
      description: selectedCommunityData.description,
      banner: selectedCommunityData.banner || "",
    });
    setShowEditModal(true);
  };

  if (!communities || !moderators) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:h-[85vh] w-full mt-3 border rounded-md">
      {/* Left column - Communities List */}
      <div className={`flex flex-col lg:w-1/3 bg-white shadow-inner rounded-md lg:border-r ${selectedCommunityData && 'hidden lg:flex'}`}>
        <div className="flex justify-between items-center p-3 sm:p-4 border-b-2">
          <h1 className="text-base sm:text-lg font-bold text-center">Communities</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-2 py-1 sm:px-3 rounded hover:bg-blue-600 text-xs sm:text-sm"
          >
            Add New
          </button>
        </div>
        <div className="flex flex-col overflow-y-auto max-h-[60vh] lg:max-h-full">
          {communities.map((community) => (
            <div
              key={community._id}
              className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 border-b flex items-center ${
                selectedCommunity?._id === community._id ? "bg-gray-200" : ""
              }`}
              onClick={() => handleCommunitySelect(community)}
            >
              <img
                src={community.banner}
                alt={community.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-4 object-cover"
              />
              <span className="text-gray-700 text-sm sm:text-base truncate">
                {community.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column - Community Details */}
      <div className={`flex flex-col flex-1 bg-white rounded-md px-3 py-3 sm:px-5 sm:py-5 lg:border-l ${!selectedCommunityData && 'hidden lg:flex'}`}>
        {isChangingCommunity ? (
          <div className="flex justify-center items-center h-screen">
            <span className="admin-loader"></span>
          </div>
        ) : selectedCommunityData ? (
          <>
            {/* Mobile back button */}
            <button
              onClick={() => {
                setSelectedCommunity(null);
                setSelectedCommunityData(null);
              }}
              className="lg:hidden mb-3 text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              ← Back to Communities
            </button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-black pb-1 mb-2">
              <h1 className="font-bold text-base sm:text-lg">
                {selectedCommunityData.name}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={openEditModal}
                  className="bg-yellow-500 text-white px-2 py-1 sm:px-3 rounded hover:bg-yellow-600 text-xs sm:text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteCommunity}
                  disabled={isUpdating}
                  className={`bg-red-500 text-white px-2 py-1 sm:px-3 rounded hover:bg-red-600 text-xs sm:text-sm ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>

            {isUpdating && (
              <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
                Updating...
              </div>
            )}
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              {selectedCommunityData.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:gap-4 text-xs sm:text-sm mb-4">
              <span>
                <strong>Moderators:</strong> {selectedCommunityData.moderatorCount}
              </span>
              <span>
                <strong>Members:</strong> {selectedCommunityData.memberCount}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 mt-4">
              {/* Moderators list */}
              <div className="flex flex-col gap-2 w-full lg:w-1/2">
                <h2 className="font-medium text-sm sm:text-base mb-2">Moderators</h2>
                {selectedCommunityData.moderators?.length === 0 && (
                  <span className="text-sm text-gray-500">No moderators</span>
                )}
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                  {selectedCommunityData.moderators?.map((moderator) => (
                    <div
                      key={moderator._id}
                      className="p-2 border flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center rounded"
                    >
                      <span className="font-medium text-sm">{moderator.name}</span>
                      <button
                        disabled={isUpdating}
                        className={`bg-red-500 px-3 py-1 text-xs sm:text-sm text-white rounded hover:bg-red-700 ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveModerator(moderator);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add moderator form */}
              <div className="flex flex-col w-full gap-2 lg:w-1/2">
                <h2 className="font-medium text-sm sm:text-base mb-2">Add Moderator</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-2.5"
                    value={newModerator}
                    onChange={(e) => setNewModerator(e.target.value)}
                  >
                    <option value="">Select a moderator</option>
                    {moderators?.map((moderator) => (
                      <option key={moderator._id} value={moderator._id}>
                        {moderator.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                    }
                    className={`px-3 py-2 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-700 whitespace-nowrap ${
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleAddModerator}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-medium text-gray-400">
              Select a community to view details
            </span>
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Community</h2>
            <form onSubmit={handleCreateCommunity}>
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
                  Description
                </label>
                <textarea
                  required
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Banner URL (Optional)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.banner}
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: "", description: "", banner: "" });
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Community Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Community</h2>
            <form onSubmit={handleEditCommunity}>
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
                  Description
                </label>
                <textarea
                  required
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Banner URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.banner}
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagement;