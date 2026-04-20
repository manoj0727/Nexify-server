import { memo } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMapPin, HiOutlineCalendar } from "react-icons/hi2";
import VerifiedBadge from "../shared/VerifiedBadge";

const PublicProfileCard = ({ user }) => {
  const followingSince = user.followingSince
    ? new Date(user.followingSince).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const isMod = user.role === "moderator";

  return (
    <Link
      to={`/user/${user._id}`}
      className="nx-card nx-card-hover block w-full p-4"
    >
      <div className="flex min-w-0 gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-white shadow-xs"
          loading="lazy"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <h2
              className={`truncate font-semibold ${
                isMod ? "text-danger" : "text-ink"
              }`}
            >
              {user.name}
            </h2>
            {user.isVerified && (
              <span className="flex-shrink-0">
                <VerifiedBadge size="sm" />
              </span>
            )}
            {isMod && (
              <span className="nx-chip flex-shrink-0 border-danger/20 bg-danger/5 text-danger">
                Mod
              </span>
            )}
          </div>
          <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink-subtle">
            <HiOutlineMapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{user.location || "—"}</span>
          </p>
        </div>
      </div>

      {followingSince && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line-subtle pt-3 text-xs">
          <span className="flex items-center gap-1.5 text-ink-subtle">
            <HiOutlineCalendar className="h-3.5 w-3.5" />
            Following since
          </span>
          <span className="font-medium text-ink">{followingSince}</span>
        </div>
      )}
    </Link>
  );
};

export default memo(PublicProfileCard);
