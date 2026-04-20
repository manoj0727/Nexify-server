import { Link } from "react-router-dom";
import { useState } from "react";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import Tooltip from "../shared/Tooltip";
import VerifiedBadge from "../shared/VerifiedBadge";
import { HiOutlinePencilSquare, HiOutlineMapPin } from "react-icons/hi2";
import { HiOutlineIdentification, HiArrowRight } from "react-icons/hi2";

const OwnProfileCard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const interests = user.interests
    ? user.interests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="nx-card relative overflow-hidden animate-fade-up">
      {/* editorial banner — dark with warm accent */}
      <div
        className="relative h-32 w-full overflow-hidden sm:h-40"
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
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all"
          style={{
            backgroundColor: "rgba(250,243,225,0.15)",
            color: "#FAF3E1",
          }}
        >
          <Tooltip text="Edit profile">
            <span className="flex items-center gap-1.5">
              <HiOutlinePencilSquare className="h-3.5 w-3.5" />
              Edit
            </span>
          </Tooltip>
        </button>
      </div>

      <div className="-mt-14 px-6 pb-6">
        <div className="flex items-end justify-between gap-4">
          <img
            src={user.avatar}
            alt="Profile"
            className="h-28 w-28 rounded-full object-cover ring-4 ring-surface shadow-md"
          />
        </div>

        <ProfileUpdateModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`font-display text-2xl font-bold ${
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
              <span>{user.bio}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-sm italic text-ink-faint">Bio not added</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <div className="flex items-center gap-1.5">
              <HiOutlineMapPin className="h-4 w-4 text-ink-subtle" />
              {user.location || <span className="italic text-ink-faint">Location not added</span>}
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
