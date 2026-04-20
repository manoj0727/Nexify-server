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

  return isAuthenticated(userData, accessToken) ? (
    <div className="nx-shell relative scroll-smooth">
      {/* ambient backdrop */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(900px circle at 10% -10%, rgba(139,92,246,0.08), transparent 60%), radial-gradient(700px circle at 110% 20%, rgba(236,72,153,0.06), transparent 55%)",
        }}
      />

      <Navbar
        userData={userData}
        toggleLeftbar={toggleLeftbar}
        showLeftbar={showLeftbar}
      />

      <div
        className="mx-auto w-full max-w-7xl px-3 pb-12 md:grid md:gap-6 md:px-8 lg:px-10"
        style={{ gridTemplateColumns: "260px 1fr 300px" }}
      >
        <Leftbar showLeftbar={showLeftbar} />

        <main className="col-span-4 md:col-span-1">
          <Outlet />
        </main>

        {showRightbar ? (
          isCommunityPage ? (
            <div className="hidden md:block">
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
