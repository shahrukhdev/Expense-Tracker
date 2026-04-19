import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation} from "react-router-dom";
import logo from "../../assets/react.svg";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";
import { setToken } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const hasShownToast = useRef(false);
  const { setUser } = useAuth();

  useEffect(() => {
    if (location.state?.message && !hasShownToast.current) {
      toast.success(location.state.message);
      hasShownToast.current = true;
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      setToken(data.data.token);

      setUser({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
      });

      // localStorage.setItem("user", JSON.stringify(data.data));

      navigate("/dashboard", {
        state: { message: data.message },
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
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height={50} />
        </div>

        <h4 className="text-center mb-4 fw-bold text-dark">
          Sign in to your account
        </h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-dark">Email address</label>
            <input
              type="email"
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
            <label htmlFor="password" className="form-label text-dark">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
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

          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/forgot-password"
              className="text-muted small"
              style={{ transition: "0.2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "";
              }}
            >
              Forgot Password?
            </Link>
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
              "Login"
            )}
          </button>
        </form>

        <p className="text-center mb-0 text-muted">
          Not signed up?{" "}
          <Link to="/register" className="text-dark fw-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}