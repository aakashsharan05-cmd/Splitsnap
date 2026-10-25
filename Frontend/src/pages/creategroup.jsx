
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("✈️");

  const [memberName, setMemberName] = useState("");
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [alertLimit, setAlertLimit] = useState("1000");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const icons = ["✈️", "🏠", "🎉", "🍕", "🏕️"];

  // Search registered users from the backend
  useEffect(() => {
    let ignore = false;

    const searchUsers = async () => {
      const search = memberName.trim();

      if (!search) {
        setUsers([]);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users?search=${encodeURIComponent(search)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to search users.");
        }

        if (!ignore) {
          setUsers(data.users || []);
        }
      } catch (err) {
        if (!ignore) {
          setUsers([]);
          setError(err.message || "Unable to search users.");
        }
      } finally {
        if (!ignore) {
          setSearchLoading(false);
        }
      }
    };

    searchUsers();

    return () => {
      ignore = true;
    };
  }, [memberName, navigate]);

  // Select or deselect a user using their MongoDB ID
  const toggleMember = (userId) => {
    setSelectedMembers((previous) =>
      previous.includes(userId)
        ? previous.filter((id) => id !== userId)
        : [...previous, userId]
    );
  };

  // Create group first, then add selected members
  const createGroups = async () => {
    if (creating) return;

    setError("");

    if (!groupName.trim()) {
      setError("Please enter a group name.");
      return;
    }

    if (
      alertLimit.trim() === "" ||
      !Number.isFinite(Number(alertLimit)) ||
      Number(alertLimit) < 0
    ) {
      setError("Please enter a valid alert limit.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setCreating(true);

    try {
      // Step 1: Create the group
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: groupName.trim(),
          alertLimit: Number(alertLimit),
          icon: selectedIcon,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to create group.");
      }

      // Backend must return the created group's ID.
      const groupId = data.group?._id || data.groupId;

      if (!groupId) {
        throw new Error(
          "Group was created, but its ID was not returned. Update the createGroup backend response."
        );
      }

      // Step 2: Add each selected user to the group
      for (const userId of selectedMembers) {
        const memberResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/groups/${groupId}/members`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          }
        );

        const memberData = await memberResponse.json();

        if (
          memberResponse.status === 401 ||
          memberResponse.status === 403
        ) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!memberResponse.ok) {
          throw new Error(
            memberData.message ||
            "Group created, but a member could not be added."
          );
        }
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EA] px-5 py-5 text-[#211F1B]">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-11 w-11 rounded-xl bg-[#F1EBDD] text-2xl"
            aria-label="Go back"
          >
            ‹
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create Group
            </h1>
            <p className="mt-1 text-sm text-[#756F65]">
              Start sharing expenses together
            </p>
          </div>
        </div>

        {/* Group name and icon */}
        <div className="mt-5 w-full rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-6">
          <div className="flex flex-col">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F3EEDF] text-3xl">
              {selectedIcon}
            </div>

            <p className="mt-5 text-xl font-semibold">
              Give your group a name
            </p>
            <p className="mt-3 text-[#756F65]">
              A trip, a flat or just your friends.
            </p>

            <label htmlFor="groupName" className="mt-5 font-semibold">
              Group name
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError("");
              }}
              maxLength={80}
              className="mt-4 h-14 w-full rounded-xl border border-[#DED6C7] bg-[#FFFDF8] px-4"
              placeholder="e.g. Goa Trip 2026"
            />

            <p className="mt-5 font-semibold">Choose a group icon</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  aria-pressed={selectedIcon === icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-12 w-12 rounded-xl bg-[#F5E3CB] text-2xl ${selectedIcon === icon
                      ? "ring-2 ring-[#211F1B]"
                      : ""
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and select members */}
        <div className="mt-5 w-full rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-6">
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-[#756F65]">Add Members</span>
            <span className="text-sm font-semibold">
              {selectedMembers.length} selected
            </span>
          </div>

          <input
            type="text"
            value={memberName}
            onChange={(e) => {
              setMemberName(e.target.value);
              setError("");
            }}
            className="mt-4 h-14 w-full rounded-xl border border-[#DED6C7] bg-[#FFFDF8] px-4"
            placeholder="🔍 Search by email or name"
          />

          {searchLoading && (
            <p className="mt-4 text-sm text-[#756F65]">
              Searching users...
            </p>
          )}

          {!searchLoading &&
            memberName.trim() &&
            users.length === 0 && (
              <p className="mt-4 text-sm text-[#756F65]">
                No matching members found.
              </p>
            )}

          {users.map((user) => {
            const isSelected = selectedMembers.includes(user._id);

            return (
              <button
                type="button"
                key={user._id}
                onClick={() => toggleMember(user._id)}
                aria-pressed={isSelected}
                className="mt-5 flex w-full items-center gap-4 text-left"
              >

                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#A58B5B] text-xl font-semibold text-white">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>


                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="mt-1 break-all text-sm text-[#756F65]">
                    {user.email}
                  </p>
                </div>

                <span className="text-xl text-[#316B52]">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alert limit */}
        <div className="mt-5 w-full rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-6">
          <label htmlFor="alertLimit" className="mb-2 block font-semibold">
            Alert limit (₹)
          </label>

          <input
            id="alertLimit"
            type="number"
            min="0"
            value={alertLimit}
            onChange={(e) => setAlertLimit(e.target.value)}
            className="h-14 w-full rounded-xl border border-[#DED6C7] bg-[#FFFDF8] px-4"
          />

          <p className="mt-2 text-sm text-[#756F65]">
            Notify members when a balance crosses this limit.
          </p>
          <p className="mt-1 text-sm text-[#756F65]">
            Alert limit · ₹
            {Number(alertLimit || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={createGroups}
          disabled={creating}
          className="mt-5 w-full rounded-2xl bg-[#211F1B] py-4 font-semibold text-white transition hover:bg-[#39352F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create Group ➡️"}
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
