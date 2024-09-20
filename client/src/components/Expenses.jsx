import { useState, useEffect } from "react";
import ExpenseCard from "./ExpenseCard";
import CreateExpenseForm from "../forms/CreateExpenseForm";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../store/groupSlice"; // Assume fetchGroup is an action that refetches group data

export default function Expenses() {
    const [group] = useOutletContext(); // Assuming group is coming from Outlet context
    const [isFormPageActive, setIsFormPageActive] = useState(false);
    const dispatch = useDispatch();
    const [expensesHistory, setExpensesHistory] = useState(group.expensesHistory || []);

    // Update expensesHistory when group data changes
    useEffect(() => {
        setExpensesHistory(group.expensesHistory);
    }, [group]);

    // Function to refresh group data
    const refreshExpenses = () => {
        dispatch(fetchGroups(group._id)); // Fetch updated group data after adding/deleting an expense
        console.log("refreshing expenses", group._id);
    };

    return (
        <div>
            {!isFormPageActive && (
                <div className="bg-stone-800 w-full px-4 py-2 rounded mt-5">
                    <div className="mb-5">
                        <div className="flex justify-between">
                            <p className="font-semibold text-2xl">Expenses</p>
                            <button
                                className="bg-[#48CA9B] text-black px-4 rounded font-bold"
                                onClick={() => setIsFormPageActive(true)}
                            >
                                +
                            </button>
                        </div>

                        <p className="text-sm text-gray-400">
                            Here are the expenses that you created for your group.
                        </p>
                    </div>

                    <div>
                        {expensesHistory?.length ? (
                            expensesHistory.map((expense, index) => (
                                <ExpenseCard
                                    key={index}
                                    group={group}
                                    expense={expense}
                                    refreshExpenses={refreshExpenses} // Pass the refresh function
                                />
                            ))
                        ) : (
                            <p className="py-7">
                                Your group doesn't contain any expense yet.&nbsp;
                                <span
                                    className="text-[#48CA9B] hover:underline cursor-pointer"
                                    onClick={() => setIsFormPageActive(true)}
                                >
                                    Create the first one
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            )}
            {isFormPageActive && (
                <CreateExpenseForm
                    setIsFormPageActive={setIsFormPageActive}
                    group={group}
                    refreshExpenses={refreshExpenses} // Pass the refresh function
                />
            )}
        </div>
    );
}