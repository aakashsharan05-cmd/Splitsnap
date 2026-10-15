
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseSplit = () => {
    const navigate = useNavigate();

    const [splitType, setSplitType] = useState("Equal");

    const [selectedMembers, setSelectedMembers] = useState([
        "You",
        "Riya",
        "Kabir",
        "Dev",
    ]);

    const members = [
        { name: "You", initial: "Y", color: "#8B527D" },
        { name: "Riya", initial: "R", color: "#A58B5B" },
        { name: "Kabir", initial: "K", color: "#C94B35" },
        { name: "Dev", initial: "D", color: "#315878" },
    ];

    const toggleMember = (name) => {
        setSelectedMembers((prev) =>
            prev.includes(name)
                ? prev.filter((member) => member !== name)
                : [...prev, name]
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F4EA] px-5 py-8 text-[#211F1B]">
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
                            Split the bill
                        </h1>

                        <p className="text-sm text-[#756F65] mt-1">
                            Dinner · ₹2,000.00
                        </p>
                    </div>
                </div>

                {/* Split type tabs */}
                <div className="flex items-center gap-1 w-full rounded-xl bg-[#F1EBDD] p-1">
                    {["Equal", "Percentage", "Exact Amount"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSplitType(type)}
                            className={`flex-1 rounded-lg py-3 px-1 text-sm font-medium transition ${splitType === type
                                ? "bg-[#FFFDF8] text-[#211F1B] shadow-sm"
                                : "text-[#756F65]"
                                }`}
                        >
                            {type === "Equal" && "= "}
                            {type === "Percentage" && "% "}
                            {type === "Exact Amount" && "# "}
                            {type}
                        </button>
                    ))}
                </div>

                {/* Members list */}
                <div className="mt-6 bg-[#FFFDF8] px-5 py-2 shadow-sm">
                    {members.map((member, index) => {
                        const isSelected = selectedMembers.includes(member.name);

                        return (
                            <div
                                key={member.name}
                                className={`flex items-center justify-between gap-3 py-5 ${index !== members.length - 1
                                    ? "border-b border-dashed border-[#DED6C7]"
                                    : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleMember(member.name)}
                                        aria-label={`Toggle ${member.name}`}
                                        className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center ${isSelected
                                            ? "bg-[#316B52] border-[#316B52] text-white"
                                            : "border-[#C9B99A] bg-transparent"
                                            }`}
                                    >
                                        {isSelected && "✓"}
                                    </button>

                                    <div
                                        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-semibold border-[3px] border-[#E8DFD0]"
                                        style={{ backgroundColor: member.color }}
                                    >
                                        {member.initial}
                                    </div>

                                    <span className="font-medium">
                                        {member.name}
                                    </span>
                                </div>

                                <span className="text-sm whitespace-nowrap">
                                    {isSelected && selectedMembers.length > 0
                                        ? `₹${(2000 / selectedMembers.length).toFixed(2)}`
                                        : "—"}
                                </span>
                            </div>
                        );
                    })}
                </div>


                {/* Split Summary */}
                <div className="w-full bg-[#EAF2EC] rounded-xl mt-5 p-4 flex items-center justify-between">
                    <span className="text-sm text-[#756F65]">
                        Split equally across {selectedMembers.length} people
                    </span>

                    <span className="font-semibold text-sm">
                        100% ✓
                    </span>
                </div>

                {/* Save Button */}
                <button className="w-full bg-[#211F1B] rounded-2xl mt-5 py-4 text-white font-semibold cursor-pointer">
                    ✓ Save expense
                </button>
            </div>
        </div>
    );
};

export default ChooseSplit
