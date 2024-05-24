const view_history = $$('#view_history');
if (view_history) {
    view_history.forEach((view)=>{
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

function deleteHistory(id){
    Swal.fire({
          title: "Do you want to proceed?",
          text: 'Delete History',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
      }).then((result) => {

        fetch(`/dashboard/history/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if(result.isConfirmed && data.success === 'true'){
                Swal.fire({
                   title: "Deleted Successfully!",
                   text: "Recorded",
                   icon: "success"
                });
                
              }
        })
        .catch(error => {
            console.log(error);
        });
          
      })
  }