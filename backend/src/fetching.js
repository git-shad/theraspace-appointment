function $($){
    return document.querySelector($);
}

function $$($){
    return document.querySelectorAll($);
}

function changeID(id){
    document.querySelector('#boxID').innerHTML = id;
}

function confirmLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Successfully Logged Out!",
          text: "Recorded",
          icon: "success"
        }).then(() => {
          window.location.href = 'logout';
        });
      }
    });
}  

