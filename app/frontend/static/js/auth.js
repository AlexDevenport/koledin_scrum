// Текущий пользователь
let currentUser = null;
let favorites = []; // Массив избранных товаров

// Проверка авторизации при загрузке
async function checkAuth() {
    try {
        const response = await fetch('/api/users/me', {
            credentials: 'include'
        });
        if (response.ok) {
            currentUser = await response.json();
            console.log('Пользователь авторизован:', currentUser);
            
            // Обновляем глобальную переменную
            window.currentUser = currentUser;
            
            // Загружаем избранное после авторизации
            await loadFavorites();
        } else {
            currentUser = null;
            window.currentUser = null;
            console.log('Пользователь не авторизован');
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        currentUser = null;
        window.currentUser = null;
    }
    updateNavAuth();
}

// Загрузка избранного
async function loadFavorites() {
    if (!currentUser) {
        favorites = [];
        window.favorites = [];
        return;
    }

    try {
        const response = await fetch('/api/favorite/', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const favoriteItems = await response.json();
            console.log('Избранное загружено с сервера:', favoriteItems);
            
            // Обогащаем избранное полной информацией о товарах
            favorites = await enrichFavoritesWithProducts(favoriteItems);
            window.favorites = favorites;
            
            console.log('Избранное после обогащения:', favorites);
        }
    } catch (error) {
        console.error('Ошибка при загрузке избранного:', error);
        // Если сервер недоступен, загружаем из localStorage
        loadFavoritesLocally();
    }
}

// Обогащение избранного информацией о товарах
async function enrichFavoritesWithProducts(favoriteItems) {
    // Если товары еще не загружены, загружаем их
    if (!window.products || window.products.length === 0) {
        await loadProducts();
    }
    
    return favoriteItems.map(fav => {
        // Ищем полную информацию о товаре
        const product = window.products?.find(p => p.id === fav.product_id);
        
        return {
            ...fav,
            product_details: product || { 
                id: fav.product_id,
                name: 'Товар загружается...', 
                price: 0,
                category: 'other',
                preview_image: null
            }
        };
    });
}

// Загрузка избранного из localStorage
function loadFavoritesLocally() {
    if (!currentUser) return;
    
    const localFavorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`)) || [];
    favorites = localFavorites.map(fav => ({
        id: fav.id || Date.now() + Math.random(),
        user_id: currentUser.id,
        product_id: fav.product_id,
        product_details: fav.product_details || {}
    }));
    window.favorites = favorites;
}

// Обновление навигации (кнопка входа/выхода и скрытие/показ профиля)
function updateNavAuth() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Находим существующие элементы
    const profileLink = navMenu.querySelector('a[href="/profile"]')?.parentElement;
    const existingAuthItem = document.querySelector('.nav-auth-item');
    
    // Удаляем существующую кнопку авторизации если есть
    if (existingAuthItem) {
        existingAuthItem.remove();
    }

    // Создаем элемент для авторизации
    const authItem = document.createElement('li');
    authItem.className = 'nav-auth-item';

    if (currentUser) {
        // Пользователь авторизован - показываем профиль и приветствие
        if (profileLink) {
            profileLink.style.display = 'block'; // Показываем профиль
        }
        
        authItem.innerHTML = `
            <div class="user-greeting">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.first_name}</span>
                <a href="#" onclick="logout(); return false;" style="color: white; margin-left: 10px;" title="Выйти">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </div>
        `;
    } else {
        // Пользователь не авторизован - скрываем профиль
        if (profileLink) {
            profileLink.style.display = 'none'; // Скрываем профиль
        }
        
        authItem.innerHTML = `
            <a href="/login" class="auth-button">
                <i class="fas fa-sign-in-alt"></i> Войти
            </a>
        `;
    }

    navMenu.appendChild(authItem);
}

// Обработка входа
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            // После успешного входа получаем данные пользователя
            const userResponse = await fetch('/api/users/me', {
                credentials: 'include'
            });
            
            if (userResponse.ok) {
                currentUser = await userResponse.json();
                window.currentUser = currentUser;
                
                // Загружаем избранное
                await loadFavorites();
                
                showNotification(`✅ С возвращением, ${currentUser.first_name}!`);
                
                // Перенаправляем на главную
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } else {
            const errorData = await response.json();
            showNotification(`❌ ${errorData.detail || 'Ошибка входа'}`);
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        showNotification('❌ Ошибка соединения с сервером');
    }
}

// Обработка регистрации
async function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
        showNotification('❌ Пароли не совпадают');
        return;
    }

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            // После успешной регистрации получаем данные пользователя
            const userResponse = await fetch('/api/users/me', {
                credentials: 'include'
            });
            
            if (userResponse.ok) {
                currentUser = await userResponse.json();
                window.currentUser = currentUser;
                showNotification(`✅ Регистрация успешна! Добро пожаловать, ${firstName}!`);
                
                // Перенаправляем на главную
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } else {
            const errorData = await response.json();
            showNotification(`❌ ${errorData.detail || 'Ошибка регистрации'}`);
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        showNotification('❌ Ошибка соединения с сервером');
    }
}

// Выход из аккаунта
async function logout() {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            currentUser = null;
            window.currentUser = null;
            favorites = [];
            window.favorites = [];
            showNotification('👋 Вы вышли из аккаунта');
            updateNavAuth();
            
            // Если мы на странице профиля, перенаправляем на главную
            if (window.location.pathname.includes('/profile')) {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        showNotification('❌ Ошибка при выходе из аккаунта');
    }
}

// Переключение между формами входа и регистрации
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
    }
}

// Получение всех купленных товаров из заказов
function getPurchasedProducts(orders) {
    const purchasedProducts = [];
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                // Ищем полную информацию о товаре в глобальном массиве products
                const productDetails = window.products?.find(p => p.id === item.product_id) || {};
                
                purchasedProducts.push({
                    id: item.product_id,
                    name: item.product_name || productDetails.name || 'Товар',
                    price: item.price || item.price_at_buy || 0,
                    preview_image: productDetails.preview_image || item.preview_image || null,
                    category: productDetails.category || item.category || 'other',
                    order_date: order.created_at,
                    order_id: order.id,
                    download_url: productDetails.download_url || `/api/products/download/${item.product_id}`
                });
            });
        }
    });
    
    return purchasedProducts;
}

// Загрузка профиля пользователя
async function loadProfile() {
    const profileContainer = document.getElementById('profileContainer');
    if (!profileContainer) return;

    if (!currentUser) {
        // Если пользователь не авторизован, показываем приглашение войти
        profileContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-user-circle" style="font-size: 5rem; color: var(--light-blue); margin-bottom: 1rem;"></i>
                <h2 style="color: var(--dark-blue);">Войдите в аккаунт</h2>
                <p style="margin: 1rem 0; color: var(--gray);">Чтобы просматривать профиль и историю покупок</p>
                <a href="/login" class="add-to-cart" style="display: inline-block; text-decoration: none; padding: 1rem 2rem;">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </a>
            </div>
        `;
        return;
    }

    // Убеждаемся, что товары загружены
    if (!window.products || window.products.length === 0) {
        await loadProducts();
    }

    // Загружаем заказы пользователя
    let userOrders = [];
    
    try {
        const ordersResponse = await fetch('/api/orders/?user_id=' + currentUser.id, {
            credentials: 'include'
        });
        if (ordersResponse.ok) {
            userOrders = await ordersResponse.json();
            console.log('Заказы с сервера:', userOrders);
        } else {
            // Если сервер недоступен, берем из localStorage
            userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
        }
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    }

    // Получаем все купленные товары
    const purchasedProducts = getPurchasedProducts(userOrders);

    // Отображаем профиль пользователя
    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="profile-info">
                <h2>${currentUser.first_name} ${currentUser.last_name}</h2>
                <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
                <p><i class="fas fa-calendar"></i> На сайте с ${new Date(currentUser.created_at).toLocaleDateString('ru-RU')}</p>
                <p><i class="fas fa-star"></i> Бонусные баллы: ${currentUser.bonus_points || 0}</p>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Выйти из аккаунта
                </button>
            </div>
        </div>
        
        <div class="profile-stats">
            <div class="stat-card">
                <div class="stat-value">${userOrders.length}</div>
                <div>Заказов</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${purchasedProducts.length}</div>
                <div>Приобретено моделей</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${currentUser.bonus_points || 0}</div>
                <div>Бонусных баллов</div>
            </div>
        </div>

        <!-- Вкладки профиля -->
        <div class="profile-tabs">
            <button class="profile-tab active" onclick="switchProfileTab('purchases')">
                <i class="fas fa-shopping-bag"></i> Мои покупки
            </button>
            <button class="profile-tab" onclick="switchProfileTab('favorites')">
                <i class="fas fa-heart"></i> Избранное (${favorites.length})
            </button>
        </div>

        <!-- Контент покупок -->
        <div id="purchasesTab" class="profile-tab-content" style="display: block;">
            <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">Мои покупки</h3>
            <div class="products-grid" id="purchasedProductsGrid">
                ${purchasedProducts.length > 0 ? 
                    purchasedProducts.map(product => `
                        <div class="product-card purchased-product">
                            <div class="product-image" onclick="window.location.href='/product?id=${product.id}'" style="cursor: pointer;">
                                ${product.preview_image ? 
                                    `<img src="${product.preview_image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                                        onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-cube\\' style=\\'font-size: 3rem;\\'></i>'">` 
                                    : `<i class="fas fa-cube" style="font-size: 3rem;"></i>`
                                }
                                <div class="purchased-badge">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                            <div class="product-info">
                                <h3 class="product-title" onclick="window.location.href='/product?id=${product.id}'" style="cursor: pointer;">${product.name}</h3>
                                <p style="color: var(--gray); font-size: 0.9rem; margin: 0.3rem 0;">
                                    <i class="fas fa-calendar-alt"></i> ${new Date(product.order_date).toLocaleDateString('ru-RU')}
                                </p>
                                <p style="color: var(--gray); margin-bottom: 0.5rem;">${getCategoryName(product.category)}</p>
                                <div class="product-price" style="font-size: 1.1rem; color: var(--dark-blue);">${product.price.toLocaleString('ru-RU')} ₽</div>
                                <button class="add-to-cart download-btn" onclick="downloadProduct(${product.id})" style="width: 100%; margin-top: 0.5rem; background: linear-gradient(135deg, #28a745, #20c997);">
                                    <i class="fas fa-download"></i> Скачать
                                </button>
                            </div>
                        </div>
                    `).join('') :
                    '<p style="color: var(--gray); grid-column: 1/-1; text-align: center; padding: 2rem;">У вас пока нет купленных товаров</p>'
                }
            </div>

            <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">История заказов</h3>
            <div class="orders-list" id="ordersList">
                ${userOrders.length > 0 ? 
                    userOrders.map(order => `
                        <div class="order-card">
                            <div class="order-header">
                                <span><strong>Заказ #${order.id}</strong></span>
                                <span>${new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                                <span><strong>${order.total_sum.toLocaleString('ru-RU')} ₽</strong></span>
                            </div>
                            <div class="order-items">
                                ${order.items ? order.items.map(item => `
                                    <div class="order-item">
                                        <span>${item.product_name || 'Товар'}</span>
                                        <span>${item.price?.toLocaleString('ru-RU') || item.price_at_buy?.toLocaleString('ru-RU') || 0} ₽ × ${item.quantity || 1}</span>
                                    </div>
                                `).join('') : ''}
                            </div>
                        </div>
                    `).join('') :
                    '<p style="color: var(--gray); text-align: center; padding: 2rem;">У вас пока нет заказов</p>'
                }
            </div>
        </div>

        <!-- Контент избранного -->
        <div id="favoritesTab" class="profile-tab-content" style="display: none;">
            <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">Избранное</h3>
            <div class="products-grid" id="favoritesGrid">
                ${renderFavorites()}
            </div>
        </div>
    `;
}

// Рендеринг избранного
function renderFavorites() {
    if (!favorites || favorites.length === 0) {
        return '<p style="color: var(--gray); grid-column: 1/-1; text-align: center; padding: 2rem;">В избранном пока нет товаров</p>';
    }

    return favorites.map(fav => {
        const product = fav.product_details;
        
        // Если нет информации о товаре, показываем заглушку
        if (!product || !product.id) {
            return `
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-cube" style="font-size: 3rem;"></i>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">Товар загружается...</h3>
                        <p style="color: var(--gray); margin-bottom: 0.5rem;">Загрузка</p>
                        <div class="product-price">0 ₽</div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="product-card favorite-product">
                <div class="product-image" onclick="window.location.href='/product?id=${product.id}'" style="cursor: pointer;">
                    ${product.preview_image ? 
                        `<img src="${product.preview_image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                            onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-cube\\' style=\\'font-size: 3rem;\\'></i>'">` 
                        : `<i class="fas fa-cube" style="font-size: 3rem;"></i>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-title" onclick="window.location.href='/product?id=${product.id}'" style="cursor: pointer;">${product.name || 'Товар'}</h3>
                    <p style="color: var(--gray); margin-bottom: 0.5rem;">${getCategoryName(product.category)}</p>
                    <div class="product-price" style="font-size: 1.1rem; color: var(--dark-blue); margin-bottom: 0.5rem;">${(product.price || 0).toLocaleString('ru-RU')} ₽</div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="add-to-cart" onclick="addToCart(${product.id})" style="flex: 2;">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                        <button class="remove-wishlist-btn" onclick="removeFromFavorites(${fav.product_id})" style="flex: 1; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer;" title="Удалить из избранного">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Переключение вкладок профиля
function switchProfileTab(tab) {
    const purchasesTab = document.getElementById('purchasesTab');
    const favoritesTab = document.getElementById('favoritesTab');
    const tabs = document.querySelectorAll('.profile-tab');
    
    if (tab === 'purchases') {
        purchasesTab.style.display = 'block';
        favoritesTab.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        favoritesTab.style.display = 'block';
        purchasesTab.style.display = 'none';
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
        
        // Обновляем отображение избранного при переключении на вкладку
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (favoritesGrid) {
            favoritesGrid.innerHTML = renderFavorites();
        }
    }
}

// Функция для скачивания товара
function downloadProduct(productId) {
    if (!currentUser) {
        showNotification('❌ Необходимо авторизоваться');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }
    
    // Ищем товар в глобальном массиве products
    const product = window.products?.find(p => p.id === productId);
    
    if (product) {
        showNotification(`📥 Начинается загрузка файла "${product.name}"...`);
        
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        
        // Если есть реальный URL для скачивания
        if (product.download_url) {
            link.href = product.download_url;
        } else {
            // Иначе создаем тестовый файл
            const content = `Информация о товаре: ${product.name}\nЦена: ${product.price} ₽\nКатегория: ${product.category}\n\nСпасибо за покупку!`;
            const blob = new Blob([content], { type: 'text/plain' });
            link.href = URL.createObjectURL(blob);
            link.download = `${product.name.replace(/\s+/g, '_')}_info.txt`;
        }
        
        link.click();
        
        // Очищаем URL если использовали blob
        if (!product.download_url) {
            setTimeout(() => {
                URL.revokeObjectURL(link.href);
            }, 100);
        }
        
        showNotification(`✅ Файл "${product.name}" успешно скачан!`);
    } else {
        showNotification('❌ Информация о товаре не найдена');
    }
}

// Добавление в избранное
async function addToFavorites(productId) {
    if (!currentUser) {
        showNotification('❌ Войдите, чтобы добавлять в избранное');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }

    const product = window.products?.find(p => p.id === productId);
    if (!product) return;

    try {
        const response = await fetch('/api/favorite/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId }),
            credentials: 'include'
        });

        if (response.ok) {
            const newFavorite = await response.json();
            
            // Добавляем в локальный массив с полной информацией о товаре
            favorites.push({
                ...newFavorite,
                product_details: product
            });
            window.favorites = favorites;
            
            showNotification(`❤️ ${product.name} добавлен в избранное!`);
            
            // Обновляем иконку кнопки
            updateWishlistButton(productId, true);
            
            // Обновляем счетчик избранного если мы на странице профиля
            updateFavoritesCount();
            
            // Если мы на странице профиля и открыта вкладка избранного, обновляем отображение
            if (window.location.pathname.includes('/profile')) {
                const favoritesTab = document.getElementById('favoritesTab');
                if (favoritesTab && favoritesTab.style.display === 'block') {
                    const favoritesGrid = document.getElementById('favoritesGrid');
                    if (favoritesGrid) {
                        favoritesGrid.innerHTML = renderFavorites();
                    }
                }
            }
        } else if (response.status === 409) {
            showNotification(`ℹ️ ${product.name} уже в избранном`);
        } else if (response.status === 404) {
            showNotification('❌ Товар не найден');
        } else {
            const errorData = await response.json();
            showNotification(`❌ ${errorData.detail || 'Ошибка при добавлении в избранное'}`);
        }
    } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
        saveFavoritesLocally(productId, product);
    }
}

// Сохранение в избранное локально
function saveFavoritesLocally(productId, product) {
    let localFavorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`)) || [];
    
    if (!localFavorites.some(item => item.product_id === productId)) {
        const newFavorite = {
            id: Date.now() + Math.random(),
            product_id: productId,
            product_details: product
        };
        
        localFavorites.push(newFavorite);
        localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(localFavorites));
        
        // Добавляем в локальный массив
        favorites.push(newFavorite);
        window.favorites = favorites;
        
        showNotification(`❤️ ${product.name} добавлен в избранное (локально)!`);
        
        // Обновляем иконку кнопки
        updateWishlistButton(productId, true);
        
        // Обновляем счетчик избранного
        updateFavoritesCount();
        
        // Если мы на странице профиля и открыта вкладка избранного, обновляем отображение
        if (window.location.pathname.includes('/profile')) {
            const favoritesTab = document.getElementById('favoritesTab');
            if (favoritesTab && favoritesTab.style.display === 'block') {
                const favoritesGrid = document.getElementById('favoritesGrid');
                if (favoritesGrid) {
                    favoritesGrid.innerHTML = renderFavorites();
                }
            }
        }
    }
}

