import { motion, AnimatePresence } from 'framer-motion';

export function ConfirmDeleteDialog( {isOpen, setIsOpen, id, callback} ) {
  const closeDialog = () => setIsOpen(false);
  const confirmDelete = async () => {
    await callback(id);
    setIsOpen(false);
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
              <h2 className="text-xl mb-4">Biztosan ki akarja törölni az elemet? (#{id})</h2>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Törlés
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
