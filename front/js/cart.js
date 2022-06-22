const prenom = document.getElementById('firstName')
const nom = document.getElementById('lastName')
const adresse = document.getElementById('address')
const ville = document.getElementById('city')
const email = document.getElementById('email')

main()

function main() {
  recuperationDonnees()
  setTimeout(btnActivation, 500)              //  ajout d'un délai pour garantir que le DOM est construit avant de 
  setTimeout(inputActivation, 500)            //  pouvoir en sélectionner les éléments .deleteItem et .itemQuantity
  formulaire()
  commander()
}





//  ----------  AFFICHAGE DES CANAPES AJOUTES AU LOCALSTORAGE ------------------

let cart = JSON.parse(localStorage.getItem("articleLS"))//  récupération du localStorage

function recuperationDonnees() {

  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => { afficherCommande(data) })
    .catch(function (error) {
      console.log('une erreur est survenue lors de la récupération des données : ' + error)
    })
}

function afficherCommande(tableauCanapes) {

  const filledCart = document.getElementById('cart__items')

  tableauCanapes.forEach(canape => {
    for (i = 0; i < cart.length; i++) {
      if (canape._id == cart[i][0]) {
        let affichage =
          `<article class="cart__item" data-id="${cart[i][0]}" data-color="${cart[i][1]}">
            <div class="cart__item__img">
              <img src="${canape.imageUrl}" alt="${canape.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${canape.name}</h2>
                <p>${cart[i][1]}</p>
                <p>${canape.price}€</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i][2]}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
        filledCart.innerHTML += affichage

        quantiteTotale(cart[i][2])

        prixTotal(canape.price, cart[i][2])
      }
    }
  })
  // formulaire()
}

//  AFFICHE LE NOMBRE D'ARTICLES DANS LA COMMANDE
let nbArticle = 0
function quantiteTotale(nombre) {
  const totalQuantity = document.getElementById('totalQuantity')
  nbArticle += parseInt(nombre, 10)
  totalQuantity.textContent = nbArticle
}

//  CALCULE ET AFFICHE LE MONTANT TOTAL DE LA COMMANDE
let montantTotal = 0
function prixTotal(prix, nombre) {
  const totalPrice = document.getElementById('totalPrice')
  montantTotal += prix * nombre
  totalPrice.textContent = montantTotal
}

//  SUPPRIME L'ARTICLE DU PANIER ET RECHARGE LA PAGE
function supprimerArticle(currentArticleID, currentArticleColor) {
  let i = 0
  let suppression = false
  while (i < cart.length && !suppression) {
    if (cart[i][0] == currentArticleID && cart[i][1] == currentArticleColor) {
      cart.splice(i, 1)
      suppression = true
    }
    i++
  }

  if (cart.length == 0) {
    localStorage.clear()
    window.location = 'cart.html'
  } else {
    localStorage.setItem('articleLS', JSON.stringify(cart))
    window.location = 'cart.html'
  }
}


//  ACTIVE LES BOUTONS SUPPRIMER (.deleteItem)
function btnActivation() {
  let supprBtns = document.getElementsByClassName('deleteItem')
  for (i = 0; i < supprBtns.length; i++) {
    let btn = supprBtns[i]
    btn.addEventListener('click', function (e) {
      e.preventDefault()
      if (confirm('Etes vous sûr de vouloir supprimer cet article ?')) {
        let currentArticle = btn.closest('article')  //  sélectionne l'article, trouve son index
        let currentArticleID = currentArticle.dataset['id']
        let currentArticleColor = currentArticle.dataset['color']
        supprimerArticle(currentArticleID, currentArticleColor)
      }
    })
  }
}


//  ----------  MISE A JOUR QUANTITE ET PRIX TOTAUX ------------------

let qteArticle = document.getElementsByClassName('itemQuantity')

//  ACTIVE LES INPUT QUANTITE  (.itemQuantity)
function inputActivation() {
  for (i = 0; i < qteArticle.length; i++) {       //  boucle qui sélectionne les input et leur ajoute un eventListener
    let qte = qteArticle[i]
    let qteInitiale = parseInt(qte.value)

    let currentArticle = qte.closest('article')  //  sélectionne l'article
    let _id = currentArticle.dataset['id']
    let prixCanape = 0

    fetch(`http://localhost:3000/api/products/${_id}`)
      .then(res => res.json())
      .then(function (canape) {
        prixCanape = canape.price
      })
      .catch(function (error) {
        console.log('une erreur est survenue lors de la récupération des données : ' + error)
      })

    qte.addEventListener('change', function (e) {
      e.preventDefault()
      e.stopPropagation()
      let currentArticleID = currentArticle.dataset['id']
      let currentArticleColor = currentArticle.dataset['color']

      if (qte.value < 1 || qte.value > 100) {               //  si l'utilisateur entre une quantité < 0 ou > 100
        alert('vous pouvez commander 100 canapés au maximum')
        qte.value = qteInitiale
      } else {
        let newItemQuantity = qte.value
        let difference = newItemQuantity - qteInitiale
        qteInitiale = qte.value                            //  réinitialisation de qteInitiale pour changements ultérieurs
        quantiteTotale(difference)                         // mise à jour du nombre total d'articles
        // mise à jour du localStorage
        let ligneAModifier = (cartItem) => cartItem[0] == currentArticleID && cartItem[1] == currentArticleColor
        cart[cart.findIndex(ligneAModifier)][2] += difference
        localStorage.setItem('articleLS', JSON.stringify(cart))

        prixTotal(prixCanape, difference)                  // mise à jour du montant total de la commande
      }
    })
  }
}






// const prenom = document.getElementById('firstName')
// const nom = document.getElementById('lastName')
// const adresse = document.getElementById('address')
// const ville = document.getElementById('city')
// const email = document.getElementById('email')

const erreurPrenom = document.getElementById('firstNameErrorMsg')
const erreurNom = document.getElementById('lastNameErrorMsg')
const erreurAdresse = document.getElementById('addressErrorMsg')
const erreurVille = document.getElementById('cityErrorMsg')
const erreurEmail = document.getElementById('emailErrorMsg')


const erreurPrenomMsg = 'Votre prénom ne doit contenir que des lettres svp'
const erreurNomMsg = 'Votre nom ne doit contenir que des lettres svp'
const erreurAdresseMsg = 'Ceci ne semble pas être une adresse correcte'
const erreurVilleMsg = 'Ceci ne semble pas être le nom d\'une ville'
const erreurEmailMsg = 'format attendu : exemple@exemple.ex'

const textOnlyRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ, '-]+$/
const adressRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9, '-]+$/
const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


//  ----------  VALIDATION DU FORMAT DES SAISIES UTILISATEURS DANS LES CHAMPS DU FORMULAIRE ------------------

let prenomOK = false
let nomOK = false
let adresseOK = false
let villeOK = false
let emailOK = false

function formulaire() {
  // vérification du format des champs sans nombre firstName, lastName, city
  prenom.addEventListener('blur', function (e) {
    e.preventDefault
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
      erreurPrenom.textContent = ''
      prenomOK = true
    } else {
      erreurPrenom.textContent = erreurPrenomMsg
      prenomOK = false
    }
    console.log('prenom : ' + prenomOK)
  })

  nom.addEventListener('blur', function (e) {
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
      erreurNom.textContent = ''
      nomOK = true
    } else {
      erreurNom.textContent = erreurNomMsg
      nomOK = false
    }
    console.log('nom : ' + nomOK)
  })

  ville.addEventListener('blur', function (e) {
    let value = e.target.value;
    let test = textOnlyRegex.test(value)
    if (test) {
      erreurVille.textContent = ''
      villeOK = true
    } else {
      erreurVille.textContent = erreurVilleMsg
      villeOK = false
    }
    console.log('ville : ' + villeOK)
  })

  // vérification du champ adresse (lettres et chiffres)
  adresse.addEventListener('blur', function (e) {
    let value = e.target.value;
    let test = adressRegex.test(value)
    if (test) {
      erreurAdresse.textContent = ''
      adresseOK = true
    } else {
      erreurAdresse.textContent = erreurAdresseMsg
      adresseOK = false
    }
    console.log('adresse : ' + adresseOK)
  });

  // vérification du format du champs email
  email.addEventListener('blur', function (e) {
    let value = e.target.value;
    let test = emailRegEx.test(value)
    if (test) {
      erreurEmail.textContent = ''
      emailOK = true
    } else {
      erreurEmail.textContent = erreurEmailMsg
      emailOK = false
    }
    console.log('email : ' + emailOK)
  })
}

//  ----------  BOUTON "COMMANDER" : VALIDATION DU FORMULAIRE ET ENVOI DES DONNEES A L'API  ------------------
function commander() {
  const btnCommander = document.getElementById('order')
  btnCommander.addEventListener('click', function (e) {
    e.preventDefault()

    if (prenom.value == '' || nom.value == '' || adresse.value == '' || ville.value == '' || email.value == '') {
      alert('tous les champs doivent être remplis avant de passer votre commande')
    } else if (!prenomOK || !nomOK || !adresseOK || !villeOK || !emailOK) {
      alert('certains des champs sont mal remplis')
    } else {
      let contact = {
        firstName: prenom.value,
        lastName: nom.value,
        address: adresse.value,
        city: ville.value,
        email: email.value
      }

      //  ----------  CREATION DE L'OBJET A ENVOYER A L'API ------------------

      let products = JSON.parse(localStorage.getItem("articleLS"))

      products.forEach(cartItem => {
        cartItem.pop()
        cartItem.pop()
      })

      // mise au format des éléments du tableau products (de tableau de tableaux au format attendu : tableau de strings )
      for (i = 0; i < products.length; i++) {
        products[i] = products[i].toString()
      }
      // envoi des données à l'API et redirection vers la page confirmation
      let commande = { contact, products }                      //  création de l'objet à envoyer

      fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commande)
      })
        .then(async (response) => {                             //  redirection vers la page confirmation avec orderId
          let orderID = await response.json()
          let param = orderID.orderId
          window.location = 'confirmation.html?orderID=' + param
        })
    }

  })

}

