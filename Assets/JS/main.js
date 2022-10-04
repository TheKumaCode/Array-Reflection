const reloadImg = document.querySelector('.reload-img');
const mainImg = document.getElementById('loaded-img');
const eDropdown = document.getElementById('email-selector');
const emailInput = document.getElementById('email');
const attach = document.getElementById('attach');
const emailCont = document.querySelector('.email-content');
const notifications = document.querySelector('.notifications');
const closeSuccBtn = document.querySelector('.close');
const emailImages = document.querySelectorAll('.email-item');
const regex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const getImg = 'https://picsum.photos/300';
const database = [];
let email;
let img;
let success = 0;

$(window).on('load', fetchImg);

reloadImg.addEventListener('click', () => {
    fetchImg();
})

function fetchImg() {
    fetch(getImg).then(response => {
        if (response.status >= 400) {
            return response.then (errormsg => {
                let error = new error ("Something ain't right");
                error.data = errormsg;
                throw error;
            })
        } else {
            mainImg.src = response.url;
            img = response.url;
        }
    })
    .catch((error) => 
    console.log("Error: " + error));
}

attach.addEventListener('click', (e) => {
    if (emailInput.value == null || emailInput.value.trim() == "") {
        closeSuccess();
        emailInput.style.outline = "3px solid red";
        notifications.querySelector('.no-email').classList.add('notify');
        e.preventDefault();
    } else if (!emailInput.value.match(regex)) {
        closeSuccess();
        emailInput.style.outline = "3px solid red";
        notifications.querySelector('.no-email').classList.remove('notify');
        notifications.querySelector('.invalid-email').classList.add('notify');
        e.preventDefault();
    } else {
        emailInput.removeAttribute("style");
        notifications.querySelector('.no-email').classList.remove('notify');
        notifications.querySelector('.invalid-email').classList.remove('notify');
        success++;
        notifications.querySelector('.success-count').textContent = success;
        notifications.querySelector('.success').classList.add('notify');
        e.preventDefault();
        addImg();
        fetchImg();
    }

    updateDatabase();
})

closeSuccBtn.addEventListener('click', () => {
    closeSuccess();
})

function closeSuccess() {
    notifications.querySelector('.success').classList.remove('notify');
    success = 0;
}

eDropdown.onchange = () => {updateDatabase()}


function addImg() {
    email = emailInput.value;
    if (!checkForEmail()) {
        database.push([email, img]);
        updateEmails();
    } else if (checkForEmail()){
        var l = database.findIndex(e => e.includes(email));
        if(!database[l].includes(img)) {
            database[l].push(img);
        }
    }
}

function checkForEmail() {
    var dblen = database.length;
    var email = emailInput.value;
    var e;
    for (var i = 0; i < dblen; i++) {
        if (database[i][0] === email) {
            e = 1;
            break;
        }
    } return e;
}

function updateEmails() {
    var email = emailInput.value;
    let newEmailElement = document.createElement('option');
    newEmailElement.textContent = email;
    newEmailElement.value = email;
    eDropdown.appendChild(newEmailElement);
    eDropdown.value = email;
}

function updateDatabase() {
    var selectedEmail = eDropdown.value;
    var emailIndex = database.findIndex(e => e.includes(selectedEmail));
    if (emailIndex >= 0) {
        emailCont.innerHTML = "";
        for (var i = 1; i < database[emailIndex].length; i++) {
            let newImg = document.createElement('img');
            newImg.classList.add('email-item');
            newImg.setAttribute('src', database[emailIndex][i]);
            emailCont.appendChild(newImg);
        }
    } else {
        emailCont.innerHTML = "";
    }
}