const filledCart = document.getElementById('cart__items')
const prenom = document.getElementById('firstName')
const nom = document.getElementById('lastName')
const adresse = document.getElementById('address')
const ville = document.getElementById('city')
const email = document.getElementById('email')

main()

function main() {
  recuperationDonnees()
  formulaire()
  commander()
}


/*  ------------------------------------------------------------------------------------------------
                                               PANIER
------------------------------------------------------------------------------------------------- */


//  ----------  AFFICHAGE DU PANIER ------------------

let cart = JSON.parse(localStorage.getItem("articleLS"))            //  récupération du localStorage

function recuperationDonnees() {

  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => { afficherCommande(data) })
    .catch(function (error) {
      console.log('une erreur est survenue lors de la récupération des données : ' + error)
    })
}

function afficherCommande(tableauCanapes) {

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
  setTimeout(supprBtnActivation(), 500)              //  ajout d'un délai pour garantir que le DOM est construit avant de 
  setTimeout(qteInputActivation(), 500)            //  pouvoir en sélectionner les éléments .deleteItem et .itemQuantity
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


//  ----------  SUPPRESSION DES ARTICLES ------------------

//  ACTIVE LES BOUTONS SUPPRIMER (.deleteItem) 
function supprBtnActivation() {
  let supprBtns = document.getElementsByClassName('deleteItem')
  for (i = 0; i < supprBtns.length; i++) {
    let btn = supprBtns[i]
    btn.addEventListener('click', function (e) {
      e.preventDefault()
      if (confirm('Etes vous sûr de vouloir supprimer cet article ?')) {
        let currentArticle = btn.closest('article')                           //  sélectionne l'article
        let currentArticleID = currentArticle.dataset['id']
        let currentArticleColor = currentArticle.dataset['color']
        supprimerArticle(currentArticleID, currentArticleColor)
      }
    })
  }
}

//  SUPPRIME L'ARTICLE DU PANIER
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
  supprUpgradeAffichagePanier()
}

//  MET A JOUR L'AFFICHAGE DU PANIER APRES SUPPRESSION
function supprUpgradeAffichagePanier() {
  if (cart.length == 0) {
    localStorage.clear()
    filledCart.setAttribute('align-items', 'center')
    filledCart.textContent = 'est désormais tristement vide'
    totalPrice.textContent = ''
    totalQuantity.textContent = ''
  } else {
    localStorage.setItem('articleLS', JSON.stringify(cart))
    filledCart.innerHTML = ''
    montantTotal = 0
    nbArticle = 0
    recuperationDonnees()
  }
}

//  ----------  MODIFICATION DES QUANTITES ------------------

