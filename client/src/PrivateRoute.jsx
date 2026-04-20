import { useMemo, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInitialAuthState } from "./redux/actions/authActions";
import Navbar from "./components/shared/Navbar";
import Leftbar from "./components/shared/Leftbar";
import Rightbar from "./components/shared/Rightbar";
import CommunityRightbar from "./components/community/Rightbar";
import ModeratorRightbar from "./components/moderator/Rightbar";

const noRightbarRoutes = [
  /\/post\/[^/]+$/,
  /\/community\/[^/]+\/report$/,
  /\/community\/[^/]+\/reported-post$/,
  /\/community\/[^/]+\/moderator$/,
].map((regex) => new RegExp(regex));

const PrivateRoute = ({ userData }) => {
  const isAuthenticated = useMemo(() => {
    return (userData, accessToken) => {
      return userData && accessToken;
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("profile");
  const accessToken = JSON.parse(token)?.accessToken;

  const currentUserIsModerator = userData?.role === "moderator";

  useEffect(() => {
    if (!isAuthenticated(userData, accessToken)) {
      dispatch(setInitialAuthState(navigate));
    }
  }, [dispatch, navigate, userData, accessToken, isAuthenticated]);

  const showRightbar = !noRightbarRoutes.some((regex) =>
    regex.test(location.pathname)
  );

  // Check if we're on a community page
  const isCommunityPage = /^\/community\/[^/]+$/.test(location.pathname);

  const [showLeftbar, setShowLeftbar] = useState(false);

  const toggleLeftbar = () => {
    setShowLeftbar(!showLeftbar);
  };

  // close mobile drawer whenever route changes
  useEffect(() => {
    setShowLeftbar(false);
  }, [location.pathname]);

  // lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = showLeftbar ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLeftbar]);

  return isAuthenticated(userData, accessToken) ? (
    <div className="nx-shell relative scroll-smooth">
      {/* ambient backdrop */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(900px circle at 10% -10%, rgba(250,129,18,0.10), transparent 60%), radial-gradient(700px circle at 110% 20%, rgba(245,231,198,0.45), transparent 55%)",
        }}
      />

      <Navbar
        userData={userData}
        toggleLeftbar={toggleLeftbar}
        showLeftbar={showLeftbar}
      />

      {/* mobile drawer backdrop */}
      {showLeftbar && (
        <div
          className="nx-drawer-backdrop"
          onClick={() => setShowLeftbar(false)}
          aria-hidden="true"
        />
      )}

      <div
        className="mx-auto w-full max-w-[1280px] px-3 pb-12 sm:px-4 lg:grid lg:gap-6 lg:px-6 xl:gap-8 xl:px-8"
        style={{ gridTemplateColumns: "240px minmax(0, 1fr) 300px" }}
      >
        <Leftbar showLeftbar={showLeftbar} />

        <main className="min-w-0">
          <Outlet />
        </main>

        {showRightbar ? (
          isCommunityPage ? (
            <div className="hidden lg:block">
              <CommunityRightbar />
            </div>
          ) : currentUserIsModerator ? (
            <ModeratorRightbar />
          ) : (
            <Rightbar />
          )
        ) : null}
      </div>
    </div>
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
