
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const ChooseSplit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const expense = location.state;
    const { groupId } = useParams();

    const [splitType, setSplitType] = useState("Equal");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [membersShare, setMembersShare] = useState([]);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const totalAmount = Number(expense?.amount || 0);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login", { replace: true });
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/api/groups/${groupId}/members`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch members"
                    );
                }

                const fetchedMembers = data.members || [];

                const normalizedMembers = fetchedMembers.map((member) => {
                    const user = member.userId;

                    return {
                        ...member,
                        userId: user?._id || user,
                        name: user?.name || member.name || "User",
                    };
                });

                setMembers(normalizedMembers);

                setMembersShare(
                    normalizedMembers.map((member) => ({
                        userId: member.userId,
                        percentage: "",
                        amount: "",
                    }))
                );

                setSelectedMembers(
                    normalizedMembers.map((member) => member.userId)
                );
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchGroupMembers();
    }, [groupId, navigate]);

    const toggleMember = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );

        setError("");
    };

    const updateMemberShare = (userId, field, value) => {
        setMembersShare((prev) =>
            prev.map((item) =>
                item.userId === userId
                    ? { ...item, [field]: value }
                    : item
            )
        );

        setError("");
    };

    const selectedShares = membersShare.filter((item) =>
        selectedMembers.includes(item.userId)
    );

    const totalPercentage = selectedShares.reduce(
        (sum, item) => sum + (Number(item.percentage) || 0),
        0
    );

    const totalExactAmount = selectedShares.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const isSplitValid =
        selectedMembers.length > 0 &&
        (splitType === "Equal" ||
            (splitType === "Percentage" &&
                Math.abs(totalPercentage - 100) < 0.000001 &&
                selectedShares.every(
                    (item) =>
                        item.percentage.trim() !== "" &&
                        Number(item.percentage) >= 0
                )) ||
            (splitType === "Exact Amount" &&
                Math.abs(totalExactAmount - totalAmount) < 0.001 &&
                selectedShares.every(
                    (item) =>
                        item.amount.trim() !== "" &&
                        Number(item.amount) >= 0
                )));


    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setError("");

        if (!expense?.description || totalAmount <= 0) {
            setError("Expense details are missing. Please go back and try again.");
            return;
        }

        if (!expense?.paidBy) {
            setError("Please select who paid for this expense.");
            return;
        }

        if (selectedMembers.length === 0) {
            setError("Select at least one member.");
            return;
        }

        const selectedShares = membersShare.filter((item) =>
            selectedMembers.includes(item.userId)
        );

        let splits = [];

        if (splitType === "Equal") {
            splits = selectedMembers.map((userId) => ({
                user: userId,
                amount: Number(
                    (totalAmount / selectedMembers.length).toFixed(2)
                ),
            }));
        } else if (splitType === "Percentage") {
            const totalPercentage = selectedShares.reduce(
                (sum, item) => sum + Number(item.percentage || 0),
                0
            );

            if (
                selectedShares.some((item) => item.percentage.trim() === "") ||
                Math.abs(totalPercentage - 100) > 0.000001
            ) {
                setError("Percentages must add up to exactly 100%.");
                return;
            }

            splits = selectedShares.map((item) => ({
                user: item.userId,
                percentage: Number(item.percentage),
            }));
        } else {
            const totalExactAmount = selectedShares.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            );

            if (
                selectedShares.some((item) => item.amount.trim() === "") ||
                Math.abs(totalExactAmount - totalAmount) > 0.001
            ) {
                setError("Member amounts must equal the total expense.");
                return;
            }

            splits = selectedShares.map((item) => ({
                user: item.userId,
                amount: Number(item.amount),
            }));
        }

        const payload = {
            description: expense.description,
            amount: totalAmount,
            category: expense.category,
            paidBy: expense.paidBy,
            splitType:
                splitType === "Equal"
                    ? "equal"
                    : splitType === "Percentage"
                        ? "percentage"
                        : "exact",
            splits,
        };

        try {
            const token = localStorage.getItem("token");
            setSaving(true);

            const response = await fetch(
                `http://localhost:5000/api/expenses/${groupId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save expense.");
            }

            navigate(`/groups/${groupId}`);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F4EA] p-8 text-center">
                Loading members...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F4EA] px-5 py-8 text-[#211F1B]">
            <div className="mx-auto max-w-xl">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-11 w-11 rounded-xl bg-[#F1EBDD] text-2xl"
                    >
                        ‹
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Split the bill
                        </h1>
                        <p className="mt-1 text-sm text-[#756F65]">
                            {expense?.description} · ₹
                            {totalAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex w-full items-center gap-1 rounded-xl bg-[#F1EBDD] p-1">
                    {["Equal", "Percentage", "Exact Amount"].map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setSplitType(type);
                                setError("");
                            }}
                            className={`flex-1 rounded-lg px-1 py-3 text-sm font-medium transition ${splitType === type
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

                <div className="mt-6 bg-[#FFFDF8] px-5 py-2 shadow-sm">
                    {members.map((member, index) => {
                        const userId = member.userId;
                        const name = member.name;
                        const isSelected = selectedMembers.includes(userId);

                        const share = membersShare.find(
                            (item) => item.userId === userId
                        );

                        let displayedAmount = "—";

                        if (isSelected && splitType === "Equal") {
                            displayedAmount =
                                selectedMembers.length > 0
                                    ? `₹${(
                                        totalAmount /
                                        selectedMembers.length
                                    ).toFixed(2)}`
                                    : "—";
                        } else if (
                            isSelected &&
                            splitType === "Percentage" &&
                            share?.percentage !== ""
                        ) {
                            displayedAmount = `₹${(
                                (totalAmount *
                                    Number(share?.percentage || 0)) /
                                100
                            ).toFixed(2)}`;
                        }

                        return (
                            <div
                                key={userId}
                                className={`flex items-center justify-between gap-3 py-5 ${index !== members.length - 1
                                        ? "border-b border-dashed border-[#DED6C7]"
                                        : ""
                                    }`}
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <button
                                        onClick={() => toggleMember(userId)}
                                        aria-label={`Toggle ${name}`}
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${isSelected
                                                ? "border-[#316B52] bg-[#316B52] text-white"
                                                : "border-[#C9B99A]"
                                            }`}
                                    >
                                        {isSelected && "✓"}
                                    </button>

                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-[#E8DFD0] font-semibold text-white"
                                        style={{
                                            backgroundColor:
                                                member.color || "#8B527D",
                                        }}
                                    >
                                        {name.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="truncate font-medium">
                                        {name}
                                    </span>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {splitType === "Equal" && (
                                        <span className="text-sm">
                                            {isSelected ? displayedAmount : "—"}
                                        </span>
                                    )}

                                    {splitType === "Percentage" &&
                                        isSelected && (
                                            <>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="any"
                                                    value={share?.percentage ?? ""}
                                                    onChange={(e) =>
                                                        updateMemberShare(
                                                            userId,
                                                            "percentage",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="%"
                                                    aria-label={`${name} percentage`}
                                                    className="w-20 rounded-lg border border-[#DED6C7] bg-[#FFFDF8] p-2 text-right"
                                                />
                                                <span className="text-sm">
                                                    {displayedAmount}
                                                </span>
                                            </>
                                        )}

                                    {splitType === "Exact Amount" &&
                                        isSelected && (
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={share?.amount ?? ""}
                                                onChange={(e) =>
                                                    updateMemberShare(
                                                        userId,
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="₹0.00"
                                                aria-label={`${name} amount`}
                                                className="w-28 rounded-lg border border-[#DED6C7] bg-[#FFFDF8] p-2 text-right"
                                            />
                                        )}
                                </div>
                            </div>
                        );
                    })}

                    {!members.length && (
                        <p className="py-5 text-sm text-[#756F65]">
                            No group members found.
                        </p>
                    )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#EAF2EC] p-4">
                    <span className="text-sm text-[#756F65]">
                        {splitType === "Equal" &&
                            `Split equally across ${selectedMembers.length} people`}
                        {splitType === "Percentage" &&
                            `Total percentage: ${totalPercentage.toFixed(2)}%`}
                        {splitType === "Exact Amount" &&
                            `Assigned: ₹${totalExactAmount.toFixed(2)} / ₹${totalAmount.toFixed(2)}`}
                    </span>

                    <span className="shrink-0 text-sm font-semibold">
                        {splitType === "Equal" &&
                            (selectedMembers.length ? "Equal ✓" : "Select members")}
                        {splitType === "Percentage" &&
                            (Math.abs(totalPercentage - 100) < 0.000001
                                ? "100% ✓"
                                : `${(100 - totalPercentage).toFixed(2)}% left`)}
                        {splitType === "Exact Amount" &&
                            (Math.abs(totalExactAmount - totalAmount) < 0.001
                                ? "Total ✓"
                                : `₹${(totalAmount - totalExactAmount).toFixed(2)} left`)}
                    </span>
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving || !members.length}
                    className="mt-5 w-full rounded-2xl bg-[#211F1B] py-4 font-semibold text-white disabled:opacity-50"
                >
                    {saving ? "Saving..." : "✓ Save expense"}
                </button>
            </div>
        </div>
    );
};

export default ChooseSplit;
