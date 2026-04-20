import { useNavigate, useLocation } from "react-router";
import { useMemo } from "react";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHandThumbUp,
} from "react-icons/hi2";

const PostOnProfile = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { content, fileUrl, community, createdAt, comments, likes, isMember } =
    post;

  const isImageFile = useMemo(() => {
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = fileUrl?.slice(fileUrl.lastIndexOf("."));
    return validExtensions.includes(fileExtension);
  }, [fileUrl]);

  return (
    <article
      className={`nx-card nx-card-hover animate-fade-up min-w-0 cursor-pointer p-4 sm:p-5 ${
        !isMember ? "pointer-events-none opacity-60" : ""
      }`}
      onClick={() => {
        if (isMember) {
          navigate(`/my/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }
      }}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
        <span>Posted in</span>
        <span className="truncate font-medium text-ink">{community.name}</span>
        <span>·</span>
        <span>{createdAt}</span>
      </div>

      {content && (
        <p
          className="mt-3 break-words text-[15px] leading-relaxed text-ink"
          style={{ overflowWrap: "anywhere" }}
        >
          {content}
        </p>
      )}

      {fileUrl && (
        <div className="mt-3 overflow-hidden rounded-md border border-line-subtle bg-surface-muted">
          {isImageFile ? (
            <img
              src={fileUrl}
              alt={content}
              loading="lazy"
              className="block w-full object-cover"
            />
          ) : (
            <video src={fileUrl} controls className="block w-full" />
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 border-t border-line-subtle pt-3 text-sm text-ink-subtle">
        <span className="flex items-center gap-1.5">
          <HiOutlineHandThumbUp className="h-4 w-4" />
          {likes.length}
        </span>
        <span className="flex items-center gap-1.5">
          <HiOutlineChatBubbleOvalLeft className="h-4 w-4" />
          {comments.length}
        </span>
      </div>
    </article>
  );
};

export default PostOnProfile;
