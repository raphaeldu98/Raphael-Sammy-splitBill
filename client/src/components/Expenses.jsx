import { useState, useEffect } from "react";
import ExpenseCard from "./ExpenseCard";
import CreateExpenseForm from "../forms/CreateExpenseForm";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchGroups } from "../store/groupSlice"; // Assume fetchGroup is an action that refetches group data

export default function Expenses() {
    const [group] = useOutletContext(); // Assuming group is coming from Outlet context
    const [isFormPageActive, setIsFormPageActive] = useState(false);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const dispatch = useDispatch();
    const [expensesHistory, setExpensesHistory] = useState([]);

    useEffect(() => {
        if (group.expensesHistory) {
            // Sort expenses by date and time (most recent first)
            const sortedExpenses = [...group.expensesHistory].sort((a, b) => {
                // Parse the date string into a Date object and compare
                return new Date(b.time).getTime() - new Date(a.time).getTime();
            });
            setExpensesHistory(sortedExpenses);
        }
    }, [group]);

    const refreshExpenses = () => {
        dispatch(fetchGroups(group._id)); // Fetch updated group data after adding/deleting an expense
    };

    const handleSelectExpense = (expense, isChecked) => {
        if (expense.expenseTitle !== 'Paid Off') { // Prevent adding "Paid Off" expenses to selection
            if (isChecked) {
                setSelectedExpenses([...selectedExpenses, expense]);
            } else {
                setSelectedExpenses(selectedExpenses.filter(e => e._id !== expense._id));
            }
        }
    };

    const deselectAll = () => {
        setSelectedExpenses([]); // Clear all selected expenses
    };

    const calculateTotal = (type) => {
        return selectedExpenses.reduce((acc, expense) => {
            const numMembers = expense.paidFor.length;
            const individualShare = expense.amount / numMembers;

            if (type === 'Raphael') {
                // If Raphael is in the paidFor list, add his share, otherwise add 0
                return acc + (expense.paidFor.includes('Raphael') ? individualShare : 0);
            }

            if (type === 'Sammy') {
                // If Sammy is in the paidFor list, add his share, otherwise add 0
                return acc + (expense.paidFor.includes('Sammy') ? individualShare : 0);
            }

            if (type === 'Total') {
                return acc + expense.amount;
            }

            return acc;
        }, 0);
    };

    return (
        <div className="flex">
            <div className="w-4/5">
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
                                        handleSelectExpense={handleSelectExpense} // Pass select function
                                        selectedExpenses={selectedExpenses} // Pass selected expenses
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
            
            {/* Right Panel for Summary */}
            <div className="w-1/5 bg-stone-800 p-5 rounded ml-4 mt-5">
                <h2 className="font-semibold text-lg mb-4">Selected Summary</h2>
                <p className="text-base font-semibold">Raphael: {group.symbol} {calculateTotal('Raphael').toFixed(2)}</p>
                <p className="text-base font-semibold">Sammy: {group.symbol} {calculateTotal('Sammy').toFixed(2)}</p>
                <p className="text-base font-semibold">Total: {group.symbol} {calculateTotal('Total').toFixed(2)}</p>
                {selectedExpenses.length > 0 && (
                    <button
                        className="bg-[#ca4848] text-black px-4 py-2 rounded mt-4 font-bold"
                        onClick={deselectAll}
                    >
                        Deselect All
                    </button>
                )}
            </div>
        </div>
    );
}