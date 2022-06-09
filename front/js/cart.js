var filledCart = document.getElementById('cart__items')
var nbArticle = 0
var montantTotal = 0
var totalQuantity = document.getElementById('totalQuantity')
var totalPrice = document.getElementById('totalPrice')

//  AFFICHAGE DES CANAPES AJOUTES AU LOCALSTORAGE

let cart = JSON.parse(localStorage.getItem("articleLS"))//  récupération du localStorage
const nbLigneLS = cart.length

//  fecth ici sur tout products, puis "filtre" panier
fetch('http://localhost:3000/api/products')
.then(res=>res.json())
.then(data => {afficherCommande(data)})


// .then(data => {cartUpgrade(data)});

function afficherCommande(tableauCanapes) {
  tableauCanapes.forEach(canape => {
    for (i=0; i < cart.length; i++) {
      if (canape._id==cart[i][0]) {
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
  }

//  AFFICHE LE NOMBRE D'ARTICLES DANS LA COMMANDE
function quantiteTotale (nombre) {
  nbArticle += parseInt(nombre, 10)
  totalQuantity.textContent = nbArticle
}

//  CALCULE ET AFFICHE LE MONTANT TOTAL DE LA COMMANDE
function prixTotal(prix, nombre) {
  montantTotal += prix*nombre
  totalPrice.textContent = montantTotal
}

//  ajout d'un délai pour garantir que le DOM est construit avant de pouvoir en sélectionner les éléments .deleteItem et .itemQuantity
  setTimeout(btnActivation, 500)
  setTimeout(inputActivation, 500)
//  SUPPRESSION D'UN ARTICLE
function btnActivation() {
  var supprBtns = document.getElementsByClassName('deleteItem')
    for (i=0; i<supprBtns.length; i++) {
      let btn = supprBtns[i]
        btn.addEventListener('click', function(e) {
          e.preventDefault()
          if (confirm('Etes vous sûr de vouloir supprimer cet article ?')) {
            let currentArticle = btn.closest('article')  //  sélectionne l'article, trouve son index
            const currentArticleID = currentArticle.dataset['id']
            const currentArticleColor = currentArticle.dataset['color']
            supprimerArticle(currentArticleID, currentArticleColor)
          }
        })
    }
  }

//  ----------  MISE A JOUR QUANTITE ET PRIX TOTAUX ------------------
var qteArticle = document.getElementsByClassName('itemQuantity')

// function cartUpgrade() {
function inputActivation() { 
  for (i=0 ; i < qteArticle.length ; i++) {       //  boucle qui sélectionne les input et leur ajoute un eventListener
    let qte = qteArticle[i]
    let qteInitiale = parseInt(qte.value)
    // let currentArticle = qte.closest('article')  //  sélectionne l'article
    // let _id = currentArticle.dataset['id']
    
    // fetch(`http://localhost:3000/api/products/${_id}`)
    // .then(res=> res.json())
    // .then(data => getPrice(data))

    // let prixCanape
    // function getPrice(canape) {
    //   prixCanape = canape.price
    // }

    qte.addEventListener('change', function(e) {
      e.preventDefault()
      e.stopPropagation()
      // let currentArticleID = currentArticle.dataset['id']
      // let currentArticleColor = currentArticle.dataset['color']

      if (qte.value < 1 || qte.value > 100) {               //  si l'utilisateur entre une quantité < 0 ou > 100
        qte.value = qteInitiale
      } else {
        let newItemQuantity = qte.value
        let difference = newItemQuantity - qteInitiale
        qteInitiale = qte.value                         //  réinitialisation de qteInitiale pour changements ultérieurs
        quantiteTotale(difference)

        //  TROUVER LE PRIX (paramètre fonction = réponse fetch)


        // prixTotal(prix, difference) // NECESSITE DE TROUVER LE PRIX
      }
    })
}

      // if (qte.value < 1 || qte.value > 100) {               //  si l'utilisateur entre une quantité < 0 ou > 100
      //   qte.value = qteInitiale                             //  la quantité n'est pas changée
      // } else {                                              //  mise à jour :
      //     let difference = newItemQuantity - qteInitiale
      //     quantiteTotale(difference)
      //     // let newTotalQuantity = 0
      //     // alert(parseInt(totalQuantity.textContent))
      //     // newTotalQuantity = parseInt(totalQuantity.textContent) + difference
      //     // alert(newTotalQuantity)
      //     // totalQuantity.textContent = newTotalQuantity      // - du nombre total d'articles
      //     newTotalPrice = parseInt(totalPrice.textContent) + (difference*prixCanape)
      //     totalPrice.textContent = newTotalPrice            // - du montant total
      //     // modification du cart
      //     // let ligneAModifier = (cartItem) => cartItem[0]==currentArticleID && cartItem[1]==currentArticleColor
      //     // cart[cart.findIndex(ligneAModifier)][2] += difference
      //     // localStorage.setItem('articleLS', JSON.stringify(cart))
          
      //     qteInitiale = qte.value                         //  réinitialisation de qteInitiale pour changements ultérieurs
      // }
    // })
  }
// }

function supprimerArticle(currentArticleID, currentArticleColor) {
  let i=0
  let suppression = false
  while(i<cart.length && !suppression) {
    if(cart[i][0]==currentArticleID && cart[i][1]==currentArticleColor) {
      cart.splice(i, 1)
      suppression = true
    }
    i++
  }

  if (cart.length==0) {
    localStorage.clear()
    window.location = 'cart.html'
  } else {
    localStorage.setItem('articleLS', JSON.stringify(cart))
    window.location = 'cart.html'
  }
}


// var goOn
//  function warning(message) {
//   let popUp = document.createElement('div')
//   document.body.appendChild(popUp)
//   popUp.style = ` position: absolute;
//                   left: 25%;
//                   top: 40%;
//                   width: 50%;
//                   padding: 20px;
//                   background: rgb(44, 62, 80);
//                   border-radius: 20px;
//                   text-align: center;`
//   popUp.innerHTML = `<p>${message}</p>
//                     <button id='confirmer'>confirmer</button>
//                     <button id='annuler'>annuler</button>`
//   let confirmer = document.getElementById('confirmer')
//   confirmer.addEventListener('click', function(e) {
//     e.preventDefault()
//     goOn = true
//   })
//   let annuler = document.getElementById('annuler')
//   annuler.addEventListener('click', function(e) {
//     e.preventDefault()
//     goOn = false
//   })
// }
