import { useOutletContext, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createExpense } from "../store/groupSlice"; // Assume these actions exist to handle expense creation and balance update

export default function Balances() {
    const [group] = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    // Function to handle "Paid Off" logic
    const handlePaidOff = async () => {
        const raphael = group.groupMembers.find(member => member.name === 'Raphael');
        const sammy = group.groupMembers.find(member => member.name === 'Sammy');

        if (!raphael || !sammy) return;

        const updatedExpenses = group.expensesHistory.map(expense => ({
            ...expense,
            paid: true, // Mark each expense as paid
        }));

        // Create expense history entry
        const expenseData = {
            expenseTitle: 'Paid Off',
            time: new Date().toISOString(),
            groupId: group._id,
            amountPaid: Math.abs(memberBalances[sammy._id]),
            payerId: sammy._id, // Sammy is paying off
            membersPaidFor: [raphael._id], // Paying off for Raphael
            category: 'Payment',
            paid: true
        };
        
        navigate(`/${group._id}/expenses`);

        // Dispatch create expense action
        await dispatch(createExpense(expenseData));

        for (const expense of updatedExpenses) {
            await dispatch(updateExpense({
                groupId: group._id,
                expenseId: expense._id,
                updatedExpense: { paid: true }
            }));
        }
    };

    // Function to calculate balances based on the expense history
    const calculateBalances = () => {
        const balances = {};

        // Initialize balances for all group members
        group.groupMembers.forEach(member => {
            balances[member._id] = 0;
        });

        // Loop through each expense in the history
        group.expensesHistory.forEach(expense => {
            const numPaidFor = expense.paidFor.length;
            const individualShare = expense.amount / numPaidFor;

            // Deduct the total amount from the payer's balance
            const payer = group.groupMembers.find(member => member.name === expense.paidBy);
            // console.log('payer', payer);
            if (payer) {
                balances[payer._id] -= expense.amount;
            }

            // console.log('individualShare', individualShare);
            // console.log('balances', balances);

            // Add each individual's share back to their balance
            expense.paidFor.forEach(memberName => {
                const member = group.groupMembers.find(m => m.name === memberName);
                if (member) {
                    balances[member._id] += individualShare;
                }
            });
        });

        // console.log('balances', balances);

        return balances;
    };

    // Get the calculated balances
    const memberBalances = calculateBalances();

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
                                            memberBalances[member._id] == 0 && "bg-orange-500"
                                        } ${memberBalances[member._id] > 0 && "bg-green-800"} ${
                                            memberBalances[member._id] < 0 && "bg-red-800"
                                        }`}
                                    >
                                        {group.symbol}
                                        {memberBalances[member._id].toFixed(2)}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}