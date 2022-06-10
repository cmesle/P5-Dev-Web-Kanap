const prenom = document.getElementById('firstName')
const nom = document.getElementById('lastName')
const adresse = document.getElementById('address')
const ville = document.getElementById('city')
const email = document.getElementById('email')
const commander = document.getElementById('order')

const erreurPrenom = document.getElementById('firstNameErrorMsg')
const erreurNom = document.getElementById('lastNameErrorMsg')
const erreurAdresse = document.getElementById('addressErrorMsg')
const erreurVille = document.getElementById('cityErrorMsg')
const erreurEmail = document.getElementById('emailErrorMsg')


const erreurPrenomMsg = 'Votre prénom avec que des lettres svp'
const erreurNomMsg = 'Votre nom avec que des lettres svp'
const erreurAdresseMsg = 'Votre adresse ?'
const erreurVilleMsg = 'Votre ville ?'
const erreurEmailMsg = 'format attendu : exemple@exemple.ex'

const textOnlyRegex = /^[A-Z][A-Za-zÀ-ÖØ-öø-ÿ' -]+/
const numbersOnlyRegex = /[\D]/

// vidage des champs au reload
// prenom.value =''
// nom.value =''
// adresse.value = ''
// ville.value = ''
// email.value = ''


// vérification du format des champs sans nombre firstName, lastName, city
prenom.addEventListener('blur', function(e) {
    e.preventDefault
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (!test) { 
        erreurPrenom.textContent = erreurPrenomMsg
        prenom.focus()
    } else {
        erreurPrenom.textContent = ''
    }
});

nom.addEventListener('blur', function(e) {
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
        erreurNom.textContent = ''
    } else {
        erreurNom.textContent = erreurNomMsg
    }
});

ville.addEventListener('blur', function(e) {
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
        isValid = true;
    } else {
        isValid = false;
        erreurVille.textContent = erreurVilleMsg
    }
});

// vérification du champ adresse (ne peut pas contenir que des nombres)
adresse.addEventListener('blur', function(e) {
    let value = e.target.value;
    let test = numbersOnlyRegex.test(value)
    if (test) {
        // isValid = true;
    } else {
        // isValid = false;
        erreurAdresse.textContent = erreurAdresseMsg
    }
});

// vérification du format du champs email
email.addEventListener('change', function(e) {
    var value = e.target.value;
    var emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    var test = emailRegEx.test(value)
    if(!test) {
        erreurEmail.textContent = erreurEmailMsg
    }
})

commander.addEventListener('click', function(e) {
    e.preventDefault()
    var contact = {
        firstName : prenom.value,
        lastName : nom.value,
        address : adresse.value,
        city : ville.value,
        email : email.value
    }
    if (prenom.value=='' || nom.value=='' || adresse.value=='' || ville.value=='' || email.value=='') {
        alert('tous les champs sont obligatoires')
    } else {
        var contact = {
            firstName : prenom.value,
            lastName: nom.value,
            address: adresse.value,
            city: ville.value,
            email: email.value
        }
    }


    // ENVOI DES DONNEES A L'API ET CHANGEMENT DE PAGE
    let commande = {contact, products}                      // création de l'objet à envoyer

    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        },
            body: JSON.stringify(commande)
    })
    .then(async (response) => {
        let orderID = await response.json()
        let param = orderID.orderId
        window.location = 'confirmation.html?orderID='+param
    })
})

