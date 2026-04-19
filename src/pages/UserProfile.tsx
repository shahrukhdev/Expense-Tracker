import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getUser, updateUser } from "../services/userService";
import avatar from "../assets/avatar-placeholder.webp";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const { setUser } = useAuth();

  // 🔥 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Password match validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFieldErrors({
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    try {
      setFormLoading(true);
      setFieldErrors({});

      // ✅ Build payload (avoid empty password)
      const payload: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.confirmPassword = formData.confirmPassword;
      }

      const response = await updateUser(payload);

      toast.success(response.message || "User updated successfully");

      // ✅ Update global user (no extra API call)
      if (response.data) {
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        });

        // also sync form
        setFormData((prev) => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
        }));
      }

      // ✅ Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

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
      setFormLoading(false);
    }
  };

  // 🔥 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();

        setFormData((prev) => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
        }));
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h4>Profile</h4>
        <p className="text-muted mb-0">
          Manage your account details
        </p>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-dark" />
        </div>
      ) : (
        <div className="bg-white p-4 rounded-4 shadow-sm">

          {/* Profile Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <img
              src={avatar}
              className="rounded-circle"
              alt="Profile"
              width={45}
              height={45}
            />
            <div>
              <h6 className="mb-0">{formData.name}</h6>
              <small className="text-muted">{formData.email}</small>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* Name */}
              <div className="col-12 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  disabled={formLoading}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {fieldErrors.name && (
                  <small className="text-danger">{fieldErrors.name}</small>
                )}
              </div>

              {/* Email */}
              <div className="col-12 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled={formLoading}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {fieldErrors.email && (
                  <small className="text-danger">{fieldErrors.email}</small>
                )}
              </div>

              {/* Password */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Password</label>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={formData.password}
                    disabled={formLoading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirm Password</label>

                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    value={formData.confirmPassword}
                    disabled={formLoading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
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
                        showConfirmPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></i>
                  </span>
                </div>

                {fieldErrors.confirmPassword && (
                  <small className="text-danger">
                    {fieldErrors.confirmPassword}
                  </small>
                )}
              </div>

              {/* Submit */}
              <div className="col-12 mt-3">
                <button
                  type="submit"
                  className="btn btn-dark d-flex justify-content-center align-items-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-light me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>

            </div>
          </form>

        </div>
      )}
    </DashboardLayout>
  );
}