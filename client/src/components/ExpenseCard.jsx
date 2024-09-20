import { formatDateString } from "../compute/formatDateString";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../store/groupSlice";

export default function ExpenseCard({ group, expense, refreshExpenses }) {
    const dispatch = useDispatch();
    const raphael = expense.paidFor.includes('Raphael') ? (expense.amount - (expense.amount / expense.paidFor.length)) : 0;
    const sammy = expense.paidFor.includes('Raphael') ? expense.amount - (expense.amount / expense.paidFor.length) : expense.amount;

    const handleDelete = async (groupId, expenseId) => {
        const IDs = [groupId, expenseId];
        await dispatch(deleteExpense(IDs)); // Delete the expense
        refreshExpenses(); // Refresh the expenses list after deletion
    };

    return (
        <div className="p-4 cursor-pointer hover:bg-stone-900 rounded ">
            <div className="flex justify-between">
                <div className="w-2/5">
                    <p className="font-semibold">{expense.expenseTitle}</p>
                </div>
                <div className="w-3/5 flex justify-between">
                    <p className="font-bold">{`Raphael: ${group.symbol} ${raphael}`}</p>
                    <p className="font-bold">{`Sammy : ${group.symbol} ${sammy}`}</p>
                    <p className="font-bold">{`Total: ${group.symbol} ${expense.amount}`}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <p className="text-sm text-gray-500 w-1/2">
                    Paid by <span className="font-semibold text-gray-400">{expense.paidBy}</span> for &nbsp;
                    {expense.paidFor.map((ex, index) => (
                        <span className="font-semibold text-gray-400" key={index}>
                            {`${ex}${expense.paidFor.length > index + 1 ? ", " : ""}`}
                        </span>
                    ))}
                </p>
                <p className="text-sm ml-10">{formatDateString(expense.time)}</p>
                <button
                    className="bg-[#ca4848] text-black px-4 rounded font-bold"
                    onClick={() => { handleDelete(group._id, expense._id) }}
                >
                    delete
                </button>
            </div>
        </div>
    );
}