import axios from "axios";
import { hasVisitedToday, SetVisitForToday } from "../services/webVisitService";

export const GeoLocationCounter = () => {
  async function getGeolocation() {
    if (hasVisitedToday()) return;

    let latitude = null;
    let longitude = null;

    function showPosition(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      callApiWithData(latitude, longitude);
    }

    function showError(_) {
      callApiWithData(latitude, longitude);
    }

    async function callApiWithData(latitude, longitude) {
      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/api/webvisit/new`, {
          latitude: latitude,
          longitude: longitude,
        });

        SetVisitForToday();
      } catch {}
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      callApiWithData(latitude, longitude)
    }
  }

  getGeolocation();
};
