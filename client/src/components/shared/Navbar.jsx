import { useRef, useState, useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineSparkles } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi2";

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => setShowDropdown((v) => !v);

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <nav className="sticky top-0 z-40 mb-5 w-full border-b border-line-subtle bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-ink-muted transition-colors hover:bg-surface-hover md:hidden"
            onClick={toggleLeftbar}
            aria-label="Toggle menu"
          >
            {showLeftbar ? <RxCross1 /> : <AiOutlineBars />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="Nexify home"
          >
            <div
              className="grid h-9 w-9 place-items-center rounded-xl shadow-ember"
              style={{ backgroundColor: "#222222" }}
            >
              <HiOutlineSparkles style={{ color: "#FA8112" }} />
            </div>
            <span className="nx-wordmark nx-brand-lockup hidden text-xl sm:inline-block">
              Nexify
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl">
          <Search />
        </div>

        <div className="relative flex items-center gap-2">
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface p-0.5 pr-3 transition-all hover:border-brand/40 hover:shadow-sm"
            onClick={handleProfileClick}
            aria-label="Account menu"
          >
            <img
              src={userData.avatar}
              alt={userData.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
            />
            <span className="hidden text-sm font-medium text-ink-muted group-hover:text-ink md:inline-block">
              {userData.name?.split(" ")[0]}
            </span>
          </button>

          <Transition
            show={showDropdown}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 scale-95 translate-y-1"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {() => (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 w-72 origin-top-right overflow-hidden rounded-lg border border-line bg-surface shadow-xl"
                role="menu"
              >
                <div className="relative p-5 pb-4">
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 10%, rgba(250,129,18,0.18), transparent 60%)",
                    }}
                  />
                  <div className="relative flex items-center gap-3">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    <div className="min-w-0">
                      <Link
                        to="/profile"
                        className="block truncate text-sm font-semibold text-ink hover:text-brand-700"
                      >
                        {userData.name}
                      </Link>
                      <div className="truncate text-xs text-ink-subtle">
                        {userData.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-line-subtle p-1.5">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-surface-hover hover:text-ink"
                  >
                    <HiOutlineUser className="h-4 w-4" />
                    View profile
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger/5"
                  >
                    <IoLogOutOutline className="h-4 w-4" />
                    {loggingOut ? "Logging out…" : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
