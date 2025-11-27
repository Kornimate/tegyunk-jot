import { motion, AnimatePresence } from "framer-motion";
import { getMachineNameByMachineId } from "../services/machineNameService";

export function RequestDialog({ isOpen, setIsOpen, requestData }) {
  const closeDialog = () => setIsOpen(false);

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
            className="bg-white p-6 rounded-2xl shadow-xl text-center z-[10000] border-4 border-gray-500"
          >
            <div className="flex justify-end">
              <button
                onClick={closeDialog}
                className="bg-gray-300 px-3 py-3 rounded-xl"
              >
                <span>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <h1 className="mb-2 text-red-500 font-bold text-xl">Adatok</h1>
            <dl className="space-y-4">
              <div className="flex">
                <dt className="font-medium text-gray-900">Id</dt>
                <dd className="ml-4 text-gray-60">#{requestData.id}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Név</dt>
                <dd className="ml-4 text-gray-60">{requestData.name}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Email</dt>
                <dd className="ml-4 text-gray-60">{requestData.email}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Telefonszám</dt>
                <dd className="ml-4 text-gray-60">{requestData.phoneNumber}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Üzenet</dt>
                <dd className="ml-4 text-gray-60">{requestData.message}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Gép</dt>
                <dd className="ml-4 text-gray-60">
                  {getMachineNameByMachineId(requestData.machine)}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">
                  Lehetséges kezdeti dátum
                </dt>
                <dd className="ml-4 text-gray-60">
                  {requestData.possibleStartDate
                    ? requestData.possibleStartDate.toLocaleString()
                    : "-"}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Aktiválási dátum</dt>
                <dd className="ml-4 text-gray-60">
                  {requestData.activatedDate
                    ? requestData.activatedDate.toLocaleString()
                    : "-"}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Létrehozási dátum</dt>
                <dd className="ml-4 text-gray-60">
                  {requestData.createdTime
                    ? requestData.createdTime.toLocaleString()
                    : "-"}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900">Aktív bérlés</dt>
                <dd className="ml-4 text-gray-60">
                  {requestData.isActiveRequest ? (
                    <span className="text-red-400">
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-red-700">
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
