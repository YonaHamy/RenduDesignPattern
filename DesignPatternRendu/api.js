var fetchMetros = (function () {
    let interval = null;

        async function initRequest() {
           let listeMetros = document.getElementById("metros");
           const selectExist = document.getElementById("selectMetro");
           if(!selectExist){
                let response = await fetch("https://api-ratp.pierre-grimaud.fr/v4/lines/metros");
                try {
                    let res = await response.json();
                    let results = await res.result.metros;
                    if(results){
                    var selectList = document.createElement("select");
                    selectList.setAttribute("id", "selectMetro");
                    selectList.addEventListener('change', function() {
                       getStations(this.value, this.options[this.selectedIndex].text);
                     });
                    listeMetros.appendChild(selectList);
                    for (var i = 0; i < results.length; i++) {
                        var option = document.createElement("option");
                        option.value = results[i].code;
                        option.text = results[i].name;
                        selectList.appendChild(option);
                    }
                   }
                }
                catch (err) {
                    console.log(err);
                }
           }
        }

        async function getStations(code, name) {
           let listeMetros = document.getElementById("stations");
            let response = await fetch(`https://api-ratp.pierre-grimaud.fr/v4/stations/metros/${code}`);

            try {
                let res = await response.json();
                let results = await res.result.stations;

                if(results){
                   while (listeMetros.firstChild) {
                       listeMetros.removeChild(listeMetros.lastChild);
                     }

                   var texte = document.createElement("P");
                   texte.setAttribute("id", "textStations");
                   texte.innerText = `Voici les stations disponibles pour la ligne  ${name} :`;
                   listeMetros.appendChild(texte);

                   var selectList = document.createElement("select");
                   selectList.setAttribute("id", "selectStations");
                   selectList.addEventListener('change', function() {
                       getStationsArrivalTime(this.value, this.options[this.selectedIndex].text, code, name);
                     });
                   listeMetros.appendChild(selectList);

                   for (var i = 0; i < results.length; i++) {
                             var option = document.createElement("option");
                             option.value = results[i].slug;
                             option.text = results[i].name;
                             selectList.appendChild(option);
                         }
                   }
            }
            catch (err) {
                console.log(err);
            }
       }

       async function getStationsArrivalTime(slug, name, code, station) {
           if(interval !== null){clearInterval(interval)};
           let horaires = document.getElementById("horaires");
            let response = await fetch(`https://api-ratp.pierre-grimaud.fr/v4/schedules/metros/${code}/${slug}/A%2BR`);
            try {
                let res = await response.json();
                let results = await res.result.schedules;
                if(results){
                   while (horaires.firstChild) {
                       horaires.removeChild(horaires.lastChild);
                     }
                   var texte = document.createElement("P");
                   texte.setAttribute("id", "textStations");
                   texte.innerText = `Voici les prochaines horaires pour la station ${name} de la ligne ${station} :`;
                   horaires.appendChild(texte);

                   var listeHoraires = document.createElement('ul');
                   listeHoraires.setAttribute('id','listeHoraires');
                   horaires.appendChild(listeHoraires);

                   for (var i = 0; i < results.length; i++) {
                             var li = document.createElement("li");
                             listeHoraires.appendChild(li);
                             li.innerHTML= `${results[i].destination} : ${results[i].message}`;
                         }
                   interval = setInterval(function() {getStationsArrivalTime(slug, name, code, station)}, 30000);
                   }
            }
            catch (err) {
                console.log(err);
            }
       }


  return {
    initRequest: initRequest
  }
})(); 


       