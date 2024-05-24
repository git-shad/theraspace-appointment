const view_historyA = $$('#view_historyA');
if (view_historyA) {
    view_historyA.forEach((view)=>{
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            console.log(id);
            fetch(`/dashboard/history/view/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(data => {
                if(data){
                    $('#appnum').value = data.appointment_id;
                    $('#firstname').value = data.firstname;
                    $('#lastname').value = data.lastname;
                    $('#childname').value = data.childname;
                    $('#contact').value = data.contact;
                }
            })
            .catch(error => {
                console.log(error);
            });
    
        });
    })
}

const write_prescription = $('#write_prescription');
if(write_prescription){
    write_prescription.addEventListener('click', (e) => {
        e.preventDefault();

        const msg = $('#message');
        const id = $('#boxID');

        fetch('/dashboard/history/msg',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message: msg.value,
                appointemnt_id: id.innerHTML
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                Swal.fire({
                    title: 'Success!',
                    text: 'Prescription submitted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error submitting the prescription.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            
        })
        .catch(error =>{
            console.log(error);
        })

    });
}