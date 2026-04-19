import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getIncomes, createIncome, updateIncome, deleteIncome } from "../services/incomeService";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Income() {
    const [incomes, setIncomes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({ title: "", source: "", amount: 0, date: "", description: "" });
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

    const fetchIncomes = async (searchValue: string, pageNumber: number) => {
        try {
            setLoading(true);

            const response = await getIncomes(searchValue, pageNumber, limit);

            setIncomes(response.data);
            setPagination(response.pagination);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchIncomes(search, page);
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search, page]);

    const handleCreate = async () => {
    try {
        setFieldErrors({});
        setModalLoading(true);

        const response = await createIncome(formData);

        toast.success(response.message || "Income created successfully");

        setShowModal(false);

        setFormData({
        title: "",
        source: "",
        amount: 0,
        date: "",
        description: "",
        });

        const updated = await getIncomes();
        setIncomes(updated.data);

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

    const handleEdit = async (income: any) => {
        try {
            setIsEditMode(true);
            setEditingId(income._id);

            setFormData({
                title: income.title,
                source: income.source,
                amount: income.amount,
                date: income.date,
                description: income.description,
            });

            setShowModal(true);

        } catch (error: any) {
            toast.error("Something went wrong. Please try again!");
        }
    };

    const handleUpdate = async () => {
        const incomeId = editingId;

        if(!incomeId) {
            return;
        }

        setFieldErrors({});
        setModalLoading(true);

        try {
            const response = await updateIncome(incomeId, formData);

            toast.success(response.message || "Income updated successfully");

            setShowModal(false);

            setFormData({
            title: "",
            source: "",
            amount: 0,
            date: "",
            description: "",
            });

            const updated = await getIncomes();
            setIncomes(updated.data);

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

            const response = await deleteIncome(deletingId);

            toast.success(response.message || "Income deleted successfully");

            const updated = await getIncomes();
            setIncomes(updated.data);
            
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
        <h4>Incomes</h4>

        <div className="d-flex gap-2">
            {/* Search */}
            <input
            type="text"
            className="form-control"
            placeholder="Search incomes..."
            style={{ width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            {/* Add Button */}
            <button className="btn btn-dark" onClick={
                () => {setShowModal(true);                    
                setIsEditMode(false);
                setEditingId(null);
                setFieldErrors({});
                setFormData({
                    title: "",
                    source: "",
                    amount: 0,
                    date: "",
                    description: "",
                    });}}>
            + Add Income
            </button>
        </div>
        </div>

        {loading ? (
            <div className="text-center">
            <div className="spinner-border text-dark" />
            </div>
        ) : incomes.length === 0 ? (
            <p className="text-muted">No incomes found.</p>
        ) : (
            <div className="bg-white p-4 rounded-4 shadow-sm">
            <div className="table-responsive">
                <table className="table align-middle mb-0">
                
                <thead className="border-bottom">
                    <tr className="text-muted small text-uppercase">
                    <th>Title</th>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {incomes.map((income, index) => (
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
                        <td className="fw-semibold">{income.title ?? ''}</td>

                        {/* Source */}
                        <td className="fw-semibold">{income.source ?? ''}</td>

                        {/* Amount */}
                        <td className="fw-bold text-dark">
                        ${income.amount ?? 0}
                        </td>

                        {/* Date */}
                        <td className="fw-semibold">{income.date ? new Date(income.date).toISOString().split("T")[0] : ""}</td>

                        {/* Description */}
                        <td>
                            {income.description ?? ''}
                        </td>

                        {/* Actions */}
                        <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                        {/* Edit */}
                        <button
                            className="btn btn-sm btn-light border d-flex align-items-center justify-content-center"
                            style={{ width: "34px", height: "34px" }}
                            onClick={() => {handleEdit(income)}}
                        >
                            <FaEdit size={14} />
                        </button>

                        {/* Delete */}
                        <button
                        className="btn btn-sm btn-light border text-danger d-flex align-items-center justify-content-center"
                        style={{ width: "34px", height: "34px" }}
                        onClick={() => {
                            setDeletingId(income._id);
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
                    {isEditMode ? "Edit Income" : "Add Income"}
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

                {/* Source */}
                <div className="mb-3">
                    <label className="form-label">Source</label>
                    <input
                    type="text"
                    className="form-control"
                    value={formData.source}
                    onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                    }
                    />
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

                {/* Date */}
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.date ? new Date(formData.date).toLocaleDateString("en-CA") : ""}
                        onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                        }
                    />
                </div>

                {/* Description */}
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
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
                        source: "",
                        amount: 0,
                        date: "",
                        description: "",
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