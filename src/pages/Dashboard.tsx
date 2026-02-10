import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [stats, setStats] = useState({
        views: 0,
        yesClicks: 0,
        noClicks: 0,
    });

    useEffect(() => {
        const views = parseInt(localStorage.getItem("valentine_views") || "0");
        const yesClicks = parseInt(localStorage.getItem("valentine_yes_clicks") || "0");
        const noClicks = parseInt(localStorage.getItem("valentine_no_clicks") || "0");

        setStats({ views, yesClicks, noClicks });
    }, []);

    const rejectionRate = stats.noClicks + stats.yesClicks > 0
        ? ((stats.noClicks / (stats.noClicks + stats.yesClicks)) * 100).toFixed(1)
        : "0";

    return (
        <div className="min-h-screen bg-background p-8 flex flex-col items-center">
            <Link to="/" className="self-start mb-8 text-primary flex items-center gap-2 font-bold hover:underline">
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full"
            >
                <h1 className="text-4xl font-display text-primary mb-8 flex items-center gap-4">
                    <BarChart size={32} /> Love Analytics
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Views" value={stats.views} color="bg-blue-100 text-blue-800" />
                    <StatCard label="She said YES! 💖" value={stats.yesClicks} color="bg-green-100 text-green-800" />
                    <StatCard label="Times Rejected 💔" value={stats.noClicks} color="bg-red-100 text-red-800" />
                    <StatCard label="Play Hard to Get Rate" value={`${rejectionRate}%`} color="bg-purple-100 text-purple-800" />
                </div>

                <div className="mt-12 bg-card p-6 rounded-2xl border shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Reset Data</h2>
                    <p className="text-muted-foreground text-sm mb-4">
                        Clear all statistics. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            setStats({ views: 0, yesClicks: 0, noClicks: 0 });
                        }}
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold hover:opacity-90 transition"
                    >
                        Reset All Data
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
    <div className={`p-6 rounded-2xl ${color}`}>
        <div className="text-sm font-bold uppercase tracking-wide opacity-80 mb-2">{label}</div>
        <div className="text-4xl font-black">{value}</div>
    </div>
);

export default Dashboard;
