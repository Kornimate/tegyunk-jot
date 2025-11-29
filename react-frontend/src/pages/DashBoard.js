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
import { SettingsHandler } from "../components/SettingsHandler";
import { RequestDialog } from "../components/RequestDialog";
import { compareDate1IsOlderOrSame } from "../services/dateService";
import Download from "../components/Download";

const DONUT_COLORS = ["#EF4444", "#000"];

// ---------- Dashboard component ----------
export function DashBoard() {
  const [requests, setRequests] = useState([]);
  const [rents, setRents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [visits, setVisits] = useState([]);
  const [pins, setPins] = useState([]);
  const [machines, setMachines] = useState([]);
  const [settings, setSettings] = useState([]);
  const [cpmCount, setCpmCount] = useState(0);
  const [hBedCount, setHBendCount] = useState(0);
  const [bedsAreaData, setBedsAreaData] = useState([]);
  const [cpmsAreaData, setCpmsAreaData] = useState([]);
  const [bedsPieData, setBedsPieData] = useState([]);
  const [cpmsPieData, setCpmsPieData] = useState([]);
  const { token, logout, email } = useAuth();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [idToActivate, setIdToActivate] = useState(null);

  const [isRequestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestDialogData, setRequestDialogData] = useState(null);

  const [activeCpms, setActiveCpms] = useState(0);
  const [activeBeds, setActiveBeds] = useState(0);

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
  const [loadingSettings, setLoadingSettings] = useState(true);

  const refreshRequests = useCallback(async () => {
    const responseRequests = await api.get("/api/requests");
    setRequests(
      responseRequests.data
        .filter((x) => !x.isActiveRequest)
        .map((x) => ({
          ...x,
          possibleStartDate: x.possibleStartDate
            ? new Date(x.possibleStartDate + "Z")
            : null,
          activatedDate: x.activatedDate
            ? new Date(x.activatedDate + "Z")
            : null,
          createdTime: x.createdTime ? new Date(x.createdTime + "Z") : null,
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
          activatedDate: x.activatedDate
            ? new Date(x.activatedDate + "Z")
            : null,
          createdTime: x.createdTime ? new Date(x.createdTime + "Z") : null,
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

  const refreshSettings = useCallback(async () => {
    const responseSettings = await api.get("/api/resources");
    setSettings(responseSettings.data);
  }, [api]);

  useEffect(() => {
    setLoadingRequests(true);
    setLoadingLogs(true);
    setLoadingVisits(true);
    setLoadingSettings(true);

    async function apiCalls() {
      await refreshRequests();
      await refreshVisits();
      await refreshLogs();
      await refreshMachines();
      await refreshSettings();
    }

    apiCalls();

    setLoadingRequests(false);
    setLoadingLogs(false);
    setLoadingVisits(false);
    setLoadingSettings(false);
  }, [
    refreshRequests,
    refreshVisits,
    refreshLogs,
    refreshMachines,
    refreshSettings,
  ]);

  useEffect(() => {
    const cpmsData = [];
    const bedsData = [];

    const cpmRents = rents.filter((x) => x.machine === 1);
    const bedRents = rents.filter((x) => x.machine === 2);

    setActiveCpms(cpmRents.filter((x) => x.isActiveRequest).length);
    setActiveBeds(bedRents.filter((x) => x.isActiveRequest).length);

    console.log(cpmRents);

    const day = new Date();
    day.setDate(day.getDate() - 13);

    for (let i = 0; i < 14; i++) {
      let counter = 0;

      for (let j = 0; j < cpmRents.length; j++) {
        if (compareDate1IsOlderOrSame(cpmRents[j].activatedDate, day)) {
          counter++;
        }
      }
      cpmsData.push({
        date: `D-${13 - i}`,
        used: counter,
      });

      counter = 0;

      for (let j = 0; j < bedRents.length; j++) {
        console.log(
          compareDate1IsOlderOrSame(bedRents[j].activatedDate, day),
          bedRents[j].activatedDate,
          day
        );
        if (compareDate1IsOlderOrSame(bedRents[j].activatedDate, day)) {
          counter++;
        }
      }
      bedsData.push({
        date: `D-${13 - i}`,
        used: counter,
      });

      day.setDate(day.getDate() + 1);
    }

    setBedsAreaData(bedsData);
    setCpmsAreaData(cpmsData);
  }, [rents]);

  useEffect(() => {
    setCpmsPieData([
      { name: "Kiadott", value: activeCpms },
      { name: "Raktárban", value: cpmCount - activeCpms },
    ]);
  }, [cpmCount, activeCpms]);

  useEffect(() => {
    setBedsPieData([
      { name: "Kiadott", value: activeBeds },
      { name: "Raktárban", value: hBedCount - activeBeds },
    ]);
  }, [hBedCount, activeBeds]);

  async function setRequestActive(id, machineId) {
    setLoadingRequests(true);

    if (machineId === 1 && cpmCount === activeCpms) {
      alert("Nincs szabad CPM gép kiadásra!");
      return;
    }

    if (machineId === 2 && hBedCount === activeBeds) {
      alert("Nincs szabad Kórházi ágy kiadásra!");
      return;
    }

    await api.put("/api/requests/update", {
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

  async function setRentNotActive(id, event) {
    event.stopPropagation();
    setLoadingRequests(true);

    await api.put("/api/requests/update", {
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

  async function putNewResourceValue(id, newValue) {
    await api.put("/api/resources/update", {
      id: id,
      newValue: newValue,
    });

    alert(`Az érték megváltozott, új érték: ${newValue}`);

    setLoadingLogs(true);
    refreshLogs();
    setLoadingLogs(false);
  }

  async function openConfirmDeleteDialog(id, event) {
    event.stopPropagation();
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  async function openConfirmActivateDialog(id, event) {
    event.stopPropagation();
    setIdToActivate(id);
    setIsActivateDialogOpen(true);
  }

  async function openRequestDialog(requestData) {
    setRequestDialogData(requestData);
    setRequestDialogOpen(true);
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
              Bejelentkezve: <span className="font-medium">{email()}</span>
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
                        {bedsPieData.map((_, i) => (
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
                    ({activeBeds})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-black rounded-full" /> Raktárban
                    ({hBedCount - activeBeds})
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
                  Összes ágy: {hBedCount}
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
                        {cpmsPieData.map((_, i) => (
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
                    ({activeCpms})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-black rounded-full" /> Raktárban
                    ({cpmCount - activeCpms})
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
                  Összes CPM gép: {cpmCount}
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
              <>
                <div className="h-60 items-center">
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
                <div className="mt-1 text-sm text-gray-500">
                  Összes látogatás (utolsó 10 nap): {visits.length}
                </div>
              </>
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-4 justify-items-center text-center">
            {/* settings[0] is hospital beds!*/}
            {loadingSettings ? (
              <Loader />
            ) : (
              <SettingsHandler
                labelText={"Kórházi ágyak (db)"}
                btnText={"Mentés"}
                initCount={settings[0]}
                apiCallCallback={putNewResourceValue}
                setterCallback={setHBendCount}
              />
            )}
          </div>
          <div className="bg-white rounded-2xl shadow p-4 justify-items-center text-center">
            {/* settings[1] is cpm machines*/}
            {loadingSettings ? (
              <Loader />
            ) : (
              <SettingsHandler
                labelText={"CPM gépek (db)"}
                btnText={"Mentés"}
                initCount={settings[1]}
                apiCallCallback={putNewResourceValue}
                setterCallback={setCpmCount}
              />
            )}
          </div>
        </section>

        {/* Requests + Active rents + Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests */}
          <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 flex flex-col h-screen">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold mb-3">Ajánlatkérések</h3>
              <Download
                data={requests}
                sheetName={"Ajánlatkérés lista"}
                fileName={"ajanlatkeresek"}
              />
            </div>
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
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => openRequestDialog(r)}
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
                            onClick={(e) => openConfirmActivateDialog(r.id, e)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-md  hover:bg-gray-600"
                          >
                            Aktiválás
                          </button>
                          <button
                            onClick={(e) => openConfirmDeleteDialog(r.id, e)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md  hover:bg-red-600"
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
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold mb-3">Aktív bérlések</h3>
              <Download
                data={rents}
                sheetName={"Ajánlatkérés lista"}
                fileName={"aktiv_berlesek"}
              />
            </div>
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
                      className="border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => openRequestDialog(r)}
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
                          onClick={(e) => setRentNotActive(r.id, e)}
                          className="px-3 py-2 bg-gray-500 text-white rounded-md  hover:bg-gray-600"
                        >
                          Leállítás
                        </button>
                        <button
                          onClick={(e) => openConfirmDeleteDialog(r.id, e)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md  hover:bg-red-600"
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
        <RequestDialog
          isOpen={isRequestDialogOpen}
          setIsOpen={setRequestDialogOpen}
          requestData={requestDialogData}
        />
      </div>
    </div>
  );
}
