import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { BiLogOut, BiMenu, BiX } from "react-icons/bi";
import { BsPeople, BsWindowStack } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdManageAccounts, MdVerified } from "react-icons/md";

const MobileResponsiveTab = ({ activeTab, handleTabClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction()).then(() => {
      navigate("/admin/signin");
    });
    setLoggingOut(false);
  };

  const tabs = [
    { id: "logs", label: "Logs", icon: <BsWindowStack className="mr-1.5" /> },
    { id: "settings", label: "Settings", icon: <IoSettingsOutline className="mr-1.5" /> },
    { id: "Community Management", label: "Communities", icon: <BsPeople className="mr-1.5" /> },
    { id: "Moderator Management", label: "Moderators", icon: <MdManageAccounts className="mr-1.5" /> },
    { id: "User Verification", label: "Verification", icon: <MdVerified className="mr-1.5" /> },
  ];

  const handleTabSelection = (tabId) => {
    handleTabClick(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden border-b border-gray-200 sticky top-0 left-0 z-30 bg-white">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-40 border-b">
            <div className="py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelection(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              <div className="border-t mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                  disabled={loggingOut}
                >
                  <BiLogOut className="mr-1.5" />
                  {loggingOut ? (
                    <ButtonLoadingSpinner loadingText={"Logging out..."} />
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Tab Display */}
        <div className="px-4 pb-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Current:</span>
            <span className="ml-2 text-blue-600 font-semibold">
              {tabs.find(t => t.id === activeTab)?.label || activeTab}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-b border-gray-200 sticky top-0 left-0 z-30 bg-white rounded-md">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          {tabs.map((tab) => (
            <li key={tab.id} className="mr-2 flex items-center">
              <span
                className={`cursor-pointer inline-flex items-center px-4 py-3 border-b-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 bg-primary rounded-md text-white"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </span>
            </li>
          ))}
          <li className="mr-2 flex items-center ml-auto">
            <span
              className={`cursor-pointer inline-flex items-center px-4 py-3 border-b-2 rounded-t-md transition-colors ${
                activeTab === "logout"
                  ? "border-blue-500 bg-primary rounded-md text-white"
                  : "border-transparent hover:text-red-600 hover:border-red-600"
              }`}
              onClick={handleLogout}
            >
              <BiLogOut className="mr-1.5" />
              {loggingOut ? (
                <ButtonLoadingSpinner loadingText={"Logging out..."} />
              ) : (
                "Logout"
              )}
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileResponsiveTab;