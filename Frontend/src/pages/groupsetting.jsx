
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupSettings = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("Goa Trip");
  const [selectedIcon, setSelectedIcon] = useState("🏝️");
  const [alertLimit, setAlertLimit] = useState("1000");

  const members = [
    {
      name: "Aakash Sharan",
      email: "aakash@example.com",
      initial: "A",
      color: "#A58B5B",
      role: "Admin",
    },
    {
      name: "Riya Sharma",
      email: "riya@example.com",
      initial: "R",
      color: "#C94B35",
      role: "Member",
    },
    {
      name: "Kabir Mehta",
      email: "kabir@example.com",
      initial: "K",
      color: "#4778AE",
      role: "Member",
    },
    {
      name: "Dev Kumar",
      email: "dev@example.com",
      initial: "D",
      color: "#92518B",
      role: "Member",
    },
  ];

  const icons = ["🏝️", "⛰️", "🏢", "🍴", "✈️", "🏕️", "🏠", "🍺"];

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

        {/* Group Details */}
        <section className="rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-5 sm:p-6">
          <h2 className="text-xl font-bold">Group Details</h2>
          <p className="mt-1 text-sm text-[#756F65]">
            Update your group name and icon.
          </p>

          <label className="mt-5 block text-sm font-semibold">
            Group name
          </label>

          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Goa Trip 2026"
            className="mt-2 h-12 w-full rounded-xl border border-[#DED6C7] bg-[#FFFDF8] px-4 outline-none focus:border-[#756F65]"
          />

          <p className="mt-5 text-sm font-semibold">Group icon</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {icons.slice(0, 6).map((icon) => (
              <button
                key={icon}
                type="button"
                aria-label={`Select ${icon} group icon`}
                aria-pressed={selectedIcon === icon}
                onClick={() => setSelectedIcon(icon)}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EBDD] text-2xl transition ${
                  selectedIcon === icon
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
            onClick={() => alert("More icons will be added later.")}
            className="mt-4 flex items-center gap-3 text-sm text-[#756F65] hover:text-[#211F1B]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EBDD] text-xl">
              +
            </span>
            Choose from more icons
          </button>

          <button
            type="button"
            onClick={() => alert("Group details API will be connected later.")}
            className="mt-5 w-full rounded-xl bg-[#211F1B] py-3 font-semibold text-white transition hover:bg-[#39352F]"
          >
            Save Changes
          </button>
        </section>

        {/* Members */}
        <section className="mt-5 rounded-2xl border border-[#DED6C7] bg-[#FFFDF8] p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                Members <span className="font-normal text-[#756F65]">({members.length})</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => alert("Add Member functionality will be added later.")}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-[#316B52] px-3 py-2.5 text-sm font-semibold text-[#316B52] transition hover:bg-[#EAF3ED]"
            >
              <span className="text-lg leading-none">+</span>
              Add Member
            </button>
          </div>

          <div>
            {members.map((member, index) => (
              <div
                key={member.email}
                className={`flex items-center gap-3 py-4 ${
                  index !== members.length - 1
                    ? "border-b border-[#DED6C7]"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>

                {/* Name and Email */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold sm:text-base">
                    {member.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#756F65] sm:text-sm">
                    {member.email}
                  </p>
                </div>

                {/* Role */}
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    member.role === "Admin"
                      ? "bg-[#EAF3ED] text-[#316B52]"
                      : "bg-[#F1EBDD] text-[#756F65]"
                  }`}
                >
                  {member.role}
                </span>

                {/* Options */}
                <button
                  type="button"
                  aria-label={`Options for ${member.name}`}
                  onClick={() =>
                    alert(`Member options for ${member.name} will be added later.`)
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
            onClick={() => alert("Alert limit API will be connected later.")}
            className="mt-4 w-full rounded-xl bg-[#211F1B] py-3 font-semibold text-white transition hover:bg-[#39352F]"
          >
            Update Limit
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
              alert("Group deletion will be implemented with backend confirmation.")
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
