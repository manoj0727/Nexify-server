import { memo, useMemo, useEffect, useState, useCallback } from "react";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import { HiOutlineSparkles } from "react-icons/hi";
import { HiArrowDown } from "react-icons/hi2";
import { Link } from "react-router-dom";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="nx-btn-secondary my-4 w-full py-3 text-sm"
  >
    {isLoading ? (
      <>
        <span className="loader" /> Loading more…
      </>
    ) : (
      <>
        <HiArrowDown className="h-4 w-4" />
        Load more posts
      </>
    )}
  </button>
);

const EmptyFeed = () => (
  <div className="nx-card relative overflow-hidden p-10 text-center animate-fade-up">
    <div className="pointer-events-none absolute inset-0 bg-aurora-soft opacity-70" />
    <div className="relative">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-aurora shadow-aurora">
        <HiOutlineSparkles className="h-6 w-6 text-white" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
        Your feed is quiet
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        Join a community and the best posts will land right here.
      </p>
      <Link
        to="/communities"
        className="nx-btn-primary mt-6 inline-flex px-5 py-2.5 text-sm"
      >
        Discover communities
      </Link>
    </div>
  </div>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts);
  const totalPosts = useSelector((state) => state.posts?.totalPosts);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    if (userData) {
      dispatch(getPostsAction(LIMIT, 0)).finally(() => setIsLoading(false));
    }
    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, LIMIT]);

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true);
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() =>
      setIsLoadMoreLoading(false)
    );
  }, [dispatch, LIMIT, posts.length]);

  const memoizedPosts = useMemo(
    () => posts.map((post) => <MemoizedPost key={post._id} post={post} />),
    [posts]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <>
      {posts.length > 0 && (
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-display text-xl font-semibold text-ink">
            For you
          </h2>
          <span className="nx-chip">
            {totalPosts} {totalPosts === 1 ? "post" : "posts"}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">{memoizedPosts}</div>

      {posts.length > 0 && posts.length < totalPosts && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoadMoreLoading}
        />
      )}

      {posts.length === 0 && <EmptyFeed />}
    </>
  );
};

export default MainSection;
