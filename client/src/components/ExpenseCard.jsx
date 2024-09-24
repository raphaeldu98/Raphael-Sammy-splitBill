import { useEffect, useState } from "react";
import { formatDateString } from "../compute/formatDateString";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../store/groupSlice";

export default function ExpenseCard({ group, expense, refreshExpenses, handleSelectExpense, selectedExpenses }) {
    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState(false);

    const raphael = expense.paidFor.includes('Raphael') ? (expense.amount - (expense.amount / expense.paidFor.length)) : 0;
    const sammy = expense.paidFor.includes('Raphael') ? expense.amount - (expense.amount / expense.paidFor.length) : expense.amount;

    const handleDelete = async (groupId, expenseId) => {
        const IDs = [groupId, expenseId];
        await dispatch(deleteExpense(IDs)); // Delete the expense
        refreshExpenses(); // Refresh the expenses list after deletion
    };

    const handleCheckboxChange = (e) => {
        if (!expense.isPaidOff) { // Prevent selection if the expense is "Paid Off"
            setIsChecked(e.target.checked);
            handleSelectExpense(expense, e.target.checked);
        }
    };

    // Deselect all checkboxes if deselectAll is triggered
    useEffect(() => {
        if (selectedExpenses.length === 0) {
            setIsChecked(false);
        }
    }, [selectedExpenses]);

    return (
        <div 
            className={`p-4 rounded flex flex-col items-start ${
                expense.expenseTitle === 'Paid Off' 
                ? 'bg-gray-300 cursor-default border-2 border-gray-400'  // Style for "Paid Off" expenses
                : 'cursor-pointer hover:bg-stone-900'
            }`}
        >
            <div className="flex items-center w-full">
                <input
                    type="checkbox"
                    className="mr-3"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    disabled={expense.expenseTitle === 'Paid Off'} // Disable checkbox for "Paid Off" expenses
                />
                <div className="w-full flex flex-col">
                    <div className="flex justify-between w-full">
                        <div className="w-1/5">
                            <p className={`font-semibold ml-8 ${expense.expenseTitle === 'Paid Off' ? 'text-gray-600' : ''}`}>
                                {expense.expenseTitle}
                            </p>
                        </div>
                        <div className="w-3/5 flex justify-between mr-4">
                            <p className={`font-bold ${expense.expenseTitle === 'Paid Off' ? 'text-gray-600' : ''}`}>
                                {`Raphael: ${group.symbol} ${raphael.toFixed(2)}`}
                            </p>
                            <p className={`font-bold ${expense.expenseTitle === 'Paid Off' ? 'text-gray-600' : ''}`}>
                                {`Sammy: ${group.symbol} ${sammy.toFixed(2)}`}
                            </p>
                            <p className={`font-bold ${expense.expenseTitle === 'Paid Off' ? 'text-gray-600' : ''}`}>
                                {`Total: ${group.symbol} ${expense.amount.toFixed(2)}`}
                            </p>
                        </div>
                        <button
                            className={`bg-[#ca4848] text-black px-4 rounded font-bold ${
                                expense.expenseTitle === 'Paid Off' ? '' : ''
                            }`}
                            onClick={() => { handleDelete(group._id, expense._id) }}
                        >
                            delete
                        </button>
                    </div>
                    <div className="flex justify-between w-full mt-2">
                        <p className={`text-sm w-1/2 ml-8 ${expense.expenseTitle === 'Paid Off' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Paid by <span className="font-semibold">{expense.paidBy}</span> for &nbsp;
                            {expense.paidFor.map((ex, index) => (
                                <span className="font-semibold" key={index}>
                                    {`${ex}${expense.paidFor.length > index + 1 ? ", " : ""}`}
                                </span>
                            ))}
                        </p>
                        <p className={`text-sm ${expense.expenseTitle === 'Paid Off' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatDateString(expense.time)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}