// Работа с корзиной
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// База данных товаров
const products = [
    {
        id: 1,
        name: "Терминал",
        category: "architecture",
        price: 340,
        image: "fa-terminal",
        preview: "/static/images/Object 1/object1_1.png",
        description: "Современный терминал для аэропорта или банка.",
        specs: {
            "Полигоны": "85,000",
            "Текстуры": "4K",
            "Формат": "FBX/OBJ",
            "Зоны": "5+",
            "Освещение": "Настроено"
        },
        images: [
            "/static/images/Object 1/object1_1.png",
            "/static/images/Object 1/object1_2.png",
            "/static/images/Object 1/object1_3.png"
        ]
    },
    {
        id: 2,
        name: "Фильтр",
        category: "oil",
        price: 990,
        image: "fa-filter",
        preview: "/static/images/Object 2/object2_1.png",
        description: "Детализированная 3D-модель нефтегазового фильтра. Подходит для дополнения к визуализации трубопроводных линий",
        specs: {
            "Полигоны": "15,000",
            "Текстуры": "2K",
            "Формат": "FBX/OBJ",
            "Разрезы": "Прозрачные"
        },
        images: [
            "/static/images/Object 2/object2_1.png",
            "/static/images/Object 2/object2_2.png",
            "/static/images/Object 2/object2_3.png"
        ]
    },
    {
        id: 3,
        name: "Резервуар",
        category: "oil",
        price: 510,
        image: "fa-water",
        preview: "/static/images/Object 3/object3_1.png",
        description: "Промышленный резервуар для хранения жидкостей. Идеально для индустриальной визуализации.",
        specs: {
            "Полигоны": "55,000",
            "Текстуры": "4K",
            "Формат": "FBX/OBJ",
            "Объем": "10,000 л",
            "Материал": "Металл"
        },
        images: [
            "/static/images/Object 3/object3_1.png",
            "/static/images/Object 3/object3_2.png",
            "/static/images/Object 3/object3_3.png"
        ]
    }
];

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.length; // Просто количество товаров, так как quantity всегда 1
        cartCount.textContent = totalItems;
    }
}

// Добавление товара в корзину (только один раз)
function addToCart(productId) {
    // Проверяем, авторизован ли пользователь
    if (!currentUser) {
        showNotification('❌ Для добавления в корзину необходимо войти в аккаунт');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Товар уже в корзине
        showNotification(`ℹ️ ${product.name} уже добавлен в корзину`);
    } else {
        // Добавляем новый товар с quantity = 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            preview: product.preview,
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

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