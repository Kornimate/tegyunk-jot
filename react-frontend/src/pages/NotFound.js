import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../resources/logo.jpg";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      {/* Logo */}
      <motion.img
        src={logo}
        alt="Logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-24 h-24 mb-6"
      />

      {/* 404 Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-8xl font-extrabold bg-gradient-to-r from-red-500 to-black text-transparent bg-clip-text drop-shadow-sm"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl font-semibold mt-4"
      >
        A kért weboldal nem található
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-gray-500 mt-2 text-center max-w-md"
      >
        Hoppá! Az oldal amit keresel nem létezik vagy más cím alatt van.
      </motion.p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-black text-white font-semibold shadow-md"
      >
        Vissza a kezdőlapra
      </motion.button>
    </div>
  );
}
