// Funcionalidad de búsqueda de productos
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.card');

// Filtrar productos cuando se presiona Enter
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();

            if (searchTerm === '' || productName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Limpiar búsqueda cuando el input está vacío
searchInput.addEventListener('input', function () {
    if (searchInput.value === '') {
        cards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// Agregar funcionalidad al botón de búsqueda
const searchButton = document.querySelector('.btn[type="submit"]');

searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();

    cards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();

        if (searchTerm === '' || productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Variables globales
const cart = [];
const cartIcon = document.querySelector('.bi-bag-fill');
const cartCounter = document.createElement('span');
cartCounter.classList.add('cart-counter');
cartCounter.textContent = '0';
cartIcon.parentElement.appendChild(cartCounter);

// Función para añadir productos al carrito
function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: parseFloat(productPrice) });
    cartCounter.textContent = cart.length;
    alert('Producto añadido');
}

// Asignar evento a los botones "ADD"
document.querySelectorAll('.card button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const card = button.closest('.card');
        const productName = card.querySelector('h3').textContent;
        const productPrice = card.querySelector('span').textContent.replace(' USD', '');
        addToCart(productName, productPrice);
    });
});

// Verificar si el carrito está vacío antes de redirigir
cartIcon.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío. Añade productos antes de continuar.');
        return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'cart.html';
});

// Función para cargar el carrito en la página del carrito
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        cartTotal.textContent = '0 USD';
        return;
    }

    let total = 0;
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('card');
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Precio: ${item.price.toFixed(2)} USD</p>
        `;
        cartContainer.appendChild(itemElement);
        total += item.price;
    });

    cartTotal.textContent = `${total.toFixed(2)} USD`;

    // Botón para vaciar el carrito
    document.getElementById('clear-cart').addEventListener('click', () => {
        localStorage.removeItem('cart');
        window.location.reload();
    });

    // Función para redirigir a WhatsApp con los productos del carrito
    function redirectToWhatsApp(cartItems) {
        const phoneNumber = '+5355363340'; // Reemplaza con el número de WhatsApp deseado
        let message = 'Hola, me gustaría ordenar los siguientes productos:%0A';

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.price.toFixed(2)} USD%0A`;
        });

        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        message += `%0ATotal: ${total.toFixed(2)} USD`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    // Botón para ordenar
    document.getElementById('order-button').addEventListener('click', () => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            alert('El carrito está vacío. Añade productos antes de ordenar.');
            return;
        }

        redirectToWhatsApp(cartItems);
        localStorage.removeItem('cart');
        window.location.reload();
    });
}

// Cargar el carrito si estamos en la página del carrito
if (window.location.pathname.endsWith('cart.html')) {
    loadCart();
}
