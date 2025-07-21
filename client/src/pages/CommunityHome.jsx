import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import CommonLoading from "../components/loader/CommonLoading";
import CommunityRightbar from "../components/community/Rightbar";
import CommunityMainSection from "../components/community/MainSection";

const CommunityHome = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();

  const { joinedCommunities } = useSelector((state) => state.community || {});
  const isAuthorized = joinedCommunities?.some(
    ({ name }) => name === communityName
  );

  useEffect(() => {
    if (!isAuthorized && joinedCommunities?.length > 0) {
      navigate("/access-denied");
    }
  }, [isAuthorized, joinedCommunities, navigate, communityName]);

  if (!joinedCommunities) {
    return (
      <div className="col-span-3 flex h-screen items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
        <CommunityMainSection />
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5 lg:sticky lg:top-20">
          <CommunityRightbar />
        </div>
      </div>
    </div>
  );
};

export default CommunityHome;
