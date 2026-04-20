import { useMemo, useEffect, memo } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineBookmark,
  HiOutlineRectangleStack,
  HiOutlineUserGroup,
  HiArrowRight,
} from "react-icons/hi2";

const navItemClass = ({ isActive }) =>
  [
    "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out-expo",
    isActive
      ? "text-ink bg-brand/10 shadow-xs"
      : "text-ink-muted hover:bg-surface-hover hover:text-ink",
  ].join(" ");

const NavItem = ({ to, icon: Icon, label, end }) => (
  <NavLink to={to} end={end} className={navItemClass}>
    {({ isActive }) => (
      <>
        {isActive && (
          <span
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #6366F1, #8B5CF6, #EC4899)",
            }}
          />
        )}
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-brand-700" : "text-ink-subtle"
          }`}
        />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.userData);
  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(
    () => joinedCommunities?.slice(0, 5),
    [joinedCommunities]
  );

  return (
    <aside className={`${showLeftbar ? "" : "hidden"} leftbar`}>
      <nav className="flex flex-col gap-1">
        <NavItem to="/home" icon={HiOutlineHome} label="Home" />
        <NavItem to="/profile" icon={HiOutlineUserCircle} label="Profile" />
        <NavItem to="/saved" icon={HiOutlineBookmark} label="Saved" />
        {user && user.role === "general" && (
          <NavItem
            to="/following"
            icon={HiOutlineRectangleStack}
            label="Following"
          />
        )}
      </nav>

      <div className="my-5 nx-divider" />

      <div>
        <div className="mb-3 flex items-center justify-between px-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            <HiOutlineUserGroup className="h-4 w-4" />
            Communities
          </div>
          {joinedCommunities?.length > 0 && (
            <Link
              to="/my-communities"
              className="flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-700 hover:bg-brand/15"
            >
              {joinedCommunities.length}
            </Link>
          )}
        </div>
        {visibleCommunities && visibleCommunities.length > 0 ? (
          <ul className="flex flex-col gap-0.5">
            {visibleCommunities.map((c) => (
              <li key={c._id || c.name}>
                <Link
                  to={`/community/${c.name}`}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  <span
                    className="h-6 w-6 flex-shrink-0 rounded-md text-[10px] font-bold uppercase grid place-items-center text-white"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
                    }}
                  >
                    {c.name?.[0]}
                  </span>
                  <span className="truncate">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-3 rounded-md border border-dashed border-line bg-surface-muted p-3 text-center text-xs text-ink-subtle">
            No communities yet.
            <Link
              to="/communities"
              className="mt-1 flex items-center justify-center gap-1 font-semibold text-brand-700 hover:underline"
            >
              Discover <HiArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {user && user.role === "general" && (
        <>
          <div className="my-5 nx-divider md:hidden" />
          <Link
            to="/communities"
            className="mx-3 flex items-center justify-center gap-2 rounded-md border border-brand/20 bg-brand/5 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand/10 md:hidden"
          >
            Browse all communities <HiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </>
      )}
    </aside>
  );
};

export default memo(Leftbar);
