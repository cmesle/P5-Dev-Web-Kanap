var filledCart = document.getElementById('cart__items')
var prixLigne = 0
var nbArticle = 0


//  AFFICHAGE DES CANAPES AJOUTES AU LOCALSTORAGE

let cart = JSON.parse(localStorage.getItem("articleLS"))//  récupération du localStorage
const nbLigneLS = cart.length


// var IDs = []
// for (i=0; i < nbLigneLS; i++) {
//   let id = cart[i][0]
//   IDs.push(id)
// }
// IDs.sort()
// tableauIDs()
// function tableauIDs() {
//   for (i=0; i < IDs.length  ; i++) {
//     // console.log(i + ' ' + IDs.length)
//     if (IDs.length>1 && IDs[0] == IDs[1]) {                       // si les 2 1ers éléments sont égaux,
//       IDs.shift()                                   // on supprime le 1er
//       // console.log(IDs)
//     } else {                                        // sinon
//       let toBeMoved = (IDs.splice(0,1)).toString()  // on ôte le 1er élémént
//       IDs.push(toBeMoved)                           // pour le mettre à la fin du tableau
//       // console.log(IDs)
//     }
//   }
// }

// //  AGREGATION DES LIGNES ARTICLE EN DOUBLON
// /*  Si un même article (id + option) a été ajouté plus d'1 fois au localStorage,
//     on les transforme en 1 seule entrée du panier */
// var compteurNbArticlesAjoutes = 0
// IDs.forEach(id => {
//   let cartArticle = cart.filter(el => el[0]==id)
//   cartArticle.sort()
//   regrouper(cartArticle)
//   cartArticle.forEach(ligne => {  //  pour ajouter des tableaux à cart, pas des tableaux de tableaux
//     cart.push(ligne)
//     compteurNbArticlesAjoutes ++
//   })
// })

// function regrouper(cartArticle) {
//   while(cartArticle.length>1 && (cartArticle[0][1]==cartArticle[1][1])) {
//       cartArticle[0][2] = parseInt(cartArticle[0][2]) + parseInt(cartArticle[1][2])
//       cartArticle.splice(1,1)
//     }
//   }

// // MISE A JOUR DU CART
//   cart = cart.splice(nbLigneLS, compteurNbArticlesAjoutes) // suppression des lignes d'origine
// cart = cart.sort()                                              // tri par id



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
    let totalQuantity = document.getElementById('totalQuantity')
    nbArticle += parseInt(article[2], 10)
    totalQuantity.textContent = nbArticle
    }

    // CALCULE ET AFFICHE LE MONTANT TOTAL DE LA COMMANDE
    function prixTotal() {
      prixLigne += canape.price*article[2]
      let totalPrice = document.getElementById('totalPrice')
      totalPrice.textContent = prixLigne
    }
  }
});

  setTimeout(btnActivation, 500)
  // SUPPRESSION D'UN ARTICLE

  function btnActivation() {
    var supprBtns = document.getElementsByClassName('deleteItem')
      for (i=0; i<supprBtns.length; i++) {
          let btn = supprBtns[i]
           btn.addEventListener('click', function(e) {
            e.preventDefault()
            alert('yahoo')
            let currentArticle = btn.closest('article')  //  sélectionne l'article, trouve son index
            let currentArticleID = currentArticle.dataset['id']
            let currentArticleColor = currentArticle.dataset['color']
            let i =0
            let suppression = false
            while(i<cart.length && !suppression) {
              if(cart[i][0]==currentArticleID && cart[i][1]==currentArticleColor) {
                cart.splice(i, 1)
                suppression = true
              }
              i++
            }
            localStorage.setItem('articleLS', JSON.stringify(cart))
            window.location = 'cart.html'
          })


      }
      
    }

  // function supprimerArticle() {
  //   let currentArticle = btn.closest('article')  //  sélectionne l'article, trouve son index
  //   let currentArticleID = currentArticle.dataset['id']
  //   let currentArticleColor = currentArticle.dataset['color']
  //   let articleASupprimer
  //   cart.forEach(article => {
  //     if (article[0]==currentArticleID && article[1]==currentArticleColor) {
  //       articleASupprimer = article
  //     }
  //   })
  //   cart.splice(cart.indexOf(articleASupprimer), 1)    //  supprime l'article du cart
  //   afficherArticle() //  relance la fonction d'affichage du panier
  // }





