import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getMachineNameByMachineId } from "../services/machineNameService";

const Download = ({ data, sheetName, fileName }) => {
  const date = new Date();

  function mapToDTO(r){
    return {
        id: r.id,
        nev: r.id,
        email: r.email,
        telefonszam: r.phoneNumber,
        uzenet: r.message,
        gep: getMachineNameByMachineId(r.machine),
        lehetseges_kezdeti_datum: r.possibleStartDate,
        aktivalasi_datum: r.activatedDate,
        befejezesi_datum: r.finishedDate,
        letrehozasi_datum: r.createdTime,
        aktiv_megbizas: r.isActiveRequest
    }
  }

  function DownloadReport() {
    const worksheet = XLSX.utils.json_to_sheet(data.map(mapToDTO));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(
      fileBlob,
      `Kornidesz_Mate_${date.getFullYear()}_${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}${date.getDate()}_${fileName}.xlsx`
    );
  }

  return (
    <button onClick={DownloadReport}>
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
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
        />
      </svg>
    </button>
  );
};

export default Download;
