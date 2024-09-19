import { useState } from "react";
import { useDispatch } from "react-redux";
import { createExpense, fetchGroups } from "../store/groupSlice";

export default function CreateExpenseForm({
    setIsFormPageActive,
    group
}) {
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseDate, setExpenseDate] = useState(Date.now());
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState('');
    const [paidFor, setPaidFor] = useState([]);
    const dispatch = useDispatch();

    const handleCheckboxChange = (memberId) => {
        if (paidFor.includes(memberId)) {
            setPaidFor(paidFor.filter(id => id !== memberId));
        } else {
            setPaidFor([...paidFor, memberId]);
        }
    };

    const handleSubmit = () => {
        const expenseData = {
            expenseTitle,
            time:expenseDate,
            groupId: group._id,
            amountPaid: parseInt(amount),
            payerId: payerId,
            membersPaidFor: paidFor
        };
        dispatch(createExpense(expenseData));
        setIsFormPageActive(false);
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
                            placeholder="Summer Vacations"
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1"
                            value={expenseTitle}
                            onChange={(e) => setExpenseTitle(e.target.value)}
                        />
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
                        <input
                            type="text"
                            placeholder="e.g. Food, General"
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
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
                <h3 className="font-bold text-xl">Paid for</h3>
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
