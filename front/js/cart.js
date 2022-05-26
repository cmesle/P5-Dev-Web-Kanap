var filledCart = document.getElementById('cart__items')
var prixLigne = 0
var nbArticle = 0

//  AFFICHAGE DES CANAPES AJOUTES AU LOCALSTORAGE

let cart = JSON.parse(localStorage.getItem("articleLS"))//  récupération du localStorage
// console.log(cart)

// /*  Si un même article (id + option) a été ajouté 2 fois au localStorage,
//     on les transforme en 1 seule entrée du panier */
// for (j = 0; j < cart.length; j++) {
//     if (cart[j][0] == cart[j+1][0] && cart[j][2] == cart[j+1][2]) {
// alert("c'est les mêmes")
//       cart[j][1] = parseInt(cart[j][1]) + parseInt(cart[j+1][1])
//       cart.splice(1, 1)
//       console.log(cart[j])
//     } else {
//       alert('sont pas pareil')
//     }
// }

cart.forEach(article => { // boucle d'affichage de chaque item du localStorage

  let _id = article[0] // récupération de l'ID du canapé

  fetch(`http://localhost:3000/api/products/${_id}`) //récupération des donnnées canapé de l'API
  .then(res => res.json())
  .then(data => {afficherArticle(data)})

  function afficherArticle(canape) {
    // let filledCart = document.getElementById('cart__items')
    let affichage = 
              `<article class="cart__item" data-id="{cartItem[0]}" data-color="{article[2]}">
                <div class="cart__item__img">
                  <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${canape.name}</h2>
                    <p>${article[2]}</p>
                    <p>${canape.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article[1]}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p id="test" class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`

    filledCart.innerHTML += affichage
    quantiteTotale()
    prixTotal()
    // AFFICHE LE NOMBRE D'ARTICLES DANS LA COMMANDE
    function quantiteTotale () {
    let totalQuantity = document.getElementById('totalQuantity')
    nbArticle += parseInt(article[1], 10)
    totalQuantity.textContent = nbArticle
    }


    // CALCULE ET AFFICHE LE MONTANT TOTAL DE LA COMMANDE
    function prixTotal() {
      prixLigne += canape.price*article[1]
      let totalPrice = document.getElementById('totalPrice')
      totalPrice.textContent = prixLigne
    }
  }


  
});
// window.onload = alert(document.getElementsByClassName('deleteItem')[0])

  // SUPPRESSION D'UN ARTICLE

// function supprimerArticle() {
//   var supprBtn = document.getElementById('test')

//   // let supprBtn1 = supprBtn[0]

//   supprBtn.addEventListener('click', function(e){
//     e.preventDefault()
//     localStorage.removeItem("article")
//   })
// }



