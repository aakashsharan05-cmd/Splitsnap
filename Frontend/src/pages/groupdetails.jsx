
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL}/api`;

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Math.abs(amount || 0));

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [groupResponse, membersResponse, balanceResponse, expensesResponse] =
          await Promise.all([
            fetch(`${API}/groups/${groupId}`, { headers }),
            fetch(`${API}/groups/${groupId}/members`, { headers }),
            fetch(`${API}/groups/${groupId}/balance`, { headers }),
            fetch(`${API}/expenses/${groupId}`, { headers }),
          ]);

        const responses = [
          groupResponse,
          membersResponse,
          balanceResponse,
          expensesResponse,
        ];

        if (responses.some((response) => response.status === 401)) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (responses.some((response) => response.status === 403)) {
          throw new Error("You don't have access to this group.");
        }

        const data = await Promise.all(
          responses.map(async (response) => {
            const text = await response.text();

            try {
              return JSON.parse(text);
            } catch {
              throw new Error(
                "Invalid server response. Check your backend routes."
              );
            }
          })
        );

        const [groupData, membersData, balanceData, expensesData] = data;

        for (let i = 0; i < responses.length; i++) {
          if (!responses[i].ok) {
            throw new Error(
              data[i].message || "Unable to load group information."
            );
          }
        }

        if (!ignore) {
          setGroup(groupData.group || groupData);
          setMembers(membersData.members || []);
          setBalances(balanceData.finalAmount || []);
          setExpenses(expensesData.expenses || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchGroupDetails();

    return () => {
      ignore = true;
    };
  }, [groupId, navigate]);

  const getMemberBalance = (member) => {
    const memberId = member.userId?._id || member.userId;

    const entry = balances.find((item) => {
      const balanceUserId = item.user?._id || item.user;
      return String(balanceUserId) === String(memberId);
    });

    return entry?.balance ?? 0;
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "U";

  const avatarColors = [
    "bg-[#94713A]",
    "bg-[#C64B35]",
    "bg-[#416783]",
    "bg-[#865276]",
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EA] px-5 py-6 text-[#211F1B]">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="mb-7 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EBDD] text-2xl hover:bg-[#E9E1D1]"
            >
              ‹
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold">
                {group?.icon || ""} {group?.name || "Group Details"}
              </h1>
              <p className="mt-0.5 text-sm text-[#756F65]">
                {members.length} people
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/groups/${groupId}/settings`)}
            aria-label="Group settings"
            title="Group settings"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EBDD] text-[#211F1B] hover:bg-[#E9E1D1]"
          >
            <Settings size={20} />
          </button>
        </header>
        {loading && (
          <p className="py-10 text-center text-sm text-[#756F65]">
            Loading group details...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Group balances */}
            <section className="relative mb-5 overflow-hidden rounded-[20px] bg-[#211E1A] p-6 text-white">
              <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border border-dashed border-white/15" />

              <p className="relative mb-3 text-xs tracking-wider text-[#C9B99A]">
                GROUP BALANCES
              </p>

              <h2 className="relative mb-6 text-3xl font-bold text-[#F8D99F]">
                {members.length} members
              </h2>

              <div className="relative space-y-3">
                {members.map((member, index) => {
                  const user = member.userId;

                  if (!user || typeof user !== "object") return null;

                  const balance = getMemberBalance(member);

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#F8F4EA] text-xs font-bold text-white ${avatarColors[index % avatarColors.length]
                            }`}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name || "Member"}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            getInitial(user.name)
                          )}
                        </div>

                        <span className="truncate text-sm">
                          {user.name || "Member"}
                        </span>
                      </div>

                      <span
                        className={`shrink-0 text-right text-xs sm:text-sm ${balance > 0
                            ? "text-[#9DD7B7]"
                            : balance < 0
                              ? "text-[#FF866C]"
                              : "text-[#C9B99A]"
                          }`}
                      >
                        {balance > 0
                          ? `Gets back ${formatMoney(balance)}`
                          : balance < 0
                            ? `Owes ${formatMoney(balance)}`
                            : "Settled up"}
                      </span>
                    </div>
                  );
                })}

                {members.length === 0 && (
                  <p className="text-sm text-[#C9B99A]">
                    No members found.
                  </p>
                )}
              </div>
            </section>

            {/* Receipt scanner */}
            <button
              type="button"
              onClick={() => navigate(`/groups/${groupId}/add-expense`)}
              className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-[#C9B99A] bg-[#F3EEDF] p-4 text-left transition hover:bg-[#EEE6D5]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#211E1A] text-2xl text-[#F8D99F]">
                📷
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  Scan a receipt <span className="text-red-500">✧</span>
                </h3>
                <p className="mt-1 text-sm text-[#756F65]">
                  AI reads the amount and splits it for you
                </p>
              </div>

              <span className="text-2xl text-[#756F65]">›</span>
            </button>

            {/* Expense history */}
            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium tracking-wide text-[#756F65]">
                  EXPENSES
                </h2>
                <span className="text-xs text-[#756F65]">
                  {expenses.length} logged
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#DED6C7] bg-[#FFFDF8]">
                {expenses.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="font-medium">No expenses yet</p>
                    <p className="mt-1 text-sm text-[#756F65]">
                      Add your first group expense to get started.
                    </p>
                  </div>
                ) : (
                  expenses.map((expense, index) => (
                    <div
                      key={expense._id}
                      className={`flex items-center gap-3 p-4 ${index !== expenses.length - 1
                          ? "border-b border-[#E9E1D5]"
                          : ""
                        }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EBDD] text-xl">
                        {expense.category === "Food"
                          ? "🍽️"
                          : expense.category === "Stay"
                            ? "🏨"
                            : expense.category === "Transit"
                              ? "🚕"
                              : expense.category === "Shopping"
                                ? "🛍️"
                                : expense.category === "Fun"
                                  ? "🎟️"
                                  : "🧾"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {expense.description || "Expense"}
                        </p>
                        <p className="mt-1 text-xs text-[#756F65]">
                          Paid by {expense.paidBy?.name || "Unknown"}
                          {expense.category ? ` · ${expense.category}` : ""}
                        </p>
                      </div>

                      <p className="shrink-0 text-right font-semibold">
                        {formatMoney(expense.amount)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-2 gap-3 pb-5">
              <button
                type="button"
                onClick={() => navigate(`/groups/${groupId}/add-expense`)}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#211E1A] px-3 py-4 font-semibold text-white transition hover:bg-[#38332D]"
              >
                <span className="text-xl">＋</span>
                Add expense
              </button>

              <button
                type="button"
                onClick={() => navigate(`/groups/${groupId}/settle-up`)}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#3D8064] px-3 py-4 font-semibold text-[#3D8064] transition hover:bg-[#EAF1E8]"
              >
                <span>✓</span>
                Settle up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
