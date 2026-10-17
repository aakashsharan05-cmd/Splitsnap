
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const members = [
  {
    name: "Riya Sharma",
    email: "riya@example.com",
    initial: "R",
    color: "#A58B5B",
  },
  {
    name: "Kabir Mehta",
    email: "kabir@example.com",
    initial: "K",
    color: "#C94B35",
  },
  {
    name: "Dev Kumar",
    email: "dev@example.com",
    initial: "D",
    color: "#315878",
  },
];

const CreateGroup = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("✈️");
  const [selectedMembers, setSelectedMembers] = useState([
    "riya@example.com",
    "kabir@example.com",
    "dev@example.com",
  ]);
  const [alertLimit, setAlertLimit] = useState("1000");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const icons = ["✈️", "🏠", "🎉", "🍕", "🏕️"];

  const filteredMembers = members.filter((member) => {
    const search = memberName.toLowerCase().trim();
    return (
      member.name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search)
    );
  });

  const createGroups = async () => {
    if (creating) return;

    setError("");
    setSuccess("");

    if (!groupName.trim()) {
      setError("Please enter a group name.");
      return;
    }

    if (alertLimit.trim() === "" || !Number.isFinite(Number(alertLimit)) ||
        Number(alertLimit) < 0) {
      setError("Please enter a valid alert limit.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        "http://localhost:5000/api/groups",
        {
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
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to create group.");
      }

      setSuccess("Group created successfully!");

      // Group creation is complete. Member addition is a separate API step.
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
                  className={`h-12 w-12 rounded-xl bg-[#F5E3CB] text-2xl ${
                    selectedIcon === icon
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

        {/* Members */}
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
            onChange={(e) => setMemberName(e.target.value)}
            className="mt-4 h-14 w-full rounded-xl border border-[#DED6C7] bg-[#FFFDF8] px-4"
            placeholder="🔍 Search by email or name"
          />

          {filteredMembers.length === 0 && (
            <p className="mt-4 text-sm text-[#756F65]">
              No matching members found.
            </p>
          )}

          {filteredMembers.map((member) => {
            const isSelected = selectedMembers.includes(member.email);

            return (
              <button
                type="button"
                key={member.email}
                onClick={() =>
                  setSelectedMembers((previous) =>
                    previous.includes(member.email)
                      ? previous.filter((email) => email !== member.email)
                      : [...previous, member.email]
                  )
                }
                className="mt-5 flex w-full items-center gap-4 text-left"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{member.name}</p>
                  <p className="mt-1 text-sm text-[#756F65]">
                    {member.email}
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

        {/* Error / success */}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mt-4 text-sm text-green-700">
            {success}
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
