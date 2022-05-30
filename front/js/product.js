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
// let cart = JSON.parse(localStorage.getItem("articleLS"))
// let cartItem = [_id, colorSelect.value, quantity.value]

document.getElementById('addToCart').addEventListener('click', verifFormulaire);
function verifFormulaire (e) {
    e.preventDefault();

    if (quantity.value==0) {
        alert('Combien de canapés souhaitez-vous commander ?')
    } else if (colorSelect.options.selectedIndex==[0]) {
        alert('Votre confiance nous honore, mais ne préférez-vous pas choisir vous-même la couleur du canapé ?')
    } 
        let cartItem = [_id, colorSelect.value, quantity.value]
        let cart = JSON.parse(localStorage.getItem("articleLS"))
    
    if (cart) {
            for (i=0; i<cart.length; i++) {
                if (cartItem[0]==cart[i][0]) {      // si l'ID du cartItem est ^présente dans le cart
                    if (cartItem[1]==cart[i][1]) {       // et si la couleur est identique
                        cart[i][3]+=cartItem[3]         // on ajoute la quantité de cartItem à la ligne de cart
                    } else {
                        cart.push(cartItem)
                        console.log(cart)
                        localStorage.setItem("articleLS", JSON.stringify(cart));
                    }
                }
            // vérifier ici la présence de l'Id, si oui, vérif couleur, si couleur ajouter quantité ...
            // cart.push(cartItem)
            // console.log(cart)
            // localStorage.setItem("articleLS", JSON.stringify(cart));

        }
     } else {
            let cart = []
            cart.push(cartItem)
            console.log(cart)
            localStorage.setItem("articleLS", JSON.stringify(cart));
        
    }
}

