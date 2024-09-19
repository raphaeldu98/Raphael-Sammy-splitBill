import { GrGroup } from "react-icons/gr";
import { RiMenu3Line } from "react-icons/ri";
import { TbCategory2 } from "react-icons/tb";
import { MdOutlineAccountBalance } from "react-icons/md";
import { MdCallSplit } from "react-icons/md";
import { CiNoWaitingSign } from "react-icons/ci";
import FeatureCard from "../components/FeatureCard";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <div className="px-20">
                <div className="text-center py-5" >
                    <h1 className="font-bold text-4xl self-center"><span className="text-[rgb(72,202,155)]">Features</span> of this Application</h1>
                    <p className="text-sm mt-2 text-gray-400">Spliit is a minimalist application to track and share expenses with your friends and family.</p>
                </div>

                <div className="grid grid-cols-3 mx-32 gap-y-3">
                    <FeatureCard 
                        icon={<GrGroup/>}
                        description="Create a group for a travel, an event, a gift…"
                        title="Groups"
                    />
                    <FeatureCard 
                        icon={<RiMenu3Line/>}
                        description="Create and list expenses in your group."
                        title="Expenses"
                    />
                    <FeatureCard 
                        icon={<TbCategory2/>}
                        description="Assign categories to your expenses.    "
                        title="Categories"
                    />
                    <FeatureCard 
                        icon={<MdOutlineAccountBalance/>}
                        description="Visualize how much each participant spent."
                        title="Balances"
                    />
                    <FeatureCard 
                        icon={<MdCallSplit/>}
                        description="Split expenses by percentage, shares or amount."
                        title="Advanced split"
                    />
                    <FeatureCard 
                        icon={<CiNoWaitingSign/>}
                        description="No account. No limitation. No problem."
                        title="No ads"
                    />
                </div>
                <div className="mt-5 text-center">
                    <button 
                        className="bg-[#0BDA99] text-black px-5 py-2 rounded mr-5"
                        onClick={()=> navigate('/groups')}
                    >
                        Go to groups
                    </button>
                </div>
            </div>
        </div>
    )
}