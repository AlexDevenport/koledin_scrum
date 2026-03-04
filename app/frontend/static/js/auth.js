// Класс для работы с пользователями
class User {
    constructor(firstName, lastName, email, password) {
        this.id = Date.now();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password; // В реальном проекте пароль должен хешироваться
        this.registeredAt = new Date().toISOString();
        this.purchases = [];
        this.wishlist = [];
    }
}

// Текущий пользователь
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Все пользователи
let users = JSON.parse(localStorage.getItem('users')) || [];

// Сохранение пользователей в localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Сохранение текущего пользователя
function saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Обновление навигации (кнопка входа/выхода)
function updateNavAuth() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Удаляем существующую кнопку авторизации если есть
    const existingAuthItem = document.querySelector('.nav-auth-item');
    if (existingAuthItem) {
        existingAuthItem.remove();
    }

    const authItem = document.createElement('li');
    authItem.className = 'nav-auth-item';

    if (currentUser) {
        // Пользователь авторизован
        authItem.innerHTML = `
            <div class="user-greeting">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.firstName}</span>
                <a href="#" onclick="logout(); return false;" style="color: white; margin-left: 10px;" title="Выйти">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </div>
        `;
    } else {
        // Пользователь не авторизован
        authItem.innerHTML = `
            <a href="/login" class="auth-button">
                <i class="fas fa-sign-in-alt"></i> Войти
            </a>
        `;
    }

    navMenu.appendChild(authItem);
}

// Обработка входа
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        saveCurrentUser();
        showNotification(`✅ С возвращением, ${user.firstName}!`);
        
        // Перенаправляем на главную или предыдущую страницу
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    } else {
        showNotification('❌ Неверный email или пароль');
    }
}

// Обработка регистрации
function handleRegister(event) {
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

    // Проверка существования пользователя
    if (users.some(u => u.email === email)) {
        showNotification('❌ Пользователь с таким email уже существует');
        return;
    }

    // Создание нового пользователя
    const newUser = new User(firstName, lastName, email, password);
    users.push(newUser);
    saveUsers();
    
    currentUser = newUser;
    saveCurrentUser();
    
    showNotification(`✅ Регистрация успешна! Добро пожаловать, ${firstName}!`);
    
    // Перенаправляем на главную
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

// Выход из аккаунта
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('👋 Вы вышли из аккаунта');
    updateNavAuth();
    
    // Если мы на странице профиля, перенаправляем на главную
    if (window.location.pathname.includes('/profile')) {
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
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

// Функция для удаления из избранного
function removeFromWishlist(productId) {
    if (!currentUser) return;
    
    const productIndex = currentUser.wishlist.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        const productName = currentUser.wishlist[productIndex].name;
        currentUser.wishlist.splice(productIndex, 1);
        saveCurrentUser();
        
        // Обновляем пользователя в общем списке users
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
        }
        
        showNotification(`🗑️ ${productName} удален из избранного`);
        
        // Если мы на странице профиля, обновляем отображение
        if (window.location.pathname.includes('/profile')) {
            loadProfile();
        }
    }
}