function qteInputActivation() {
  let qteArticle = document.getElementsByClassName('itemQuantity')
  for (i = 0; i < qteArticle.length; i++) {             //  boucle qui sélectionne les input et leur ajoute un eventListener
    let qte = qteArticle[i]
    let qteInitiale = parseInt(qte.value)

    let currentArticle = qte.closest('article')              //  sélectionne l'article
    let _id = currentArticle.dataset['id']
    let prixCanape = 0

    fetch(`http://localhost:3000/api/products/${_id}`)      // récupère le prix du canapé correspondant à l'input pour mise à jour du montant total
      .then(res => res.json())
      .then(function (canape) {
        prixCanape = canape.price
      })
      .catch(function (error) {
        console.log('une erreur est survenue lors de la récupération des données : ' + error)
      })

    qte.addEventListener('change', function (e) {
      e.preventDefault()
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


/*  ------------------------------------------------------------------------------------------------
                                          FORMULAIRE
------------------------------------------------------------------------------------------------- */

const textOnlyRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ, '-]+$/
const adressRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9, '-]+$/
const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

let prenomOK = false
let nomOK = false
let adresseOK = false
let villeOK = false
let emailOK = false

// VERIFICATION CHAMPS NE POUVANT CONTENIR QUE DU TEXTE
function textOnlyVerif(value, erreurChamp, champOK, erreurChampMsg) {
  if (textOnlyRegex.test(value)) {
    erreurChamp.textContent = ''
    champOK = true
  } else {
    erreurChamp.textContent = erreurChampMsg
    champOK = false
  }
  return champOK
}

//  ----------  VALIDATION DU FORMAT DES SAISIES UTILISATEUR DANS LES CHAMPS DU FORMULAIRE ------------------

function formulaire() {

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

  // const textOnlyRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ, '-]+$/
  // const adressRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9, '-]+$/
  // const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  // vérification du format des champs sans nombre firstName, lastName, city

  prenom.addEventListener('change', function (e) {
    let value = e.target.value;
    prenomOK = textOnlyVerif(value, erreurPrenom, prenomOK, erreurPrenomMsg)
  })

  nom.addEventListener('change', function (e) {
    let value = e.target.value;
    nomOK = textOnlyVerif(value, erreurNom, nomOK, erreurNomMsg)
  })

  ville.addEventListener('change', function (e) {
    let value = e.target.value;
    villeOK = textOnlyVerif(value, erreurVille, villeOK, erreurVilleMsg)
  })

  // vérification du champ adresse (lettres et chiffres)
  adresse.addEventListener('change', function (e) {
    let value = e.target.value;
    if (adressRegex.test(value)) {
      erreurAdresse.textContent = ''
      adresseOK = true
    } else {
      erreurAdresse.textContent = erreurAdresseMsg
      adresseOK = false
    }
  })

  // vérification du format du champs email
  email.addEventListener('change', function (e) {
    let value = e.target.value;
    if (emailRegEx.test(value)) {
      erreurEmail.textContent = ''
      emailOK = true
    } else {
      erreurEmail.textContent = erreurEmailMsg
      emailOK = false
    }
  })
}


/*  ------------------------------------------------------------------------------------------------
                                      ENVOI DE LA COMMANDE
------------------------------------------------------------------------------------------------- */

/*  ----------  BOUTON "COMMANDER"  ------------------
  Vérifie le formulaire, envoie la commande à l'API et vide le panier */
let contact = {}
let param
function commander() {
  const commanderBtn = document.getElementById('order')
  commanderBtn.addEventListener('click', function (e) {
    e.preventDefault()
    if (prenom.value == '' || nom.value == '' || adresse.value == '' || ville.value == '' || email.value == '') {
      alert('tous les champs doivent être remplis afin de passer votre commande')
    } else if (!prenomOK || !nomOK || !adresseOK || !villeOK || !emailOK) {
      alert('certains des champs sont mal remplis')
    } else {
      contact = {
        firstName: prenom.value,
        lastName: nom.value,
        address: adresse.value,
        city: ville.value,
        email: email.value
      }

      donneesAEnvoyer()
      localStorage.clear()
    }
  })
}


//  ----------  PREPARATION TABLEAU PRODUCTS  ------------------

let products = JSON.parse(localStorage.getItem("articleLS"))
function creationProducts() {
  products.forEach(cartItem => {
    cartItem.pop()
    cartItem.pop()
  })

  // mise au format des éléments du tableau products (de tableau de tableaux au format attendu : tableau de strings )
  for (i = 0; i < products.length; i++) {
    products[i] = products[i].toString()
  }
}


//  ----------  ENVOI DES DONNEES A L'API  ------------------

function donneesAEnvoyer() {
  creationProducts()
  let commande = { contact, products }                        //  création de l'objet à envoyer

  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commande)
  })
    .then(res => res.json())
    .then(data => {                              //  redirection vers la page confirmation avec orderId
      let param = data.orderId
      window.location = 'confirmation.html?orderID=' + param
    })
    .catch(error => {
      console.log('Une erreur est survenue lors de l\'envoi des données : ' + error)
    })
}