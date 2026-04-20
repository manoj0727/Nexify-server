import { HiOutlineCalendar } from "react-icons/hi";

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 py-2 text-sm">
    <span className="text-ink-muted">{label}</span>
    <span className="font-semibold text-ink">{value}</span>
  </div>
);

const OwnInfoCard = ({ user }) => {
  const joinedOn = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="nx-card animate-fade-up p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-ink sm:text-lg">
          Profile summary
        </h3>
        {joinedOn && (
          <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <HiOutlineCalendar className="h-3.5 w-3.5" />
            Joined {user.duration} ago · {joinedOn}
          </div>
        )}
      </div>

      <div className="mt-3 divide-y divide-line-subtle">
        <Row label="Total posts" value={user.totalPosts ?? 0} />
        <Row label="Communities" value={user.totalCommunities ?? 0} />
        {user.totalPosts > 0 && (
          <Row
            label="Posts in communities"
            value={`${user.totalPosts} in ${user.totalPostCommunities} ${
              user.totalPostCommunities === 1 ? "community" : "communities"
            }`}
          />
        )}
        <Row label="Followers" value={user.followers?.length ?? 0} />
        <Row label="Following" value={user.following?.length ?? 0} />
      </div>
    </div>
  );
};

export default OwnInfoCard;