// Загрузка профиля пользователя
function loadProfile() {
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

    // Отображаем профиль пользователя
    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="profile-info">
                <h2>${currentUser.firstName} ${currentUser.lastName}</h2>
                <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
                <p><i class="fas fa-calendar"></i> На сайте с ${new Date(currentUser.registeredAt).toLocaleDateString('ru-RU')}</p>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Выйти из аккаунта
                </button>
            </div>
        </div>
        
        <div class="profile-stats">
            <div class="stat-card">
                <div class="stat-value">${currentUser.purchases?.length || 0}</div>
                <div>Приобретено моделей</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${currentUser.wishlist?.length || 0}</div>
                <div>В избранном</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Math.floor((currentUser.purchases?.reduce((sum, item) => sum + item.price, 0) || 0) * 0.1)}</div>
                <div>Бонусных баллов</div>
            </div>
        </div>
        
        <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">Мои покупки</h3>
        <div class="products-grid" id="purchasesGrid">
            ${currentUser.purchases?.length > 0 ? 
                currentUser.purchases.sort((a, b) => new Date(b.date) - new Date(a.date)).map(purchase => `
                    <div class="product-card">
                        <div class="product-image" onclick="window.location.href='/product?id=${purchase.id}'" style="cursor: pointer;">
                            ${purchase.preview ? 
                                `<img src="${purchase.preview}" alt="${purchase.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                                    onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${purchase.image || 'fa-cube'}\' style=\'font-size: 3rem;\'></i>'">` 
                                : `<i class="fas ${purchase.image || 'fa-cube'}" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="product-info">
                            <h3 class="product-title" onclick="window.location.href='/product?id=${purchase.id}'" style="cursor: pointer;">${purchase.name}</h3>
                            <p style="color: var(--gray); margin-bottom: 0.5rem;">${getCategoryName(purchase.category)}</p>
                            <div class="product-price" style="font-size: 1.2rem;">${purchase.price.toLocaleString('ru-RU')} ₽</div>
                            <p style="color: var(--gray); font-size: 0.9rem; margin: 0.5rem 0;">
                                <i class="fas fa-calendar-alt"></i> ${new Date(purchase.date).toLocaleDateString('ru-RU')}
                            </p>
                            <button class="add-to-cart" style="width: 100%;" onclick="downloadProduct(${purchase.id})">
                                <i class="fas fa-download"></i> Скачать
                            </button>
                        </div>
                    </div>
                `).join('') :
                '<p style="color: var(--gray); grid-column: 1/-1; text-align: center; padding: 2rem;">У вас пока нет покупок</p>'
            }
        </div>

        <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">Избранное</h3>
        <div class="products-grid" id="wishlistGrid">
            ${currentUser.wishlist?.length > 0 ? 
                currentUser.wishlist.map(item => `
                    <div class="product-card">
                        <div class="product-image" onclick="window.location.href='/product?id=${item.id}'" style="cursor: pointer;">
                            ${item.preview ? 
                                `<img src="${item.preview}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                                    onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${item.image}\' style=\'font-size: 3rem;\'></i>'">` 
                                : `<i class="fas ${item.image}" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="product-info">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h3 class="product-title" onclick="window.location.href='/product?id=${item.id}'" style="cursor: pointer;">${item.name}</h3>
                                <button class="remove-wishlist-btn" onclick="removeFromWishlist(${item.id})" title="Удалить из избранного">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <p style="color: var(--gray); margin-bottom: 0.5rem;">${getCategoryName(item.category)}</p>
                            <div class="product-price">${item.price.toLocaleString('ru-RU')} ₽</div>
                            <button class="add-to-cart" onclick="addToCart(${item.id})" style="width: 100%;">
                                <i class="fas fa-shopping-cart"></i> В корзину
                            </button>
                        </div>
                    </div>
                `).join('') :
                '<p style="color: var(--gray); grid-column: 1/-1; text-align: center; padding: 2rem;">В избранном пока нет товаров</p>'
            }
        </div>
    `;
}

// Функция для скачивания товара
function downloadProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`📥 Начинается загрузка файла "${product.name}"...`);
        // Здесь можно добавить реальную логику скачивания файла
    }
}

// Добавление в избранное
function addToWishlist(productId) {
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

    // Проверяем, есть ли уже товар в избранном
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
        });
        
        saveCurrentUser();
        
        // Обновляем пользователя в общем списке users
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
        }
        
        showNotification(`❤️ ${product.name} добавлен в избранное!`);
        
        // Если мы на странице профиля, обновляем отображение
        if (window.location.pathname.includes('/profile')) {
            loadProfile();
        }
    } else {
        // Удаляем из избранного
        const productName = currentUser.wishlist[existingItemIndex].name;
        currentUser.wishlist.splice(existingItemIndex, 1);
        saveCurrentUser();
        
        // Обновляем пользователя в общем списке users
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
        }
        
        showNotification(`🗑️ ${productName} удален из избранного`);
        
        // Если мы на странице профиля, обновляем отображение
        if (window.location.pathname.includes('/profile')) {
            loadProfile();
        }
    }
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();
    
    // Если мы на странице профиля, загружаем профиль
    if (window.location.pathname.includes('/profile')) {
        loadProfile();
    }
});