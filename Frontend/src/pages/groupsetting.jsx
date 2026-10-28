
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GroupSettings = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [groupName, setGroupName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🏝️");
  const [alertLimit, setAlertLimit] = useState("1000");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [members, setMembers] = useState([]);

  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);



  const icons = ["🏝️", "⛰️", "🏢", "🍴", "✈️", "🏕️", "🏠", "🍺"];

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return null;
    }

    return token;
  };


  const fetchGroupDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch group details");
      }

      setGroupName(data.group.name ?? "");
      setSelectedIcon(data.group.icon || "🏝️");
      setAlertLimit(String(data.group.alertLimit ?? 1000));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate]);



  const fetchMemberDetails = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch group details");
      }
      console.log("Members response:", data.members);
      setMembers(data.members)
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  useEffect(() => {
    fetchGroupDetails();
    fetchMemberDetails();
  }, [groupId]);


  const handleSaveChanges = async (fields) => {
    setError("");
    setSuccess("");

    if (fields.name !== undefined && !fields.name.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    if (
      fields.alertLimit !== undefined &&
      (fields.alertLimit.trim() === "" ||
        !Number.isFinite(Number(fields.alertLimit)) ||
        Number(fields.alertLimit) < 0)
    ) {
      setError("Enter a valid, non-negative alert limit.");
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      setSaving(true);

      const payload = { ...fields };

      if (payload.name !== undefined) {
        payload.name = payload.name.trim();
      }

      if (payload.alertLimit !== undefined) {
        payload.alertLimit = Number(payload.alertLimit);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update group");
      }

      // Matches the current backend response: { message, updatedgroup }
      const updatedGroup = data.updatedgroup;

      if (updatedGroup) {
        setGroupName(updatedGroup.name ?? "");
        setSelectedIcon(updatedGroup.icon || "🏝️");
        setAlertLimit(String(updatedGroup.alertLimit ?? 1000));
      } else {
        // If the backend returns { group } instead, use that property.
        const group = data.group;

        if (group) {
          setGroupName(group.name ?? "");
          setSelectedIcon(group.icon || "🏝️");
          setAlertLimit(String(group.alertLimit ?? 1000));
        }
      }

      setSuccess("Changes saved successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleSearchUser = async () => {


    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearching(false)
      return;
    }

    setSearching(true)
    setError("")
    try {
      const token = getToken();
      if (!token) return;


      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users?search=${encodeURIComponent(searchTerm.trim())}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update group");
      }

      setSearchResults(data.users)

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSearching(false)

    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EA] p-8 text-center">
        Loading group settings...
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-[#F8F4EA] px-5 py-5 text-[#211F1B]">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EBDD] text-2xl hover:bg-[#EAE1CF]"
          >
            ‹
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Group Settings
            </h1>
            <p className="mt-1 text-sm text-[#756F65]">
              {groupName || "Your group"}
            </p>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <p role="alert" className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mb-4 rounded-xl bg-green-100 p-3 text-sm text-green-800">
            {success}
          </p>
        )}

        {/* Group Details */}
        <section className="rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-5 sm:p-6">
          <h2 className="text-xl font-bold">Group Details</h2>
          <p className="mt-1 text-sm text-[#756F65]">
            Update your group name and icon.
          </p>

          <label className="mt-5 block text-sm font-semibold" htmlFor="groupName">
            Group name
          </label>

          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Goa Trip 2026"
            maxLength={100}
            className="mt-2 h-12 w-full rounded-xl border border-[#DED6C7] bg-[#FFFDF8] px-4 outline-none focus:border-[#756F65]"
          />

          <p className="mt-5 text-sm font-semibold">Group icon</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                aria-label={`Select ${icon} group icon`}
                aria-pressed={selectedIcon === icon}
                onClick={() => setSelectedIcon(icon)}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EBDD] text-2xl transition ${selectedIcon === icon
                  ? "ring-2 ring-[#176B52] ring-offset-2"
                  : "hover:bg-[#EAE1CF]"
                  }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              handleSaveChanges({
                name: groupName,
                icon: selectedIcon,
              })
            }
            className="mt-5 w-full rounded-xl bg-[#211F1B] py-3 font-semibold text-white transition hover:bg-[#39352F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </section>

        {/* Members — still hardcoded */}
        <section className="mt-5 rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              Members{" "}
              <span className="font-normal text-[#756F65]">
                ({members.length})
              </span>
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowAddMember(true);
                setSearchTerm("");
                setSearchResults([]);
                setSelectedUser(null);
                setError("");
                setSuccess("");
              }}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-[#316B52] px-3 py-2.5 text-sm font-semibold text-[#316B52] transition hover:bg-[#EAF3ED]"
            >
              <span className="text-lg leading-none">+</span>
              Add Member
            </button>
          </div>

          {showAddMember && (
            <div className="mt-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email"
                className="w-full rounded-xl border p-3"
              />

              <button
                type="button"
                onClick={handleSearchUser}
                disabled={searching}
                className="mt-3 rounded-xl bg-[#211F1B] px-5 py-2 font-semibold text-white disabled:opacity-60"
              >
                {searching ? "Searching..." : "Search"}
              </button>
              {selectedUser && (
                <div className="mt-3 rounded-xl border border-[#DED6C7] p-3">
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-[#756F65]">
                    {selectedUser.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            {members.map((member, index) => (
              <div
                key={member._id}
                className={`flex items-center gap-3 py-4 ${index !== members.length - 1
                  ? "border-b border-[#DED6C7]"
                  : ""
                  }`}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
                  style={{
                    backgroundColor: "#A58B5B",
                  }}
                >
                  {member.userId?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold sm:text-base">
                    {member.userId?.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#756F65] sm:text-sm">
                    {member.userId?.email}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${member.role === "admin"
                    ? "bg-[#EAF3ED] text-[#316B52]"
                    : "bg-[#F1EBDD] text-[#756F65]"
                    }`}
                >
                  {member.role}
                </span>

                <button
                  type="button"
                  aria-label={`Options for ${member.name}`}
                  onClick={() =>
                    alert(`Member options for ${member.name} are not implemented yet.`)
                  }
                  className="shrink-0 rounded-lg px-2 py-1 text-xl leading-none text-[#756F65] hover:bg-[#F1EBDD]"
                >
                  ⋮
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Group Alert Limit */}
        <section className="mt-5 rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-5 sm:p-6">
          <h2 className="text-lg font-bold">Group Alert Limit</h2>

          <p className="mt-2 text-sm leading-5 text-[#756F65]">
            Get notified when any member's balance exceeds this amount.
          </p>

          <div className="mt-4 flex h-12 overflow-hidden rounded-xl border border-[#DED6C7]">
            <span className="flex items-center justify-center bg-[#F1EBDD] px-4 font-semibold">
              ₹
            </span>

            <input
              type="number"
              min="0"
              value={alertLimit}
              onChange={(e) => setAlertLimit(e.target.value)}
              aria-label="Group alert limit in rupees"
              className="min-w-0 flex-1 bg-[#FFFDF8] px-4 outline-none focus:bg-white"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveChanges({ alertLimit })}
            className="mt-4 w-full rounded-xl bg-[#211F1B] py-3 font-semibold text-white transition hover:bg-[#39352F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Limit"}
          </button>

          <p className="mt-3 text-xs leading-5 text-[#756F65]">
            All group members will be notified when this limit is exceeded.
          </p>
        </section>

        {/* Danger Zone */}
        <section className="mt-5 rounded-2xl border border-red-300 bg-[#FFFDF8] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>

          <p className="mt-2 text-sm text-[#756F65]">
            These actions cannot be undone.
          </p>

          <button
            type="button"
            onClick={() =>
              alert("Group deletion is not implemented yet.")
            }
            className="mt-4 w-full rounded-xl border border-red-400 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete Group
          </button>
        </section>
      </div>
    </div>
  );
};

export default GroupSettings;
