confirmationCommande()

// AFFICHE L'IDENTIFIANT DE COMMANDE DANS LA PAGE
function confirmationCommande() {
    // récupère l'identifiant de commande en paramètre de l'URL
    const pageCourante = document.location.href
    let url = new URL(pageCourante)
    let orderID = url.searchParams.get('orderID')

    // affiche l'identifiant de commande dans la page
    document.getElementById('orderId').textContent = orderID
}