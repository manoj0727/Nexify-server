import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArchiveBox,
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
  const toggleModal = (value) => {
    setShowModal(value);
  };

  // Handle case where user or community is null
  if (!user || !community) {
    console.error("Post missing user or community data:", post);
    return null; // Don't render the post if critical data is missing
  }

  return (
    <div className="border rounded bg-white p-4 m-2 hover:shadow-lg duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            className="rounded-full overflow-hidden w-12 h-12 object-cover"
            src={user.avatar || "/images/default-avatar.svg"}
            alt="user avatar"
            loading="lazy"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {userData._id === user._id ? (
                <Link to="/profile" className={`font-semibold text-lg capitalize ${user.role === "moderator" ? "text-red-600" : ""}`}>
                  {user.name}
                </Link>
              ) : (
                <Link
                  to={`/user/${user._id}`}
                  className={`font-semibold text-lg capitalize ${user.role === "moderator" ? "text-red-600" : ""}`}
                >
                  {user.name}
                </Link>
              )}
              {user.isVerified && <VerifiedBadge size="sm" />}
              {user.role === "moderator" && (
                <span className="ml-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                  MOD
                </span>
              )}
            </div>
            <Link
              to={`/community/${community.name}`}
              className="text-sm text-gray-500"
            >
              {community.name}
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-500">{createdAt}</p>
      </div>
      <div>
        <p
          onClick={() => {
            navigate(`/post/${post._id}`, {
              state: { from: location.pathname },
            });
          }}
          className="my-2 cursor-pointer break-words"
        >
          {content}
        </p>
        <div className="mt-4">
          {fileUrl && fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 text-white px-3 py-2">
                  <p className="text-xs">{user.name}</p>
                  <p className="text-xs">{community.name}</p>
                  <p className="text-xs">{createdAt}</p>
                </div>
              )}
            >
              <PhotoView src={fileUrl}>
                <div className="w-full aspect-w-1 aspect-h-1">
                  <img
                    src={fileUrl}
                    alt={content}
                    loading="lazy"
                    className="cursor-pointer object-cover rounded-md"
                  />
                </div>
              </PhotoView>
            </PhotoProvider>
          ) : (
            fileUrl && (
              <div className="w-full aspect-w-16 aspect-h-9">
                <video
                  className="block mx-auto rounded-md focus:outline-none"
                  src={fileUrl}
                  controls
                />
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <Like post={post} />

          <button
            className="flex items-center text-lg gap-1"
            onClick={() => {
              navigate(`/post/${post._id}`, {
                state: { from: location.pathname },
              });
            }}
          >
            <HiOutlineChatBubbleOvalLeft className="text-2xl" />
            {comments.length}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {userData?._id === post.user._id && (
            <Tooltip text="Delete post">
              <button
                onClick={() => toggleModal(true)}
                className="text-red-500 text-2xl"
              >
                <HiOutlineArchiveBox />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {showModal && (
        <DeleteModal
          showModal={showModal}
          postId={post._id}
          onClose={() => toggleModal(false)}
          prevPath={location.pathname}
        />
      )}
    </div>
  );
};

export default Post;
