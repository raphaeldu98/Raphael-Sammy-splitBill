import { useEffect, useState } from "react";
import { formatDateString } from "../compute/formatDateString";
import { useDispatch } from "react-redux";
import { deleteExpense, updateExpense } from "../store/groupSlice"; // Update with correct action

export default function ExpenseCard({ group, expense, refreshExpenses, handleSelectExpense, selectedExpenses }) {
    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState(false);
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const [editedExpense, setEditedExpense] = useState({ ...expense }); // State for edited expense

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

    const raphael = expense.paidFor.includes('Raphael') ? (expense.amount - (expense.amount / expense.paidFor.length)) : 0;
    const sammy = expense.paidFor.includes('Raphael') ? expense.amount - (expense.amount / expense.paidFor.length) : expense.amount;

    const handleDelete = async (groupId, expenseId) => {
        const IDs = [groupId, expenseId];
        await dispatch(deleteExpense(IDs)); // Delete the expense
        refreshExpenses(); // Refresh the expenses list after deletion
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation(); // Prevent triggering the card click event
        const newChecked = e.target.checked;
        setIsChecked(newChecked);
        handleSelectExpense(expense, newChecked);
    };

    const handleCardClick = () => {
        if (expense.expenseTitle !== 'Paid Off' && !editMode) { // Only allow clicking on non-"Paid Off" expenses and when not editing
            const newChecked = !isChecked;
            setIsChecked(newChecked);
            handleSelectExpense(expense, newChecked);
        }
    };

    const handleEditToggle = () => {
        setEditMode(!editMode); // Toggle edit mode
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedExpense({
            ...editedExpense,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        // Save edited expense data to database
        await dispatch(updateExpense({
            groupId: group._id,
            expenseId: expense._id,
            updatedExpense: editedExpense,
        }));
        // refreshExpenses(); 
        setEditMode(false); // Exit edit mode
        refreshExpenses(); 
        // setTimeout(() => {
        //     refreshExpenses(); 
        // }, 3000);
        console.log('refreshed');
    };

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
            onClick={handleCardClick} // Bind click event to the entire card
        >
            {!editMode ? (
                <>
                    <div className="flex items-center w-full">
                        <input
                            type="checkbox"
                            className="mr-3"
                            checked={isChecked}
                            onChange={handleCheckboxChange} // Checkbox change event
                            disabled={expense.expenseTitle === 'Paid Off'} // Disable checkbox for "Paid Off" expenses
                            style={{ width: '30px', height: '30px' }} 
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
                                    className="bg-blue-500 text-white px-4 py-1 rounded mx-2 font-bold"
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Prevent triggering the card click event
                                        handleEditToggle(); // Toggle edit mode
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className={`bg-[#ca4848] text-black px-2 py-1 rounded font-bold ${
                                        expense.expenseTitle === 'Paid Off' ? '' : ''
                                    }`}
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Prevent triggering the card click event
                                        handleDelete(group._id, expense._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="flex justify-between w-full mt-2">
                                <p className={`text-sm ml-8 ${expense.expenseTitle === 'Paid Off' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Paid by <span className="font-semibold">{expense.paidBy}</span> for &nbsp;
                                    {expense.paidFor.map((ex, index) => (
                                        <span className="font-semibold" key={index}>
                                            {`${ex}${expense.paidFor.length > index + 1 ? ", " : ""}`}
                                        </span>
                                    ))}
                                </p>
                                <p className={`text-sm ml-2 ${expense.expenseTitle === 'Paid Off' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Category: <span className="font-semibold">{expense.category}</span>
                                </p>
                                <p className={`text-sm ${expense.expenseTitle === 'Paid Off' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {formatDateString(expense.time)}
                                </p>
                            </div>
                            {/* <div className="flex justify-end w-full mt-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Prevent triggering the card click event
                                        handleEditToggle(); // Toggle edit mode
                                    }}
                                >
                                    Edit
                                </button>
                            </div> */}
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full p-4 rounded bg-stone-700">
                    <h3 className="font-bold text-xl mb-3">Edit Expense</h3>
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            name="expenseTitle"
                            value={editedExpense.expenseTitle}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-stone-800 text-white"
                            placeholder="Expense Title"
                        />
                        <input
                            type="number"
                            name="amount"
                            value={editedExpense.amount}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-stone-800 text-white"
                            placeholder="Amount"
                        />
                        <input
                            type="datetime-local"
                            name="time"
                            value={editedExpense.time}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-stone-800 text-white"
                        />
                        <select
                            name="category"
                            value={editedExpense.category}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-stone-800 text-white"
                        >
                            {categoryOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                            onClick={(e) => { 
                                e.stopPropagation(); // Prevent triggering the card click event
                                handleSaveChanges(); // Save changes
                            }}
                        >
                            Save Changes
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={(e) => { 
                                e.stopPropagation(); // Prevent triggering the card click event
                                handleEditToggle(); // Cancel editing
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}