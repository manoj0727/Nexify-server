import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeaveModal from "../modals/LeaveModal";
import { getCommunityAction } from "../../redux/actions/communityActions";
import placeholder from "../../assets/placeholder.png";
import CommonLoading from "../loader/CommonLoading";

import {
  useBannerLoading,
  useIsModeratorUpdated,
} from "../../hooks/useCommunityData";
import { HiUserGroup, HiCheckCircle } from "react-icons/hi2";

const Rightbar = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const dispatch = useDispatch();
  const { communityName } = useParams();

  const toggleLeaveModal = useCallback(() => {
    setShowLeaveModal((prevState) => !prevState);
  }, []);

  useEffect(() => {
    dispatch(getCommunityAction(communityName));
  }, [dispatch, communityName]);

  const communityData = useSelector((state) => state.community?.communityData);

  const isModeratorOfThisCommunity = useSelector(
    (state) => state.auth?.isModeratorOfThisCommunity
  );

  const { name, description, members, rules, banner } = useMemo(
    () => communityData || {},
    [communityData]
  );

  const bannerLoaded = useBannerLoading(banner);
  const isModeratorUpdated = useIsModeratorUpdated(isModeratorOfThisCommunity);

  if (!communityData) {
    return (
      <div className="flex justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md sticky top-20 h-[85vh] p-5 border overflow-y-auto">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">{name}</h2>
        <div className="flex items-center gap-2 text-primary mb-4">
          <HiUserGroup />
          <span className="mr-2">
            {members?.length || 0}{" "}
            {members?.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      {bannerLoaded ? (
        <img
          src={banner}
          alt="community banner"
          className="w-full h-40 rounded-md object-cover mb-4"
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />
      ) : (
        <img
          src={placeholder}
          alt="community banner placeholder"
          className="w-full h-40 rounded-md object-cover mb-4"
        />
      )}

      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Action Buttons */}
      <div className="mb-4">
        {isModeratorOfThisCommunity && (
          <Link
            to={`/community/${communityName}/moderator`}
            className="px-4 bg-primary text-white shadow-md text-sm py-2 rounded-md flex justify-center items-center w-full mb-3 hover:bg-primary-600"
          >
            Moderation Panel
          </Link>
        )}

        {isModeratorUpdated && !isModeratorOfThisCommunity && (
          <button
            onClick={toggleLeaveModal}
            className="px-4 shadow-md text-sm py-2 border border-red-400 hover:text-white hover:bg-red-400 text-red-400 rounded-md flex justify-center items-center w-full"
          >
            Leave Community
          </button>
        )}
      </div>

      {/* Community Guidelines */}
      <div className="text-slate-900 border-t pt-4 mt-4">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Community Guidelines</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No hate speech or discrimination</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No sexually explicit content</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No posting personal information about others without their consent</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No spam or fraudulent content</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No threatening or harassing language</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No promotion of illegal activities</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No posting of copyrighted material without permission</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No graphic violence or gore</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No spreading false or misleading information</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <HiCheckCircle className="flex-shrink-0 text-primary text-lg mt-0.5" />
              <span className="text-gray-700 leading-relaxed">No encouraging self-harm or suicide</span>
            </li>
          </ul>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          Please follow these guidelines to maintain a positive community environment.
        </p>
      </div>

      {/* Custom Community Rules */}
      {rules && rules.length > 0 && (
        <div className="text-slate-900 border-t pt-4 mt-4">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Additional Community Rules</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <ul className="flex flex-col gap-3">
              {rules.map((rule) => (
                <li key={rule._id} className="flex items-start gap-3 text-sm">
                  <HiCheckCircle className="flex-shrink-0 text-blue-600 text-lg mt-0.5" />
                  <span className="text-gray-700 leading-relaxed">{rule.rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <LeaveModal
        show={showLeaveModal}
        toggle={toggleLeaveModal}
        communityName={communityName}
      />
    </div>
  );
};

export default Rightbar;
