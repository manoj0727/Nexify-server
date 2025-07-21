import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getLogsAction,
  deleteLogsAction,
} from "../../redux/actions/adminActions";
import CurrentTime from "../shared/CurrentTime";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import CommonLoading from "../loader/CommonLoading";
import { FcRefresh } from "react-icons/fc";

const ResponsiveLogs = () => {
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const dispatch = useDispatch();
  const logs = useSelector((state) => state.admin?.logs);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      await dispatch(getLogsAction());
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setClearing(true);
      await dispatch(deleteLogsAction());
    } finally {
      setClearing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchLogs();
    } catch (error) {}
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs?.length]);

  if (loading || !logs) {
    return (
      <div className="flex items-center justify-center mt-5">
        <CommonLoading />
      </div>
    );
  }

  // Mobile Log Card Component
  const MobileLogCard = ({ log }) => (
    <div className="bg-white border rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-gray-500">{log.relativeTimestamp}</p>
          <p className="text-xs text-gray-400">{log.formattedTimestamp}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            log.level === "error"
              ? "bg-red-500 text-white"
              : log.level === "warn"
              ? "bg-orange-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {log.level}
        </span>
      </div>
      
      <div className="mb-2">
        <p className={`text-sm font-medium ${
          log.level === "info"
            ? "text-blue-600"
            : log.level === "warn"
            ? "text-orange-600"
            : log.level === "error"
            ? "text-red-600"
            : ""
        }`}>
          <span className="capitalize">{log.type}: </span>
          {log.message}
        </p>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        <span className="font-medium">Email:</span> {log.email}
      </div>
      
      {log.contextData && Object.keys(log.contextData).length > 0 && (
        <div className="border-t pt-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Context Data:</p>
          <div className="text-xs text-gray-600">
            {Object.entries(log.contextData).map(([key, value]) => (
              <div key={key} className="flex gap-1">
                <span className="font-medium text-blue-600">{key}:</span>
                <span className="break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            User Activity Logs
          </h1>
          <div className="text-sm">
            <CurrentTime />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="text-xs sm:text-sm italic text-gray-600">
            {`Showing ${logs.length} items from the last 7 days`}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Refresh logs"
            >
              <FcRefresh className="text-lg sm:text-xl" />
            </button>
            <button
              className={`bg-blue-500 text-white text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded hover:bg-blue-700 transition-colors ${
                clearing ? "opacity-50 cursor-not-allowed" : ""
              } ${logs.length === 0 ? "hidden" : ""}`}
              onClick={handleCleanup}
              disabled={clearing || logs.length === 0}
            >
              {clearing ? (
                <ButtonLoadingSpinner loadingText="Clearing..." />
              ) : (
                "Clear Logs"
              )}
            </button>
          </div>
        </div>

        {/* Logs Content */}
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No logs found</div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block lg:hidden">
              <div className="max-h-[60vh] overflow-y-auto">
                {logs.map((log) => (
                  <MobileLogCard key={log._id} log={log} />
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <div className="max-h-[60vh] overflow-y-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm">Timestamp</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm">Message</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm">Email Used</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm">Level</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm">Context Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            <div className="font-mono">
                              <p>{log.relativeTimestamp}</p>
                              <p className="text-xs text-gray-500">{log.formattedTimestamp}</p>
                            </div>
                          </td>
                          <td className={`py-3 px-4 text-sm ${
                            log.level === "info"
                              ? "text-blue-600"
                              : log.level === "warn"
                              ? "text-orange-600"
                              : log.level === "error"
                              ? "text-red-600"
                              : ""
                          }`}>
                            <span className="capitalize">{log.type}: </span>
                            <span>{log.message}</span>
                          </td>
                          <td className="py-3 px-4 text-sm">{log.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                log.level === "error"
                                  ? "bg-red-500 text-white"
                                  : log.level === "warn"
                                  ? "bg-orange-500 text-white"
                                  : "bg-blue-500 text-white"
                              }`}
                            >
                              {log.level}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {log.contextData && (
                              <ul className="text-xs">
                                {Object.entries(log.contextData).map(([key, value]) => (
                                  <li key={key}>
                                    <span className="font-medium text-blue-600">{key}: </span>
                                    <span className="text-gray-700">{value}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm italic text-gray-600 mt-4">
              Logs are automatically deleted after 7 days
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponsiveLogs;