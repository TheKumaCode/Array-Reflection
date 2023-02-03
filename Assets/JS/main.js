const reloadImg = document.querySelector(".reload-img");
const mainImg = document.getElementById("loaded-img");
const eDropdown = document.getElementById("email-selector");
const emailInput = document.getElementById("email");
const attach = document.getElementById("attach");
const emailCont = document.querySelector(".email-content");
const notifications = document.querySelector(".notifications");
const closeSuccBtn = document.querySelector(".close");
const emailImages = document.querySelectorAll(".email-item");
const regex = /^([A-z\d\.-]+)@([A-z\d-]+)\.([A-z]{2,8})(\.[A-z]{2,8})?$/;
const getImg = "https://picsum.photos/300";
const database = [];
let email;
let img;
let success = 0;

//Calls the fetchImg function when the page loads.
$(window).on("load", fetchImg);

//Calls the fetchImg function when the reload image button is clicked.
reloadImg.addEventListener("click", () => {
	fetchImg();
});

//Creates a fetchImg function.
function fetchImg() {
	//Fetches an image using the link variable, and enters a promise.
	fetch(getImg)
		.then((response) => {
			//If the image fails to fetch it gets and throws an error message.
			if (response.status >= 400) {
				return response.then((errormsg) => {
					let error = new error("Something ain't right");
					error.data = errormsg;
					throw error;
				});
			} else {
				//If the image succeeds in fetching then the image it set to display on the page and the url is saves as a variable so it can be used later in the code.
				mainImg.src = response.url;
				img = response.url;
			}
		})
		//This catches and logs the error message that appears in the previous promise.
		.catch((error) => console.log("Error: " + error));
}

//This is the form validator for the email.
attach.addEventListener("click", (e) => {
	if (emailInput.value == null || emailInput.value.trim() == "") {
		//If the email is empty then a message pops up saying that an email is required and previous messages are removed then prevents the form from submitting.
		closeSuccess();
		emailInput.style.outline = "3px solid red";
		notifications.querySelector(".no-email").classList.add("notify");
		e.preventDefault();
	} else if (!emailInput.value.match(regex)) {
		//If the email is invalid then a message pops up saying that it's invalid and previous messages are removed then prevents the form from submitting.
		closeSuccess();
		emailInput.style.outline = "3px solid red";
		notifications.querySelector(".no-email").classList.remove("notify");
		notifications.querySelector(".invalid-email").classList.add("notify");
		e.preventDefault();
	} else {
		//If the email is valid and not empty then a success message pops up with a count that says the number of successes and previous messages are removed then prevents the form from submitting. Then the addImg and the fetchImg functions are called.
		emailInput.removeAttribute("style");
		notifications.querySelector(".no-email").classList.remove("notify");
		notifications
			.querySelector(".invalid-email")
			.classList.remove("notify");
		success++;
		notifications.querySelector(".success-count").textContent = success;
		notifications.querySelector(".success").classList.add("notify");
		e.preventDefault();
		addImg();
		fetchImg();
	}
	//The updateDatabase function is called.
	updateDatabase();
});

//When the close button is clicked on the success message the closeSuccess function is called.
closeSuccBtn.addEventListener("click", () => {
	closeSuccess();
});

//Function to close the success message and reset the success score.
function closeSuccess() {
	notifications.querySelector(".success").classList.remove("notify");
	success = 0;
}

//When the selected email on the dropdown is changed, the updateDatabase function is called.
eDropdown.onchange = () => {
	updateDatabase();
};

//Function that adds an image to a database.
function addImg() {
	//The input of the email is saved as a variable.
	email = emailInput.value;
	if (!checkForEmail()) {
		//If the checkForEmail function does not return true the email and image is added to the database.
		database.push([email, img]);
		//The updateEmails function is called.
		updateEmails();
	} else if (checkForEmail()) {
		//If the checkForEmail function returns true a variable is created that contains the index (the position) of the email in the database.
		var l = database.findIndex((e) => e.includes(email));
		if (!database[l].includes(img)) {
			//If the row of the existing email does not have image, add it to the end of the row.
			database[l].push(img);
		}
	}
}

//Function to check if an email already exists in the database.
function checkForEmail() {
	//Variables are created for the length of the database, the email in the input, and an null variable.
	var dblen = database.length;
	var email = emailInput.value;
	var e;
	for (var i = 0; i < dblen; i++) {
		//For loop the goes through all the rows in the database.
		if (database[i][0] === email) {
			//If the value in the first position of the row is the same as the email variable (the new email) is the same set the e variable to 1 (for true) and exit the loop.
			e = 1;
			break;
		}
	}
	//Return the e variable.
	return e;
}

//Functiuon to add a new email to the dropdown.
function updateEmails() {
	//Creates a variable for the new email and a new element.
	var email = emailInput.value;
	let newEmailElement = document.createElement("option");
	//Sets the value and text of the new element to the new email.
	newEmailElement.textContent = email;
	newEmailElement.value = email;
	//Adds the new element to the dropdown menu.
	eDropdown.appendChild(newEmailElement);
	//Select the new email to open it.
	eDropdown.value = email;
}

//Function to update the selected email from the dropdown.
function updateDatabase() {
	//Creates a variable for the selected email and the position of the new email.
	var selectedEmail = eDropdown.value;
	var emailIndex = database.findIndex((e) => e.includes(selectedEmail));
	if (emailIndex >= 0) {
		//If the position of the new selected email is not empty, it clears all the displayed images.
		emailCont.innerHTML = "";
		for (var i = 1; i < database[emailIndex].length; i++) {
			//For loop that does through all the images in the selected emails row and creates a new variable for the new element.
			let newImg = document.createElement("img");
			//Gives the new element the class of email-item and sets its source to the currently selected image.
			newImg.classList.add("email-item");
			newImg.setAttribute("src", database[emailIndex][i]);
			//Adds the new element to the end of the displayed images.
			emailCont.appendChild(newImg);
		}
	} else {
		//If the selected email on the dropdown is emptry all the images are cleared from the dropdown.
		emailCont.innerHTML = "";
	}
}
