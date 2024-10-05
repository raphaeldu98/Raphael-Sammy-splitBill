import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createExpense } from "../store/groupSlice"; // Fetch groups is not necessary here

export default function CreateExpenseForm({
    setIsFormPageActive,
    group,
    refreshExpenses // Add refreshExpenses as a prop
}) {
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date().toISOString());
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState('');
    const [paidFor, setPaidFor] = useState([]);
    const dispatch = useDispatch();

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
        'Payments',
        'Other'
    ];

    useEffect(() => {
        // Default to check all members in the "Paid For" section
        setPaidFor(group.groupMembers.map(member => member._id));

        // Default "Paid By" to the first member in the group
        if (group.groupMembers.length > 0) {
            setPayerId(group.groupMembers[0]._id);
        }
    }, [group]);

    const handleCheckboxChange = (memberId) => {
        if (paidFor.includes(memberId)) {
            setPaidFor(paidFor.filter(id => id !== memberId));
        } else {
            setPaidFor([...paidFor, memberId]);
        }
    };

    const handleSubmit = async () => {
        const expenseData = {
            expenseTitle,
            time: expenseDate,
            groupId: group._id,
            amountPaid: parseFloat(amount),
            payerId: payerId,
            membersPaidFor: paidFor,
            category: category || 'Other'
        };
        await dispatch(createExpense(expenseData)); // Create the expense
        refreshExpenses(); // Refresh the expenses list after creation
        setIsFormPageActive(false);
    };

    const deselectAll = () => {
        setPaidFor([]); 
    };

    const handleSetExpenseTitle = (title) => {
        setExpenseTitle(title);
    };

    return (
        <div className="mt-5 w-full pb-5">
            <div className="bg-stone-800 rounded-lg p-5">
                <h3 className="font-bold text-xl mb-5">Create expense</h3>
                <div className="flex gap-5">
                    <div className="w-full">
                        <p className="font-semibold mb-2">Expense title</p>
                        <input
                            type="text"
                            placeholder="Expense title"
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1"
                            value={expenseTitle}
                            onChange={(e) => setExpenseTitle(e.target.value)}
                        />
                        {/* Default Expense Title Buttons */}
                        <div className="mt-2 flex gap-2">
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('99 Ranch')}
                            >
                                99 Ranch
                            </button>
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('Safeway')}
                            >
                                Safeway
                            </button>
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('Costco')}
                            >
                                Costco
                            </button>
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('Amazon')}
                            >
                                Amazon
                            </button>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('蓝胖子加油')}
                            >
                                蓝胖子加油
                            </button>
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('小冰加油')}
                            >
                                小冰加油
                            </button>
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('电费')}
                            >
                                电费
                            </button>
                            <button 
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                                onClick={() => handleSetExpenseTitle('网费')}
                            >
                                网费
                            </button>
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold mb-2">Expense date</p>
                        <input
                            type="datetime-local"
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1"
                            value={expenseDate}
                            onChange={(e) => setExpenseDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-5">
                    <div className="w-full">
                        <p className="font-semibold mb-2">Category</p>
                        <select
                        value={category}
                        className="w-1/2 bg-black px-2 rounded-md pt-2 pb-1"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="" disabled>Select a category</option>
                        {
                            categoryOptions.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))
                        }
                    </select>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold mb-2">Amount</p>
                        <input
                            type="text"
                            placeholder="e.g. 100"
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mr-5">
                    <p className="font-semibold mb-2">Paid by</p>
                    <select
                        value={payerId}
                        className="w-1/2 bg-black px-2 rounded-md pt-2 pb-1"
                        onChange={(e) => setPayerId(e.target.value)}
                    >
                        <option value="" disabled>Select a member</option>
                        {
                            group.groupMembers.map((member) => (
                                <option key={member._id} value={member._id}>{member.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="bg-stone-800 rounded-lg p-5 mt-3">
                <div className="flex justify-between">
                    <h3 className="font-bold text-xl">Paid for</h3>
                    <button
                        className="bg-[#ca4848] text-black px-4 py-2 rounded mt-4 font-bold"
                        onClick={deselectAll}
                    >
                        Deselect All
                    </button>
                </div>
                {/* <h3 className="font-bold text-xl">Paid for</h3> */}
                <p className="">Select who the expense was paid for.</p>
                <div className="">
                    {
                        group.groupMembers.map((member) =>
                            <div
                                className="flex gap-3 pb-2 border-stone-700 border-b-[0.1px] mt-5"
                                key={member._id}
                            >
                                <input
                                    type="checkbox"
                                    checked={paidFor.includes(member._id)}
                                    onChange={() => handleCheckboxChange(member._id)}
                                />
                                <p>{member.name}</p>
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="mt-4">
                <button
                    className="bg-[#0BDA99] text-black px-5 py-2 rounded mr-5"
                    onClick={handleSubmit}
                >
                    Create
                </button>
                <button
                    className="text-red-700 hover:bg-stone-800 px-5 py-2 rounded"
                    onClick={() => setIsFormPageActive(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}