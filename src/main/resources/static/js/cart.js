// static/js/cart.js
function removeCartItem(itemId) {
    if (!confirm('Are you sure you want to remove this item?')) {
        return;
    }

    const token = document.querySelector('meta[name="_csrf"]').content;
    const header = document.querySelector('meta[name="_csrf_header"]').content;

    fetch(`/cart/items/${itemId}/remove`, {
        method: 'POST',
        headers: {
            [header]: token
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove item');
        }
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to remove item from cart');
    });
}