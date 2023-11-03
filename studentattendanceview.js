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
    const targetRollNumber = localStorage.getItem('rollno');
    document.getElementById('rollno').innerHTML = "Roll no: " + targetRollNumber;
    var division;
    if (targetRollNumber.includes('B')) {

        division = " B";
    } else {
        division = " A";

    }
    const nameRef = ref(database, `users/INFT/TE/Divison${division}`);

    const divisionRef = ref(database, `/lectures/INFT/TE/Division${division}`);
    try {
        const divisionSnapshot = await get(divisionRef);

        if (divisionSnapshot.exists()) {
            const subjects = Object.keys(divisionSnapshot.val());

            for (const subject of subjects) {
                await fetchAttendanceData(subject, targetRollNumber);
            }
        }
    } catch (error) {
        console.error("Error getting division data:", error);
    }

    try {
        const emailSnapshot = await get(nameRef);

        if (emailSnapshot.exists()) {
            const emails = Object.keys(emailSnapshot.val());

            for (const email of emails) {
                const infoRef = ref(database, `users/INFT/TE/Divison${division}/${email}/name`);
                const rollcheck = ref(database, `users/INFT/TE/Divison${division}/${email}/rollno`);
                const rollchecksnapshot = await get(rollcheck);

                const infosnapshot = await get(infoRef);

                if (rollchecksnapshot.exists()) {
                    if (targetRollNumber === rollchecksnapshot.val()) {

                        const name = infosnapshot.val();
                        console.log(name);
                        document.getElementById('name').innerHTML = "Name: " + name;
                        document.getElementById('loader').remove('loader');
                        break;
                    } else { console.log("Roll number not found") }
                }
            }
        }
    } catch (error) {
        console.error("Error getting division data:", error);
    }
});

async function fetchAttendanceData(subject, targetRollNumber) {
    let total = 0;
    let present = 0;

    const dbRef = ref(database, `/lectures/INFT/TE/Division A/${subject}/attendance`);

    try {
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const keys = Object.keys(snapshot.val());

            async function getDataForDate(date) {
                const dateRef = ref(database, `/lectures/INFT/TE/Division A/${subject}/attendance/${date}`);
                const rollRef = ref(database, `/lectures/INFT/TE/Division A/${subject}/attendance/${date}/${targetRollNumber}`);

                try {
                    const dateSnapshot = await get(dateRef);

                    if (dateSnapshot.exists()) {
                        const rollSnapshot = await get(rollRef);

                        if (rollSnapshot.exists()) {
                            const value = rollSnapshot.val();
                            if (value === true) {
                                present = present + 1;
                            }
                            console.log(value);
                        }
                    }
                } catch (error) {
                    console.error(`Error getting data for ${date}:`, error);
                }
            }


            await Promise.all(keys.map(async (date) => {
                total = total + 1;
                await getDataForDate(date);
            }));

            console.log(`Subject: ${subject}`);
            console.log(`Total Lectures: ${total}`);
            console.log(`Present: ${present}`);

            const attendancePercentage = (present / total) * 100;

            // Append a new row to the table
            const table = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
            const newRow = table.insertRow(table.rows.length);
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);

            // Populate the cells with data
            cell1.innerHTML = subject;
            cell2.innerHTML = attendancePercentage.toFixed(2) + "%";
            cell3.innerHTML = `<canvas id="${subject}Chart" width="300" height="300"></canvas>`;

            // Create and render the pie chart
            const chartData = {
                labels: ['Present', 'Absent'],
                datasets: [{
                    data: [present, total - present],
                    backgroundColor: ['green', 'red']
                }]
            };

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false
            };

            const ctx = document.getElementById(`${subject}Chart`).getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: chartOptions
            });


        }
    } catch (error) {
        console.error(`Error getting data for ${subject}:`, error);
    }
}
