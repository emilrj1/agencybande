import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase konfig
const firebaseConfig = {
  apiKey: "AIzaSyBZSokeyo5io-Ck-5T7cL0InI1DsX7KMww",
  authDomain: "agency-cec1f.firebaseapp.com",
  projectId: "agency-cec1f",
  appId: "1:69049090225:web:4e39942395a2ee74276290"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elementer
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const darkChatSection = document.getElementById('darkChat');
const toggleChatBtn = document.getElementById('toggleChat');
const pageContent = document.getElementById('page-content');
const navLinks = document.querySelectorAll('nav ul li a[data-page]');

let unsubscribeFromChat = null;
let currentUserEmail = null;

// Escape HTML for sikkerhed
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (match) => {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[match];
  });
}

// Tjek loginstatus
onAuthStateChanged(auth, user => {
  if (user) {
    currentUserEmail = user.email;
    setupChat();
  } else {
    currentUserEmail = null;
    if (unsubscribeFromChat) unsubscribeFromChat();
    darkChatSection.style.display = 'none';
  }
});

// Sæt chat op
function setupChat() {
  if (unsubscribeFromChat) unsubscribeFromChat();

  const messagesQuery = query(collection(db, 'chatMessages'), orderBy('timestamp', 'asc'));

  unsubscribeFromChat = onSnapshot(messagesQuery, snapshot => {
    chatMessages.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const time = data.timestamp?.toDate().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) || '';
      const msgEl = document.createElement('div');
      msgEl.classList.add('chat-message');
      msgEl.innerHTML = `<strong>${escapeHtml(data.email)}</strong> <span style="color:#888;font-size:0.8em;">${time}</span><br>${escapeHtml(data.message)}`;
      chatMessages.appendChild(msgEl);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

// Form submit (send besked)
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (message === '') return;

  if (!currentUserEmail) {
    alert("Du skal være logget ind for at sende beskeder.");
    return;
  }

  addDoc(collection(db, 'chatMessages'), {
    email: currentUserEmail,
    message,
    timestamp: serverTimestamp()
  }).then(() => {
    chatInput.value = '';
  }).catch(error => {
    console.error("Fejl ved at sende besked:", error);
  });
});

// Toggle chat visning
toggleChatBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (darkChatSection.style.display === 'none' || darkChatSection.style.display === '') {
    darkChatSection.style.display = 'block';
  } else {
    darkChatSection.style.display = 'none';
  }
});

// Navbar side skift (indlæs side tekst som eksempel)
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = e.target.dataset.page;
    pageContent.textContent = `Du er nu på siden: ${page}`;
  });
});
function typeWriter() {
  if (i < text.length) {
    element.innerHTML = text.substring(0, i + 1);
    i++;
    setTimeout(typeWriter, 100);
  }
}
import { auth } from "./firebase-config.js"; // Husk at importere auth
// Hvis du bruger Firestore, importér det også

const dashboardNav = document.getElementById('dashboardNav');
const dashboardSection = document.getElementById('dashboard');

// Tjek brugerens auth-state
auth.onAuthStateChanged((user) => {
  if (user && user.email === "emilrj96@gmail.com") {
    dashboardNav.style.display = "inline"; // samme som øvrige links
  }
});


// Håndter click på dashboard-linket
dashboardNav.addEventListener('click', (e) => {
  e.preventDefault();
  // Skjul andet indhold
  document.getElementById('page-content').style.display = "none";
  dashboardSection.style.display = "block";
});

// Hvis du vil have knappen til at tilføje bruger til login-databasen
document.getElementById('addUserForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newUserEmail = document.getElementById('newUserEmail').value;
  // Her lægger du brugerens email i Firestore:
  await addDoc(collection(db, "authorizedUsers"), { email: newUserEmail });
  alert(`Brugeren ${newUserEmail} er tilføjet!`);
});

