import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase config - husk at erstatte med dine egne værdier
const firebaseConfig = {
  apiKey: "AIzaSyBZSokeyo5io-Ck-5T7cL0InI1DsX7KMww",
  authDomain: "agency-cec1f.firebaseapp.com",
  databaseURL: "https://agency-cec1f-default-rtdb.firebaseio.com",
  projectId: "agency-cec1f",
  storageBucket: "agency-cec1f.firebasestorage.app",
  messagingSenderId: "69049090225",
  appId: "1:69049090225:web:4e39942395a2ee74276290"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const contentEl = document.getElementById('page-content');

// Setup navigation links
document.querySelectorAll('.nav-list a[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    loadPage(page);
  });
});

function loadPage(page) {
  switch(page) {
    case 'marker':
      showMarkers();
      break;
    case 'druglabs':
      showDrugLabs();
      break;
    case 'våbenpriser':
      showWeaponPrices();
      break;
    case 'våbenbestillinger':
      showWeaponOrders();
      break;
    default:
      contentEl.innerHTML = "<p>Side ikke fundet.</p>";
  }
}

function showMarkers() {
  contentEl.innerHTML = `
    <h2>Marker</h2>
    <p>Her kan du se og administrere markører (indhold kan udbygges senere).</p>
  `;
}

function showDrugLabs() {
  contentEl.innerHTML = `
    <h2>DrugLabs</h2>
    <p>Oversigt over DrugLabs kommer snart.</p>
  `;
}

function showWeaponPrices() {
  contentEl.innerHTML = `<h2>Våbenpriser</h2><p>Henter data fra serveren...</p>`;

  const wpRef = ref(db, "weaponPrices");
  onValue(wpRef, snapshot => {
    const data = snapshot.val() || {};
    if(Object.keys(data).length === 0) {
      contentEl.innerHTML = `<h2>Våbenpriser</h2><p>Ingen våben fundet i databasen.</p>`;
      return;
    }

    let html = `<table>
      <thead><tr><th>Våben</th><th>Pris</th></tr></thead>
      <tbody>`;

    Object.values(data).forEach(wp => {
      html += `<tr><td>${wp.name}</td><td>${wp.price} DKK</td></tr>`;
    });

    html += `</tbody></table>`;
    contentEl.innerHTML = `<h2>Våbenpriser</h2>${html}`;
  });
}

function showWeaponOrders() {
  contentEl.innerHTML = `
    <h2>Våbenbestillinger</h2>
    <p>Funktionalitet for våbenbestillinger kommer snart.</p>
  `;
}

// Load default page ved start:
loadPage('marker');
