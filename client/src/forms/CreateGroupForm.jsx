import { useState } from "react"
import {useSelector, useDispatch} from "react-redux"
import { createGroup, fetchGroups } from "../store/groupSlice"


export default function CreateGroup({
    setIsSelect
}){
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [members, setMembers] = useState(['']);

    function handleInputChange(index, e){
        const newMembers = [...members];
        newMembers[index] = e.target.value;
        setMembers(newMembers);
    }

    function handleAddMember(){
        setMembers([...members, '']);
    }

    const handleSubmit = ()=>{
        const groupData = {
            groupName,
            symbol,
            groupMembers: members.map(name => ({name, currentBalance: 0})),
            totalGroupSpending: 0
        };
        dispatch(createGroup(groupData));
        dispatch(fetchGroups())
        setIsSelect(false);
    }

    return(
        <div className="mt-5 w-full px-56">
            <div className="bg-stone-800 rounded-lg p-5">
                <h3 className="font-bold text-xl mb-5">Group Information</h3>
                <div className="flex gap-5">
                    <div className="w-full">
                        <p className="font-semibold mb-2">Group Name</p>
                        <input 
                            type="text" 
                            placeholder="Summer Vacation" 
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1"
                            value={groupName}
                            onChange={(e)=>setGroupName(e.target.value)} 
                        />
                    </div>
                    <div className="w-full">
                        <p className="font-semibold mb-2">Currency Symbol</p>
                        <input 
                            type="text" 
                            placeholder="$, ¥, ₹..." 
                            className="bg-black px-2 w-full rounded-md pt-2 pb-1" 
                            value={symbol}
                            onChange={(e)=>setSymbol(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-stone-800 rounded-lg p-5 mt-3">
                <h3 className="font-bold text-xl">Group Member's Name</h3>
                <p className="mb-5">Enter Name</p>
                <div className="">
                    {
                        members.map((member, index)=>(
                            <div className="w-[90%] mb-4" key={index}>
                                <input 
                                    type="text" 
                                    placeholder="e.g. John" 
                                    className="bg-black px-2 w-full rounded-md pt-2 pb-1" 
                                    value={member}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            </div>
                        ))
                    }
                    <button 
                        className=" hover:bg-stone-900 bg-stone-600 px-4 py-2 rounded-md"
                        onClick={handleAddMember}
                    >
                        Add member
                    </button>
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
                    onClick={() => setIsSelect(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}