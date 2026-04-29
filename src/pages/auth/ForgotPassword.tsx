import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/react.svg";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await forgotPassword({ email });

      toast.success(response.message);

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
            error?.response?.data?.message || "Something went wrong. Please try again!";
          setError(message);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="bg-white p-4 p-md-5 shadow-sm"
        style={{ width: "100%", maxWidth: 420 }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height={50} />
        </div>

        {/* Title */}
        <h4 className="text-center mb-3 fw-bold text-dark">
          Forgot Password
        </h4>

        {/* Subtitle */}
        <p className="text-center text-muted mb-4 small">
          Enter your email and we’ll send you a reset link
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="mb-4">
            <label className="form-label text-dark">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <small className="text-danger">{fieldErrors.email}</small>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            className="btn btn-dark w-100 mb-3 d-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center mb-0 text-muted">
          Remember your password?{" "}
          <Link to="/login" className="text-dark fw-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}