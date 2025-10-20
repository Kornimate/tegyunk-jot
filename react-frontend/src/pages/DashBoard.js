import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/AuthProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";
import { ConfirmRequestStartDialog } from "../components/ConfirmRequestStartDialog";
import "../styles/leaflet-overrides.css";

// ---------- Sample data ----------
const bedsPieData = [
  { name: "Active supply", value: 72 },
  { name: "Passive supply", value: 28 },
];
const cpmsPieData = [
  { name: "Active supply", value: 35 },
  { name: "Passive supply", value: 65 },
];
const DONUT_COLORS = ["#EF4444", "#000"];

const visitsData = Array.from({ length: 10 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  visits: Math.floor(200 + Math.random() * 800),
}));

const bedsAreaData = Array.from({ length: 14 }).map((_, i) => ({
  date: `D-${13 - i}`,
  used: Math.floor(40 + Math.random() * 120),
  total: 200,
}));
const cpmsAreaData = Array.from({ length: 14 }).map((_, i) => ({
  date: `D-${13 - i}`,
  used: Math.floor(40 + Math.random() * 120),
  total: 200,
}));
const mapPins = [
  { id: 1, name: "Center Hospital A", coords: [48.1118, 20.80101] },
  { id: 2, name: "Clinic B", coords: [48.2, 20.5] },
  { id: 3, name: "Depot C", coords: [48.0, 20.9] },
];
const SAMPLE_REQUESTS = Array.from({ length: 18 }).map((_, i) => ({
  id: `REQ-${1000 + i}`,
  name: `Requester ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `+36 30 123 45${String(i).padStart(2, "0")}`,
  startDate: "2025-10-15",
  message: "Kérem a bérlést rövid időre.",
}));
const SAMPLE_RENTS = Array.from({ length: 8 }).map((_, i) => ({
  id: `RENT-${200 + i}`,
  name: `Tenant ${i + 1}`,
  email: `tenant${i + 1}@example.com`,
  phone: `+36 20 555 00${i}`,
  startDate: "2025-09-10",
}));
const SAMPLE_LOGS = Array.from({ length: 53 }).map(
  (_, i) =>
    `Log entry #${i + 1} — action happened at ${new Date().toISOString()}`
);

// ---------- Dashboard component ----------
export function DashBoard() {
  const [requests, setRequests] = useState(SAMPLE_REQUESTS);
  const [rents, setRents] = useState(SAMPLE_RENTS);
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [visits, setVisits] = useState(visitsData);
  const [pins, setPins] = useState(mapPins);
  const [machines, setMachines] = useState([]);
  const [cpmCount, setCpmCount] = useState(0);
  const [hBedCount, setHBendCount] = useState(0);
  const { token, logout } = useAuth();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [idToActivate, setIdToActivate] = useState(null);

  const LOGS_PER_PAGE = 10;
  const [logPage, setLogPage] = useState(0);
  const maxLogPage = Math.max(0, Math.ceil(logs.length / LOGS_PER_PAGE) - 1);
  const currentLogs = useMemo(
    () =>
      logs.slice(
        logPage * LOGS_PER_PAGE,
        logPage * LOGS_PER_PAGE + LOGS_PER_PAGE
      ),
    [logs, logPage]
  );

  const api = useMemo(
    () =>
      axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      }),
    [token]
  );

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);

  const refreshRequests = useCallback(async () => {
    const responseRequests = await api.get("/api/requests");
    setRequests(
      responseRequests.data
        .filter((x) => !x.isActiveRequest)
        .map((x) => ({
          ...x,
          possibleStartDate: x.possibleStartDate
            ? new Date(x.possibleStartDate)
            : null,
        }))
    );
    setRents(
      responseRequests.data
        .filter((x) => x.isActiveRequest)
        .map((x) => ({
          ...x,
          possibleStartDate: x.possibleStartDate
            ? new Date(x.possibleStartDate)
            : null,
        }))
    );
  }, [api]);

  const refreshVisits = useCallback(async () => {
    const responseVisits = await api.get("/api/webvisit");
    setVisits(
      responseVisits.data.map((x) => {
        const date = new Date(x.date);
        return { ...x, date: date.getMonth() + ". " + date.getDate() + "." };
      })
    );

    const responsePins = await api.get("/api/webvisit/coordinates");
    setPins(
      responsePins.data.map((x, i) => ({ ...x, name: x.name + " " + i }))
    );
  }, [api]);

  const refreshLogs = useCallback(async () => {
    const responseLogs = await api.get("/api/logs");
    setLogs(
      responseLogs.data.map((x) => ({
        ...x,
        recordedTime: new Date(x.recordedTime + "Z"),
      }))
    );
  }, [api]);

  const refreshMachines = useCallback(async () => {
    const responseMachines = await api.get("/api/resources/machines");
    setMachines(responseMachines.data);
  }, [api]);

  useEffect(() => {
    setLoadingRequests(true);
    setLoadingLogs(true);
    setLoadingVisits(true);

    async function apiCalls() {
      await refreshRequests();
      await refreshVisits();
      await refreshLogs();
      await refreshMachines();
    }

    apiCalls();

    setLoadingRequests(false);
    setLoadingLogs(false);
    setLoadingVisits(false);
  }, [refreshRequests, refreshVisits, refreshLogs, refreshMachines]);

  async function setRequestActive(id, machineId) {
    setLoadingRequests(true);

    await api.put("/api/requests/edit", {
      id: id,
      isActive: true,
      machine: machineId,
    });

    refreshRequests();

    setLoadingLogs(true);
    refreshLogs();
    setLoadingLogs(false);

    setLoadingRequests(false);
  }

  async function setRentNotActivity(id) {
    setLoadingRequests(true);

    await api.put("/api/requests/edit", {
      id: id,
      isActive: false,
    });

    refreshRequests();

    setLoadingLogs(true);
    refreshLogs();
    setLoadingLogs(false);

    setLoadingRequests(false);
  }

  async function deleteElement(id) {
    setLoadingRequests(true);

    await api.delete(`/api/requests/delete/${id}`);

    refreshRequests();

    setLoadingLogs(true);
    refreshLogs();
    setLoadingLogs(false);

    setLoadingRequests(false);
  }

  async function openConfirmDeleteDialog(id) {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  async function openConfirmActivateDialog(id) {
    setIdToActivate(id);
    setIsActivateDialogOpen(true);
  }

  function hBedsChanged(e){
    if(e.target.value === ""){
      setHBendCount(0)
      return;
    }

    setHBendCount(e.target.value)
  }

  function cpmsChanged(e){
    if(e.target.value === ""){
      setCpmCount(0)
      return;
    }

    setCpmCount(e.target.value)
  }

  function SignOut() {
    logout();
  }

  const Loader = () => (
    <div className="flex items-center justify-center h-48">
      <CircularProgress color="error" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-col md:flex-row">
          <div>
            <h1 className="text-2xl font-bold my-2">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 my-2">
            <div className="text-sm text-gray-600">
              Bejelentkezve:{" "}
              <span className="font-medium">admin@example.com</span>
            </div>
          </div>
          <button
            className="px-3 py-2 rounded-md bg-white border shadow-sm my-2"
            onClick={SignOut}
          >
            Kijelentkezés
          </button>
        </header>

        {/* Charts grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Beds Donut */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">
              Kórházi ágyak (Kiadott vs Raktárban)
            </h3>
            {loadingRequests ? (
              <Loader />
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={bedsPieData}
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {bedsPieData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full" /> Kiadott
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="w-3 h-3 bg-black rounded-full" /> Raktárban
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Beds Area */}
          <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2">
            <h3 className="font-semibold mb-2">
              Kiadott kórházi ágyak (utolsó 14 nap)
            </h3>
            {loadingRequests ? (
              <Loader />
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer>
                    <AreaChart data={bedsAreaData}>
                      <defs>
                        <linearGradient
                          id="colorUsed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#9CA3AF"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#9CA3AF"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="used"
                        stroke="#9CA3AF"
                        fill="url(#colorUsed)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Összes ágy: {bedsAreaData[0]?.total || 0}
                </div>
              </>
            )}
          </div>

          {/* CPM Donut */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">
              CPM gépek (Kiadott vs Raktárban)
            </h3>
            {loadingRequests ? (
              <Loader />
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={cpmsPieData}
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {cpmsPieData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full" /> Kiadott
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="w-3 h-3 bg-black rounded-full" /> Raktárban
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CPM Area */}
          <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2">
            <h3 className="font-semibold mb-2">
              Kiadott CPM gépek (utolsó 14 nap)
            </h3>
            {loadingRequests ? (
              <Loader />
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer>
                    <AreaChart data={cpmsAreaData}>
                      <defs>
                        <linearGradient
                          id="colorUsed2"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#9CA3AF"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#9CA3AF"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="used"
                        stroke="#9CA3AF"
                        fill="url(#colorUsed2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Összes CPM gép: {bedsAreaData[0]?.total || 0}
                </div>
              </>
            )}
          </div>

          {/* Visits Bar */}
          <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2">
            <h3 className="font-semibold mb-2">
              Weboldal látogatások (utolsó 10 nap)
            </h3>
            {loadingVisits ? (
              <Loader />
            ) : (
              <div className="h-64 items-center">
                <ResponsiveContainer>
                  <BarChart data={visits}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#9CA3AF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="relative z-20 bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Weboldal látogatások térkép</h3>
            {loadingVisits ? (
              <Loader />
            ) : (
              <div className="h-64 rounded-lg overflow-hidden z-10">
                <MapContainer
                  center={[48.11175, 20.80101]}
                  zoom={8}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {pins.map((p) => (
                    <Marker key={p.id} position={p.coords}>
                      <Popup>{p.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <label
              htmlFor="bedsCount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kórházi ágyak (db)
            </label>
            <input id="bedsCount" type="number" value={hBedCount} onChange={hBedsChanged} />
          </div>
          <div className="bg-white rounded-2xl shadow p-4"></div>
        </section>

        {/* Requests + Active rents + Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests */}
          <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 flex flex-col h-screen">
            <h3 className="font-semibold mb-3">Ajánlatkérések</h3>
            {loadingRequests ? (
              <Loader />
            ) : (
              <div className="flex-1 overflow-auto space-y-3 pr-2">
                {requests && requests.length > 0 ? (
                  requests.map((r) => (
                    <motion.article
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">
                            {r.name}{" "}
                            <span className="text-xs text-gray-400">
                              (#{r?.id})
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {r.email} • {r?.phoneNumber}
                          </div>
                          <div className="text-sm text-gray-600">
                            Start:{" "}
                            {r?.possibleStartDate
                              ? r?.possibleStartDate?.toLocaleString()
                              : "-"}
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            {r.message}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => openConfirmActivateDialog(r.id)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-md"
                          >
                            Aktiválás
                          </button>
                          <button
                            onClick={() => openConfirmDeleteDialog(r.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md"
                          >
                            Törlés
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <span className="flex justify-center italic text-gray-500">
                    Nincsenek ajánlatkérések
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rents */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col h-screen">
            <h3 className="font-semibold mb-3">Aktív bérlések</h3>
            {loadingRequests ? (
              <Loader />
            ) : (
              <div className="flex-1 overflow-auto space-y-3 pr-2">
                {rents && rents.length > 0 ? (
                  rents.map((r) => (
                    <motion.article
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">
                          {r.name}{" "}
                          <span className="text-xs text-gray-400">
                            (#{r.id})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {r.email} • {r?.phoneNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          Start:{" "}
                          {r?.possibleStartDate
                            ? r?.possibleStartDate?.toLocaleString()
                            : "-"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setRentNotActivity(r.id)}
                          className="px-3 py-2 bg-gray-500 text-white rounded-md"
                        >
                          Leállítás
                        </button>
                        <button
                          onClick={() => openConfirmDeleteDialog(r.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md"
                        >
                          Törlés
                        </button>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <span className="flex justify-center italic text-gray-500">
                    Nincsenek aktív elemek
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:col-span-3">
            <h3 className="font-semibold mb-3">Tevékenység (utolsó 30 nap)</h3>
            {loadingLogs ? (
              <Loader />
            ) : (
              <>
                <div className="flex-1 overflow-auto">
                  <ul className="space-y-2">
                    {currentLogs && currentLogs.length > 0 ? (
                      currentLogs.map((log, idx) => (
                        <li
                          key={`log_${idx}`}
                          className={`text-sm text-gray-700 border-b pb-2 ${
                            log.important ? "font-bold" : ""
                          }`}
                        >
                          {log.text}, ekkor:{" "}
                          {log?.recordedTime?.toLocaleString()}
                        </li>
                      ))
                    ) : (
                      <span className="flex justify-center italic text-gray-500">
                        Nincsenek bejegyzések
                      </span>
                    )}
                  </ul>
                </div>
                <div className="mt-3 flex justify-between">
                  {currentLogs && currentLogs.length > 10 && (
                    <>
                      <button
                        onClick={() => setLogPage((p) => Math.max(0, p - 1))}
                        className="px-3 py-2 bg-gray-100 rounded-md"
                      >
                        <ArrowBackIcon />
                      </button>
                      <button
                        onClick={() =>
                          setLogPage((p) => Math.min(maxLogPage, p + 1))
                        }
                        className="px-3 py-2 bg-gray-100 rounded-md"
                      >
                        <ArrowForwardIcon />
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          id={idToDelete}
          callback={deleteElement}
        />
        <ConfirmRequestStartDialog
          isOpen={isActivateDialogOpen}
          setIsOpen={setIsActivateDialogOpen}
          id={idToActivate}
          callback={setRequestActive}
          dropDownElements={machines}
        />
      </div>
    </div>
  );
}

{/* <div class="flex flex-col gap-4 w-full max-w-xs">
<label class="text-sm font-medium text-gray-700">Quantity</label>
<input
type="number"
placeholder="Enter a number"
class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
</div> */}