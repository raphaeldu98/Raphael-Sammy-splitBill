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
    const [onlyPaidForTwo, setOnlyPaidForTwo] = useState(false); // Toggle for filtering paidFor.length === 2
    const [startDate, setStartDate] = useState(''); // Start date for time filter
    const [endDate, setEndDate] = useState(''); // End date for time filter

    // State to control the visibility of the breakdown and chart sections
    const [showBreakdown, setShowBreakdown] = useState(true); // Default to unfolded
    const [showChart, setShowChart] = useState(true); // Default to unfolded

    // Function to reset all filters
    const resetFilters = () => {
        setOnlyPaidForTwo(false);
        setStartDate('');
        setEndDate('');
    };

    let spend = 0;

    // Filter expenses by time and other conditions
    const filteredExpenses = group.expensesHistory
        .filter(expense => {
            const expenseDate = new Date(expense.time);
            const startDateValid = startDate ? new Date(startDate) <= expenseDate : true;
            const endDateValid = endDate ? new Date(endDate) >= expenseDate : true;
            return (
                expense.category !== 'Payment' && 
                (!onlyPaidForTwo || expense.paidFor.length === 2) &&
                startDateValid &&
                endDateValid
            );
        });

    filteredExpenses.forEach(expense => {
        spend += expense.amount;
    });

    useEffect(() => {
        if (group.expensesHistory) {
            const categoryTotals = filteredExpenses.reduce((acc, expense) => {
                const { category, amount } = expense;
                if (category in acc) {
                    acc[category] += amount;
                } else {
                    acc[category] = amount;
                }
                return acc;
            }, {});

            setCategoryData(categoryTotals);

            const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
            setTotalSpending(total);
        }
    }, [group, onlyPaidForTwo, startDate, endDate]); // Recalculate when filters or date range changes

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
                        <p className="text-xl">{`${group.symbol} ${spend.toFixed(2)}`}</p>
                    </div>
                </div>

                {/* Time Filters */}
                <div className="mt-4 flex gap-3">
                    <input 
                        type="date" 
                        className="bg-stone-700 p-2 rounded" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input 
                        type="date" 
                        className="bg-stone-700 p-2 rounded" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                {/* Toggle for showing expenses where paidFor.length === 2 */}
                <div className="mt-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={onlyPaidForTwo}
                            onChange={() => setOnlyPaidForTwo(!onlyPaidForTwo)}
                        />
                        <span className="text-white">Only show sharing expenses</span>
                    </label>
                </div>

                {/* Reset Filters Button */}
                <div className="mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Arrow Toggle for Breakdown Section */}
                <div className="mt-5 cursor-pointer flex items-center justify-between" onClick={() => setShowBreakdown(!showBreakdown)}>
                    <p className="font-bold text-lg">Category Breakdown</p>
                    <span className={`transform transition-transform duration-200 ${showBreakdown ? 'rotate-90' : '-rotate-90'}`}>
                        ➤
                    </span>
                </div>

                {/* Table for Category Breakdown */}
                {showBreakdown && (
                    <div className="mt-5">
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
                )}

                {/* Arrow Toggle for Chart Section */}
                <div className="mt-5 cursor-pointer flex items-center justify-between" onClick={() => setShowChart(!showChart)}>
                    <p className="font-bold text-lg">Category Distribution</p>
                    <span className={`transform transition-transform duration-200 ${showChart ? 'rotate-90' : '-rotate-90'}`}>
                        ➤
                    </span>
                </div>

                {/* Pie Chart for Category Distribution */}
                {showChart && (
                    <div className="mt-5">
                        <div className="w-1/2 mx-auto mt-5">
                            <Pie data={chartData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}