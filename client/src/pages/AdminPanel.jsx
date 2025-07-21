import { useState, useEffect } from "react";
import MobileResponsiveTab from "../components/admin/MobileResponsiveTab";
import Logs from "../components/admin/Logs";
import Settings from "../components/admin/Settings";
import CommunityManagement from "../components/admin/CommunityManagement";
import ModeratorManagement from "../components/admin/ModeratorManagement";
import UserVerification from "../components/admin/UserVerification";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/adminActions";
import { useNavigate } from "react-router-dom";
const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("logs");
  const adminPanelError = useSelector((state) => state.admin?.adminPanelError);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (adminPanelError === "Unauthorized") {
      dispatch(logoutAction()).then(() => {
        navigate("/admin/signin");
      });
    }
  }, [adminPanelError, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <MobileResponsiveTab activeTab={activeTab} handleTabClick={handleTabClick} />
        
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {activeTab === "logs" && <Logs />}
          {activeTab === "settings" && <Settings />}
          {activeTab === "Community Management" && <CommunityManagement />}
          {activeTab === "Moderator Management" && <ModeratorManagement />}
          {activeTab === "User Verification" && <UserVerification />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
