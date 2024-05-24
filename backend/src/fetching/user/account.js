const uploadimg = $('#updateInfo');
if(uploadimg){
    uploadimg.addEventListener('click', (e) => {
        e.preventDefault();
        const img = $('#image');
        const formData = new FormData();
        formData.append('firstname',$('#fname').value);
        formData.append('lastname',$('#lname').value);
        formData.append('email',$('#eml').value);
        formData.append('address',$('#addr').value);
        formData.append('contact',$('#cont').value);
        formData.append('image', img.files[0]);

        fetch('/dashboard/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
                
        })
        .catch(error => {
            console.log(error);
        });

    });
}