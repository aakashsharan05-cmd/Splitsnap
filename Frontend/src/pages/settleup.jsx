import React from "react";
import { useNavigate } from "react-router-dom";

const SettleUp = () => {
  const navigate = useNavigate();

  const members = [
    {
      name: "Riya Sharma",
      email: "riya@example.com",
      initial: "R",
      amount: 1830,
      direction: "Riya pays you",
      subtitle: "settles their full balance",
      color: "#A58B5B",
    },
    {
      name: "Kabir Mehta",
      email: "kabir@example.com",
      initial: "K",
      amount: 420,
      direction: "You pay Kabir",
      subtitle: "settles their full balance",
      color: "#C94B35",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EA] px-5 py-5 text-[#211F1B]">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-11 h-11 shrink-0 rounded-xl bg-[#F1EBDD] text-2xl hover:bg-[#EAE1CF]"
          >
            ‹
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Settle up
            </h1>
            <p className="text-sm text-[#756F65] mt-1">
              Goa Trip
            </p>
          </div>
        </div>

        {/* Information banner */}
        <div className="my-3 flex items-center gap-3 rounded-xl bg-[#F1EBDD] p-5">
          <span className="shrink-0" aria-hidden="true">
            💵
          </span>
          <p className="text-sm leading-6 text-[#756F65]">
            Suggested payments below settle the group with the{" "}
            <span className="font-semibold text-[#211F1B]">
              fewest transactions possible
            </span>
            , instead of everyone paying everyone.
          </p>
        </div>

        {/* Section heading */}
        <h2 className="mt-8 mb-4 text-sm font-semibold uppercase tracking-wide text-[#756F65]">
          Suggested settlements
        </h2>

        {/* Settlement card */}
        <div className="rounded-2xl bg-[#FFFDF8] px-5 divide-y divide-dashed divide-[#DED6C7]">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between gap-3 py-5"
            >
              {/* Member details */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-[#DED6C7] ring-offset-2 ring-offset-[#FFFDF8]"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base">
                    {member.direction}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-[#756F65]">
                    {member.subtitle}
                  </p>
                </div>
              </div>

              {/* Amount and action */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span className="font-semibold text-sm sm:text-base text-[#176B52] whitespace-nowrap">
                  ₹{member.amount.toLocaleString("en-IN")}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    alert(`Payment confirmation for ${member.name} will be implemented later.`)
                  }
                  className="rounded-full border border-[#267653] px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#267653] whitespace-nowrap hover:bg-[#EAF3ED] transition"
                >
                  Mark paid
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Settle entire group */}
        <button
          type="button"
          
          className="mt-6 w-full flex items-center justify-center gap-3 rounded-2xl bg-[#211F1B] px-4 py-4 text-white font-semibold hover:bg-[#39352F] transition"
        >
          <span aria-hidden="true">🎉</span>
          Mark entire group as settled
        </button>
      </div>
    </div>
  );
};

export default SettleUp;