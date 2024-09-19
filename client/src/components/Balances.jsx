import { useOutletContext} from "react-router-dom"

export default function Balances(){
    const [group] = useOutletContext();

    return(
        <div className="mt-5 w-full pb-5">
            <div className="bg-stone-900 rounded-lg p-5">
                <div>
                    <p className="font-bold text-lg">Balances</p>
                    {/* <p className="text-sm text-gray-500">This is the amount that each participant paid or was paid for.</p> */}
                </div>
                {/* <div className="flex justify-center items-center mt-5">
                    <ul>
                        {
                            group && 
                            group?.groupMembers?.map((member) => 
                            <li 
                                className="mb-3" 
                                key={member._id}
                            >
                                {member.name}: 
                                <span 
                                    className={`rounded py-[0.5px] px-4 ml-3 text-white ${member.currentBalance==0 && "bg-orange-500"} ${member.currentBalance>0 && "bg-green-800"} ${member.currentBalance<0 && "bg-red-800"}`}
                                >
                                    {group.symbol}{member.currentBalance}
                                </span>
                            </li>)
                        }
                    </ul>
                </div> */}
                <div className="flex justify-center items-center mt-5">
                    <ul>
                        {
                            group && 
                            group?.groupMembers?.map((member) => 
                            <li 
                                className="mb-3" 
                                key={member._id}
                            >
                                {member.name}: 
                                <span 
                                    className={`rounded py-[0.5px] px-4 ml-3 text-white ${member.balance==0 && "bg-orange-500"} ${member.balance>0 && "bg-green-800"} ${member.balance<0 && "bg-red-800"}`}
                                >
                                    {group.symbol}{member.balance}
                                </span>
                            </li>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}