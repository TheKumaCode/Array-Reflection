const reloadImg = document.querySelector('.reload-img')
const mainImg = document.getElementById('loaded-img')
const eDropdown = document.getElementById('email-selector')
const emailInput = document.getElementById('email')
const attach = document.getElementById('attach')
const emailCont = document.querySelector('.email-content')
const notifications = document.querySelector('.notifications')
const closeSuccBtn = document.querySelector('.close')
const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const getImg = 'https://picsum.photos/300'
let email
let img
let success = 0;
const database = []

$(window).on('load', fetchImg)

reloadImg.addEventListener('click', () => {
    fetchImg()
})

function fetchImg() {
    fetch(getImg).then(response => {
        if (response.status >= 400) {
            return response.then (errormsg => {
                let error = new error ("Something ain't right")
                error.data = errormsg
                throw error
            })
        } else {
            mainImg.src = response.url
            img = response.url
        }
    })
    .catch((error) => 
    console.log("Error: " + error));
}

attach.addEventListener('click', (e) => {
    if (emailInput.value == null || emailInput.value.trim() == "") {
        closeSuccess()
        emailInput.style.outline = "3px solid red";
        notifications.querySelector('.no-email').classList.add('notify')
        e.preventDefault()
    } else if (!emailInput.value.match(regex)) {
        closeSuccess()
        emailInput.style.outline = "3px solid red";
        notifications.querySelector('.no-email').classList.remove('notify')
        notifications.querySelector('.invalid-email').classList.add('notify')
        e.preventDefault()
    } else {
        emailInput.removeAttribute("style");
        notifications.querySelector('.no-email').classList.remove('notify')
        notifications.querySelector('.invalid-email').classList.remove('notify')
        success++
        notifications.querySelector('.success-count').textContent = success
        notifications.querySelector('.success').classList.add('notify')
        e.preventDefault()
        addImg()
        fetchImg()
    }

    updateDatabase()
})

closeSuccBtn.addEventListener('click', () => {
    closeSuccess()
})

function closeSuccess() {
    notifications.querySelector('.success').classList.remove('notify')
    success = 0;
}

eDropdown.onchange = () => {updateDatabase()}


function addImg() {
    email = emailInput.value
    if (!checkForEmail()) {
        database.push([email, img])
        updateEmails()
    } else if (checkForEmail()){
        var l = database.findIndex(e => e.includes(email))
        database[l].push(img)
    }
}

function checkForEmail() {
    var dblen = database.length
    var email = emailInput.value
    var e
    for (var i = 0; i < dblen; i++) {
        if (database[i][0] === email) {
            e = 1
            break
        }
    } return e
}

function updateEmails() {
    var email = emailInput.value
    let newEmailElement = document.createElement('option')
    newEmailElement.textContent = email
    eDropdown.appendChild(newEmailElement)
}

function updateDatabase() {
    var selectedEmail = eDropdown.value
    var emailIndex = database.findIndex(e => e.includes(selectedEmail))
    if (emailIndex >= 0) {
        emailCont.innerHTML = ""
        for (var i = 1; i < database[emailIndex].length; i++) {
            let newImg = document.createElement('img')
            newImg.classList.add('email-item')
            newImg.setAttribute('src', database[emailIndex][i])
            emailCont.appendChild(newImg)
        }
    } else {
        emailCont.innerHTML = ""
    }
}