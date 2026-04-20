import { Link } from "react-router-dom";
import { useState } from "react";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import Tooltip from "../shared/Tooltip";
import VerifiedBadge from "../shared/VerifiedBadge";
import {
  HiOutlinePencilSquare,
  HiOutlineMapPin,
  HiOutlineIdentification,
  HiArrowRight,
} from "react-icons/hi2";

const OwnProfileCard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const interests = user.interests
    ? user.interests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="nx-card relative animate-fade-up">
      {/* banner — overflow-hidden contains blobs, but stays off outer card so tooltip isn't clipped */}
      <div
        className="relative h-28 w-full overflow-hidden rounded-t-lg sm:h-36"
        style={{ backgroundColor: "#222222" }}
      >
        <div
          className="absolute -left-16 top-4 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: "#FA8112", opacity: 0.38 }}
        />
        <div
          className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full blur-3xl"
          style={{ backgroundColor: "#F5E7C6", opacity: 0.1 }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(250,243,225,0.2) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="tooltip absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all hover:brightness-110 sm:right-4 sm:top-4"
          style={{
            backgroundColor: "rgba(250,243,225,0.18)",
            color: "#FAF3E1",
          }}
          aria-label="Edit profile"
        >
          <HiOutlinePencilSquare className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      {/* floating avatar + body */}
      <div className="relative px-5 pb-6 pt-12 sm:px-6 sm:pt-16">
        <img
          src={user.avatar}
          alt={user.name}
          className="absolute -top-10 left-5 h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-surface sm:-top-14 sm:left-6 sm:h-28 sm:w-28"
        />

        <ProfileUpdateModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`font-display text-xl font-bold sm:text-2xl ${
                user.role === "moderator" ? "text-danger" : "text-ink"
              }`}
            >
              {user.name}
            </h2>
            {user.isVerified && <VerifiedBadge size="md" />}
            {user.role === "moderator" && (
              <span className="nx-chip border-danger/20 bg-danger/5 text-danger">
                Moderator
              </span>
            )}
          </div>

          {user.bio ? (
            <p className="mt-1.5 flex items-start gap-2 text-sm text-ink-muted">
              <HiOutlineIdentification className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-subtle" />
              <span className="min-w-0 break-words">{user.bio}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-sm italic text-ink-faint">
              Bio not added
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <div className="flex min-w-0 items-center gap-1.5">
              <HiOutlineMapPin className="h-4 w-4 flex-shrink-0 text-ink-subtle" />
              <span className="truncate">
                {user.location || (
                  <span className="italic text-ink-faint">
                    Location not added
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Interests
          </h3>
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {interests.map((interest, i) => (
                <span key={i} className="nx-chip">
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">
              No interests yet — add a few to help people find you.
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-line-subtle pt-4">
          <Link
            to="/devices-locations"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Manage devices & locations
            <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnProfileCard;
