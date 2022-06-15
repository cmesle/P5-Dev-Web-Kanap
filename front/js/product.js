// -----------  AFFICHAGE DES DONNEES PRODUIT   -----------------------

const pageCourante = document.location.href;
let url = new URL(pageCourante)
let _id = url.searchParams.get('id');

var nomCanape                                                   //  variables globales utilisées par
var colorSelect = document.getElementById('colors')             //  toutes les fonctions de la page

fetch(`http://localhost:3000/api/products/${_id}`)
    .then(res => res.json())
    .then(data => { remplirFiche(data) })

function remplirFiche(canape) {
    let image = document.getElementsByClassName('item__img')
    image[0].innerHTML = `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`
    document.getElementById('title').textContent = canape.name
    document.getElementById('price').textContent = canape.price
    document.getElementById('description').textContent = canape.description

    let canapeColors = canape.colors
    canapeColors.forEach(couleur => {
        let options = `<option value="${couleur}">${couleur}</option>`
        colorSelect.innerHTML += options
    });

    nomCanape = canape.name
}


// -----------  AJOUT D'UN ARTICLE AU PANIER    -----------------------

const quantity = document.getElementById('quantity')
const commander = document.getElementById('addToCart')

commander.addEventListener('click', function (e) {
    e.preventDefault();

    if (quantity.value == 0) {
        alert('Combien de canapés souhaitez-vous commander ?')
    } else if (colorSelect.options.selectedIndex == [0]) {
        alert('Votre confiance nous honore, mais ne préférez-vous pas choisir vous-même la couleur du canapé ?')
    } else {
        let newCartItem = [_id, colorSelect.value, parseInt(quantity.value)]
        let cart = JSON.parse(localStorage.getItem("articleLS"))

        if (!cart) {
            let cart = []
            cart.push(newCartItem)
            localStorage.setItem("articleLS", JSON.stringify(cart));
            confirmationAjout('Vous avez ajouté ' + quantity.value + '  ' + nomCanape + ' ' + colorSelect.value + ' à votre panier')

        } else {

            let alreadyInCart = (cartItem) => cartItem[0] == newCartItem[0] && cartItem[1] == newCartItem[1]

            if (cart.findIndex(alreadyInCart) == -1) {                      // l'article (id + couleur) n'existe pas dans le panier
                cart.push(newCartItem)                                      // on l'ajoute au panier
                cart.sort()
                localStorage.setItem("articleLS", JSON.stringify(cart))     // mise à jour du locaStorage
                confirmationAjout('Vous avez ajouté ' + quantity.value + ' ' + nomCanape + ' ' + colorSelect.value + ' à votre panier')
            } else {
                // console.log(cart[cart.findIndex(alreadyInCart)][2])
                // let truc = parseInt(cart[cart.findIndex(alreadyInCart)][2])
                // console.log(truc)
                // truc += newCartItem[2]    // sinon on ajoute la quantité du nouvel article à celle de l'entrée existante
                // cart[cart.findIndex(alreadyInCart)][2] = truc
                console.log(cart[cart.findIndex(alreadyInCart)][2])
                console.log(newCartItem[2])
                cart[cart.findIndex(alreadyInCart)][2] += newCartItem[2]    // sinon on ajoute la quantité du nouvel article à celle de l'entrée existante
                console.log(cart[cart.findIndex(alreadyInCart)][2])
                localStorage.setItem("articleLS", JSON.stringify(cart))     // mise à jour du locaStorage
                confirmationAjout('Vous avez ajouté ' + quantity.value + ' autre(s) ' + nomCanape + ' ' + colorSelect.value + ' à votre panier')
            }
        }
    }
})

/* CONFIRMATION AJOUT : cette fonction fait apparaitre un message confirmant l'ajout de l'article au panier
                        elle donne aussi la possibilité d'accéder au panier sans remonter jusqu'en haut de page */
function confirmationAjout(message) {
    let popUp = document.createElement('div')
    document.getElementsByClassName('item__content__addButton')[0].appendChild(popUp)
    popUp.style = ` display: block;
                    position: absolute;
                    left: 25%;
                    width: 50%;
                    padding: 20px;
                    background: rgb(44, 62, 80);
                    border-radius: 20px;
                    border: 2px solid white;
                    text-align: center;
                    font-size: 14px;`
    popUp.innerHTML = `<p>${message}</p>
                      <button id='to__cart' href='cart.html' style='margin-right: 18px; font-size: 14px;'>voir le panier</button>
                      <button id='fermer' style='font-size: 14px;'>fermer</button>`
    let toCart = document.getElementById('to__cart')
    toCart.addEventListener('click', function (e) {
        e.preventDefault()
        window.location = 'cart.html'
    })
    let fermer = document.getElementById('fermer')
    fermer.addEventListener('click', function (e) {
        e.preventDefault()
        document.getElementsByClassName('item__content__addButton')[0].removeChild(popUp)
    })
}