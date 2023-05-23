const firebaseConfig = {
    apiKey: "AIzaSyArOi3g7iOGy61Mj_S8rhGwb6BfGNJKD1I",
    authDomain: "fir-817f3.firebaseapp.com",
    projectId: "fir-817f3",
    storageBucket: "fir-817f3.appspot.com",
    messagingSenderId: "362659662266",
    appId: "1:362659662266:web:eb3b135a6da7e271fc7583"
  };
  
firebase.initializeApp(firebaseConfig); // Inicializar app Firebase
const db = firebase.firestore(); // db representa mi BBDD //inicia Firestore

let form = document.querySelector("form")

// Create contact functionality

const createContact = (picture) => {
  db.collection("users")
    .add(picture)
    .then((docRef) => {
    })
    .catch((error) => console.error("Error adding document: ", error));
};

// Paint all contacts functionality

const paintContacts = () => {
  let section = document.querySelector(".cards-container")

  section.innerHTML = ""

  db.collection("users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let cardDiv = document.createElement("div")
        cardDiv.className = "contactcard"
      
        let userNameP = document.createElement("h2")
        let userNamePText = document.createTextNode(doc.data().userName)
        userNameP.appendChild(userNamePText)

        let userImage = document.createElement("img")
        userImage.setAttribute("src", doc.data().userUrl)
      
        let userEmailP = document.createElement("p")
        let userEmailPText = document.createTextNode(doc.data().userEmail)
        userEmailP.appendChild(userEmailPText)

        let userMessageP = document.createElement("p")
        let userMessagePText = document.createTextNode(doc.data().userMessage)
        userMessageP.appendChild(userMessagePText)

        let deleteContactButton = document.createElement("button")
        deleteContactButton.setAttribute("id", doc.id)
        let deleteContactText = document.createTextNode("Delete")
        deleteContactButton.appendChild(deleteContactText)

        deleteContactButton.addEventListener("click", function(event) {
          event.preventDefault()

          // Delete this contact functionality
        
          db.collection("users").get().then(users => {
            
              db.collection("users").doc(doc.id).delete().then(val => {
                paintContacts()
              })
          });
        })

        cardDiv.appendChild(userNameP)
        cardDiv.appendChild(userImage)
        cardDiv.appendChild(userEmailP)
        cardDiv.appendChild(userMessageP)
        cardDiv.appendChild(deleteContactButton)

        section.appendChild(cardDiv)
      });
    })
    .catch(() => console.log('Error reading documents'));
}

// Checks the email

function checkEmail(email) {
  return /^([a-zA-Z0-9]+)@([a-z]+)\.([a-z]{2,4}$)/gm.test(email)
}

// Checks the name

function checkName(name) {
  return /[a-zA-Z0-9]{5,}/gm.test(name)
}

// Checks the URL

function checkURL(url) {
  return /^https:\/\/[\S-]+/gm.test(url)
}

// Checks the password

// function checkPassword(pwd) {
//   return /^[a-zA-Z0-9]+[!@#$%&a-zA-Z0-9]{6,20}$/gm.test(pwd)
// }


// Form validation

form.addEventListener("submit", function(event) {
    event.preventDefault()

    const userName = event.target.name.value;
    let userEmail = event.target.email.value
    let userUrl = event.target.url.value
    let userMessage = event.target.message.value

    let userProfile = {userName, userEmail, userUrl, userMessage}

    if(checkName(userName) && checkEmail(userEmail) && checkURL(userUrl)) {
      console.log("Form validada!");
      createContact(userProfile)
      paintContacts()
    } else {
      console.log("Form no validada!");
    }
});

paintContacts()

// Delete one contact functionality

db.collection("users").get().then(values => {
  values.forEach(user => {

    document.querySelector(`#${user.id}`).addEventListener("click", function(event) {
        event.preventDefault()

        db.collection("users").doc(user.id).delete().then(val => {
          paintContacts()
        })
    })
  })
 })


// Delete all contacts functionality

document.querySelector("#delete-contacts").addEventListener("click", function(event) {
  event.preventDefault()

  db.collection("users").get().then(users => {
    users.forEach(user => {
      db.collection("users").doc(user.id).delete().then(val => {
        paintContacts()
      })
    });
  });
})