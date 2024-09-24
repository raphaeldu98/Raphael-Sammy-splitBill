import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createExpense } from "../store/groupSlice"; // Assume these actions exist to handle expense creation and balance update

export default function Balances() {
    const [group] = useOutletContext();
    const dispatch = useDispatch();

    // Function to handle "Paid Off" logic
    const handlePaidOff = async () => {
        const raphael = group.groupMembers.find(member => member.name === 'Raphael');
        const sammy = group.groupMembers.find(member => member.name === 'Sammy');

        if (!raphael || !sammy) return;

        // Create expense history entry
        const expenseData = {
            expenseTitle: 'Paid Off',
            time: new Date().toISOString(),
            groupId: group._id,
            amountPaid: Math.abs(sammy.balance),
            payerId: sammy._id, // Sammy is paying off
            membersPaidFor: [raphael._id] // Paying off for Raphael
        };

        // Dispatch create expense action
        await dispatch(createExpense(expenseData));
    };

    return (
        <div className="mt-5 w-full pb-5">
            <div className="bg-stone-900 rounded-lg p-5">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">Balances</p>
                    {/* Paid Off Button */}
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                        onClick={handlePaidOff}
                    >
                        Paid Off
                    </button>
                </div>
                <div className="flex justify-center items-center mt-5">
                    <ul>
                        {group &&
                            group?.groupMembers?.map((member) => (
                                <li className="mb-3" key={member._id}>
                                    {member.name}:
                                    <span
                                        className={`rounded py-[0.5px] px-4 ml-3 text-white ${
                                            member.balance == 0 && "bg-orange-500"
                                        } ${member.balance > 0 && "bg-green-800"} ${
                                            member.balance < 0 && "bg-red-800"
                                        }`}
                                    >
                                        {group.symbol}
                                        {member.balance}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}