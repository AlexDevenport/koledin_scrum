// Получение ID товара из URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Текущий выбранный индекс изображения
let currentImageIndex = 0;

// Проверка, есть ли товар в избранном
function isInWishlist(productId) {
    if (!currentUser || !currentUser.wishlist) return false;
    return currentUser.wishlist.some(item => item.id === productId);
}

// Отображение детальной информации о товаре
function displayProductDetail() {
    const productId = getProductId();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = '/catalog';
        return;
    }

    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;
    
    // Проверяем, в избранном ли товар
    const inWishlist = isInWishlist(productId);
    
    // Создаем HTML для галереи
    const thumbnailsHtml = product.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
            <img src="${img}" alt="Фото товара ${index + 1}" onerror="this.parentElement.innerHTML='<div class=\'thumbnail-placeholder\'><i class=\'fas ${product.image}\'></i></div>'">
        </div>
    `).join('');

    // Создаем HTML для характеристик
    const specsHtml = Object.entries(product.specs).map(([key, value]) => `
        <div class="spec-item">
            <span class="spec-label">${key}:</span>
            <span>${value}</span>
        </div>
    `).join('');

    productDetail.innerHTML = `
        <div class="product-gallery">
            <div class="main-image" id="mainImage">
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${product.image}\' style=\'font-size: 5rem;\'></i>'">
            </div>
            <div class="thumbnail-container">
                ${thumbnailsHtml}
            </div>
        </div>
        
        <div class="product-info-detail">
            <span class="product-category-detail">${getCategoryName(product.category)}</span>
            <h1 class="product-title-detail">${product.name}</h1>
            
            <div class="product-meta">
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span style="color: var(--gray); margin-left: 5px;">(4.5)</span>
                </div>
                <div style="color: var(--gray);">
                    <i class="fas fa-eye"></i> 234 просмотра
                </div>
            </div>
            
            <div class="product-price-detail">
                ${product.price.toLocaleString('ru-RU')} ₽
            </div>
            
            <div class="product-description">
                <h3 style="margin-bottom: 1rem; color: var(--dark-blue);">Описание</h3>
                <p style="line-height: 1.8;">${product.description}</p>
            </div>
            
            <div class="product-specs">
                <h3 style="margin-bottom: 1rem; color: var(--dark-blue);">Характеристики</h3>
                ${specsHtml}
            </div>
            
            <div class="product-actions-detail">
                <button class="add-to-cart-detail" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})" id="wishlistBtn">
                    <i class="fas ${inWishlist ? 'fa-heart' : 'fa-heart'}"></i>
                </button>
            </div>
        </div>
    `;
}

// Переключение избранного (добавить/удалить)
function toggleWishlist(productId) {
    if (!currentUser) {
        showNotification('❌ Войдите, чтобы добавлять в избранное');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!currentUser.wishlist) {
        currentUser.wishlist = [];
    }

    const existingItemIndex = currentUser.wishlist.findIndex(item => item.id === productId);
    
    if (existingItemIndex === -1) {
        // Добавляем в избранное
        currentUser.wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            preview: product.preview,
            badge: product.badge
        });
        
        saveCurrentUser();
        showNotification(`❤️ ${product.name} добавлен в избранное!`);
        
        // Меняем иконку кнопки
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    } else {
        // Удаляем из избранного
        const productName = currentUser.wishlist[existingItemIndex].name;
        currentUser.wishlist.splice(existingItemIndex, 1);
        saveCurrentUser();
        showNotification(`🗑️ ${productName} удален из избранного`);
        
        // Меняем иконку кнопки
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    }
    
    // Если мы на странице профиля, обновляем отображение
    if (window.location.pathname.includes('/profile')) {
        loadProfile();
    }
}

// Смена изображения в галерее
function changeImage(index) {
    const productId = getProductId();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentImageIndex = index;
    
    // Обновляем главное изображение
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.innerHTML = `<img src="${product.images[index]}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${product.image}\' style=\'font-size: 5rem;\'></i>'">`;
    }
    
    // Обновляем активный thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'characters': 'Персонажи',
        'architecture': 'Архитектура',
        'vehicles': 'Транспорт'
    };
    return categories[category] || category;
}

// Функция возврата на предыдущую страницу
function goBack() {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = '/catalog';
    }
}

// Загружаем товар при открытии страницы
document.addEventListener('DOMContentLoaded', displayProductDetail);