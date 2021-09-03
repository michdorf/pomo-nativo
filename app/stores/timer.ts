import {writable} from "svelte/store";
import {ApplicationSettings} from "@nativescript/core";

let timerStore = writable({
  iniziatoT: 0,
  finito: true,
  tempo: 25 * 60,
  tempi: [25, 5, 15] /* Cambiato da std_stato in ambiente */,
  durataTimer: 0,
  puntoLavoro: 0,
  pausaLungaDopo: 4,
  obbiettivoProGiorno: 4,
  attivita: new Attivita(),
  sessioni: [],
  sesDati: [] // data array as stored in db
});

const statoStoragek = "pomo-d-oro";

function salvaState(statoCompleto) {
  ApplicationSettings.setString(statoStoragek, JSON.stringify(statoCompleto))
}

const autoSaver = timerStore.subscribe(value => {
  salvaState(value);
});

export default timerStore;
