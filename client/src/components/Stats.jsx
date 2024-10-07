import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

export default function Stats() {
    const [group] = useOutletContext();
    const [categoryData, setCategoryData] = useState({});
    const [totalSpending, setTotalSpending] = useState(0);

    let spend =  0;
    group.expensesHistory.forEach(expense => {
        spend += expense.amount;
    }, 0);

    useEffect(() => {
        if (group.expensesHistory) {
            // Calculate category data
            const categoryTotals = group.expensesHistory.reduce((acc, expense) => {
                const { category, amount } = expense;
                if (category in acc) {
                    acc[category] += amount;
                } else {
                    acc[category] = amount;
                }
                return acc;
            }, {});

            setCategoryData(categoryTotals);

            // Calculate total spending
            const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
            setTotalSpending(total);
        }
    }, [group]);

    // Prepare data for the pie chart
    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
        }]
    };

    return (
        <div className="mt-5 w-full pb-5">
            <div className="bg-stone-900 rounded-lg p-5">
                <div>
                    <p className="font-bold text-lg">Totals</p>
                    <p className="text-sm text-gray-500">Spending summary of the entire group.</p>

                    <div className="mt-5">
                        <p className="text-md text-gray-300">Total group spendings</p>
                        <p className="text-xl">{`${group.symbol} ${spend}`}</p>
                    </div>
                </div>

                {/* Table for Category Breakdown */}
                <div className="mt-5">
                    <p className="font-bold text-lg">Category Breakdown</p>
                    <table className="w-full mt-3 bg-stone-800 rounded-lg">
                        <thead>
                            <tr className="text-left border-b border-stone-700">
                                <th className="p-3">Category</th>
                                <th className="p-3">Amount ({group.symbol})</th>
                                <th className="p-3">Percentage (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(categoryData).map(([category, amount], index) => (
                                <tr key={index} className="border-b border-stone-700">
                                    <td className="p-3">{category}</td>
                                    <td className="p-3">{amount.toFixed(2)}</td>
                                    <td className="p-3">{((amount / totalSpending) * 100).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pie Chart for Category Distribution */}
                <div className="mt-5">
                    <p className="font-bold text-lg">Category Distribution</p>
                    <div className="w-1/2 mx-auto mt-5">
                        <Pie data={chartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}