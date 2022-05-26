const prenom = document.getElementById('firstName')
const nom = document.getElementById('lastName')
const adresse = document.getElementById('adress')
const ville = document.getElementById('city')
const email = document.getElementById('email')

const erreurPrenom = document.getElementById('firstNameErrorMsg')
const erreurNom = document.getElementById('lastNameErrorMsg')
const erreurVille = document.getElementById('cityErrorMsg')
const erreurEmail = document.getElementById('emailErrorMsg')

// vérification du format des champs sans nombre ni caractère spéciaux firstName, lastName
prenom.addEventListener('input', function(e) {
    var value = e.target.value;
    if (value = /^\w-$/) {
        isValid = true;
    } else {
        isValid = false;
        erreurPrenom.textContent += 'que des lettres svp'
    }
});
 nom.addEventListener('input', function(e) {
    var value = e.target.value;
    if (/^\w-$/.value) {
        isValid = true;
    } else {
        isValid = false;
        erreurNom.textContent += 'que des lettres svp'
    }
});

// vérification du format du champs sans nombre city
city.addEventListener('input', function(e) {
    var value = e.target.value;
    if (/^\w-$/.value) {
        isValid = true;
        console.log(value)
    } else {
        isValid = false;
        erreurVille.textContent += 'que des lettres svp'
    }
});

// vérification du format du champs email
email.addEventListener('input', function(e) {
    var value = e.target.value;
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.value) {
        isValid = true;
    } else {
        isValid = false;
        erreurEmail.textContent += 'format attendu : exemple@exemple.ex'
    }
});