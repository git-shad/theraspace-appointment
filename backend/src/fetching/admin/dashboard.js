const view_appointmentToday = $$('#view_appointmentToday');
if(view_appointmentToday){
    view_appointmentToday.forEach(view => {
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('boxID').innerHTML;

            fetch('/dashboard/main/${id}',{
                method: "PUT"
            })
            .then(response => response.json())
            .then(data => {})
            .catch(error =>{
                console.log(error);
            });
        });
    });
}