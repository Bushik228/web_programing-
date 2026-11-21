/**
 * Лабораторна робота №4: Робота з JavaScript
 * Студент: Буштин Владислав
 * Варіант: 2
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSystemInfo();
    fetchReviews();
    initModal();
});

/* ==========================================================================
   1. Зберігання даних у браузері (localStorage)
   ========================================================================== */
function initSystemInfo() {
    // Зчитуємо дані про браузер та ОС
    const systemData = {
        userAgent: navigator.userAgent,
        platform: navigator.platform || (navigator.userAgentData && navigator.userAgentData.platform) || 'Невідома платформа',
        language: navigator.language,
        timestamp: new Date().toLocaleString('uk-UA')
    };

    // Зберігаємо всю наявну інформацію у localStorage у форматі JSON
    localStorage.setItem('lab4_system_info', JSON.stringify(systemData));

    // Зчитуємо дані назад із localStorage для перевірки
    const savedDataString = localStorage.getItem('lab4_system_info');
    const infoContainer = document.getElementById('os-browser-info');

    if (savedDataString && infoContainer) {
        try {
            const data = JSON.parse(savedDataString);
            infoContainer.innerHTML = `
                <p><strong>Операційна система / Платформа:</strong> ${data.platform}</p>
                <p><strong>Браузер (User-Agent):</strong> <span style="word-break: break-all;">${data.userAgent}</span></p>
                <p><strong>Мова системи:</strong> ${data.language} | <strong>Збережено:</strong> ${data.timestamp}</p>
            `;
        } catch (e) {
            infoContainer.textContent = savedDataString;
        }
    }
}

/* ==========================================================================
   2. Відображення динамічного вмісту із сервера (Fetch API, Варіант 2)
   ========================================================================== */
async function fetchReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    // Відповідно до варіанта 2: /posts/2/comments
    const url = 'https://jsonplaceholder.typicode.com/posts/2/comments';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const comments = await response.json();

        // Очищаємо індикатор завантаження
        reviewsContainer.innerHTML = '';

        // Відображаємо коментарі у порядку їх отримання
        comments.forEach((comment, index) => {
            const card = document.createElement('article');
            card.className = 'review-card';
            card.innerHTML = `
                <div>
                    <div class="review-header">
                        <span class="review-number">${index + 1}</span>
                        <div>
                            <h4 class="review-author">${escapeHtml(comment.name)}</h4>
                            <a href="mailto:${encodeURIComponent(comment.email)}" class="review-email">${escapeHtml(comment.email)}</a>
                        </div>
                    </div>
                    <p class="review-body">"${escapeHtml(comment.body)}"</p>
                </div>
            `;
            reviewsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Не вдалося отримати коментарі:', error);
        reviewsContainer.innerHTML = `
            <p class="error-msg">Помилка завантаження відгуків із сервера (${error.message}). Перевірте з'єднання з мережею.</p>
        `;
    }
}

// Допоміжна функція безпечного відображення тексту
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ==========================================================================
   3. Надсилання форми зворотного зв'язку (Модальне вікно через 1 хв)
   ========================================================================== */
function initModal() {
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const openBtn = document.getElementById('open-modal-btn');

    if (!modal) return;

    function openModal() {
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    // Відкрити модальне вікно через 1 хвилину (60 000 мс) перебування на сайті
    const timerId = setTimeout(() => {
        openModal();
    }, 60000);

    // Закриття на кнопку "Закрити" (хрестик)
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Ручне відкриття (зручно для швидкої перевірки викладачем без очікування 60 с)
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            clearTimeout(timerId); // якщо відкрито вручну, скасовуємо таймер
            openModal();
        });
    }

    // Закриття кліком по фону (overlay)
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Закриття клавішею Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   4. Перехід на нічний/денний режим (Автоматично та вручну)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Автоматичне перемикання за часом доби:
    // Денна тема: від 07:00 до 21:00 (7 <= hours < 21)
    // Нічна тема: в увесь інший час
    const now = new Date();
    const hours = now.getHours();
    const isDayTime = hours >= 7 && hours < 21;

    // Початкова тема за часом доби
    let activeTheme = isDayTime ? 'light' : 'dark';

    function setPageTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.textContent = '☀️ Світла тема';
            }
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            if (themeToggleBtn) {
                themeToggleBtn.textContent = '🌙 Нічна тема';
            }
        }
    }

    // Встановлюємо початкову тему
    setPageTheme(activeTheme);

    // Додаємо слухач події на кнопку для ручного перемикання
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
            setPageTheme(activeTheme);
        });
    }
}
