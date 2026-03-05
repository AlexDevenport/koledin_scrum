// Получение ID товара из URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Текущий выбранный индекс изображения
let currentImageIndex = 0;

// Отображение детальной информации о товаре
async function displayProductDetail() {
    const productId = getProductId();
    
    // Ждем загрузки товаров если они еще не загружены
    if (products.length === 0) {
        await loadProducts();
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = '/catalog';
        return;
    }

    // Увеличиваем счетчик просмотров
    try {
        await fetch(`/api/products/update/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ views_count: (product.views_count || 0) + 1 })
        });
    } catch (error) {
        console.error('Ошибка при обновлении просмотров:', error);
    }

    // Проверяем, есть ли товар в избранном
    let inFavorites = false;
    if (window.currentUser) {
        inFavorites = await checkFavoriteStatus(productId);
    }

    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;
    
    // Создаем HTML для галереи
    const images = product.images || [product.preview_image];
    const thumbnailsHtml = images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
            <img src="${img}" alt="Фото товара ${index + 1}" 
                onerror="this.parentElement.innerHTML='<div class=\\'thumbnail-placeholder\\'><i class=\\'fas fa-cube\\'></i></div>'">
        </div>
    `).join('');

    // Создаем HTML для характеристик
    const specsHtml = `
        <div class="spec-item">
            <span class="spec-label">Полигоны:</span>
            <span>${product.polygons_count?.toLocaleString() || 'Н/Д'}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Текстуры:</span>
            <span>${product.texture_quality || 'Н/Д'}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Форматы:</span>
            <span>${product.formats?.join(', ') || 'FBX/OBJ'}</span>
        </div>
    `;

    productDetail.innerHTML = `
        <div class="product-gallery">
            <div class="main-image" id="mainImage">
                <img src="${product.preview_image}" alt="${product.name}" 
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-cube\\' style=\\'font-size: 5rem;\\'></i>'">
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
                    ${generateRatingStars(product.rating || 4.5)}
                    <span style="color: var(--gray); margin-left: 5px;">(${product.rating || 4.5})</span>
                </div>
                <div style="color: var(--gray);">
                    <i class="fas fa-eye"></i> ${product.views_count || 0} просмотров
                </div>
            </div>
            
            <div class="product-price-detail">
                ${product.price.toLocaleString('ru-RU')} ₽
            </div>
            
            <div class="product-description">
                <h3 style="margin-bottom: 1rem; color: var(--dark-blue);">Описание</h3>
                <p style="line-height: 1.8;">${product.description || 'Описание отсутствует'}</p>
            </div>
            
            <div class="product-specs">
                <h3 style="margin-bottom: 1rem; color: var(--dark-blue);">Характеристики</h3>
                ${specsHtml}
            </div>
            
            <div class="product-actions-detail">
                <button class="add-to-cart-detail" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="wishlist-btn ${inFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id})" id="wishlistBtn">
                    <i class="fas ${inFavorites ? 'fa-heart' : 'fa-heart'}"></i>
                </button>
            </div>
        </div>
    `;
}

// Переключение избранного
async function toggleFavorite(productId) {
    if (!window.currentUser) {
        showNotification('❌ Войдите, чтобы добавлять в избранное');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }

    const wishlistBtn = document.getElementById('wishlistBtn');
    const isActive = wishlistBtn.classList.contains('active');
    
    if (isActive) {
        await removeFromFavorites(productId);
    } else {
        await addToFavorites(productId);
    }
}

// Генерация звезд рейтинга
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Смена изображения в галерее
function changeImage(index) {
    const productId = getProductId();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentImageIndex = index;
    
    // Обновляем главное изображение
    const mainImage = document.getElementById('mainImage');
    const images = product.images || [product.preview_image];
    
    if (mainImage) {
        mainImage.innerHTML = `<img src="${images[index]}" alt="${product.name}" 
            onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-cube\\' style=\\'font-size: 5rem;\\'></i>'">`;
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

// Функция возврата на предыдущую страницу
function goBack() {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = '/catalog';
    }
}

// Делаем функции глобальными
window.displayProductDetail = displayProductDetail;
window.changeImage = changeImage;
window.goBack = goBack;
window.toggleFavorite = toggleFavorite;

// Загружаем товар при открытии страницы
document.addEventListener('DOMContentLoaded', displayProductDetail);