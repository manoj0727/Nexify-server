import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";
import JoinModal from "../modals/JoinModal";
import { MoonLoader } from "react-spinners";
import { MdClear } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";

const BASE_URL = process.env.REACT_APP_API_URL;

const Search = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [community, setCommunity] = useState(null);
  const [joinedCommunity, setJoinedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  const setInitialValue = () => {
    setUsers([]);
    setPosts([]);
    setCommunity(null);
    setJoinedCommunity(null);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((q) => {
        setLoading(true);
        const encodedQuery = encodeURIComponent(q);
        axios
          .get(`${BASE_URL}/search?q=${encodedQuery}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            const { posts, users, community, joinedCommunity } = res.data;
            setPosts(posts);
            setUsers(users);
            setCommunity(community);
            setJoinedCommunity(joinedCommunity);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }, 800),
    [accessToken]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setInitialValue();
      return;
    }

    debouncedHandleSearch(value);
  };

  const clearValues = () => {
    setInitialValue();
    setInputValue("");
  };

  useEffect(() => {
    return () => {
      setInitialValue();
    };
  }, []);

  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const toggleModal = () => {
    setJoinModalVisibility((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-subtle">
          <HiOutlineSearch className="h-4 w-4" />
        </span>
        <input
          type="text"
          id="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search people, posts, communities…"
          className="h-10 w-full rounded-full border border-line bg-surface-muted pl-11 pr-10 text-sm text-ink placeholder-ink-faint shadow-xs transition-all duration-200 focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
          aria-label="Search"
          autoComplete="off"
        />
        {inputValue !== "" && (
          <button
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-subtle hover:text-ink"
            onClick={clearValues}
          >
            <MdClear />
          </button>
        )}
      </div>

      {inputValue !== "" && (
        <div
          onBlur={() => !community && clearValues()}
          className="absolute left-0 right-0 top-12 z-50 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-xl"
        >
          {loading && (
            <div className="flex items-center justify-center gap-2 py-3 px-4 text-sm text-ink-muted">
              <MoonLoader size={16} color={"#8B5CF6"} />
              Searching…
            </div>
          )}
          {posts.length > 0 && (
            <ul className="z-30">
              {posts.map((post) => (
                <li key={post._id} className="border-b py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/post/${post._id}`);
                      clearValues();
                    }}
                    className="block text-sm text-gray-700 hover:text-blue-500 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="h-8 w-8 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.content}
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted by {post.user.name} in {post.community.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {users.length > 0 && (
            <ul className="z-30">
              {users.map((user) => (
                <li key={user._id} className="border-b py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/user/${user._id}`);
                      clearValues();
                    }}
                    className="block text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {community && (
            <div className="border-b py-2 px-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={community.banner}
                    alt={community.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className=" px-2 flex justify-between items-center gap-2">
                  <div className="">
                    <p className="font-medium">{community.name}</p>

                    <p className="text-sm line-clamp-2">
                      {community.description}
                    </p>
                  </div>

                  {!community.isMember && (
                    <>
                      <JoinModal
                        show={joinModalVisibility}
                        onClose={() => {
                          toggleModal(false);
                          setCommunity(null);
                        }}
                        community={community}
                      />
                      <button
                        className="bg-primary px-2 py-1 text-white text-sm rounded-md"
                        onClick={() => toggleModal(true)}
                      >
                        Join
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {joinedCommunity && (
            <div
              key={joinedCommunity._id}
              onClick={() => {
                navigate(`/community/${joinedCommunity.name}`);
                clearValues();
              }}
              className="block text-sm text-gray-700 hover:text-indigo-500 border-b py-2 px-4 cursor-pointer"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={joinedCommunity.banner}
                    alt={joinedCommunity.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-md text-primary">
                    {joinedCommunity.name}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {joinedCommunity.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
