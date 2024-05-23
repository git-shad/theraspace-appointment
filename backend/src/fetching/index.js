const send = $('#emailsend');
if(send){
    send.addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email',$('#email').value);
        formData.append('subject',$('#subject').value);
        formData.append('message',$('#msg').value);
        console.log(formData);
        fetch('/home',{
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {})
        .catch(error =>{
            console.log(error);
        })
    });
}