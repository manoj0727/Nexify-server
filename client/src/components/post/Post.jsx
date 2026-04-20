import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineTrash,
  HiOutlineEllipsisHorizontal,
} from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import Like from "./Like";
import "react-photo-view/dist/react-photo-view.css";
import Tooltip from "../shared/Tooltip";
import VerifiedBadge from "../shared/VerifiedBadge";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const { content, fileUrl, fileType, user, community, createdAt, comments } =
    post;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (value) => setShowModal(value);

  if (!user || !community) {
    console.error("Post missing user or community data:", post);
    return null;
  }

  const openPost = () =>
    navigate(`/post/${post._id}`, { state: { from: location.pathname } });

  const isMod = user.role === "moderator";

  return (
    <article className="nx-card nx-card-hover animate-fade-up p-5">
      {/* header */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs"
              src={user.avatar || "/images/default-avatar.svg"}
              alt={user.name}
              loading="lazy"
            />
            {isMod && (
              <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-danger text-[8px] font-bold text-white ring-2 ring-white">
                M
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              {userData._id === user._id ? (
                <Link
                  to="/profile"
                  className={`font-semibold capitalize ${
                    isMod ? "text-danger" : "text-ink"
                  } hover:text-brand-700`}
                >
                  {user.name}
                </Link>
              ) : (
                <Link
                  to={`/user/${user._id}`}
                  className={`font-semibold capitalize ${
                    isMod ? "text-danger" : "text-ink"
                  } hover:text-brand-700`}
                >
                  {user.name}
                </Link>
              )}
              {user.isVerified && <VerifiedBadge size="sm" />}
              {isMod && (
                <span className="nx-chip border-danger/20 bg-danger/5 text-danger">
                  Mod
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
              <Link
                to={`/community/${community.name}`}
                className="font-medium hover:text-brand-700"
              >
                {community.name}
              </Link>
              <span>·</span>
              <span>{createdAt}</span>
            </div>
          </div>
        </div>

        {userData?._id === post.user._id && (
          <Tooltip text="Delete post">
            <button
              onClick={() => toggleModal(true)}
              className="grid h-8 w-8 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-danger/5 hover:text-danger"
              aria-label="Delete post"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </header>

      {/* body */}
      <div
        onClick={openPost}
        className="mt-4 cursor-pointer break-words text-[15px] leading-relaxed text-ink"
      >
        {content}
      </div>

      {/* media */}
      {fileUrl && (
        <div className="mt-4 overflow-hidden rounded-md border border-line-subtle bg-surface-muted">
          {fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-3 py-2 text-xs text-white backdrop-blur-sm">
                  <p>{user.name}</p>
                  <p>{community.name} · {createdAt}</p>
                </div>
              )}
            >
              <PhotoView src={fileUrl}>
                <img
                  src={fileUrl}
                  alt={content}
                  loading="lazy"
                  className="w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <video
              src={fileUrl}
              controls
              className="block w-full rounded-md focus:outline-none"
            />
          )}
        </div>
      )}

      {/* actions */}
      <footer className="mt-4 flex items-center justify-between border-t border-line-subtle pt-3">
        <div className="flex items-center gap-1">
          <Like post={post} />
          <button
            onClick={openPost}
            className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-hover hover:text-brand-700"
          >
            <HiOutlineChatBubbleOvalLeft className="h-5 w-5" />
            <span>{comments.length}</span>
          </button>
        </div>
        <button
          onClick={openPost}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink"
          aria-label="More"
        >
          <HiOutlineEllipsisHorizontal className="h-5 w-5" />
        </button>
      </footer>

      {showModal && (
        <DeleteModal
          showModal={showModal}
          postId={post._id}
          onClose={() => toggleModal(false)}
          prevPath={location.pathname}
        />
      )}
    </article>
  );
};

export default Post;
