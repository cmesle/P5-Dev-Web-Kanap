const pageCourante = document.location.href;
let url = new URL(pageCourante)
let orderID = url.searchParams.get('orderID');

document.getElementById('orderId').textContent = orderID