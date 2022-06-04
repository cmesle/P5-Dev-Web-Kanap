var filledCart = document.getElementById('cart__items')
var prixLigne = 0
var nbArticle = 0
var totalQuantity = document.getElementById('totalQuantity')
var totalPrice = document.getElementById('totalPrice')


//  AFFICHAGE DES CANAPES AJOUTES AU LOCALSTORAGE

let cart = JSON.parse(localStorage.getItem("articleLS"))//  récupération du localStorage
const nbLigneLS = cart.length

cart.forEach(article => { // boucle d'affichage de chaque item du localStorage

  let _id = article[0] // récupération de l'ID du canapé

  fetch(`http://localhost:3000/api/products/${_id}`) //récupération des donnnées canapé de l'API
  .then(res => res.json())
  .then(data => {afficherArticle(data)})

  function afficherArticle(canape) {
    let affichage = 
              `<article class="cart__item" data-id="${article[0]}" data-color="${article[1]}">
                <div class="cart__item__img">
                  <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${canape.name}</h2>
                    <p>${article[1]}</p>
                    <p>${canape.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article[2]}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
    filledCart.innerHTML += affichage

    quantiteTotale()

    prixTotal()

    // AFFICHE LE NOMBRE D'ARTICLES DANS LA COMMANDE
    function quantiteTotale () {
      nbArticle += parseInt(article[2], 10)
      totalQuantity.textContent = nbArticle
    }

    // CALCULE ET AFFICHE LE MONTANT TOTAL DE LA COMMANDE
    function prixTotal() {
      prixLigne += canape.price*article[2]
      totalPrice.textContent = prixLigne
    }
  }
});

  setTimeout(btnActivation, 500)
  setTimeout(cartUpgrade, 500)
  // SUPPRESSION D'UN ARTICLE

  function btnActivation() {
    var supprBtns = document.getElementsByClassName('deleteItem')
      for (i=0; i<supprBtns.length; i++) {
        let btn = supprBtns[i]
          btn.addEventListener('click', function(e) {
            e.preventDefault()
            alert('Vous êtes sur le point de supprimer un article')
            let currentArticle = btn.closest('article')  //  sélectionne l'article, trouve son index
            const currentArticleID = currentArticle.dataset['id']
            const currentArticleColor = currentArticle.dataset['color']
            supprimerArticle(currentArticleID, currentArticleColor)
          })
      }
    }

//  ----------  MISE A JOUR QUANTITE ET PRIX TOTAUX ------------------
var qteArticle = document.getElementsByClassName('itemQuantity')


function cartUpgrade() {

  for (i=0 ; i < qteArticle.length ; i++) {
    let qte = qteArticle[i]
    let qteInitiale = parseInt(qte.value)
    // alert('qteInitiale : ' + qteInitiale)
    let currentArticle = qte.closest('article')  //  sélectionne l'article
  
    let _id = currentArticle.dataset['id']
    
    fetch(`http://localhost:3000/api/products/${_id}`)
    .then(res=> res.json())
    .then(data => getPrice(data))

    let prixCanape
    function getPrice(canape) {
      prixCanape = canape.price
    }
    // alert('prixCanape : ' +prixCanape) //undefined

    qte.addEventListener('change', function(e) {

      let currentArticleID = currentArticle.dataset['id']
      let currentArticleColor = currentArticle.dataset['color']
      let qteChangee = qte.value

      if (qteChangee == 0) {
        // warning('attention')
        alert('Vous êtes sur le point de supprimer cet article')
        supprimerArticle(currentArticleID, currentArticleColor)
      } else {
        warning('attention')

        // if (goOn) {
          let difference = qteChangee - qteInitiale
          alert('difference: '+difference)
          newTotalQuantity = parseInt(totalQuantity.textContent) + difference
          totalQuantity.textContent = newTotalQuantity
          newTotalPrice = parseInt(totalPrice.textContent) + (difference*prixCanape)
          totalPrice.textContent = newTotalPrice
        // modification du cart
          let ligneAModifier = (cartItem) => cartItem[0]==currentArticleID && cartItem[1]==currentArticleColor
          cart[cart.findIndex(ligneAModifier)][2] += difference
          localStorage.setItem('articleLS', JSON.stringify(cart))
          

          qteInitiale = qte.value
        // }
      }
    })
  }
}

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
var goOn
 function warning(message) {
  let popUp = document.createElement('div')
  document.body.appendChild(popUp)
  popUp.style = ` position: absolute;
                  left: 25%;
                  top: 40%;
                  width: 50%;
                  padding: 20px;
                  background: rgb(44, 62, 80);
                  border-radius: 20px;
                  text-align: center;`
  popUp.innerHTML = `<p>${message}</p>
                    <button id='confirmer'>confirmer</button>
                    <button id='annuler'>annuler</button>`
  let confirmer = document.getElementById('confirmer')
  confirmer.addEventListener('click', function(e) {
    e.preventDefault()
    goOn = true
  })
  let annuler = document.getElementById('annuler')
  annuler.addEventListener('click', function(e) {
    e.preventDefault()
    goOn = false
  })
}
