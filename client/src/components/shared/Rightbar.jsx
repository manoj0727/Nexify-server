import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  getPublicUsersAction,
  followUserAndFetchData,
} from "../../redux/actions/userActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoinModal from "../modals/JoinModal";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdPeople } from "react-icons/io";
import { HiOutlineSparkles } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi2";
import placeholder from "../../assets/placeholder.png";

const SectionTitle = ({ title, trailing }) => (
  <div className="mb-3 flex items-center justify-between">
    <h5 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
      {title}
    </h5>
    {trailing}
  </div>
);

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [joinModalVisibility, setJoinModalVisibility] = useState({});
  const [notJoinedCommunitiesFetched, setNotJoinedCommunitiesFetched] =
    useState(false);
  const [publicUsersFetched, setPublicUsersFetched] = useState(false);

  const currentUser = useSelector((state) => state.auth?.userData);
  const recommendedUsers = useSelector((state) => state.user?.publicUsers);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotJoinedCommunitiesAction());
      setNotJoinedCommunitiesFetched(true);
      await dispatch(getPublicUsersAction());
    };
    fetchData().then(() => setPublicUsersFetched(true));
  }, [dispatch]);

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  const [visibleCommunities, remainingCount] = useMemo(() => {
    const visible = notJoinedCommunities?.slice(0, 4) || [];
    const remaining = Math.max((notJoinedCommunities?.length || 0) - 4, 0);
    return [visible, remaining];
  }, [notJoinedCommunities]);

  const [followLoading, setFollowLoadingState] = useState({});

  const followUserHandler = useCallback(
    async (toFollowId) => {
      setFollowLoadingState((p) => ({ ...p, [toFollowId]: true }));
      await dispatch(followUserAndFetchData(toFollowId, currentUser));
      setFollowLoadingState((p) => ({ ...p, [toFollowId]: false }));
      navigate(`/user/${toFollowId}`);
    },
    [dispatch, currentUser, navigate]
  );

  const toggleJoinModal = useCallback((communityId, visible) => {
    setJoinModalVisibility((prev) => ({ ...prev, [communityId]: visible }));
  }, []);

  const currentLocation = useLocation().pathname;

  return (
    <aside className="rightbar">
      {currentLocation !== "/communities" && (
        <section className="animate-fade-up">
          <SectionTitle
            title="Suggested communities"
            trailing={
              remainingCount > 0 && (
                <Link
                  to="/communities"
                  className="flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-700 hover:bg-brand/15"
                >
                  +{remainingCount}
                </Link>
              )
            }
          />

          {notJoinedCommunitiesFetched && visibleCommunities.length === 0 && (
            <p className="rounded-md border border-dashed border-line bg-surface-muted p-3 text-center text-xs italic text-ink-subtle">
              No communities to join right now.
            </p>
          )}

          <ul className="flex flex-col gap-2">
            {visibleCommunities.map((community) => (
              <li
                key={community._id}
                className="group nx-card nx-card-hover flex items-center justify-between gap-3 p-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={community.banner || placeholder}
                    alt={community.name}
                    className="h-9 w-9 flex-shrink-0 rounded-md object-cover ring-1 ring-line"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {community.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-ink-subtle">
                      <IoMdPeople />
                      {community.members.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleJoinModal(community._id, true)}
                  className="nx-btn-secondary h-8 px-2.5 py-1 text-xs"
                >
                  Join
                </button>
                <JoinModal
                  show={joinModalVisibility[community._id] || false}
                  onClose={() => toggleJoinModal(community._id, false)}
                  community={community}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="my-5 nx-divider" />

      <section className="animate-fade-up">
        <SectionTitle
          title="People to follow"
          trailing={<HiOutlineSparkles className="h-4 w-4 text-ink-subtle" />}
        />

        {publicUsersFetched && recommendedUsers?.length === 0 && (
          <p className="rounded-md border border-dashed border-line bg-surface-muted p-3 text-center text-xs italic text-ink-subtle">
            No recommendations yet — check back later.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {recommendedUsers?.length > 0 &&
            recommendedUsers.map((user) => (
              <li
                key={user._id}
                className="nx-card nx-card-hover flex items-center justify-between gap-3 p-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/user/${user._id}`}
                      className="block truncate text-sm font-medium text-ink hover:text-brand-700"
                    >
                      {user.name}
                    </Link>
                    <div className="text-xs text-ink-subtle">
                      {user.followerCount} followers
                    </div>
                  </div>
                </div>
                <button
                  disabled={followLoading[user._id]}
                  onClick={() => followUserHandler(user._id)}
                  className="nx-btn-primary h-8 px-3 py-1 text-xs"
                >
                  {followLoading[user._id] ? (
                    <span className="loader h-3 w-3" />
                  ) : (
                    <>
                      <BsPersonPlusFill className="text-xs" />
                      Follow
                    </>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </section>

      <div className="mt-6 flex justify-center">
        <Link
          to="/communities"
          className="flex items-center gap-1 text-xs font-medium text-ink-subtle hover:text-brand-700"
        >
          Explore more <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
};

export default Rightbar;
