import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, get, set, push, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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





document.addEventListener('DOMContentLoaded', async function () {
    const divisionSelect = document.getElementById('division');
    const studentsContainer = document.getElementById('students-container');

    document.getElementById('load').addEventListener('click', async function () {
        studentsContainer.innerHTML = '';

        const selectedDivision = divisionSelect.value;
        const subject = document.getElementById('subject').value;
        const year = document.getElementById('year').value;
        const date = document.getElementById('date').value;
        const course = document.getElementById('course').value;

        const userPath = `lectures/${course}/${year}/Division ${selectedDivision}/${subject}/attendance/${date.replace(/\./g, '_')}`;
        const userRef = ref(database, userPath);

        // Check if data already exists
        const dataSnapshot = await get(userRef);
        const promises = [];


        if (selectedDivision === 'A' || selectedDivision === 'B') {
            let numberOfStudents;
            let prefix;

            if (selectedDivision === 'A') {
                numberOfStudents = 73;
                prefix = '21101A00';
            } else {
                numberOfStudents = 73;
                prefix = '21101B00';
            }

            for (let i = 1; i <= numberOfStudents; i++) {
                const twoDigitNumber = i < 10 ? `0${i}` : `${i}`;
                const rollNumber = `${prefix}${twoDigitNumber}`;
                const studentDiv = document.createElement('div');
                studentDiv.className = 'student';

                const studentButton = document.createElement('button');
                studentButton.className = 'student-click';
                studentButton.textContent = `Student ${rollNumber}`;
                studentButton.id = rollNumber;
                studentButton.value = rollNumber;

                if (dataSnapshot.exists()) { }
                else {
                    promises.push(update(userRef, {
                        [rollNumber]: false,
                    }));
                }

                const rollNumberToRetrieve = rollNumber; // Replace with the actual roll number

                const snapshot = await get(userRef);


                const value = snapshot.val()[rollNumberToRetrieve];
                if (value === true) {
                    studentDiv.style.backgroundColor = 'green';
                } else {
                    studentDiv.style.backgroundColor = '';
                }
                console.log(value);


                studentButton.addEventListener('click', function () {
                    if (studentDiv.style.backgroundColor === 'green') {
                        studentDiv.style.backgroundColor = '';
                        update(userRef, {
                            [rollNumber]: false,
                        });
                    } else {
                        studentDiv.style.backgroundColor = 'green';
                        console.log(studentButton.value);
                        update(userRef, {
                            [rollNumber]: true,
                        });
                    }
                });

                studentDiv.appendChild(studentButton);
                studentsContainer.appendChild(studentDiv);
            }
        }

        try {
            // Wait for all promises to be resolved before logging
            await Promise.all(promises);
            console.log('All roll numbers added successfully');
        } catch (error) {
            console.error('Error adding roll numbers:', error);
        }

    });
});


