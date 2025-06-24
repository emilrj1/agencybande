import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, update, remove, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// Din Firebase config
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
const auth = getAuth(app);
const db = getDatabase(app);

const adminEmails = ["emilrj96@gmail.com"]; // Admin emails

// Elementer
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const weaponPricesTableBody = document.querySelector('#weaponPricesTable tbody');
const addWeaponForm = document.getElementById('addWeaponForm');
const newWeaponName = document.getElementById('newWeaponName');
const newWeaponPrice = document.getElementById('newWeaponPrice');

const usersTableBody = document.querySelector('#usersTable tbody');
const addUserForm = document.getElementById('addUserForm');
const newUserEmail = document.getElementById('newUserEmail');
const newUserName = document.getElementById('newUserName');



// Login funktionalitet
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  loginError.style.display = 'none';
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
    const user = userCredential.user;
    if(adminEmails.includes(user.email)) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      loadWeaponPrices();
      loadUsers();
    } else {
      loginError.textContent = "Du har ikke adgang til admin dashboard.";
      loginError.style.display = 'block';
      signOut(auth);
    }
  })
  .catch(error => {
    loginError.textContent = error.message;
    loginError.style.display = 'block';
  });
});

// Tjek login status
onAuthStateChanged(auth, user => {
  if(user && adminEmails.includes(user.email)) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    loadWeaponPrices();
    loadUsers();
  } else {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
  }
});

// Logout knap
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Funktion: Load våbenpriser fra Firebase
function loadWeaponPrices() {
  const wpRef = ref(db, 'weaponPrices');
  onValue(wpRef, snapshot => {
    weaponPricesTableBody.innerHTML = '';
    const data = snapshot.val();
    if(data) {
      Object.entries(data).forEach(([key, value]) => {
        const tr = document.createElement('tr');

        // Våben navn
        const tdName = document.createElement('td');
        tdName.textContent = value.name;
        tr.appendChild(tdName);

        // Pris (input felt til ændring)
        const tdPrice = document.createElement('td');
        const inputPrice = document.createElement('input');
        inputPrice.type = 'number';
        inputPrice.value = value.price;
        inputPrice.min = 0;
        inputPrice.style.width = '80px';
        tdPrice.appendChild(inputPrice);
        tr.appendChild(tdPrice);

        // Handlinger (gem ændring / slet)
        const tdActions = document.createElement('td');

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Gem';
        saveBtn.addEventListener('click', () => {
          const newPrice = parseInt(inputPrice.value);
          if(newPrice >= 0) {
            update(ref(db, 'weaponPrices/' + key), { price: newPrice });
          }
        });
        tdActions.appendChild(saveBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Slet';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.addEventListener('click', () => {
          if(confirm(`Slet våben "${value.name}"?`)) {
            remove(ref(db, 'weaponPrices/' + key));
          }
        });
        tdActions.appendChild(deleteBtn);

        tr.appendChild(tdActions);

        weaponPricesTableBody.appendChild(tr);
      });
    }
  });
}

// Tilføj våben
addWeaponForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newWeaponName.value.trim();
  const price = parseInt(newWeaponPrice.value);
  if(name && price >= 0) {
    const wpRef = ref(db, 'weaponPrices');
    // Push nyt våben
    push(wpRef, { name, price });
    newWeaponName.value = '';
    newWeaponPrice.value = '';
  }
});

// Funktion: Load users fra Firebase
function loadUsers() {
  const usersRef = ref(db, 'forumUsers');
  onValue(usersRef, snapshot => {
    usersTableBody.innerHTML = '';
    const data = snapshot.val();
    if(data) {
      Object.entries(data).forEach(([key, user]) => {
        const tr = document.createElement('tr');

        const tdEmail = document.createElement('td');
        tdEmail.textContent = user.email;
        tr.appendChild(tdEmail);

        // Navn (input felt for redigering)
        const tdName = document.createElement('td');
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.value = user.name || '';
        inputName.style.width = '150px';
        tdName.appendChild(inputName);
        tr.appendChild(tdName);

        // Handlinger
        const tdActions = document.createElement('td');

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Gem';
        saveBtn.addEventListener('click', () => {
          const newName = inputName.value.trim();
          if(newName) {
            update(ref(db, 'forumUsers/' + key), { name: newName });
          }
        });
        tdActions.appendChild(saveBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Slet';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.addEventListener('click', () => {
          if(confirm(`Slet bruger "${user.email}"?`)) {
            remove(ref(db, 'forumUsers/' + key));
          }
        });
        tdActions.appendChild(deleteBtn);

        tr.appendChild(tdActions);

        usersTableBody.appendChild(tr);
      });
    }
  });
}

addUserForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = newUserEmail.value.trim();
  const password = prompt('Skriv en adgangskode til denne bruger:');

  if(email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        const uid = cred.user.uid;
        set(ref(db, 'forumUsers/' + uid), { email: email }); // kun email i databasen
        newUserEmail.value = '';
      })
      .catch((error) => {
        console.error('Fejl ved oprettelse af bruger:', error.message);
      });
  }
});

