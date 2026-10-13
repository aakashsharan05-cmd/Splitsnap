import React from 'react'
import { useNavigate } from "react-router-dom";

const groups = [
  {
    name: "Goa Trip",
    people: 4,
    _id:1,
    amount: 2370,
  },
  {
    name: "Flat 4B",
    people: 3,
    _id:2,
    amount: 540,
  },
  {
    name: "Weekend Trek Crew",
    people: 5,
    _id:3,
    amount: 0,
  },
];

const n = groups.length

const Dashboard = () => {
  
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8F4EA]  justify-center px-5 py-10 text-[#211F1B]">



      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#211F1B] flex items-center justify-center text-[#F8DFA8] text-lg">
            ₹
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            SplitSnap
          </h1>
        </div>
      </div>

      <div className="bg-[#211E1A] space-y-3 rounded-2xl p-6 mb-7 max-w-xl mx-auto">

        <h1 className="text-[#C9B99A] text-sm tracking-wider font-medium">
          ACROSS ALL GROUPS, YOU'RE OWED
        </h1>

        <h1 className="text-[#F8D99F] text-4xl font-mono font-bold">
          ₹1,830.00
        </h1>

      </div>

      <div className="max-w-xl mx-auto mb-7">



        {/* Groups heading */}
        <div className="flex items-center justify-between mb-4 ">
          <h1>YOUR GROUPS</h1>
          <span>{n} groups</span>
        </div>

        {/* Group cards */}
        <div className="space-y-3 ">

          {groups.map((group) => (
            <div
            key={group._id}
      onClick={() => navigate(`/groups/${group._id}`)}
              className="bg-[#FFFDF8] border border-[#DED6C7] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">

                <h2 className="font-semibold">
                  {group.name}
                </h2>

                <span className="font-mono">
                  ₹{group.amount.toLocaleString("en-IN")}
                </span>

              </div>
              <div className=' font-mono font-bold'>{group.people} Memebers</div>
            </div>
          ))}

        </div>
        <button className="w-full rounded-2xl p-5 mt-6 bg-[#FFFDF8] border border-dashed border-[#B8A98F] text-center font-semibold hover:bg-[#F2EBDD] transition">
          + Create a new Group
        </button>


      </div>

    </div>
  );
};

export default Dashboard;