// Удаление из избранного - ИСПРАВЛЕНО для использования правильной ручки
async function removeFromFavorites(productId) {
    if (!currentUser) {
        showNotification('❌ Необходимо авторизоваться');
        return;
    }

    // Находим товар для уведомления
    const favoriteItem = favorites.find(f => f.product_id === productId);
    const productName = favoriteItem?.product_details?.name || 'Товар';

    try {
        console.log(`Удаление товара ${productId} из избранного через DELETE /api/favorite/${productId}`);
        
        const response = await fetch(`/api/favorite/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        // Проверяем успешность (204 No Content или 200 OK)
        if (response.ok || response.status === 204) {
            // Удаляем из локального массива
            favorites = favorites.filter(item => item.product_id !== productId);
            window.favorites = favorites;
            
            showNotification(`🗑️ ${productName} удален из избранного`);
            
            // Обновляем иконку кнопки на странице товара, если она есть
            updateWishlistButton(productId, false);
            
            // Обновляем счетчик избранного
            updateFavoritesCount();
            
            // Обновляем отображение если мы на странице профиля
            if (window.location.pathname.includes('/profile')) {
                const favoritesGrid = document.getElementById('favoritesGrid');
                if (favoritesGrid) {
                    favoritesGrid.innerHTML = renderFavorites();
                }
                
                // Обновляем текст вкладки
                const favoritesTab = document.querySelector('.profile-tab:nth-child(2)');
                if (favoritesTab) {
                    favoritesTab.innerHTML = `<i class="fas fa-heart"></i> Избранное (${favorites.length})`;
                }
            }
        } else {
            // Если сервер вернул ошибку, пытаемся понять причину
            let errorMessage = 'Ошибка при удалении из избранного';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (e) {
                // Если не удалось распарсить JSON
                if (response.status === 404) {
                    errorMessage = 'Товар не найден в избранном';
                } else if (response.status === 401) {
                    errorMessage = 'Необходимо авторизоваться';
                }
            }
            
            showNotification(`❌ ${errorMessage}`);
            
            // Если товар не найден на сервере, но есть локально, удаляем локально
            if (response.status === 404) {
                removeFavoritesLocally(productId);
            }
        }
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        showNotification('❌ Ошибка соединения с сервером. Удаляем локально...');
        removeFavoritesLocally(productId);
    }
}

// Удаление из избранного локально (резервный вариант)
function removeFavoritesLocally(productId) {
    // Находим товар для уведомления
    const favoriteItem = favorites.find(f => f.product_id === productId);
    const productName = favoriteItem?.product_details?.name || 'Товар';
    
    let localFavorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`)) || [];
    localFavorites = localFavorites.filter(item => item.product_id !== productId);
    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(localFavorites));
    
    // Удаляем из локального массива
    favorites = favorites.filter(item => item.product_id !== productId);
    window.favorites = favorites;
    
    showNotification(`🗑️ ${productName} удален из избранного (локально)`);
    
    // Обновляем иконку кнопки
    updateWishlistButton(productId, false);
    
    // Обновляем счетчик избранного
    updateFavoritesCount();
    
    // Обновляем отображение если мы на странице профиля
    if (window.location.pathname.includes('/profile')) {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (favoritesGrid) {
            favoritesGrid.innerHTML = renderFavorites();
        }
        
        // Обновляем текст вкладки
        const favoritesTab = document.querySelector('.profile-tab:nth-child(2)');
        if (favoritesTab) {
            favoritesTab.innerHTML = `<i class="fas fa-heart"></i> Избранное (${favorites.length})`;
        }
    }
}

