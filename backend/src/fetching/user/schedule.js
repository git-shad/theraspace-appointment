const view_appointment = $$('#view_appointment');
if (view_appointment) {
    view_appointment.forEach((view)=>{
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            
            fetch(`/dashboard/schedule/${id}`, {
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


const editinfo = $$('#editinfo');
if (editinfo) {
    editinfo.forEach(editinfo => {
        editinfo.addEventListener('click',(e)=>{
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            const firstname = $('#firstname').value;
            const lastname = $('#lastname').value;
            const childname = $('#childname').value;
            const contact = $('#contact').value;
    
            const data = { firstname,lastname,childname,contact };
        
                Swal.fire({
                      title: "Edited Successfully!",
                      text: "Recorded",
                      icon: "success"
                });
                fetch(`/dashboard/schedule/${id}/edit`,{
                    method: 'PUT',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
    
                })
                .catch(error => {
                    console.log(error);
                })
                       
            
        });
    })
}
