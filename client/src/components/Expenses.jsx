import { useState, useEffect } from "react";
import ExpenseCard from "./ExpenseCard";
import CreateExpenseForm from "../forms/CreateExpenseForm";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchGroups } from "../store/groupSlice";

export default function Expenses() {
    const [group] = useOutletContext(); // Assuming group is coming from Outlet context
    const [isFormPageActive, setIsFormPageActive] = useState(false);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [showPaidExpenses, setShowPaidExpenses] = useState(false); // State to toggle paid expenses
    const [filters, setFilters] = useState({
        category: '',
        paidBy: '',
        minAmount: '',
        maxAmount: '',
        startTime: '',
        endTime: ''
    });
    const dispatch = useDispatch();
    const [expensesHistory, setExpensesHistory] = useState([]);

    // Available categories for filtering
    const categoryOptions = [
        'Food',
        'Groceries',
        'General',
        'Utilities',
        'Rent',
        'Shopping',
        'Transportation',
        'Entertainment',
        'Travel',
        'Health',
        'Pets',
        'Other'
    ];

    useEffect(() => {
        if (group.expensesHistory) {
            const sortedExpenses = [...group.expensesHistory].sort((a, b) => {
                return new Date(b.time).getTime() - new Date(a.time).getTime();
            });
            setExpensesHistory(sortedExpenses);
        }
    }, [group]);

    const refreshExpenses = () => {
        dispatch(fetchGroups(group._id)); 
        console.log('Refreshing expenses...');
    };

    const handleSelectExpense = (expense, isChecked) => {
        if (expense.expenseTitle !== 'Paid Off') {
            if (isChecked) {
                setSelectedExpenses([...selectedExpenses, expense]);
            } else {
                setSelectedExpenses(selectedExpenses.filter(e => e._id !== expense._id));
            }
        }
    };

    const deselectAll = () => {
        setSelectedExpenses([]); 
    };

    const calculateTotal = (type) => {
        return selectedExpenses.reduce((acc, expense) => {
            const numMembers = expense.paidFor.length;
            const individualShare = expense.amount / numMembers;

            if (type === 'Raphael') {
                return acc + (expense.paidFor.includes('Raphael') ? individualShare : 0);
            }

            if (type === 'Sammy') {
                return acc + (expense.paidFor.includes('Sammy') ? individualShare : 0);
            }

            if (type === 'Total') {
                return acc + expense.amount;
            }

            return acc;
        }, 0);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = (expense) => {
        const { category, paidBy, minAmount, maxAmount, startTime, endTime } = filters;

        // Check category
        if (category && expense.category !== category) return false;

        // Check paidBy
        if (paidBy && expense.paidBy !== paidBy) return false;

        // Check amount range
        if (minAmount && expense.amount < parseFloat(minAmount)) return false;
        if (maxAmount && expense.amount > parseFloat(maxAmount)) return false;

        // Check time range
        const expenseTime = new Date(expense.time).getTime();
        if (startTime && expenseTime < new Date(startTime).getTime()) return false;
        if (endTime && expenseTime > new Date(endTime).getTime()) return false;

        return true;
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            paidBy: '',
            minAmount: '',
            maxAmount: '',
            startTime: '',
            endTime: ''
        });
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

                        {/* Filter Section */}
                        <div className="bg-stone-700 p-3 rounded mb-5">
                            <div className="flex gap-4 mb-3">
                                {/* Select Category */}
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="p-2 rounded bg-stone-800 text-white w-1/5"
                                >
                                    <option value="">All Categories</option>
                                    {categoryOptions.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                {/* Select Paid By */}
                                <select
                                    name="paidBy"
                                    value={filters.paidBy}
                                    onChange={handleFilterChange}
                                    className="p-2 rounded bg-stone-800 text-white w-1/5"
                                >
                                    <option value="">All Paid By</option>
                                    {group?.groupMembers?.map((member) => (
                                        <option key={member._id} value={member.name}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Amount Range */}
                                <input
                                    type="number"
                                    name="minAmount"
                                    placeholder="Min Amount"
                                    value={filters.minAmount}
                                    onChange={handleFilterChange}
                                    className="p-2 rounded bg-stone-800 text-white w-1/5"
                                />
                                <input
                                    type="number"
                                    name="maxAmount"
                                    placeholder="Max Amount"
                                    value={filters.maxAmount}
                                    onChange={handleFilterChange}
                                    className="p-2 rounded bg-stone-800 text-white w-1/5"
                                />

                                {/* Reset Filter Button */}
                                <button
                                    className="bg-red-600 text-white rounded w-1/5"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>

                            {/* Time Filter */}
                            <div className="flex gap-4">
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={filters.startTime}
                                    onChange={handleFilterChange}
                                    className="p-2 rounded bg-stone-800 text-white w-1/2"
                                />
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={filters.endTime}
                                    onChange={handleFilterChange}
                                    className="p-2 rounded bg-stone-800 text-white w-1/2"
                                />
                            </div>
                        </div>

                        <div>
                            {expensesHistory?.length ? (
                                expensesHistory
                                    .filter(applyFilters)
                                    .map((expense, index) => (
                                        (!expense.paid || showPaidExpenses) && (
                                            <ExpenseCard
                                                key={index}
                                                group={group}
                                                expense={expense}
                                                refreshExpenses={refreshExpenses}
                                                handleSelectExpense={handleSelectExpense}
                                                selectedExpenses={selectedExpenses}
                                            />
                                        )
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

                        {/* Toggle Paid Expenses */}
                        <div className="text-center mt-5">
                            <button
                                className="text-sm text-[#48CA9B] hover:underline cursor-pointer"
                                onClick={() => setShowPaidExpenses(!showPaidExpenses)}
                            >
                                {showPaidExpenses ? 'Hide' : 'Show'} Paid Expenses
                            </button>
                        </div>
                    </div>
                )}
                {isFormPageActive && (
                    <CreateExpenseForm
                        setIsFormPageActive={setIsFormPageActive}
                        group={group}
                        refreshExpenses={refreshExpenses} 
                    />
                )}
            </div>
            
            {/* Right Panel for Summary */}
            <div className="w-1/5 bg-stone-800 p-5 rounded ml-4 mt-5 sticky top-4 h-max">
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