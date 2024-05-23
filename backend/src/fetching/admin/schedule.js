const setSchedule = $('#setSchedule');
if(setSchedule){
    setSchedule.addEventListener('click', function(){
        var s = $('#stime');
        var e = $('#etime');

        console.log(s.value)
        fetch('/dashboard/schedule/set',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'  
                },
            body: JSON.stringify({  
                stime: s.value,
                etime: e.value
            })
        })
        .then(response => response.json())
        .then(data => {})
        .catch(error => {
            console.log(error);
        })
    });
}