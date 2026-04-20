import { useState, useEffect } from "react";
import { HiOutlineHandThumbUp, HiHandThumbUp } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  likePostAction,
  unlikePostAction,
} from "../../redux/actions/postActions";

const Like = ({ post }) => {
  const dispatch = useDispatch();
  const { _id, likes } = post;
  const userData = useSelector((state) => state.auth?.userData);

  const [likeState, setLikeState] = useState({
    liked: post.likes.includes(userData._id),
    localLikes: likes.length,
  });

  useEffect(() => {
    setLikeState({
      liked: post.likes.includes(userData._id),
      localLikes: post.likes.length,
    });
  }, [post.likes, userData._id]);

  const toggleLike = async (e) => {
    e.preventDefault();
    const optimisticLikes = likeState.liked
      ? likeState.localLikes - 1
      : likeState.localLikes + 1;

    setLikeState((prevState) => ({
      ...prevState,
      liked: !prevState.liked,
      localLikes: optimisticLikes,
    }));

    try {
      if (likeState.liked) {
        dispatch(unlikePostAction(_id));
      } else {
        dispatch(likePostAction(_id));
      }
    } catch (error) {
      setLikeState((prevState) => ({
        ...prevState,
        liked: !prevState.liked,
        localLikes: optimisticLikes,
      }));
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-out-expo ${
        likeState.liked
          ? "text-brand-700 bg-brand/10 hover:bg-brand/15"
          : "text-ink-muted hover:bg-surface-hover hover:text-brand-700"
      }`}
      aria-pressed={likeState.liked}
    >
      {likeState.liked ? (
        <HiHandThumbUp className="h-5 w-5 transition-transform group-active:scale-90" />
      ) : (
        <HiOutlineHandThumbUp className="h-5 w-5 transition-transform group-active:scale-90" />
      )}
      <span>{likeState.localLikes}</span>
    </button>
  );
};

export default Like;
