import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const creategroup = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("✈️");
  const [selectedMembers, setSelectedMembers] = useState([
    "riya@example.com",
    "kabir@example.com",
    "dev@example.com",
  ]);
  const [alertLimit, setAlertLimit] = useState(1000);

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

  return (
    <div>
      <div className="min-h-screen bg-[#F8F4EA] px-5 py-5 text-[#211F1B]">
        <div className="max-w-xl mx-auto">


          {/* Header */}

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-xl bg-[#F1EBDD] text-2xl"
            >
              ‹
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create Group
              </h1>

              <p className="text-sm text-[#756F65] mt-1">
                Start sharing expenses together
              </p>
            </div>
          </div>


          {/* groupname */}
          <div className="rounded-2xl w-full bg-[#FFFDF8] mt-5 p-6 border border-[#DED6C7]">

            <div className="flex flex-col">

              {/* Starting icon */}
              <div className="w-22 h-22 rounded-2xl bg-[#F3EEDF] flex items-center justify-center text-3xl">
                👥
              </div>

              <p className="font-semibold text-xl mt-5">
                Give your group a name
              </p>

              <p className="text-[#756F65] mt-3">
                A trip, a flat or just your friends.
              </p>

              <p className="font-semibold mt-5">
                Group name
              </p>

              <input
                type="text" value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="rounded-xl w-full h-14 mt-4 border border-[#DED6C7] px-4 bg-[#FFFDF8]"
                placeholder="e.g. Goa Trip 2026"
              />

              <p className="font-semibold mt-5">
                Choose a group icon
              </p>

              <div className="flex items-center gap-3 mt-4 flex-wrap">

                <button
                  onClick={() => setSelectedIcon("✈️")}
                  className={`w-12 h-12 rounded-xl text-2xl ${selectedIcon === "✈️"
                    ? "ring-2 ring-[#211F1B]"
                    : ""
                    } bg-[#F5E3CB]`}
                >
                  ✈️
                </button>


                <button
                  onClick={() => setSelectedIcon("🏠")}
                  className={`w-12 h-12 rounded-xl text-2xl ${selectedIcon === "🏠"
                    ? "ring-2 ring-[#211F1B]"
                    : ""
                    } bg-[#F5E3CB]`}
                >
                  🏠
                </button>


                <button
                  onClick={() => setSelectedIcon("🎉")}
                  className={`w-12 h-12 rounded-xl text-2xl ${selectedIcon === "🎉"
                    ? "ring-2 ring-[#211F1B]"
                    : ""
                    } bg-[#F5E3CB]`}
                >
                  🎉
                </button>



                <button
                  onClick={() => setSelectedIcon("🍕")}
                  className={`w-12 h-12 rounded-xl text-2xl ${selectedIcon === "🍕"
                    ? "ring-2 ring-[#211F1B]"
                    : ""
                    } bg-[#F5E3CB]`}
                >
                  🍕
                </button>



                <button
                  onClick={() => setSelectedIcon("🏕️")}
                  className={`w-12 h-12 rounded-xl text-2xl ${selectedIcon === "🏕️"
                    ? "ring-2 ring-[#211F1B]"
                    : ""
                    } bg-[#F5E3CB]`}
                >
                  🏕️
                </button>


              </div>
            </div>
          </div>


          {/* Add members */}
          <div className="rounded-2xl w-full bg-[#FFFDF8] mt-5 p-6 border border-[#DED6C7]">
            <div className="w-full   mt-1 flex items-center justify-between">
              <span className="text-sm text-[#756F65]">
                Add Members
              </span>

              <span className="font-semibold text-sm">
                {selectedMembers.length} selected
              </span>
            </div>
            <input
              type="text" value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              className="rounded-xl w-full h-14 mt-4 border border-[#DED6C7] px-4 bg-[#FFFDF8]"
              placeholder="🔍  search by email or name"
            />


            {members.map((member) => {
              const isSelected = selectedMembers.includes(member.email);

              return (
                <div
                  key={member.email}
                  onClick={() =>
                    setSelectedMembers((prev) =>
                      prev.includes(member.email)
                        ? prev.filter((email) => email !== member.email)
                        : [...prev, member.email]
                    )
                  }
                  className="flex items-center gap-4 mt-5 cursor-pointer"
                >
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initial}
                  </div>

                  {/* Member details */}
                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-[#756F65] mt-1">
                      {member.email}
                    </p>
                  </div>

                  {/* Selected icon */}
                  <span className="text-[#316B52] text-xl">
                    {isSelected ? "✓" : ""}
                  </span>
                </div>
              );
            })}

          </div>


          <div className="rounded-2xl w-full bg-[#FFFDF8] mt-5 p-6 border border-[#DED6C7]">

            <div className="mt-4">
              <label className="font-semibold block mb-2">
                Alert limit (₹)
              </label>

              <input
                type="number"
                min="0"
                value={alertLimit}
                onChange={(e) => setAlertLimit(e.target.value)}
                className="rounded-xl w-full h-14 border border-[#DED6C7] px-4 bg-[#FFFDF8]"
              />

              <p className="text-sm text-[#756F65] mt-2">
                Notify members when a balance crosses this limit.
              </p>

              <p className="text-sm text-[#756F65] mt-1">
                Default limit · ₹{Number(alertLimit || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>


          {/* Save Button */}
          <button className="w-full bg-[#211F1B] rounded-2xl mt-5 py-4 text-white font-semibold cursor-pointer">
            Create Group ➡️
          </button>


        </div>
      </div>
    </div>
  )
}

export default creategroup
