import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getModProfileAction } from "../../redux/actions/authActions";
import CommonLoading from "../loader/CommonLoading";
import VerifiedBadge from "../shared/VerifiedBadge";

const ModeratorProfile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getModProfileAction());
  }, [dispatch]);

  const moderator = useSelector((state) => state.moderation?.modProfile);
  if (!moderator)
    return (
      <div className="flex justify-center items-center">
        <CommonLoading />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 items-center ">
      <img
        src={moderator.avatar}
        alt="user"
        className="w-20 h-20 rounded-full object-cover"
      />
      <div className="flex items-center gap-2">
        <span className="font-bold text-red-600">{moderator.name}</span>
        {moderator.isVerified && <VerifiedBadge size="md" />}
        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
          MOD
        </span>
      </div>

      <p>{moderator.email}</p>
      <p>Joined: {moderator.createdAt}</p>
    </div>
  );
};

export default ModeratorProfile;
