import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ConfirmRequestStartDialog({
  isOpen,
  setIsOpen,
  id,
  callback,
  dropDownElements,
}) {
  const closeDialog = () => setIsOpen(false);
  const confirmDelete = async () => {
    await callback(id, selectedOption);
    setIsOpen(false);
  };

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-xl text-center z-[10000]"
          >
            <h2 className="text-xl mb-4">Ajánlatkérés aktiválása (#{id})</h2>
            <div className="relative w-64 my-6">
              <label
                htmlFor="options"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gép választása
              </label>
              <select
                id="options"
                name="options"
                className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 px-3 pr-10 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={selectedOption} onChange={handleChange}
              >
                {dropDownElements.map((element) => (
                  <option value={element.id} key={`machines_${element.id}`}>{element.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Aktiválás
              </button>
              <button
                onClick={closeDialog}
                className="bg-gray-300 px-4 py-2 rounded-xl"
              >
                Mégse
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
