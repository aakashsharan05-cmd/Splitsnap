import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const SettleUp = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settlement, setSettlement] = useState([]);
  const [paymentAmounts, setPaymentAmounts] = useState({});

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/groups/${groupId}/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch balances"
          );
        }
        const { sSettlement } = balanceCalculator(data.finalAmount);
        setSettlement(sSettlement);
        setBalances(data.finalAmount || []);


      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [groupId, navigate]);

  const balanceCalculator = (balances) => {
    const creditor = balances.filter(num => num.balance > 0)
    const debtors = balances.filter(num => num.balance < 0)

    const ccreditor = creditor.map(item => ({
      ...item
    }));
    const cdebitors = debtors.map(item => ({
      ...item,
      balance: Math.abs(item.balance)
    }));

    const sSettlement = []
    let i = 0
    let j = 0
    const n = ccreditor.length
    const m = cdebitors.length
    while (i < n && j < m) {
      const payment = Math.round(
        Math.min(ccreditor[i].balance, cdebitors[j].balance) * 100
      ) / 100
      const settle = {
        from: cdebitors[j].user,
        to: ccreditor[i].user,
        fromName: cdebitors[j].name,
        toName: ccreditor[i].name,
        amount: payment
      }
      sSettlement.push(settle)
      ccreditor[i].balance -= payment
      cdebitors[j].balance -= payment
      if (Math.abs(ccreditor[i].balance) < 0.01) i++
      if (Math.abs(cdebitors[j].balance) < 0.01) j++
    }
    return { ccreditor, cdebitors, sSettlement }

  }

  const handleMarkPaid = async (member, enteredAmount) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      console.log("Logged-in user token:", localStorage.getItem("token"));
      console.log("Suggested payer ID:", member.from);
      console.log("Suggested receiver ID:", member.to);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settlements/${groupId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: member.to,
            amount: Number(enteredAmount),
          }),
        }
      );

   
const data = await response.json();

if (!response.ok) {
  console.log("Settlement API error:", data);
  throw new Error(
    data.message || "Failed to fetch balances"
  );
}

    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }
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


        {loading && <p>Loading balances...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Settlement card */}


        <div className="rounded-2xl bg-[#FFFDF8] px-4 sm:px-6 divide-y divide-dashed divide-[#DED6C7]">
          {settlement.map((member) => {
            const key = `${member.from}-${member.to}`;
            const enteredAmount = paymentAmounts[key] ?? "";

            return (
              <div
                key={key}
                className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                {/* Payer and receiver */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F1EBDD] text-[#211F1B] font-semibold ring-2 ring-[#DED6C7] ring-offset-2 ring-offset-[#FFFDF8]">
                    {member.fromName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-[#211F1B] break-words">
                      {member.fromName}
                    </p>
                    <p className="mt-1 text-sm text-[#756F65]">
                      pays {member.toName}
                    </p>
                  </div>
                </div>

                {/* Amount and actions */}
                <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end sm:gap-3">
                  <div className="min-w-[100px] sm:text-right">
                    <p className="text-xs text-[#756F65] mb-1 sm:hidden">
                      Suggested amount
                    </p>
                    <span className="font-semibold text-sm sm:text-base text-[#176B52] whitespace-nowrap">
                      ₹{member.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <input
                    type="number"
                    min="0.01"
                    max={member.amount}
                    step="0.01"
                    value={enteredAmount}
                    onChange={(e) =>
                      setPaymentAmounts((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder="Amount (₹)"
                    aria-label={`Payment amount from ${member.fromName} to ${member.toName}`}
                    className="w-32 sm:w-36 rounded-full border border-[#D8CFBD] bg-transparent px-4 py-2.5 text-sm text-[#211F1B] outline-none transition focus:border-[#267653] focus:ring-2 focus:ring-[#267653]/15"
                  />

                  <button
                    type="button"
                    disabled={
                      enteredAmount === "" ||
                      !Number.isFinite(Number(enteredAmount)) ||
                      Number(enteredAmount) <= 0 ||
                      Number(enteredAmount) > member.amount
                    }
                    onClick={() => handleMarkPaid(member, enteredAmount)}
                    className="rounded-full bg-[#211F1B] px-4 py-2.5 text-sm font-medium text-white whitespace-nowrap transition hover:bg-[#39352F] disabled:cursor-not-allowed disabled:bg-[#EAE4D8] disabled:text-[#A49B8D]"
                  >
                    Mark paid
                  </button>
                </div>
              </div>
            );
          })}

          {settlement.length === 0 && !loading && (
            <p className="py-8 text-center text-sm text-[#756F65]">
              Everyone is settled up!
            </p>
          )}
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