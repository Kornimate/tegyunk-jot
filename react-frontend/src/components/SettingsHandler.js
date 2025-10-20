import { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";

export const SettingsHandler = ({
  initCount: initData = 0,
  labelText,
  btnText,
  apiCallCallback,
  setterCallback
}) => {

  const [count, setCount] = useState(0);

  useEffect(() => {
    if(!initData)
        return

    setCount(initData.value)
    setterCallback(initData.value)
  }, [initData, setterCallback]);

  function countChanged(e) {
    if (e.target.value === "") {
      setCount(null);
      return;
    }

    setCount(e.target.value);
  }

  async function btnClicked() {
    if (count === null) {
      alert("Adjon meg egy számot!");
    }
    await apiCallCallback(initData?.id, count);
    setterCallback(count);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <SettingsIcon className="top-2 left-2 text-red-500" />
      <label className="text-sm font-medium text-gray-700">{labelText}</label>
      <input
        value={count}
        onChange={countChanged}
        type="number"
        placeholder="Adjon meg egy számot"
        className="text-center w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        onClick={btnClicked}
      >
        {btnText}
      </button>
    </div>
  );
};
