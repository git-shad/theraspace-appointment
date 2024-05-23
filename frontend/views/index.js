function Menu(icon) {
  let list = document.querySelector('ul');
  if (icon.name === 'menu') {
    icon.name = 'close';
    list.style.top = '80px';
    list.style.opacity = '100';
  } else {
    icon.name = 'menu';
    list.style.top = '-400px';
    list.style.opacity = '0';
  }
}

window.addEventListener('load', function () {
    setTimeout(function () {
      let a = document.querySelector('.preloader')
      if(a){
        a.style.display = 'none';
      }
          
    }, 1000);
});

let sections = document.querySelectorAll('section');
let liLinks = document.querySelectorAll('li a');

window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offSet = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offSet && top < offSet + height) {
      liLinks.forEach(link => {
        link.classList.remove('active');
      });
      document.querySelector('li a[href*=' + id + ']').classList.add('active');
    }
  });
};

const dateInput = document.getElementById('dateInput');
if(dateInput){
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0,10);
  dateInput.value = formattedDate;
}

