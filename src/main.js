import CovidApi from "./api/covid";
import "./assets/css/main.css";

const $selectCountries = document.querySelector('[data-js="select-countrie"]');
const $dataConfirmed = document.querySelector('[data-js="data-confirmed"]');
const $dataDeath = document.querySelector('[data-js="data-deaths"]');
const $dataRecovered = document.querySelector('[data-js="data-recovered"]');
const $dataActive = document.querySelector('[data-js="data-active"]');
const $initialDate = document.querySelector('[data-js="initial-date"]');
const $finalDate = document.querySelector('[data-js="final-date"]');
const $loadData = document.querySelector('[data-js="load-data"]');
let $textCountryTop = document.querySelector('[data-js="text-country-top"]');

const localeString = "pt-BR";
let countrySlug = "";
let initialDate = "";
let finalDate = "";
let maxDate = new Date().toISOString().slice(0, 10);

$initialDate.setAttribute("max", maxDate);
$finalDate.setAttribute("max", maxDate);
const covidData = new CovidApi();

$selectCountries.addEventListener("change", callCompareCountry);
$initialDate.addEventListener("change", getInitialDate);
$finalDate.addEventListener("change", getFinalDate);
$loadData.addEventListener("click", loadCovidData);

function loadCovidData() {
  setTimeout(() => {
    const urlRequest = `${countrySlug}?from=${initialDate}&to=${finalDate}`;
    const data = countryAllStatus(urlRequest);
    insertDeathsOnDOM(data);
    insertConfirmedOnDom(data);
    insertRecoveredOnDOM(data);
    insertActiveOnDOM(data);
  }, 1000);
}

function getInitialDate() {
  const inputDate = this.value;
  initialDate = `${inputDate}T00:00:00Z`;
}

function getFinalDate() {
  const inputDate = this.value;
  finalDate = `${inputDate}T00:00:00Z`;
}

async function getData() {
  try {
    const response = await covidData.countries();
    return response;
  } catch (error) {
    console.log(`Não foi possivel realizar a requisição ${error}`);
  }
}

async function countryAllStatus(URL) {
  try {
    const response = await covidData.byCountryAllStatus(URL);
    return response;
  } catch (error) {
    console.log(`Não foi possivel realizar a requisição ${error}`);
  }
}

async function insertCountriesOnSelect(data) {
  const { Countries } = await data;
  for (let i = 0; i < Countries.length; i++) {
    const optionCountrie = document.createElement("option");
    const nameCountrieSelect = document.createTextNode(Countries[i].Country);
    optionCountrie.appendChild(nameCountrieSelect);
    $selectCountries.appendChild(optionCountrie);
  }
}
async function insertConfirmedOnDom(data) {
  const dataCountries = await data;
  const totalConfirmeds = dataCountries.map((item) => item.Confirmed);
  const lastPosition = totalConfirmeds[totalConfirmeds.length - 1];
  const firstPosition = totalConfirmeds[0];

  const resultConfirmed = lastPosition - firstPosition;
  $dataConfirmed.textContent = resultConfirmed.toLocaleString(localeString);
}

async function insertDeathsOnDOM(data) {
  const dataCountries = await data;
  const totalDeaths = dataCountries.map((item) => item.Deaths);
  const lastPosition = totalDeaths[totalDeaths.length - 1];
  const firstPosition = totalDeaths[0];

  const resultDeath = lastPosition - firstPosition;
  $dataDeath.textContent = resultDeath.toLocaleString(localeString);
}

async function insertRecoveredOnDOM(data) {
  const dataCountries = await data;
  const TotalRecovered = dataCountries.map((item) => item.Recovered);
  const lastPosition = TotalRecovered[TotalRecovered.length - 1];
  const firstPosition = TotalRecovered[0];

  const resultRecovered = lastPosition - firstPosition;
  $dataRecovered.textContent = resultRecovered.toLocaleString(localeString);
}

async function insertActiveOnDOM(data) {
  const dataCountries = await data;
  const TotalActive = dataCountries.map((item) => item.Active);
  const lastPosition = TotalActive[TotalActive.length - 1];
  const firstPosition = TotalActive[0];

  const resultActive = lastPosition - firstPosition;
  $dataActive.textContent = resultActive.toLocaleString(localeString);
}

async function insertGlobalDataOnDOM(data) {
  const { Global } = await data;
  const { TotalConfirmed, TotalDeaths, TotalRecovered } = Global;

  let activaCases = TotalConfirmed - TotalDeaths + TotalRecovered;

  $dataConfirmed.textContent = TotalConfirmed.toLocaleString(localeString);
  $dataDeath.textContent = TotalDeaths.toLocaleString(localeString);
  $dataRecovered.textContent = TotalRecovered.toLocaleString(localeString);
  $dataActive.textContent = activaCases.toLocaleString(localeString);
}

function getCountryNameOnSelect() {
  let optionText =
    $selectCountries.options[$selectCountries.selectedIndex].text;
  optionText === "Global" ? (optionText = "Globais") : optionText;
  $textCountryTop.textContent = optionText;
  return optionText;
}

async function compareCountry(countrySelect, data) {
  const { Countries } = await data;
  const foundCountry = Countries.find(
    (country) => country.Country === countrySelect
  );
  countrySlug = foundCountry.Slug;
}

async function callCompareCountry() {
  const country = await compareCountry(getCountryNameOnSelect(), getData());
  return country;
}

insertCountriesOnSelect(getData());
insertGlobalDataOnDOM(getData());
