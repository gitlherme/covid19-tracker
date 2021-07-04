const baseUrl = 'https://api.covid19api.com';
const selectCountry = document.querySelector('#countries');
const totalConfirmed = document.querySelector('.total-confirmed').children;
const totalDeaths = document.querySelector('.total-deaths').children;
const totalRecovered = document.querySelector('.total-recovered').children;
const totalActives = document.querySelector('.actives').children;
const date = document.querySelector('#date');

window.onload = function() {
  init();
}


function init() {
  let today = new Date();
  date.value = today.toISOString().substr(0, 10);
  getCountries();
  getSummary();
  selectCountry.addEventListener('change', () => {
    getSummary();
  });
  date.addEventListener('change', () => {
    getSummary();
  });
}

async function getCountries() {
  let countries;
  try {
    let res = await fetch(`${baseUrl}/countries`);
    countries = await res.json();
    countries.forEach((country) => {
      let option = document.createElement('option');
      option.value = country.Slug;
      option.text = country.Country;
      selectCountry.add(option, selectCountry.options[selectCountry.options.length+1])
    })
  } catch(e) {
    console.error(e);
  }
  return countries
}

async function getSummary() {
 let countrySelected = selectCountry.value;
 try {
   if (countrySelected == 'global') {
      let response = await (await fetch(`${baseUrl}/summary`)).json();
      totalConfirmed[1].innerHTML = response.Global.TotalConfirmed.toLocaleString();
      totalDeaths[1].innerHTML = response.Global.TotalDeaths.toLocaleString();
      totalRecovered[1].innerHTML = response.Global.TotalRecovered.toLocaleString();
      totalActives[0].innerHTML = 'Atualização';
      const dateAtt = new Date(response.Global.Date);
      const day = dateAtt.getDate().toString().padStart(2, '0');
      const month = (dateAtt.getMonth() + 1).toString().padStart(2, '0');
      const year = dateAtt.getFullYear();
      const hours = dateAtt.getHours();
      const minutes = dateAtt.getMinutes();
      totalActives[1].innerHTML = `${day}/${month}/${year} - ${hours}:${minutes}`;
   } else {
      let response = await (await fetch(`${baseUrl}/country/${countrySelected}?from=2020-02-25T00:00:00Z&to=${date.value}T00:00:00Z`)).json();

      let calcConfirmed = response[response.length-1].Confirmed - response[response.length-2].Confirmed;
      let calcDeaths = response[response.length-1].Deaths - response[response.length-2].Deaths;
      let calcRecovered = response[response.length-1].Recovered - response[response.length-2].Recovered;
      let calcActives = response[response.length-1].Active - response[response.length-2].Active;

      totalConfirmed[1].innerHTML = response[response.length-1].Confirmed.toLocaleString();
      if (calcConfirmed < 0) {
        totalConfirmed[2].children[0].classList.add('fas');
        totalConfirmed[2].children[0].classList.add('fa-long-arrow-alt-down');
        totalConfirmed[2].children[0].classList.remove('fa-long-arrow-alt-up');
      } else {
        totalConfirmed[2].children[0].classList.add('fas');
        totalConfirmed[2].children[0].classList.add('fa-long-arrow-alt-up');
        totalConfirmed[2].children[0].classList.remove('fa-long-arrow-alt-down');
      }
      totalConfirmed[2].children[1].innerHTML = `Diário ${calcConfirmed}`;


      totalDeaths[1].innerHTML = response[response.length-1].Deaths.toLocaleString();
      if (calcDeaths < 0) {
        totalDeaths[2].children[0].classList.add('fas');
        totalDeaths[2].children[0].classList.add('fa-long-arrow-alt-down');
        totalDeaths[2].children[0].classList.remove('fa-long-arrow-alt-up');
      } else {
        totalDeaths[2].children[0].classList.add('fas');
        totalDeaths[2].children[0].classList.add('fa-long-arrow-alt-up');
        totalDeaths[2].children[0].classList.remove('fa-long-arrow-alt-down');
      }
      totalDeaths[2].children[1].innerHTML = `Diário ${calcDeaths}`

      totalRecovered[1].innerHTML = response[response.length-1].Recovered.toLocaleString();
      if (calcRecovered < 0) {
        totalRecovered[2].children[0].classList.add('fas');
        totalRecovered[2].children[0].classList.add('fa-long-arrow-alt-down');
        totalRecovered[2].children[0].classList.remove('fa-long-arrow-alt-up');
      } else {
        totalRecovered[2].children[0].classList.add('fas');
        totalRecovered[2].children[0].classList.add('fa-long-arrow-alt-up');
        totalRecovered[2].children[0].classList.remove('fa-long-arrow-alt-down');
      }
      totalRecovered[2].children[1].innerHTML = `Diário ${calcRecovered}`

      totalActives[0].innerHTML = 'Ativos'
      totalActives[1].innerHTML = response[response.length-1].Active.toLocaleString();
      if (calcActives < 0) {
        totalActives[2].children[0].classList.add('fas');
        totalActives[2].children[0].classList.add('fa-long-arrow-alt-down');
        totalActives[2].children[0].classList.remove('fa-long-arrow-alt-up');
      } else {
        totalActives[2].children[0].classList.add('fas');
        totalActives[2].children[0].classList.add('fa-long-arrow-alt-up');
        totalActives[2].children[0].classList.remove('fa-long-arrow-alt-down');
      }
      totalActives[2].children[1].innerHTML = `Diário ${calcActives}`
    }
 } catch(e) {
   console.error(e);
 }

}