// Обновление иконки кнопки избранного
function updateWishlistButton(productId, inFavorites) {
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        if (inFavorites) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Обновление счетчика избранного в профиле
function updateFavoritesCount() {
    const favoritesTab = document.querySelector('.profile-tab:nth-child(2)');
    if (favoritesTab) {
        favoritesTab.innerHTML = `<i class="fas fa-heart"></i> Избранное (${favorites.length})`;
    }
}

// Проверка, есть ли товар в избранном
async function checkFavoriteStatus(productId) {
    if (!currentUser) return false;
    
    // Сначала проверяем в локальном массиве
    if (favorites.some(item => item.product_id === productId)) {
        return true;
    }
    
    try {
        const response = await fetch(`/api/favorite/check?product_id=${productId}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            return data.in_favorites;
        }
    } catch (error) {
        console.error('Ошибка при проверке избранного:', error);
    }
    return false;
}

// Делаем функции и переменные глобальными
window.currentUser = currentUser;
window.favorites = favorites;
window.checkAuth = checkAuth;
window.loadFavorites = loadFavorites;
window.updateNavAuth = updateNavAuth;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.switchAuthTab = switchAuthTab;
window.loadProfile = loadProfile;
window.switchProfileTab = switchProfileTab;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.checkFavoriteStatus = checkFavoriteStatus;
window.downloadProduct = downloadProduct;
window.getPurchasedProducts = getPurchasedProducts;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    
    if (window.location.pathname.includes('/profile')) {
        loadProfile();
    }
    
    if (window.location.pathname.includes('/login') && currentUser) {
        window.location.href = '/';
    }
});