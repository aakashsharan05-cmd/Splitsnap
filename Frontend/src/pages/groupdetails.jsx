
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const members = [
  { id: 1, name: "Riya", amount: 1830, type: "receive", initial: "R" },
  { id: 2, name: "Kabir", amount: 420, type: "receive", initial: "K" },
  { id: 3, name: "Dev", amount: 960, type: "owe", initial: "D" },
];

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  return (
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
              Goa Trip
            </h1>
            <p className="text-sm text-[#756F65] mt-1">
              4 people
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-[#211E1A] rounded-2xl p-6 mb-6">

          <p className="text-[#C9B99A] text-sm tracking-wider mb-4">
            YOU'RE OWED, NET
          </p>

          <h2 className="text-[#F8D99F] text-4xl font-mono font-bold mb-6">
            ₹2,370.00
          </h2>

          {/* Members Balance */}
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#A58B5B] border-2 border-[#F8F4EA] flex items-center justify-center text-white text-xs font-bold">
                    {member.initial}
                  </div>

                  <span className="text-white">
                    {member.name}
                  </span>
                </div>

                <span className={`font-mono text-sm font-semibold ${member.type === "receive"
                  ? "text-[#8FC5A8]"
                  : "text-[#E98970]"
                  }`}>
                  {member.type === "receive" ? "↘ owes you" : "↗ you owe"} ₹
                  {member.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Receipt */}
        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[#C9B99A] bg-[#F3EEDF] p-5 cursor-pointer">

          <div className="w-13 h-13 rounded-xl bg-[#211E1A] text-[#F8D99F] flex items-center justify-center text-2xl">
            📷
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">
              Scan a receipt ✨
            </h3>
            <p className="text-sm text-[#756F65] mt-1">
              AI reads the amount and splits it for you
            </p>
          </div>

          <span className="text-2xl text-[#756F65]">›</span>
        </div>
        <div className="flex items-center justify-between mb-4 font-mono mt-6 ">
          <h1>EXPENSES</h1>
          <span>4 LOGGED</span>
        </div>

        {/* Outer row */}
        <div className="bg-[#FFFDF8] rounded-2xl p-5">
          <div className="flex items-center justify-between py-5 border-b border-dashed ">
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full">
                Y
              </div>

              <div className="flex flex-col gap-1">
                <h1>Goa Airbnb</h1>
                <p>you paid</p>
              </div>

            </div>

            <p>₹40000</p>



          </div>
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full">
                Y
              </div>

              <div className="flex flex-col gap-1">
                <h1> Airbnb</h1>
                <p>ravi paid</p>
              </div>

            </div>

            <p>₹20000</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button className="cursor-pointer rounded-2xl bg-[#211E1A] text-white p-5 w-full">
            + Add expense
          </button>

          <button className="cursor-pointer  rounded-2xl border border-[#3D8064] text-[#3D8064] p-5 w-full">
            ✓ Settle up
          </button>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;










