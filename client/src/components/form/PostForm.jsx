import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostAction,
  clearCreatePostFail,
} from "../../redux/actions/postActions";
import InappropriatePostModal from "../modals/InappropriatePostModal";
import TopicConflictModal from "../modals/TopicConflictModal";
import EligibilityDetectionFailModal from "../modals/EligibilityDetectionFailModal";

const PostForm = ({ communityId, communityName }) => {
  const dispatch = useDispatch();
  const [showInappropriateContentModal, setShowInappropriateContentModal] =
    useState(false);
  const [showTopicConflictModal, setShowTopicConflictModal] = useState(false);
  const [
    showEligibilityDetectionFailModal,
    setShowEligibilityDetectionFailModal,
  ] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    file: null,
    error: "",
    loading: false,
  });

  const isPostInappropriate = useSelector(
    (state) => state.posts?.isPostInappropriate
  );
  const postCategory = useSelector((state) => state.posts?.postCategory);
  const confirmationToken = useSelector(
    (state) => state.posts?.confirmationToken
  );

  const handleContentChange = (event) => {
    setFormData({
      ...formData,
      content: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      selectedFile.size <= 50 * 1024 * 1024 // 50MB
    ) {
      setFormData({
        ...formData,
        file: selectedFile,
        error: "",
      });
    } else {
      setFormData({
        ...formData,
        file: null,
        error: "Please select an image or video file under 50MB.",
      });
    }
  };

  useEffect(() => {
    if (isPostInappropriate) setShowInappropriateContentModal(true);
    if (postCategory) setShowTopicConflictModal(true);
    if (confirmationToken) setShowEligibilityDetectionFailModal(true);
  }, [isPostInappropriate, postCategory, confirmationToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content, file, loading } = formData;
    if (loading) return;

    if (!content && !file) {
      setFormData({
        ...formData,
        error: "Please enter a message or select a file.",
      });
      return;
    }

    const newPost = new FormData();
    newPost.append("content", content);
    newPost.append("communityId", communityId);
    newPost.append("communityName", communityName);
    newPost.append("file", file);

    setFormData({
      ...formData,
      loading: true,
    });

    try {
      await dispatch(createPostAction(newPost));
      setFormData({
        content: "",
        file: null,
        error: "",
        loading: false,
      });
      event.target.reset();
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
      });
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      file: null,
      error: "",
    });
  };

  return (
    <>
      <InappropriatePostModal
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCreatePostFail());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"post"}
      />

      <TopicConflictModal
        closeTopicConflictModal={() => {
          setShowTopicConflictModal(false);
          dispatch(clearCreatePostFail());
        }}
        showTopicConflictModal={showTopicConflictModal}
        communityName={postCategory?.community}
        recommendedCommunity={postCategory?.recommendedCommunity}
      />

      <EligibilityDetectionFailModal
        closeEligibilityDetectionFailModal={() => {
          setShowEligibilityDetectionFailModal(false);
          dispatch(clearCreatePostFail());
        }}
        showEligibilityDetectionFailModal={showEligibilityDetectionFailModal}
        confirmationToken={confirmationToken}
      />

      <form
        onSubmit={handleSubmit}
        className="nx-card relative overflow-hidden p-5 animate-fade-up"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-aurora-soft opacity-60 blur-2xl" />

        <div className="relative">
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Share something with your community
          </label>
          <textarea
            className="w-full resize-none rounded-md border border-line bg-surface-muted px-3.5 py-3 text-sm text-ink placeholder-ink-faint transition-all duration-200 focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
            name="content"
            id="content"
            rows={4}
            placeholder={`What's on your mind${communityName ? `, in ${communityName}` : ""}?`}
            value={formData.content}
            onChange={handleContentChange}
            minLength={10}
            maxLength={3000}
            required
          />
          <div className="mt-1 flex justify-end text-xs text-ink-faint">
            {formData.content.length}/3000
          </div>
        </div>

        <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="file"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-muted transition-all hover:border-brand/40 hover:bg-brand/5 hover:text-brand-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Photo / Video
            <input
              name="file"
              type="file"
              id="file"
              accept="image/*, video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            className={`nx-btn-primary px-5 py-2 text-sm transition-opacity ${
              !formData.content && !formData.file
                ? "pointer-events-none opacity-50"
                : "opacity-100"
            }`}
            type="submit"
            disabled={formData.loading || (!formData.content && !formData.file)}
          >
            {formData.loading ? (
              <>
                <span className="loader" /> Posting…
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>

        {formData.file && (
          <div className="relative mt-3 flex items-center justify-between rounded-md border border-line-subtle bg-surface-muted px-3 py-2">
            <p className="truncate text-xs text-ink-muted">{formData.file.name}</p>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="rounded-full p-1 text-ink-subtle hover:bg-danger/10 hover:text-danger"
              aria-label="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {formData.error && (
          <p className="relative mt-2 text-xs text-danger">{formData.error}</p>
        )}
      </form>
    </>
  );
};

export default PostForm;
