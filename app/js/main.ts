import { Riproducibile } from "../webApp/js/osservabile";
import ajax from "../webApp/js/ajax.js";
import t from "../webApp/js/traduzione.js";
import { faiIlLogin } from "../login/js/login.js";
import modifNonSalvate from "~/stores/modifiche";

const erroriOsserv = new Riproducibile();

erroriOsserv.prossimo("Alt er fint");

function handleError(response: Response) {
  const r = response;
  if (r.msg === "non entrato") {
    faiIlLogin();
    return;
  }
  // alert("Errore: \n"+r.msg);
  erroriOsserv.prossimo(r.msg);
  console.error(r.msg);
}

function handleWarn(r: Response, action: Action, payload, richiama) {
  if (r.msg === "gia in corso") {
    if (confirm(t("Timer gia in corso\nVuoi continuare?"))) {
      payload.force = true;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      mandaAlServer(action, payload, richiama);
    } else {
      richiama(r.timerStato); // Overskriv med server-version
    }
  }
}

function mandaAlServer(action, payload, richiama) {
  // Håndterer i første omgang /api/inzia/
  const url = "https://dechiffre.dk/pomo-d-oro/api/";
  ajax({
    method: "post",
    url: url,
    postvars: {
      action: action,
      payload: payload ? JSON.stringify(payload) : ""
    },
    withCredentials: true,
    run: function(resp) {
      const r = JSON.parse(resp);
      if (r.stato === "errore") {
        handleError(r);
        return false;
      }
      if (r.stato === "warn") {
        handleWarn(r, action, payload);
        return false;
      }
      if (r.msg === "gia piu recente") {
        erroriOsserv.prossimo(r);
        // alert("Gia un piu recente\n\nPayload\n" + JSON.stringify(payload) + "\n\nServer stato:\n" + JSON.stringify(r));
      }
      if (r.timerStato) {
        richiama(r.timerStato);
      }
    },
    onerror: function(error) {
      erroriOsserv.prossimo(error);
      console.log(error);
    }
  });
}

// Non credo the funzioni perche APP non é disponibile da main.js
function modificheNonSalvate(vero) {
  if (typeof vero !== "undefined") {
    if (!vero) {
      setTimeout(function() {
        modifNonSalvate.set(!!vero)
      }, 250);
    } else {
      modifNonSalvate.set(!!vero);
    }
  }
  return modifNonSalvate;
}

interface Response {
  msg: string;
  stato: 'warn' | 'errore';
  timerStato: string;
}

export type Action = 'chiedi';

export { mandaAlServer, modificheNonSalvate, erroriOsserv };
