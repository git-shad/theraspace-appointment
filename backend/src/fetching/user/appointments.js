const confirm_appointment = $('#confirm_appointment');
if (confirm_appointment) {
    confirm_appointment.addEventListener('click', (e) => {
        e.preventDefault();

        const schedule_id = $('#boxID').innerHTML;
        const date = $('#dateInput').value;
        const fname = $('#firstname').value;
        const lname = $('#lastname').value;
        const childname = $('#childname').value;
        const contact = $('#contact').value;


        if (!schedule_id || !date || !fname || !lname || !childname || !contact) {
            Swal.fire({
                title: "Error",
                text: "All fields are required.",
                icon: "error",
                confirmButtonColor: '#3085d6'
            });
            return;
        }

         // Check if contact is numeric and exactly 11 digits
         if (!/^\d{11}$/.test(contact)) {
            Swal.fire({
                title: "Error",
                text: "Contact number must be exactly 11 digits and numeric.",
                icon: "error",
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const data = { schedule_id, date, fname, lname, childname, contact };

        Swal.fire({
            title: "Do you want to proceed?",
            text: 'Set Appointment',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Appointment Successfully!",
                    text: "Recorded",
                    icon: "success"
                });
                fetch('/dashboard/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    // Handle success
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });
}
    
