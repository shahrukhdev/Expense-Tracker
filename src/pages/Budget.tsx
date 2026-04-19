import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { createBudget, deleteBudget, getBudgets, updateBudget } from "../services/budgetService";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCategories } from "../services/categoryService";

export default function Budget() {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({ title: "", categoryId: "", amount: 0, year: "" });
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState<any>(null);

    const fetchBudgets = async (searchValue: string, pageNumber: number) => {
        try {
            setLoading(true);

            const response = await getBudgets(searchValue, pageNumber, limit);

            setBudgets(response.data);
            setPagination(response.pagination);

        } catch (error: any) {
            toast.error(
            error.response?.data?.message ||
            "Something went wrong. Please try again!"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBudgets(search, page);
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search, page]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
            }
        };
        fetchCategories();
    }, []);

    const handleCreate = async () => {
    try {
        setFieldErrors({});
        setModalLoading(true);

        const response = await createBudget(formData);

        toast.success(response.message || "Budget created successfully");

        setShowModal(false);

        setFormData({
        title: "",
        categoryId: "",
        amount: 0,
        year: "",
        });

        const updated = await getBudgets();
        setBudgets(updated.data);

    } catch (error: any) {
        const status = error?.response?.status;

        if (status === 422) {
        const errorsArray = error?.response?.data?.errors || [];

        const formattedErrors: { [key: string]: string } = {};

        errorsArray.forEach((e: any) => {
            formattedErrors[e.field] = e.message;
        });

        setFieldErrors(formattedErrors);
        } else {
        const message =
            error?.response?.data?.message ||
            "Something went wrong. Please try again!";
        toast.error(message);
        }
    } finally {
        setModalLoading(false);
    }
    };

    const handleEdit = async (budget: any) => {
        try {
            setIsEditMode(true);
            setEditingId(budget._id);

            setFormData({
                title: budget.title,
                categoryId: budget.categoryId?._id,
                amount: budget.amount,
                year: budget.year
            });

            setShowModal(true);

        } catch (error: any) {
            toast.error("Something went wrong. Please try again!");
        }
    };

    const handleUpdate = async () => {
        const budgetId = editingId;

        if(!budgetId) {
            return false;
        }

        setFieldErrors({});
        setModalLoading(true);

        try {
            const response = await updateBudget(budgetId, formData);

            toast.success(response.message || "Budget updated successfully");

            setShowModal(false);

            setFormData({
            title: "",
            categoryId: "",
            amount: 0,
            year: "",
            });

            const updated = await getBudgets();
            setBudgets(updated.data);

        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 422) {
            const errorsArray = error?.response?.data?.errors || [];

            const formattedErrors: { [key: string]: string } = {};

            errorsArray.forEach((e: any) => {
                formattedErrors[e.field] = e.message;
            });

            setFieldErrors(formattedErrors);
            } else {
            const message =
                error?.response?.data?.message ||
                "Something went wrong. Please try again!";
            toast.error(message);
            }
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        try {
            setDeleteLoading(true);

            const response = await deleteBudget(deletingId);

            toast.success(response.message || "Budget deleted successfully");

            const updated = await getBudgets();
            setBudgets(updated.data);
            
            resetDeleteModal();

        } catch (error: any) {
                toast.error(error?.response?.data?.message || "Something went wrong. Please try again!");
        } finally {
            setDeleteLoading(false);
        }
    };

    const resetDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingId(null);
    };

    return (
        <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Budgets</h4>

        <div className="d-flex gap-2">
            {/* Search */}
            <input
            type="text"
            className="form-control"
            placeholder="Search budgets..."
            style={{ width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            {/* Add Button */}
            <button
            className="btn btn-dark"
            onClick={() => {
                setShowModal(true);
                setIsEditMode(false);
                setEditingId(null);
                setFieldErrors({});
                setFormData({
                title: "",
                categoryId: "",
                amount: 0,
                year: "",
                });
            }}
            >
            + Add Budget
            </button>
        </div>
        </div>

        {loading ? (
            <div className="text-center">
            <div className="spinner-border text-dark" />
            </div>
        ) : budgets.length === 0 ? (
            <p className="text-muted">No budgets found.</p>
        ) : (
            <div className="bg-white p-4 rounded-4 shadow-sm">
            <div className="table-responsive">
                <table className="table align-middle mb-0">
                
                <thead className="border-bottom">
                    <tr className="text-muted small text-uppercase">
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Year</th>
                    <th className="text-end">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {budgets.map((budget, index) => (
                    <tr
                        key={index}
                        style={{ transition: "0.2s" }}
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                        }
                    >
                        {/* Title */}
                        <td className="fw-semibold">{budget.title ?? ''}</td>

                        {/* Category */}
                        <td className="fw-semibold">{budget.categoryId?.name ?? "N/A"}</td>

                        {/* Amount */}
                        <td className="fw-bold text-dark">
                        ${budget.amount ?? 0}
                        </td>

                        {/* Year */}
                        <td>
                            {budget.year ?? ''}
                        </td>

                        {/* Actions */}
                        <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                        {/* Edit */}
                        <button
                            className="btn btn-sm btn-light border d-flex align-items-center justify-content-center"
                            style={{ width: "34px", height: "34px" }}
                            onClick={() => {handleEdit(budget)}}
                        >
                            <FaEdit size={14} />
                        </button>

                        {/* Delete */}
                        <button
                        className="btn btn-sm btn-light border text-danger d-flex align-items-center justify-content-center"
                        style={{ width: "34px", height: "34px" }}
                        onClick={() => {
                            setDeletingId(budget._id);
                            setShowDeleteModal(true);
                        }}
                        >
                        <FaTrash size={14} />
                        </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>

                </table>

                {pagination && (
                <div className="d-flex justify-content-between align-items-center mt-3">

                    <small className="text-muted">
                    Showing page {pagination.page} of {pagination.totalPages}
                    </small>

                    <div className="d-flex gap-2">

                    <button
                        className="btn btn-sm btn-light"
                        disabled={pagination.page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Prev
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                        key={i}
                        className={`btn btn-sm ${
                            pagination.page === i + 1 ? "btn-dark" : "btn-light"
                        }`}
                        onClick={() => setPage(i + 1)}
                        >
                        {i + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm btn-light"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Next
                    </button>

                    </div>
                </div>
                )}

            </div>
            </div>
        )}

        {showModal && (
        <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog">
            <div className="modal-content rounded-4">
                
                {/* Header */}
                <div className="modal-header">
                <h5 className="modal-title">
                    {isEditMode ? "Edit Budget" : "Add Budget"}
                </h5>
                <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                ></button>
                </div>

                {/* Body */}
                <div className="modal-body">

                {/* Title */}
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    />
                    {fieldErrors.title && (
                    <small className="text-danger">{fieldErrors.title}</small>
                    )}
                </div>

                {/* Category */}
                <div className="mb-3">
                <label className="form-label">Category</label>

                <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                    }
                >
                    <option value="">Select category</option>

                    {categories.map((c: any) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Amount */}
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                    type="number"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) =>
                        setFormData({ ...formData, amount: Number(e.target.value) })
                    }
                    />
                    {fieldErrors.amount && (
                    <small className="text-danger">{fieldErrors.amount}</small>
                    )}
                </div>

                {/* Year */}
                <div className="mb-3">
                    <label className="form-label">Year</label>
                    <input
                    type="text"
                    className="form-control"
                    value={formData.year}
                    onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                    }
                    />
                </div>

                </div>

                {/* Footer */}
                <div className="modal-footer">
                <button
                    className="btn btn-light"
                    onClick={() => {
                    setShowModal(false);
                    setIsEditMode(false);
                    setEditingId(null);
                    setFieldErrors({});
                    setFormData({
                    title: "",
                    categoryId: "",
                    amount: 0,
                    year: "",
                    });
                }}
                >
                    Cancel
                </button>
                
                <button
                    className="btn btn-dark"
                    onClick={isEditMode ? handleUpdate : handleCreate}
                    disabled={modalLoading}
                >
                    {modalLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Update"
                    : "Save"}
                </button>
                </div>

            </div>
            </div>
        </div>
        )}

        {showDeleteModal && (
        <>
            <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4">

                {/* Header */}
                <div className="modal-header">
                    <h5 className="modal-title text-danger">Confirm Delete</h5>
                    <button
                    className="btn-close"
                    onClick={resetDeleteModal}
                    ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <p className="mb-0">
                    Are you sure you want to delete this record?
                    </p>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                    className="btn btn-light"
                    onClick={resetDeleteModal}
                    >
                    Cancel
                    </button>

                    <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    >
                    {deleteLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>

                </div>
            </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>
        </>
        )}

        </DashboardLayout>
    );

};