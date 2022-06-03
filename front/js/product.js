const pageCourante = document.location.href;
// let debut = pageCourante.lastIndexOf('=');
// let _id = pageCourante.substring(debut+1);
let _id = pageCourante.substring(pageCourante.lastIndexOf('=')+1);
// let url = new URL(pageCourante)
// let _id = url.searchParams.get('id');

let colorSelect = document.getElementById('colors')

fetch(`http://localhost:3000/api/products/${_id}`)
.then(res=>res.json())
.then(data=>{remplirFiche(data)})

function remplirFiche(canape) {
    let image = document.getElementsByClassName('item__img')
    image[0].innerHTML = `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`
    document.getElementById('price').textContent = canape.price
    document.getElementById('description').textContent = canape.description

    let canapeColors = canape.colors
    canapeColors.forEach(couleur => {
        let options = `<option value="${couleur}">${couleur}</option>`
        colorSelect.innerHTML += options
    });

}

let quantity = document.getElementById('quantity')

document.getElementById('addToCart').addEventListener('click', function(e) {
    e.preventDefault();

    if (quantity.value==0) {
        alert('Combien de canapés souhaitez-vous commander ?')
    } else if (colorSelect.options.selectedIndex==[0]) {
        alert('Votre confiance nous honore, mais ne préférez-vous pas choisir vous-même la couleur du canapé ?')
    } 
        let newCartItem = [_id, colorSelect.value, parseInt(quantity.value)]
        let cart = JSON.parse(localStorage.getItem("articleLS"))
    
        if (cart) {

            let alreadyInCart = (cartItem) => cartItem[0]==newCartItem[0] && cartItem[1]==newCartItem[1]

            if (cart.findIndex(alreadyInCart)==-1) {                        // l'article (id + couleur) n'existe pas dans le panier
                cart.push(newCartItem)                                      // on l'ajoute au panier
                localStorage.setItem("articleLS", JSON.stringify(cart))     // mise à jour du locaStorage
            } else {
                cart[cart.findIndex(alreadyInCart)][2] += newCartItem[2]    // sinon on ajoute la quantité du nouvel article à celle de la l'entrée existante
                localStorage.setItem("articleLS", JSON.stringify(cart))     // mise à jour du locaStorage
            }
        } else {
                let cart = []
                cart.push(newCartItem)
                localStorage.setItem("articleLS", JSON.stringify(cart));
            
        }
})

