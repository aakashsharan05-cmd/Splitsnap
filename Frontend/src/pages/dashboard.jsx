
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/groups`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your groups."
          );
        }

        setGroups(data.groups || []);
      } catch (err) {
        setError(
          err.message || "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  const handleRetry = () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch("${import.meta.env.VITE_API_URL}/api/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load groups.");
        }

        return data;
      })
      .then((data) => {
        if (data) setGroups(data.groups || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#F8F4EA] px-5 py-10 text-[#211F1B]">
      {/* Header */}
      <div className="mx-auto mb-10 flex max-w-xl justify-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#211F1B] text-lg text-[#F8DFA8]">
            ₹
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            SplitSnap
          </h1>
        </div>
      </div>

      {/* Overall balance */}
      <div className="mx-auto mb-7 max-w-xl space-y-3 rounded-2xl bg-[#211E1A] p-6">
        <h2 className="text-sm font-medium tracking-wider text-[#C9B99A]">
          ACROSS ALL GROUPS
        </h2>

        <p className="font-mono text-4xl font-bold text-[#F8D99F]">
          —
        </p>

        <p className="text-sm text-[#C9B99A]">
          Your combined balance will appear here.
        </p>
      </div>

      {/* Groups section */}
      <div className="mx-auto mb-7 max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold tracking-wide">
            YOUR GROUPS
          </h2>

          <span className="text-sm text-[#756F65]">
            {groups.length} {groups.length === 1 ? "group" : "groups"}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-6 text-center text-[#756F65]">
            Loading your groups...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="space-y-3 rounded-2xl border border-red-200 bg-[#FFFDF8] p-5">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={handleRetry}
              className="rounded-xl bg-[#211F1B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#39352F]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groups.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#B8A98F] bg-[#FFFDF8] px-5 py-10 text-center">
            <div className="mb-3 text-3xl">👥</div>

            <h3 className="mb-2 font-semibold">
              No groups yet
            </h3>

            <p className="mb-5 text-sm text-[#756F65]">
              Create a group to start splitting expenses with friends.
            </p>

            <button
              onClick={() => navigate("/create-group")}
              className="rounded-xl bg-[#211F1B] px-5 py-3 font-semibold text-[#F8DFA8] transition hover:bg-[#39352F]"
            >
              + Create your first group
            </button>
          </div>
        )}

        {/* Group cards */}
        {!loading && !error && groups.length > 0 && (
          <div className="space-y-3">
            {groups.map((group) => (
              <button
                key={group._id}
                type="button"
                onClick={() => navigate(`/groups/${group._id}`)}
                className="w-full rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-5 text-left transition hover:border-[#B8A98F] hover:bg-[#F2EBDD] focus:outline-none focus:ring-2 focus:ring-[#B8A98F]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2EBDD] text-xl">
                      {group.icon || "👥"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {group.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#756F65]">
                        Open group details
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-lg text-[#756F65]">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Create group button */}
        {!loading && !error && groups.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/creategroup")}
            className="mt-6 w-full rounded-2xl border border-dashed border-[#B8A98F] bg-[#FFFDF8] p-5 text-center font-semibold transition hover:bg-[#F2EBDD]"
          >
            + Create a new Group
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
