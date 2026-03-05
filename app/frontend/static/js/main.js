// Работа с корзиной
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Товары (будут загружены с сервера)
let products = [];

// Загрузка товаров с сервера
async function loadProducts() {
    try {
        const response = await fetch('/api/products/');
        if (response.ok) {
            products = await response.json();
            console.log('Товары загружены:', products);
            window.products = products; // Делаем глобальными
            
            // Обновляем отображение в зависимости от страницы
            if (window.location.pathname.includes('/catalog')) {
                if (typeof displayProducts === 'function') displayProducts();
            } else if (window.location.pathname.includes('/product')) {
                if (typeof displayProductDetail === 'function') displayProductDetail();
            } else if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                displayHomePageProducts();
            }
        } else {
            console.error('Ошибка загрузки товаров');
            products = getMockProducts();
            window.products = products;
        }
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        products = getMockProducts();
        window.products = products;
    }
}

// Тестовые данные для разработки
function getMockProducts() {
    return [
        {
            id: 1,
            name: "Терминал",
            category: "architecture",
            price: 340,
            preview_image: "/static/images/Object 1/object1_1.png",
            images: [
                "/static/images/Object 1/object1_1.png",
                "/static/images/Object 1/object1_2.png",
                "/static/images/Object 1/object1_3.png"
            ],
            description: "Современный терминал для аэропорта или банка.",
            polygons_count: 85000,
            texture_quality: "4K",
            formats: ["FBX", "OBJ"],
            rating: 4.5,
            views_count: 234
        },
        {
            id: 2,
            name: "Фильтр",
            category: "oil",
            price: 990,
            preview_image: "/static/images/Object 2/object2_1.png",
            images: [
                "/static/images/Object 2/object2_1.png",
                "/static/images/Object 2/object2_2.png",
                "/static/images/Object 2/object2_3.png"
            ],
            description: "Детализированная 3D-модель нефтегазового фильтра.",
            polygons_count: 15000,
            texture_quality: "2K",
            formats: ["FBX", "OBJ"],
            rating: 4.8,
            views_count: 156
        },
        {
            id: 3,
            name: "Резервуар",
            category: "oil",
            price: 510,
            preview_image: "/static/images/Object 3/object3_1.png",
            images: [
                "/static/images/Object 3/object3_1.png",
                "/static/images/Object 3/object3_2.png",
                "/static/images/Object 3/object3_3.png"
            ],
            description: "Промышленный резервуар для хранения жидкостей.",
            polygons_count: 55000,
            texture_quality: "4K",
            formats: ["FBX", "OBJ"],
            rating: 4.7,
            views_count: 189
        }
    ];
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.length;
        cartCount.textContent = totalItems;
    }
}

// Добавление товара в корзину
function addToCart(productId) {
    // Проверяем, авторизован ли пользователь
    if (!window.currentUser) {
        showNotification('❌ Для добавления в корзину необходимо войти в аккаунт');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Товар уже в корзине
        showNotification(`ℹ️ ${product.name} уже добавлен в корзину`);
    } else {
        // Добавляем новый товар
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            preview_image: product.preview_image,
            quantity: 1
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        showNotification(`✅ ${product.name} добавлен в корзину!`);
    }
    
    // Если мы на странице корзины, обновляем отображение
    if (window.location.pathname.includes('/cart')) {
        displayCart();
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Если мы на странице корзины, обновляем отображение
    if (window.location.pathname.includes('/cart')) {
        displayCart();
    }
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
    
    // Создаем заказ на сервере
    const orderData = {
        user_id: window.currentUser.id,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: 1,
            price_at_buy: item.price
        }))
    };
    
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
            showNotification(`✅ Заказ оформлен на сумму ${total.toLocaleString('ru-RU')} ₽! Спасибо за покупку!`);
            
            // Очищаем корзину
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        } else {
            const errorData = await response.json();
            showNotification(`❌ ${errorData.detail || 'Ошибка при оформлении заказа'}`);
        }
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('❌ Ошибка соединения с сервером');
    }
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1e4b8c, #4a90e2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-size: 1rem;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'characters': 'Персонажи',
        'architecture': 'Архитектура',
        'oil': 'Нефть'
    };
    return categories[category] || category;
}

// Функция для отображения главной страницы
function displayHomePageProducts() {
    // Категории
    const categories = [
        { name: 'Персонажи', icon: 'fa-robot', category: 'characters', description: 'Игровые персонажи, люди, существа' },
        { name: 'Архитектура', icon: 'fa-city', category: 'architecture', description: 'Здания, интерьеры, города' },
        { name: 'Нефть', icon: 'fa-oil-can', category: 'oil', description: 'Нефтяная промышленность' }
    ];
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (categoriesGrid) {
        categoriesGrid.innerHTML = categories.map(cat => `
            <div class="product-card">
                <div class="product-image" onclick="window.location.href='/catalog?category=${cat.category}'" style="cursor: pointer;">
                    <i class="fas ${cat.icon}" style="font-size: 3rem;"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${cat.name}</h3>
                    <p style="color: var(--gray); margin-bottom: 0.5rem;">${cat.description}</p>
                    <a href="/catalog?category=${cat.category}" class="add-to-cart" style="display: inline-block; text-decoration: none; width: 100%; text-align: center;">
                        <i class="fas fa-search"></i> Смотреть
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    // Новинки (первые 3 товара)
    const newProductsGrid = document.getElementById('newProductsGrid');
    if (newProductsGrid && products.length > 0) {
        const newProducts = products.slice(0, 3);
        newProductsGrid.innerHTML = newProducts.map(product => `
            <div class="product-card">
                <div class="product-image" onclick="window.location.href='/product?id=${product.id}'" style="cursor: pointer;">
                    ${product.preview_image ? 
                        `<img src="${product.preview_image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                            onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-cube\\' style=\\'font-size: 3rem;\\'></i>'">` 
                        : `<i class="fas fa-cube" style="font-size: 3rem;"></i>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-title" onclick="window.location.href='/product?id=${product.id}'" style="cursor: pointer;">${product.name}</h3>
                    <p style="color: var(--gray); margin-bottom: 0.5rem;">${getCategoryName(product.category)}</p>
                    <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})" style="width: 100%;">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Делаем функции и переменные глобальными
window.products = products;
window.cart = cart;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.showNotification = showNotification;
window.getCategoryName = getCategoryName;
window.loadProducts = loadProducts;
window.displayHomePageProducts = displayHomePageProducts;

// Добавляем стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);