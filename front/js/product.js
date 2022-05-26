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
        // let options = document.createElement('option')
        // options.setAttribute('value', couleur)
        // options.textContent = couleur
        // colorSelect.appendChild(options) 
        let options = `<option value="${couleur}">${couleur}</option>`
        colorSelect.innerHTML += options
    });

}

let quantity = document.getElementById('quantity')

document.getElementById('addToCart').addEventListener('click', verifFormulaire);
function verifFormulaire (e) {
    e.preventDefault();

    if (quantity.value==0) {alert('Combien de canapés souhaitez-vous commander ?')}
    else if (colorSelect.options.selectedIndex==[0]) {
        alert('Votre confiance nous honore, mais ne préférez-vous pas choisir vous-même la couleur du canapé ?')
    } else {
        let cartItem = [_id, quantity.value, colorSelect.value]
        let cart = JSON.parse(localStorage.getItem("articleLS"))

        if (cart) {
            cart.push(cartItem)
            console.log(cart)
            localStorage.setItem("articleLS", JSON.stringify(cart));

        } else {
            let cart = []
            cart.push(cartItem)
            console.log(cart)
            localStorage.setItem("articleLS", JSON.stringify(cart));
        }
    }
}

