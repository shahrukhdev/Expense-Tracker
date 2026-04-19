import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/react.svg";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (!email) {
      setError("Missing email in reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({ email, token, password, confirmPassword });

      toast.success(response.message || "Password reset successful");

      // redirect to login
      navigate("/login", {
        state: { message: "Password reset successful. Please login." },
      });

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
          Reset Password
        </h4>

        <p className="text-center text-muted mb-4 small">
          Enter your new password below
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>


          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-dark">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              readOnly
            />
            {fieldErrors.email && (
              <small className="text-danger">{fieldErrors.email}</small>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-dark">New Password</label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>
            {fieldErrors.password && (
                <small className="text-danger">{fieldErrors.password}</small>
              )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label text-dark">Confirm Password</label>

            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>
            {fieldErrors.confirmPassword && (
                <small className="text-danger">{fieldErrors.confirmPassword}</small>
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
            type="submit"
            className="btn btn-dark w-100 mb-3 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light" />
            ) : (
              "Reset Password"
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