import * as api from "../api/adminAPI";
import * as types from "../constants/adminConstants";

export const initializeAdminAuth = () => async (dispatch) => {
  const adminData = localStorage.getItem("admin");
  if (adminData) {
    const parsed = JSON.parse(adminData);
    if (parsed?.accessToken) {
      dispatch({
        type: types.SIGN_IN_SUCCESS,
        payload: parsed
      });
    }
  }
};

export const signInAction = (credential) => async (dispatch) => {
  try {
    const { error, data } = await api.signIn(credential);
    if (error) {
      throw new Error(error);
    }
    localStorage.setItem("admin", JSON.stringify(data));
    dispatch({
      type: types.SIGN_IN_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.SIGN_IN_FAIL,
      payload: error.message,
    });
  }
};

export const logoutAction = () => async (dispatch) => {
  try {
    localStorage.removeItem("admin");
    dispatch({
      type: types.LOGOUT_SUCCESS,
    });
  } catch (error) {}
};

export const getLogsAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getLogs();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_LOGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_LOGS_FAIL,
      payload: error.message,
    });
  }
};

export const deleteLogsAction = () => async (dispatch) => {
  try {
    const { error } = await api.deleteLogs();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.DELETE_LOGS_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_LOGS_FAIL,
      payload: error.message,
    });
  }
};

export const getServicePreferencesAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getServicePreferences();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_SERVICE_PREFERENCES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_SERVICE_PREFERENCES_FAIL,
      payload: error.message,
    });
  }
};

export const updateServicePreferencesAction =
  (preferences) => async (dispatch) => {
    try {
      const { error } = await api.updateServicePreferences(preferences);
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.UPDATE_SERVICE_PREFERENCES_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: types.UPDATE_SERVICE_PREFERENCES_FAIL,
        payload: error.message,
      });
    }
  };

export const getCommunitiesAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunities();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_COMMUNITIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_COMMUNITIES_FAIL,
      payload: error.message,
    });
  }
};

export const getCommunityAction = (communityId) => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunity(communityId);
    if (error) {
      throw new Error(error);
    }

    dispatch({
      type: types.GET_COMMUNITY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_COMMUNITY_FAIL,
      payload: error.message,
    });
  }
};

export const getModeratorsAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getModerators();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_MODERATORS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_MODERATORS_FAIL,
      payload: error.message,
    });
  }
};

export const addModeratorAction =
  (communityId, moderatorId) => async (dispatch) => {
    try {
      const { error } = await api.addModerator(communityId, moderatorId);
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.ADD_MODERATOR_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: types.ADD_MODERATOR_FAIL,
        payload: error.message,
      });
    }
  };

export const removeModeratorAction =
  (communityId, moderatorId) => async (dispatch) => {
    try {
      const { error } = await api.removeModerator(communityId, moderatorId);
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.REMOVE_MODERATOR_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: types.REMOVE_MODERATOR_FAIL,
        payload: error.message,
      });
    }
  };

export const createCommunityAction = (communityData) => async (dispatch) => {
  try {
    const { error, data } = await api.createCommunity(communityData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.CREATE_COMMUNITY_SUCCESS,
      payload: data,
    });
    // Refresh communities list
    dispatch(getCommunitiesAction());
  } catch (error) {
    dispatch({
      type: types.CREATE_COMMUNITY_FAIL,
      payload: error.message,
    });
  }
};

export const updateCommunityAction = (communityId, communityData) => async (dispatch) => {
  try {
    const { error, data } = await api.updateCommunity(communityId, communityData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.UPDATE_COMMUNITY_SUCCESS,
      payload: data,
    });
    // Refresh communities list
    dispatch(getCommunitiesAction());
  } catch (error) {
    dispatch({
      type: types.UPDATE_COMMUNITY_FAIL,
      payload: error.message,
    });
  }
};

export const deleteCommunityAction = (communityId) => async (dispatch) => {
  try {
    const { error } = await api.deleteCommunity(communityId);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.DELETE_COMMUNITY_SUCCESS,
    });
    // Refresh communities list
    dispatch(getCommunitiesAction());
  } catch (error) {
    dispatch({
      type: types.DELETE_COMMUNITY_FAIL,
      payload: error.message,
    });
  }
};

export const createModeratorAction = (moderatorData) => async (dispatch) => {
  try {
    const { error, data } = await api.createModerator(moderatorData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.CREATE_MODERATOR_SUCCESS,
      payload: data,
    });
    // Refresh moderators list
    dispatch(getModeratorsAction());
  } catch (error) {
    dispatch({
      type: types.CREATE_MODERATOR_FAIL,
      payload: error.message,
    });
  }
};

export const deleteModeratorAction = (moderatorId) => async (dispatch) => {
  try {
    const { error } = await api.deleteModerator(moderatorId);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.DELETE_MODERATOR_SUCCESS,
    });
    // Refresh moderators list
    dispatch(getModeratorsAction());
  } catch (error) {
    dispatch({
      type: types.DELETE_MODERATOR_FAIL,
      payload: error.message,
    });
  }
};
