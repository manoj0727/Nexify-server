import { memo } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import VerifiedBadge from "../shared/VerifiedBadge";
const PublicProfileCard = ({ user }) => {
  const followingSince = new Date(user.followingSince).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      to={`/user/${user._id}`}
      className="bg-white border rounded-md w-full px-4 py-4 cursor-pointer shadow-2xl shadow-[#f2f5fc]"
    >
      <div className="flex gap-3">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <div className="flex items-center gap-1">
            <h2 className={`font-bold text-base ${
              user.role === "moderator" ? "text-red-600" : ""
            }`}>
              {user.name}
            </h2>
            {user.isVerified && <VerifiedBadge size="sm" />}
            {user.role === "moderator" && (
              <span className="ml-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                MOD
              </span>
            )}
          </div>
          <p className="flex items-center gap-2">
            <CiLocationOn className="text-lg" />
            {user.location || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-semibold text-gray-500">Following Since</p>
        <p>{followingSince}</p>
      </div>
    </Link>
  );
};

export default memo(PublicProfileCard);
