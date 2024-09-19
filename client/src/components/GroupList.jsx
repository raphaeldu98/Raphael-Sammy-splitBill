import { useState, useEffect } from "react"
import CreateGroupForm from "../forms/CreateGroupForm";
import GroupCard from "./GroupCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroups } from "../store/groupSlice";


export default function Groups(){
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const status = useSelector((state) => state.groups.status);
    const error = useSelector((state) => state.groups.error);
    const [isSelect, setIsSelect] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchGroups());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }


    return(
        <div>
            {!isSelect && <div className="flex justify-center mt-5 ">
                <button
                    className=" text-md  rounded hover:text-black px-5 py-2 bg-[#48CA9B] text-black "
                    onClick={()=> setIsSelect(true)}
                >
                    + New Group
                </button>
            </div>}
            {
                isSelect && <CreateGroupForm setIsSelect={setIsSelect}/>
            }

            {
                !isSelect &&
                <div className="grid grid-cols-2 px-52 gap-x-2 gap-y-2 mt-4">

                    {groups.map((group) => <GroupCard key={group._id} groupInfo={group}/>)}
                </div>
            }

        </div>
        
    )
}

