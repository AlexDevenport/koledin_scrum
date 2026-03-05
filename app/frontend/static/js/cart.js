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
        const itemTotal = item.price;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image" onclick="window.location.href='/product?id=${item.id}'" style="cursor: pointer;">
                    ${item.preview_image ? 
                        `<img src="${item.preview_image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                            onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-cube\\' style=\\'font-size: 2rem; color: white; display: flex; align-items: center; justify-content: center; height: 100%;\\'></i>'">` 
                        : `<i class="fas fa-cube" style="font-size: 2rem; color: white; display: flex; align-items: center; justify-content: center; height: 100%;"></i>`
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
async function checkout() {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста!');
        return;
    }
    
    // Проверяем, авторизован ли пользователь
    if (!window.currentUser) {
        showNotification('❌ Для оформления заказа необходимо войти в аккаунт');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Создаем заказ на сервере в правильном формате
    const orderData = {
        user_id: window.currentUser.id,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: 1,
            price_at_buy: item.price
        }))
    };
    
    console.log('Отправка заказа:', orderData);
    
    try {
        const response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
            credentials: 'include'
        });
        
        if (response.ok) {
            const createdOrder = await response.json();
            console.log('Заказ создан:', createdOrder);
            
            showNotification(`✅ Заказ №${createdOrder.id} оформлен на сумму ${total.toLocaleString('ru-RU')} ₽! Спасибо за покупку!`);
            
            // Сохраняем заказ в localStorage для отображения в профиле
            saveOrderToLocalStorage(createdOrder, cart);
            
            // Очищаем корзину
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        } else {
            const errorData = await response.json();
            console.error('Ошибка сервера:', errorData);
            showNotification(`❌ ${errorData.detail || 'Ошибка при оформлении заказа'}`);
        }
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('❌ Ошибка соединения с сервером. Используем локальное сохранение...');
        
        // Если сервер недоступен, сохраняем заказ локально
        const localOrder = saveOrderLocally(cart, total);
        showNotification(`✅ Заказ №${localOrder.id} оформлен локально на сумму ${total.toLocaleString('ru-RU')} ₽!`);
        
        // Очищаем корзину
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

// Сохранение заказа в localStorage (для отображения в профиле)
function saveOrderToLocalStorage(order, cartItems) {
    // Получаем существующие заказы
    let userOrders = JSON.parse(localStorage.getItem(`orders_${window.currentUser.id}`)) || [];
    
    // Создаем заказ с товарами
    const orderWithItems = {
        ...order,
        items: cartItems.map(item => ({
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: 1
        }))
    };
    
    userOrders.push(orderWithItems);
    localStorage.setItem(`orders_${window.currentUser.id}`, JSON.stringify(userOrders));
}

// Локальное сохранение заказа (если сервер недоступен)
function saveOrderLocally(cartItems, total) {
    const orderId = Date.now();
    const order = {
        id: orderId,
        user_id: window.currentUser.id,
        total_sum: total,
        created_at: new Date().toISOString(),
        items: cartItems.map(item => ({
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: 1
        }))
    };
    
    // Получаем существующие заказы
    let userOrders = JSON.parse(localStorage.getItem(`orders_${window.currentUser.id}`)) || [];
    userOrders.push(order);
    localStorage.setItem(`orders_${window.currentUser.id}`, JSON.stringify(userOrders));
    
    return order;
}

// Загружаем корзину при открытии страницы
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    displayCart();
});