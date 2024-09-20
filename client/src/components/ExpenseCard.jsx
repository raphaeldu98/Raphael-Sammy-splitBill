import { formatDateString } from "../compute/formatDateString";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../store/groupSlice";


export default function ExpenseCard({group, expense}){
    const dispatch = useDispatch();
    const raphael = expense.paidFor.includes('Raphael') ? (expense.amount - (expense.amount / expense.paidFor.length)) : 0;
    const sammy = expense.paidFor.includes('Raphael') ? expense.amount - (expense.amount / expense.paidFor.length) : expense.amount;

    const handleDelete = (groupId, expenseId) => {
        const IDs = [groupId, expenseId];
        dispatch(deleteExpense(IDs));
    }

    return(
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
                <p 
                    className="text-sm text-gray-500 w-1/2"
                >
                    Paid by <span className="font-semibold text-gray-400">{expense.paidBy}</span> for 
                    &nbsp;{expense.paidFor.map((ex, index) => 
                    <span 
                        className="font-semibold text-gray-400"
                        key={index}
                    >
                        {`${ex}${expense.paidFor.length > index+1 ? ", " : ""}`}
                    </span>)}
                </p>
                <p className="text-sm ml-10">{formatDateString(expense.time)}</p>
                <button 
                        className="bg-[#ca4848] text-black px-4 rounded font-bold"
                        onClick={()=>{handleDelete(group._id, expense._id)}}
                    >
                        delete
                </button>
            </div>
            
        </div>
    )
}

// createdAt
// : 
// "2024-07-28T17:11:57.338Z"
// expenseTitle
// : 
// "ex"
// paidBy
// : 
// "66a67bae673dd03e704d2b93"
// paidFor
// : 
// (3) ['om', 'ram', 'laksman']
// time
// : 
// "2024-07-02T22:41"
// updatedAt
// : 
// "2024-07-28T17:11:57.338Z"
// _id
// : 
// "66a67bdd673dd03e704d2b9e"