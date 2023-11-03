document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('checkattendance').addEventListener('click', () => {
        const rollno = document.getElementById('rollno').value
        localStorage.setItem('rollno', rollno)
        window.location.href = 'studentattendanceview.html';

    });
});