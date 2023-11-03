import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {

    apiKey: "AIzaSyCi9v09k6xILtMDc1ezEi3GtVLEDqOAXuM",
    authDomain: "attendanceerp-a224b.firebaseapp.com",
    databaseURL: "https://attendanceerp-a224b-default-rtdb.firebaseio.com",
    projectId: "attendanceerp-a224b",
    storageBucket: "attendanceerp-a224b.appspot.com",
    messagingSenderId: "594131242676",
    appId: "1:594131242676:web:1442172c91b81e49ac11e1",
    measurementId: "G-PELESS2395"

};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase(app);

var usernameSpan = document.getElementById('username');

// Fetch user data from the database
try {
    const userRef = ref(database, "users/" + localStorage.getItem('branch') + "/" + localStorage.getItem('year') + "/" + localStorage.getItem('divison') + "/" + localStorage.getItem('userRef').replace(/\./g, '_'));
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const storedUsername = snapshot.child('name').val();
        const rollno = snapshot.child('rollno').val();
        document.getElementById('username').innerHTML = "Welcome, " + storedUsername;
        localStorage.setItem('rollno', rollno);


    } else {
        console.error('User data not found.');
    }

} catch (error) {
    console.error('Error fetching user data:', error.message);
};

document.getElementById('search').addEventListener('click', () => {

    window.location.href = 'studentattendanceview.html';

})

