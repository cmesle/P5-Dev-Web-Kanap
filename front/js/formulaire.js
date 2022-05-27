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

const textOnlyRegex = /^[A-Z][A-Za-zÀ-ÖØ-öø-ÿ' -]+/
const numbersOnlyRegex = /[\D]/

// vidage des champs au reload
prenom.value =''
nom.value =''
adresse.value = ''
ville.value = ''
email.value = ''


// vérification du format des champs sans nombre firstName, lastName, city
prenom.addEventListener('change', function(e) {
    e.preventDefault
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (!test) { 
        erreurPrenom.textContent = 'Votre prénom avec que des lettres svp'
    } else {
        erreurPrenom.textContent = ''
    }
});

nom.addEventListener('change', function(e) {
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
        erreurNom.textContent = ''
    } else {
        erreurNom.textContent = 'que des lettres svp'
    }
});

ville.addEventListener('change', function(e) {
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
        isValid = true;
    } else {
        isValid = false;
        erreurVille.textContent += 'que des lettres svp'
    }
});

// vérification du champ adresse (ne peut pas contenir que des nombres)
adresse.addEventListener('change', function(e) {
    let value = e.target.value;
    let test = numbersOnlyRegex.test(value)
    if (test) {
        // isValid = true;
    } else {
        // isValid = false;
        erreurAdresse.textContent += 'ceci ne ressemble pas à une adresse...'
    }
});

// vérification du format du champs email
email.addEventListener('change', function(e) {
    var value = e.target.value;
    var emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    var test = emailRegEx.test(value)
    if(!test) {
        erreurEmail.textContent += 'format attendu : exemple@exemple.ex'
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
        alert('ts champs obligatoires')
        return false
    } else {
        var contact = {
            firstName : prenom.value,
            lastName : nom.value,
            address : adresse.value,
            city : ville.value,
            email : email.value
        }
        console.log(contact)
    }




    // fetch('http://url-service-web.com/api/orders', {
	// method: 'POST',
	// headers: { 
    // 'Accept': 'application/json', 
    // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*'
 
    // },
	//     body: JSON.stringify(contact)
    // })
})

