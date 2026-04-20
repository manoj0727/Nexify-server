import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import OwnProfileCard from "./OwnProfileCard";
import CommonLoading from "../loader/CommonLoading";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts;

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      await dispatch(getUserAction(userData._id));
    };
    fetchUser().then(() => setLoading(false));
  }, [dispatch, userData._id]);

  const MemoizedPostOnProfile = memo(PostOnProfile);

  let postToShow;

  postToShow = posts?.map((post) => (
    <MemoizedPostOnProfile key={post._id} post={post} />
  ));

  return (
    <>
      {loading || !user || !posts ? (
        <div className="flex justify-center items-center h-screen">
          <CommonLoading />
        </div>
      ) : (
        <>
          <OwnProfileCard user={user} />
          <OwnInfoCard user={user} />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
              Your recent posts
            </h3>
            {posts?.length > 0 && (
              <span className="nx-chip flex-shrink-0">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
            )}
          </div>

          {postToShow?.length === 0 ? (
            <div className="nx-card animate-fade-up flex flex-col items-center justify-center p-8 text-center">
              <img
                className="w-32 opacity-80 sm:w-40"
                src={NoPost}
                alt="no post"
              />
              <p className="mt-4 font-semibold text-ink">Nothing posted yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Your first post is one step away. Head to a community and share.
              </p>
            </div>
          ) : (
            <div className="flex min-w-0 flex-col gap-3">{postToShow}</div>
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;
