// Текущий пользователь
let currentUser = null;

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
    `;
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
async function addToWishlist(productId) {
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
        const response = await fetch('/api/users/wishlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId }),
            credentials: 'include'
        });

        if (response.ok) {
            showNotification(`❤️ ${product.name} добавлен в избранное!`);
            
            // Обновляем иконку кнопки
            const wishlistBtn = document.getElementById('wishlistBtn');
            if (wishlistBtn) {
                wishlistBtn.classList.add('active');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            }
        } else {
            // Если сервер недоступен, сохраняем в localStorage
            saveWishlistLocally(productId, product);
        }
    } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
        saveWishlistLocally(productId, product);
    }
}

// Сохранение в избранное локально
function saveWishlistLocally(productId, product) {
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    
    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            preview_image: product.preview_image
        });
        localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
        showNotification(`❤️ ${product.name} добавлен в избранное (локально)!`);
        
        // Обновляем иконку кнопки
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    }
}

// Удаление из избранного
async function removeFromWishlist(productId) {
    if (!currentUser) {
        showNotification('❌ Необходимо авторизоваться');
        return;
    }

    try {
        const response = await fetch('/api/users/wishlist/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId }),
            credentials: 'include'
        });

        if (response.ok) {
            showNotification('🗑️ Товар удален из избранного');
            
            // Обновляем иконку кнопки
            const wishlistBtn = document.getElementById('wishlistBtn');
            if (wishlistBtn) {
                wishlistBtn.classList.remove('active');
                wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            }
        } else {
            removeWishlistLocally(productId);
        }
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        removeWishlistLocally(productId);
    }
}

// Удаление из избранного локально
function removeWishlistLocally(productId) {
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
    showNotification('🗑️ Товар удален из избранного (локально)');
    
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
}

// Проверка, есть ли товар в избранном
async function checkWishlistStatus(productId) {
    if (!currentUser) return false;
    
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    if (wishlist.some(item => item.id === productId)) {
        return true;
    }
    
    try {
        const response = await fetch('/api/users/wishlist/check?product_id=' + productId, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            return data.in_wishlist;
        }
    } catch (error) {
        console.error('Ошибка при проверке избранного:', error);
    }
    return false;
}

// Делаем функции и переменные глобальными
window.currentUser = currentUser;
window.checkAuth = checkAuth;
window.updateNavAuth = updateNavAuth;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.switchAuthTab = switchAuthTab;
window.loadProfile = loadProfile;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.checkWishlistStatus = checkWishlistStatus;
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