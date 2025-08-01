import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TrustedDevicesLocations from "../components/profile/TrustedDevicesLocations";
import PrimaryDevicesLocations from "../components/profile/PrimaryDevicesLocations";
import BlockedDevicesLocations from "../components/profile/BlockedDevicesLocations";
import CommonLoading from "../components/loader/CommonLoading";

import {
  getTrustedContextAuthDataAction,
  getUserPreferencesAction,
  getBlockedAuthContextDataAction,
  getContextAuthDataAction,
} from "../redux/actions/authActions";

const DevicesLocations = () => {
  const dispatch = useDispatch();
  const [dateFetched, setDateFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserPreferencesAction());
      await dispatch(getContextAuthDataAction());
      await dispatch(getTrustedContextAuthDataAction());
      await dispatch(getBlockedAuthContextDataAction());
    };
    fetchData().then(() => setDateFetched(true));
  }, [dispatch, dateFetched]);

  const userPreferences = useSelector((state) => state.auth?.userPreferences);
  const contextAuthData = useSelector((state) => state.auth?.contextAuthData);
  const trustedAuthContextData = useSelector(
    (state) => state.auth?.trustedAuthContextData
  );
  const blockedContextAuthData = useSelector(
    (state) => state.auth?.blockedAuthContextData
  );

  if (!dateFetched) {
    return (
      <div className="col-span-2 flex items-center justify-center h-screen">
        <CommonLoading />
      </div>
    );
  }

  if (!userPreferences || (userPreferences && !userPreferences.enableContextBasedAuth)) {
    return (
      <div className="bg-white border p-5 text-gray-700 text-center main-section">
        <p className="text-lg font-semibold mb-4">
          Context-based authentication is currently disabled for your account.
        </p>
        <p className="text-sm mb-6">
          By enabling context-based authentication, you will gain control over
          your devices, their locations, and manage trusted and blocked devices.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh to Enable
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Context-based authentication has been enabled for your account. Click refresh to see your devices and locations.
        </p>
      </div>
    );
  }

  return (
    <div className="main-section border bg-white">
      <PrimaryDevicesLocations contextAuthData={contextAuthData} />

      <TrustedDevicesLocations
        trustedAuthContextData={trustedAuthContextData}
      />
      <BlockedDevicesLocations
        blockedContextAuthData={blockedContextAuthData}
      />
    </div>
  );
};

export default DevicesLocations;
