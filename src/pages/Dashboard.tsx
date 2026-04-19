import DashboardLayout from "../components/layout/DashboardLayout";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { getDashboardSummary } from "../services/dashboardService";

export default function Dashboard() {
  const location = useLocation();
  const hasShownToast = useRef(false);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalBudget: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(false);
  const renderDashboardSummary = useRef(false);

    useEffect(() => {
        if (location.state?.message && !hasShownToast.current) {
            toast.success(location.state.message);
            hasShownToast.current = true;
        }
    }, [location.state]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
            setLoading(true);
            const response = await getDashboardSummary();
            const data = response.data;
            setSummary({ totalIncome: data.income.total, totalExpenses: data.expenses.total, totalBudget: data.budget.total, savings: data.savings.total });
            } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
            } finally {
            setLoading(false);
            }
        };

        if (!renderDashboardSummary.current) {
            fetchSummary();
            renderDashboardSummary.current = true;
        }
    }, []);

    return (
    <DashboardLayout>
        <h4 className="mb-4">Dashboard</h4>

        {/* Cards */}
        {loading ? (
        <div className="text-center mt-5">
            <div className="spinner-border text-dark" role="status" />
        </div>
        ) : (
        <div className="row g-4">
            {[
            { title: "Total Income", value: `$${summary.totalIncome}` },
            { title: "Total Expenses", value: `$${summary.totalExpenses}` },
            { title: "Total Budget", value: `$${summary.totalBudget}` },
            { title: "Savings", value: `$${summary.savings}` },
            ].map((card, i) => (
            <div key={i} className="col-md-3">
                <div
                className="p-4 bg-white rounded shadow-sm h-100"
                style={{ transition: "0.2s" }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                }
                >
                <h6 className="text-muted">{card.title}</h6>
                <h3 className="fw-bold">{card.value}</h3>
                </div>
            </div>
            ))}
        </div>
        )}

        {/* Overview Section (ALWAYS visible) */}
        <div className="mt-5">
        <div className="bg-white p-4 rounded shadow-sm">
            <h6 className="mb-3">Overview</h6>

            {loading ? (
            <p className="text-muted">Loading analytics...</p>
            ) : (
            <p className="text-muted mb-0">
                Charts and analytics will go here.
            </p>
            )}
        </div>
        </div>
    </DashboardLayout>
    );
}