// Importér Firebase v11+ som ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// 🔑 Indsæt dine egne Firebase credentials her:
const firebaseConfig = {
  apiKey: "AIzaSyBZSokeyo5io-Ck-5T7cL0InI1DsX7KMww",
  authDomain: "agency-cec1f.firebaseapp.com",
  projectId: "agency-cec1f",
  appId: "1:69049090225:web:4e39942395a2ee74276290"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginButton = document.getElementById('loginButton');

// Login logik
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // 🎯 Hvis login lykkedes, omdiriger til forum.html
    window.location.href = "forum.html";
  } catch (error) {
    alert(error.message);
  }
});
function typeWriter() {
  if (i < text.length) {
    element.innerHTML = text.substring(0, i + 1);
    i++;
    setTimeout(typeWriter, 100);
  }
}
