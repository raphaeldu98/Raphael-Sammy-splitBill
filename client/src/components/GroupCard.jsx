import { useNavigate } from "react-router-dom"
import { formatDateString } from "../compute/formatDateString";
import { useDispatch } from "react-redux";
import { deleteGroup, fetchGroups } from "../store/groupSlice";

export default function GroupCard({groupInfo}){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleClick(){
        navigate(`/${groupInfo._id}/expenses`)
    }

    const handleDeleteGroup = () => {
        dispatch(deleteGroup(groupInfo._id))
        dispatch(fetchGroups());
    }

    return(
        <div 
            className=" bg-stone-900 cursor-pointer px-4  py-3 rounded-md pt-5"
        >
            <div className="flex justify-between mb-2">
                <p 
                    className="font-bold hover:underline"
                    onClick={handleClick}
                >
                    {groupInfo.groupName}
                </p>
                <button 
                    className="text-red-600 text-xs hover:bg-stone-800 px-4 rounded"
                    onClick={handleDeleteGroup}
                >
                    Delete
                </button>
            </div>
            <div className="flex justify-between">
                <p className="text-xs">👥 {groupInfo.groupMembers.length}</p>
                <p className="text-xs">{formatDateString(groupInfo.createdAt)}</p>
            </div>
        </div>
    )
}


// {
//     _id: ObjectId('66a526e962d5608fd8a79e27'),
//     groupName: 'Study Group',
//     symbol: 'SG',
//     groupMembers: [
//       {
//         name: 'Alice',
//         currentBalance: 0,
//         _id: ObjectId('60d9f3a93f1a2b3a2c4c7b3e')
//       },
//       {
//         name: 'Bob',
//         currentBalance: 0,
//         _id: ObjectId('60d9f3a93f1a2b3a2c4c7b3f')
//       }
//     ],
//     totalGroupSpending: 0,
//     createdAt: ISODate('2024-07-27T16:57:13.617Z'),
//     updatedAt: ISODate('2024-07-27T16:57:13.617Z'),
//     __v: 0
//   },