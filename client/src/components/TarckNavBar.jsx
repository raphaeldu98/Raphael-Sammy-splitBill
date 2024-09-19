import { NavLink, Outlet } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";

export default function TrackNavBar(){
    const { groupId } = useParams();
    const [group, setGroup] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchGroup(){
            setIsLoading(true)
            const response = await fetch(`http://localhost:8000/api/v1/groups/${groupId}`);
            const data = await response.json();
            console.log("data", data)
            setGroup(data);
            setIsLoading(false);
        }

        fetchGroup();
        
    }, []);


    if(isLoading) return <div>Loading...</div>


    return(
        <div className="w-full px-56 mt-5">
            <div className="bg-stone-800 max-w-max px-2 py-1 flex gap-3 rounded">
                <NavLink 
                    to={`/${groupId}/expenses`} 
                    className={({ isActive }) =>
                    `font-semibold px-2 py-1 rounded ${isActive ? 'bg-black' : ''}`}
                >
                    Expenses
                </NavLink>
                <NavLink 
                    to={`/${groupId}/balances`} 
                    className={({ isActive }) =>
                    `font-semibold px-2 py-1 rounded ${isActive ? 'bg-black' : ''}`}
                >
                    Balances
                </NavLink>
                <NavLink 
                    to={`/${groupId}/stats`} 
                    className={({ isActive }) =>
                    `font-semibold px-2 py-1 rounded ${isActive ? 'bg-black' : ''}`}
                >
                    Status
                </NavLink>
                <NavLink 
                    to={`/${groupId}/activity`} 
                    className={({ isActive }) =>
                    `font-semibold px-2 py-1 rounded ${isActive ? 'bg-black' : ''}`}
                >
                    Activity
                </NavLink>
                <NavLink 
                    to={`/${groupId}/settings`} 
                    className={({ isActive }) =>
                    `font-semibold px-2 py-1 rounded ${isActive ? 'bg-black' : ''}`}
                >
                    Settings
                </NavLink>
            </div>
            <Outlet context={[group]}/>
        </div>
    )
}