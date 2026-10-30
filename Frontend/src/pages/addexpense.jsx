
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Addexpense = () => {
    const navigate = useNavigate();

    const [category, setCategory] = useState("food");
    const [paidBy, setPaidBy] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [receiptFile, setReceiptFile] = useState(null);
    const [scanning, setScanning] = useState(false);
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

                const [membersResponse, groupResponse] =
                    await Promise.all([
                        fetch(
                            `${import.meta.env.VITE_API_URL}/api/groups/${groupId}/members`,
                            { headers }
                        ),
                        fetch(
                            `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`,
                            { headers }
                        ),
                    ]);

                const [membersData, groupData] = await Promise.all([
                    membersResponse.json(),
                    groupResponse.json(),
                ]);

                if (!membersResponse.ok) {
                    throw new Error(
                        membersData.message || "Failed to fetch members"
                    );
                }

                if (!groupResponse.ok) {
                    throw new Error(
                        groupData.message || "Failed to fetch group"
                    );
                }

                setMembers(membersData.members || []);
                setGroup(groupData.group || groupData);
            } catch (err) {
                setError(err.message || "Something went wrong.");
            }
        };

        fetchGroupDetails();
    }, [groupId, navigate]);

    const getInitial = (name) =>
        name?.charAt(0)?.toUpperCase() || "U";

    const handleScanReeipt = async (receiptFile) => {
        if (receiptFile === null) {
            return
        }
        setScanning(true)
        console.log("handleScanReceipt called");
        const formData = new FormData();
        formData.append("receipt", receiptFile);
        setError("")
        try {
           const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            console.log("Sending request to backend");
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/receipts/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body : formData
                }
            )
            console.log("Response status:", response.status);
            const data =await response.json()
            if(!response.ok){
                 throw new Error(data.message || "Failed to update group");
            }
            console.log(data)
            setDescription(data.receipt.merchant)
            setAmount(data.receipt.totalAmount)
            setCategory(data.receipt.category)
        } catch (error) {
            console.error("Upload failed:", error);
            setError(error.message || "something went  wrong")
        } finally {
            setScanning(false)

        }

    }

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
                                Add Expense
                            </h1>

                            <p className="text-sm text-[#756F65] mt-1">
                                {group?.name || "Loading group..."}
                            </p>
                        </div>
                    </div>

                    {/* Scan Receipt */}

                    <div
                        onClick={() =>
                            document.getElementById("receiptInput")?.click()
                        }
                        className="flex items-center gap-4 rounded-2xl border border-dashed border-[#C9B99A] bg-[#F3EEDF] p-5 cursor-pointer"
                    >
                        <div className="w-13 h-13 rounded-xl bg-[#211E1A] text-[#F8D99F] flex items-center justify-center text-2xl">
                            📷
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold">
                                Scan a receipt ✨
                            </h3>

                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="receiptInput"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        setReceiptFile(file);
                                        console.log("Selected receipt:", file.name);
                                    }
                                    handleScanReeipt(file)
                                }}
                            />

                            <p className="text-sm text-[#756F65] mt-1">
                                AI reads the amount and splits it for you
                            </p>
                        </div>
                    </div>


                    {/* Manual Entry */}
                    <div className="mt-5 text-center font-light">
                        <p>-or enter manually-</p>
                    </div>

                    {/* Description */}
                    <div className="mt-10 flex flex-col">
                        <p>Description</p>
                        <input
                            className="rounded-xl mt-3 p-4 border border-[#DED6C7] bg-[#FFFDF8]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Dinner at the beach shack"
                        />
                    </div>

                    {/* Amount */}
                    <div className="mt-5 flex flex-col">
                        <p>Amount</p>
                        <input
                            className="rounded-xl mt-3 p-4 border border-[#DED6C7] bg-[#FFFDF8]"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="₹ 0.00"
                            type="number"
                            min="0"
                        />
                    </div>

                    {/* Category */}
                    <div className="mt-5">
                        <p>Category</p>
                    </div>

                    <div className="flex items-start mt-5 flex-wrap gap-2">
                        {[
                            { label: "Food", value: "food" },
                            { label: "Shopping", value: "Shopping" },
                            { label: "Transit", value: "Transit" },
                            { label: "Stay", value: "Stay" },
                            { label: "Fun", value: "Fun" },
                            { label: "miscellaneous", value: "miscellaneous" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setCategory(item.value)}
                                className={`cursor-pointer rounded-full border px-4 py-2 ${category === item.value
                                    ? "bg-[#211E1A] text-white"
                                    : "bg-[#FFFDF8] text-[#211F1B]"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Paid By */}
                    <div className="mt-5">
                        <p>Paid By</p>
                    </div>

                    <div className="flex items-start gap-4 mt-4 flex-wrap">
                        {members.map((member) => {
                            const user = member.userId;
                            const userId = user?._id || user;
                            const name = user?.name || member.name || "User";

                            return (
                                <div
                                    key={userId}
                                    className="flex flex-col items-center"
                                >
                                    <button
                                        onClick={() => setPaidBy(userId)}
                                        className={`w-12 h-12 border-2 bg-[#8B527D] text-white rounded-full flex items-center justify-center cursor-pointer ${paidBy === userId
                                            ? "border-black"
                                            : "border-[#DED6C7]"
                                            }`}
                                    >
                                        {getInitial(name)}
                                    </button>

                                    <span className="text-sm text-[#756F65] mt-1">
                                        {name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="mt-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={() => {
                            if (!description.trim()) {
                                setError("Please enter a description.");
                                return;
                            }

                            if (!amount || Number(amount) <= 0) {
                                setError("Please enter a valid amount.");
                                return;
                            }

                            if (!paidBy) {
                                setError("Please select who paid.");
                                return;
                            }

                            setError("");
                            navigate(`/groups/${groupId}/choose-split`, {
                                state: {
                                    description: description.trim(),
                                    amount: Number(amount),
                                    category,
                                    paidBy,
                                },
                            });
                        }}
                        className="w-full rounded-2xl p-5 mt-6 bg-black text-white border border-[#B8A98F] text-center font-semibold transition"
                    >
                        Next: Choose Split
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Addexpense;
