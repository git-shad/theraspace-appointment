const view_prescription = $$('#view_prescription');
if (view_prescription) {
    view_prescription.forEach((view)=>{
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            
            fetch(`/dashboard/prescription/${id}`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    console.log(data.msg)
                    $('#msg').innerHTML = data.msg;
                }
            })
            .catch(error => {
                console.log(error);
            });
        });
    });
}


