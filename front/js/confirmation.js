const pageCourante = document.location.href;

// let _id = pageCourante.substring(pageCourante.lastIndexOf('=')+1);
let url = new URL(pageCourante)
let orderID = url.searchParams.get('orderID');

document.getElementById('orderId').textContent = orderID