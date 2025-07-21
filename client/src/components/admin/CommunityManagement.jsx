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
    <div className="flex gap-2 h-[85vh] w-full mt-3 border rounded-md">
      {/* Left column */}
      <div className="flex flex-col w-full bg-white shadow-inner rounded-md border-r">
        <div className="flex justify-between items-center p-4 border-b-2">
          <h1 className="text-lg font-bold text-center">Communities</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Add New
          </button>
        </div>
        <div className="flex flex-col overflow-y-auto">
          {communities.map((community) => (
            <div
              key={community._id}
              className={`p-4 cursor-pointer hover:bg-background border-b flex items-center ${
                selectedCommunity?._id === community._id ? "bg-gray-200" : ""
              }`}
              onClick={() => handleCommunitySelect(community)}
            >
              <img
                src={community.banner}
                alt={community.name}
                className="w-10 h-10 rounded-full mr-2 md:mr-4"
              />
              <span className="text-gray-700 text-xs md:text-base">
                {community.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col w-full bg-white rounded-md px-5 py-5 border-l">
        {isChangingCommunity ? (
          <div className="flex justify-center items-center h-screen">
            <span className="admin-loader"></span>
          </div>
        ) : selectedCommunityData ? (
          <>
            <div className="flex justify-between items-start border-b border-black pb-1 mb-2">
              <h1 className="font-bold text-lg">
                {selectedCommunityData.name}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={openEditModal}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteCommunity}
                  disabled={isUpdating}
                  className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm ${
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
            <p className="text-sm text-gray-600 mb-2">
              {selectedCommunityData.description}
            </p>
            <span className="text-sm">
              Total Moderators: {selectedCommunityData.moderatorCount}
            </span>
            <span className="text-sm">
              Total Members: {selectedCommunityData.memberCount}
            </span>

            <div className="flex flex-col md:flex-row gap-5 mt-4">
              {/* Moderators list */}
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <h2 className="font-medium mb-2">Moderators</h2>
                {selectedCommunityData.moderators?.length === 0 && (
                  <span>No moderators</span>
                )}
                <div className="flex flex-col">
                  {selectedCommunityData.moderators?.map((moderator) => (
                    <div
                      key={moderator._id}
                      className={`p-2 cursor-pointer border flex flex-col md:flex-row gap-2 justify-between items-center rounded ${
                        selectedModerator?._id === moderator._id ? "" : ""
                      }`}
                      onClick={() => handleModeratorSelect(moderator)}
                    >
                      <span className="font-medium">{moderator.name}</span>
                      <button
                        disabled={isUpdating}
                        className={` bg-red-500 px-4 py-1 text-sm  text-white rounded hover:bg-red-700 ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleRemoveModerator(moderator)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add moderator form */}
              <div className="flex flex-col w-full gap-2 md:w-1/2">
                <h2 className="font-medium mb-2">Add Moderator</h2>
                <div className="flex flex-col gap-2 md:flex-row">
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                    className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-700 ${
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