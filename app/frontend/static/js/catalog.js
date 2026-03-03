// Функция для отображения товаров
function displayProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image" onclick="window.location.href='product.html?id=${product.id}'" style="cursor: pointer;">
                ${product.preview ? 
                    `<img src="${product.preview}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${product.image}\' style=\'font-size: 3rem;\'></i>'">` 
                    : `<i class="fas ${product.image}"></i>`
                }
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="window.location.href='product.html?id=${product.id}'" style="cursor: pointer;">${product.name}</h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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

// Инициализация фильтров
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    // Получаем категорию из URL если есть
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayProducts(this.dataset.filter);
        });
        
        // Если есть параметр категории в URL, активируем соответствующий фильтр
        if (categoryParam && btn.dataset.filter === categoryParam) {
            btn.classList.add('active');
        }
    });
    
    // Если есть параметр категории, отображаем отфильтрованные товары
    if (categoryParam) {
        displayProducts(categoryParam);
    }
}

// Загрузка товаров при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    // Если нет параметра категории, показываем все товары
    if (!new URLSearchParams(window.location.search).get('category')) {
        displayProducts();
    }
});