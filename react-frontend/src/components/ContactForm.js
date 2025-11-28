import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Announcement } from "./Announcement";
import axios from "axios";

export function ContactForm() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    function handleLanguageChange() {
      setErrors({});
    }

    i18n.on("languageChanged", handleLanguageChange);

    return () => i18n.off("languageChanged", handleLanguageChange);
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startDate: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t("nameRequired");

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("phoneRequired");
    } else if (!/^[+\d\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = t("phoneInvalid");
    }

    if (!formData.message.trim()) newErrors.message = t("messageRequired");

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
    } else {
      sendRequest();
    }
  };

  async function sendRequest() {
    await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/requests/new`,
      {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        possibleStartDate: formData.possibleStartDate === "" ? null : formData.possibleStartDate,
        message: formData.message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    

    setStateToNormal();
  }

  function setStateToNormal() {
    setSuccess(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      startDate: "",
      message: "",
    });
    setErrors({});
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Name */}
      <label className="col-span-2 text-md font-semibold text-gray-700 ps-1 place-content-center">
        {t("nameLbl")}
        <span className="text-red-700"> *</span>
      </label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={`col-span-2 md:col-span-2 rounded-lg border p-3 ${
          errors.name ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={t("nameLbl")}
      />
      {errors.name && (
        <p className="col-span-2 text-red-500 text-sm ps-1">{errors.name}</p>
      )}

      {/* Email */}
      <label className="col-span-2 text-md font-semibold text-gray-700 ps-1 place-content-center">
        {t("emailLbl")}
        <span className="text-red-700"> *</span>
      </label>
      <input
        name="email"
        type="text"
        value={formData.email}
        onChange={handleChange}
        className={`col-span-2 md:col-span-2 rounded-lg border p-3 ${
          errors.email ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={t("emailLbl")}
      />
      {errors.email && (
        <p className="col-span-2 text-red-500 text-sm ps-1">{errors.email}</p>
      )}

      {/* Phone */}
      <label className="col-span-2 text-md font-semibold text-gray-700 ps-1 place-content-center">
        {t("phoneLbl")}
        <span className="text-red-700"> *</span>
      </label>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className={`col-span-2 md:col-span-2 rounded-lg border p-3 ${
          errors.phone ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={t("phoneLbl")}
      />
      {errors.phone && (
        <p className="col-span-2 text-red-500 text-sm ps-1">{errors.phone}</p>
      )}

      {/* Start Date */}
      <label className="col-span-2 text-md font-semibold text-gray-700 ps-1 place-content-center">
        {t("startDateLbl")}
      </label>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="col-span-2 md:col-span-2 rounded-lg border border-gray-300 p-3"
      />

      {/* Message */}
      <label className="col-span-2 text-md font-semibold text-gray-700 ps-1 place-content-center">
        {t("messageLbl")}
        <span className="text-red-700"> *</span>
      </label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        className={`col-span-2 md:col-span-2 rounded-lg border p-3 h-32 ${
          errors.message ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={t("messagePlaceholder")}
      />
      {errors.message && (
        <p className="col-span-2 text-red-500 text-sm ps-1">{errors.message}</p>
      )}

      {/* Submit Button */}
      <div className="col-span-2 md:col-span-2 flex justify-center">
        <button
          type="submit"
          className="rounded-lg px-5 py-2 bg-gradient-to-r from-red-500 to-black text-white font-semibold shadow-md hover:scale-105 transition-transform"
        >
          {t("btnSendMessage")}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="col-span-2">
          <Announcement
            type="info"
            message={`✅ ${t("formSuccess")}`}
            extraStyle="my-2"
            closable={true}
          />
        </div>
      )}
    </motion.form>
  );
}
