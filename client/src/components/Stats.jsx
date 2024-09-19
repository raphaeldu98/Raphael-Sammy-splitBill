import { useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";

export default function Stats(){

    const [group] = useOutletContext();

    return(
        <div className="mt-5 w-full pb-5">
            <div className="bg-stone-900 rounded-lg p-5">
            <div>
                <p className="font-bold text-lg">Totals</p>
                <p className="text-sm text-gray-500">Spending summary of the entire group.</p>

                <div className="mt-5">
                    <p className="text-md text-gray-300">Total group spendings</p>
                    <p className="text-xl">{`${group.symbol} ${group.totalGroupSpending}`}</p>
                </div>
            </div>
            </div>
        </div>
    )
}