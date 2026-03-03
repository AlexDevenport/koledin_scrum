// Отображение корзины
function displayCart() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-shopping-cart" style="font-size: 5rem; color: var(--light-blue); margin-bottom: 1rem;"></i>
                <h2 style="color: var(--dark-blue);">Корзина пуста</h2>
                <p style="margin: 1rem 0; color: var(--gray);">Добавьте товары из каталога</p>
                <a href="/catalog" class="add-to-cart" style="display: inline-block; text-decoration: none; padding: 1rem 2rem;">
                    <i class="fas fa-cube"></i> Перейти в каталог
                </a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    const cartItems = cart.map(item => {
        const itemTotal = item.price; // quantity всегда 1
        total += itemTotal;
        const product = products.find(p => p.id === item.id);
        
        return `
            <div class="cart-item">
                <div class="cart-item-image" onclick="window.location.href='/product?id=${item.id}'" style="cursor: pointer;">
                    ${product?.preview ? 
                        `<img src="${product.preview}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                        : `<i class="fas ${item.image}" style="font-size: 2rem; color: white; display: flex; align-items: center; justify-content: center; height: 100%;"></i>`
                    }
                </div>
                <div class="cart-item-title" onclick="window.location.href='/product?id=${item.id}'" style="cursor: pointer;">
                    <h3>${item.name}</h3>
                    <p style="color: var(--gray);">1 шт.</p>
                </div>
                <div class="cart-item-price">
                    ${itemTotal.toLocaleString('ru-RU')} ₽
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
    }).join('');
    
    cartContainer.innerHTML = `
        ${cartItems}
        <div class="cart-total">
            Итого: ${total.toLocaleString('ru-RU')} ₽
        </div>
        <button class="checkout-btn" onclick="checkout()">
            <i class="fas fa-credit-card"></i> Оформить заказ
        </button>
    `;
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    showNotification(`✅ Заказ оформлен на сумму ${total.toLocaleString('ru-RU')} ₽! Спасибо за покупку!`);
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Загружаем корзину при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});