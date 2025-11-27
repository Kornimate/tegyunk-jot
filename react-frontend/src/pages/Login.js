import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import logo from "../resources/logo.jpg";
import { useAuth } from "../hooks/AuthProvider";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [fastAuth, setFastAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, checkIfTokenIsValid, setIsAuthenticated, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated)
      return;

    async function apiCall() {
      setLoading(true);
      const resp = await checkIfTokenIsValid();
      if (resp) {
        setIsAuthenticated(true);
        setFastAuth(true);
      } else {
        setFastAuth(false);
      }
      setLoading(false)
    }

    apiCall();
  }, [checkIfTokenIsValid, setIsAuthenticated, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrorMsg("Tölts ki minden mezőt!");
      setErrors((prev) => ({ ...prev, email: true }));
    }

    if (!formData.password) {
      setErrorMsg("Tölts ki minden mezőt!");
      setErrors((prev) => ({ ...prev, password: true }));
    }

    if (errors.email || errors.password) return;

    setErrorMsg("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      login(response.data.token, response.data.email);
      navigate("/admin/dashboard");
    } catch {
      setErrorMsg("Sikertelen bejelentkezés!");
    }
  };

  function navigateHome(){
    navigate("/")
  }

  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <CircularProgress color="error" />
      </div>
    )
  }

  if (fastAuth) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
        >
          {/* LEFT SIDE: Logo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-black text-white p-8 md:w-1/2"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-28 h-28 mb-4 drop-shadow-lg rounded-xl"
            />
            <h2 className="text-2xl font-bold text-center">Üdvözöllek!</h2>
            <p className="text-gray-200 mt-2 text-center max-w-xs">
              Jelentkezz be, hogy kezelhesd a megkereséseket és lásd az
              analitikákat.
            </p>
          </motion.div>

          {/* RIGHT SIDE: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-8 flex flex-col justify-center md:w-1/2"
          >
            <div className="flex justify-between">

            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
              Bejelentkezés
            </h1>
            <span className="flex cursor-pointer items-center justify-items-center" onClick={navigateHome}>
              <HomeIcon className="mb-6" fontSize="large"/>
            </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="email@pelda.com"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Jelszó
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
              </div>

              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center"
                >
                  {errorMsg}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="mt-2 py-3 rounded-lg bg-gradient-to-r from-red-500 to-black font-semibold text-white shadow-md"
              >
                Bejelentkezés
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    );
  }
}
