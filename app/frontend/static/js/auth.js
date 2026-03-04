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
        } else {
            currentUser = null;
            console.log('Пользователь не авторизован');
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        currentUser = null;
    }
    updateNavAuth();
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
                <span>${currentUser.first_name}</span>
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
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Выйти из аккаунта
                </button>
            </div>
        </div>
        
        <div class="profile-stats">
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div>Приобретено моделей</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div>В избранном</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${currentUser.bonus_points || 0}</div>
                <div>Бонусных баллов</div>
            </div>
        </div>
        
        <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">Мои покупки</h3>
        <div class="products-grid" id="purchasesGrid">
            <p style="color: var(--gray); grid-column: 1/-1; text-align: center; padding: 2rem;">У вас пока нет покупок</p>
        </div>

        <h3 style="color: var(--dark-blue); margin: 2rem 0 1rem;">Избранное</h3>
        <div class="products-grid" id="wishlistGrid">
            <p style="color: var(--gray); grid-column: 1/-1; text-align: center; padding: 2rem;">В избранном пока нет товаров</p>
        </div>
    `;
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

// Делаем функции и переменные глобальными
window.currentUser = currentUser;
window.checkAuth = checkAuth;
window.updateNavAuth = updateNavAuth;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.switchAuthTab = switchAuthTab;
window.loadProfile = loadProfile;
window.getCategoryName = getCategoryName;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    
    // Если мы на странице профиля, загружаем профиль
    if (window.location.pathname.includes('/profile')) {
        loadProfile();
    }
    
    // Если мы на странице входа, проверяем не авторизован ли уже пользователь
    if (window.location.pathname.includes('/login') && currentUser) {
        // Если пользователь уже авторизован, перенаправляем на главную
        window.location.href = '/';
    }
});