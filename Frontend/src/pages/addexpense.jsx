import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Addexpense = () => {
    const navigate = useNavigate();

    const [category, setCategory] = useState("food");
    const [paidBy, setPaidBy] = useState("You");

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
                                Goa Trip
                            </p>
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
                            placeholder="e.g. Dinner at the beach shack"
                        />
                    </div>


                    {/* Amount */}
                    <div className="mt-5 flex flex-col">
                        <p>Amount</p>

                        <input
                            className="rounded-xl mt-3 p-4 border border-[#DED6C7] bg-[#FFFDF8]"
                            placeholder="₹ 0.00"
                            type="number"
                        />
                    </div>


                    {/* Category */}
                    <div className="mt-5">
                        <p>Category</p>
                    </div>

                    <div className="flex items-start mt-5 flex-wrap gap-2">

                        {/* Food */}
                        <button
                            onClick={() => setCategory("food")}
                            className={`cursor-pointer rounded-full border px-4 py-2 ${category === "food"
                                ? "bg-[#211E1A] text-white"
                                : "bg-[#FFFDF8] text-[#211F1B]"
                                }`}
                        >
                            Food
                        </button>


                        {/* Shopping */}
                        <button
                            onClick={() => setCategory("Shopping")}
                            className={`cursor-pointer rounded-full border px-4 py-2 ${category === "Shopping"
                                ? "bg-[#211E1A] text-white"
                                : "bg-[#FFFDF8] text-[#211F1B]"
                                }`}
                        >
                            Shopping
                        </button>


                        {/* Transit */}
                        <button
                            onClick={() => setCategory("Transit")}
                            className={`cursor-pointer rounded-full border px-4 py-2 ${category === "Transit"
                                ? "bg-[#211E1A] text-white"
                                : "bg-[#FFFDF8] text-[#211F1B]"
                                }`}
                        >
                            Transit
                        </button>


                        {/* Stay */}
                        <button
                            onClick={() => setCategory("Stay")}
                            className={`cursor-pointer rounded-full border px-4 py-2 ${category === "Stay"
                                ? "bg-[#211E1A] text-white"
                                : "bg-[#FFFDF8] text-[#211F1B]"
                                }`}
                        >
                            Stay
                        </button>


                        {/* Fun */}
                        <button
                            onClick={() => setCategory("Fun")}
                            className={`cursor-pointer rounded-full border px-4 py-2 ${category === "Fun"
                                ? "bg-[#211E1A] text-white"
                                : "bg-[#FFFDF8] text-[#211F1B]"
                                }`}
                        >
                            Fun
                        </button>

                    </div>


                    {/* Paid By */}
                    <div className="mt-5">
                        <p>Paid By</p>
                    </div>

                    <div className="flex items-start gap-4 mt-4">

                        {/* You */}
                        <div className="flex flex-col items-center">
                            {/* <button className="w-12 h-12 rounded-full bg-[#8B527D] text-white flex items-center justify-center border-2 cursor-pointer border-[#DED6C7]">
                                Y
                            </button> */}

                            <button
                                onClick={() => setPaidBy("You")}
                                className={`w-12 h-12 bg-[#8B527D] text-white rounded-full flex items-center justify-center cursor-pointer  ${paidBy === "You"
                                    ? "border-black"
                                    : "border-[#DED6C7]"
                                    }`}
                            >
                                Y
                            </button>

                            <span className="text-sm text-[#756F65] mt-1">
                                You
                            </span>
                        </div>


                        {/* Riya */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => setPaidBy("Riya")}
                                className={`w-12 h-12 rounded-full bg-[#A58B5B] text-white flex items-center justify-center cursor-pointer border-2 ${paidBy === "Riya"
                                        ? "border-black"
                                        : "border-[#DED6C7]"
                                    }`}
                            >
                                R
                            </button>

                            <span className="text-sm text-[#756F65] mt-1">
                                Riya
                            </span>
                        </div>


                        {/* Kabir */}
                        <div className="flex flex-col items-center">
                            <button className="w-12 h-12 rounded-full bg-[#C94B35] text-white flex items-center justify-center border-2 cursor-pointer border-[#DED6C7]">
                                K
                            </button>

                            <span className="text-sm text-[#756F65] mt-1">
                                Kabir
                            </span>
                        </div>


                        {/* Dev */}
                        <div className="flex flex-col items-center">
                            <button className="w-12 h-12 rounded-full bg-[#315878] text-white flex items-center justify-center border-2 cursor-pointer border-[#DED6C7]">
                                D
                            </button>

                            <span className="text-sm text-[#756F65] mt-1">
                                Dev
                            </span>
                        </div>

                    </div>


                    {/* Next Button */}
                    <button className="w-full rounded-2xl p-5 mt-6 bg-black text-white border border-[#B8A98F] text-center font-semibold transition">
                        Next: Choose Split
                    </button>

                </div>

            </div>
        </div>
    );
};

export default Addexpense;