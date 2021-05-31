import axios from "../utils/axios";

export default class CovidApi {
  async countries() {
    const { data } = await axios.get("/summary");
    return data;
  }

  async byCountryAllStatus(country) {
    const { data } = await axios.get(`/country/${country}`);
    return data;
  }
}
