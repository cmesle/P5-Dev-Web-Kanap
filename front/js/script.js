fetch('http://localhost:3000/api/products')
.then(res=>res.json())
.then(data=> {afficherCanape(data)});


function afficherCanape(tableauCanapes) {

    let section = document.getElementById('items');

    tableauCanapes.forEach(canape => {
        let produit = `<a href="./product.html?id=${canape._id}">\
                        <article>\
                            <img src="${canape.imageUrl}" alt="${canape.altText}">\
                            <h3 class="productName">${canape.name}</h3>\
                            <p class="productDescription">${canape.description}</p>\
                        </article>\
                       </a>`;
        section.innerHTML += produit;
    });
}