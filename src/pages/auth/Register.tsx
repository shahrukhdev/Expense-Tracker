import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/react.svg";
import { registerUser } from "../../services/authService";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const data = await registerUser({ name, email, password, confirmPassword });

      navigate('/login', {
        state: { message: data.message }
      });

    } catch (error: any) {
      const status = error?.response?.status;

      if (status == 422) {
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
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height={50} />
        </div>

        <h4 className="text-center mb-4 fw-bold text-dark">
          Create your account
        </h4>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-dark">
              Full name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {fieldErrors.name && (
              <small className="text-danger">{fieldErrors.name}</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-dark">
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <small className="text-danger">{fieldErrors.email}</small>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-dark">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((prev) => !prev)}
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

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label text-dark">
              Confirm Password
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
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

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <button
            className="btn btn-dark w-100 mb-3 d-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center mb-0 text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-dark fw-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}