
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const ChooseSplit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const expense = location.state;

    const [splitType, setSplitType] = useState("Equal");
    const [selectedMembers, setSelectedMembers] = useState([]);
      const [membersShare, setMembersShare] = useState([]);
    const [error, setError] = useState("");
    const [members, setMembers] = useState([]);
    const { groupId } = useParams();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login", { replace: true });
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [membersResponse] =
                    await Promise.all([
                        fetch(
                            `http://localhost:5000/api/groups/${groupId}/members`,
                            { headers }
                        ),

                    ]);

                const [membersData] = await Promise.all([
                    membersResponse.json()
                ]);

                if (!membersResponse.ok) {
                    throw new Error(
                        membersData.message || "Failed to fetch members"
                    );
                }



                setMembers(membersData.members || []);
                const fetchedMembers = membersData.members || [];

                setMembers(fetchedMembers);

                setSelectedMembers(
                    fetchedMembers.map((member) => {
                        const user = member.userId;
                        return user?._id || user;
                    })
                );

            } catch (err) {
                setError(err.message || "Something went wrong.");
            }
        };

        fetchGroupDetails();
    }, [groupId, navigate]);


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
                            {expense?.description} · ₹{Number(expense?.amount || 0).toFixed(2)}
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
                        const user = member.userId;
                        const userId = user?._id || user;
                        const name = user?.name || member.name || "User";

                        const isSelected = selectedMembers.includes(userId);

                        return (
                            <div
                                key={userId}
                                className={`flex items-center justify-between gap-3 py-5 ${index !== members.length - 1
                                    ? "border-b border-dashed border-[#DED6C7]"
                                    : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleMember(userId)}
                                        aria-label={`Toggle ${name}`}
                                        className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center ${isSelected
                                            ? "bg-[#316B52] border-[#316B52] text-white"
                                            : "border-[#C9B99A] bg-transparent"
                                            }`}
                                    >
                                        {isSelected && "✓"}
                                    </button>

                                    <div
                                        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-semibold border-[3px] border-[#E8DFD0]"
                                        style={{ backgroundColor: member.color || "#8B527D" }}
                                    >
                                        {name.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="font-medium">
                                        {name}
                                    </span>
                                </div>

                                <span className="text-sm whitespace-nowrap">
                                    {isSelected && selectedMembers.length > 0
                                        ? `₹${(
                                            Number(expense?.amount || 0) /
                                            selectedMembers.length
                                        ).toFixed(2)}`
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
