(function() {
    'use strict';

    console.log("Блокировка рекламы активирована");

    // Подменяем проверку подписки (премиум аккаунт)
    const originalAccount = window.Account || {};
    window.Account = {
        ...originalAccount,
        hasPremium: () => true,
        isPremium: true,
        __proto__: originalAccount
    };

    // Ломаем создание <video> для рекламы
    const originalCreateElement = document.createElement;
    document.createElement = new Proxy(originalCreateElement, {
        apply(target, thisArg, args) {
            const element = target.apply(thisArg, args);
            
            if (args[0] === "video") {
                console.log("Перехватываем создание <video> для рекламы!");
                
                // Запрещаем рекламе воспроизводиться
                element.play = function() {
                    console.log("Рекламное видео заблокировано!");
                    setTimeout(() => {
                        element.ended = true;
                        element.dispatchEvent(new Event("ended"));
                    }, 500);
                    return Promise.reject(new DOMException("The play() request was interrupted by a call to pause().", "AbortError"));
                };
                
                // Добавляем дополнительные защиты
                element.load = () => {};
                element.poster = "";
                element.src = "";
                element.innerHTML = "";
            }
            
            return element;
        }
    });

    // Очищаем таймеры рекламы
    function clearAdTimers() {
        console.log("Очищаем рекламные таймеры...");
        
        // Более эффективная очистка таймеров
        const highestId = setTimeout(() => {});
        for (let i = 1; i < highestId; i++) {
            clearTimeout(i);
            clearInterval(i);
            cancelAnimationFrame(i);
        }
    }

    // Убираем рекламу после загрузки страницы
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", clearAdTimers);
    } else {
        clearAdTimers();
    }

    // Дополнительные защиты
    Object.defineProperty(window, "ads", {
        get: () => [],
        set: () => {},
        configurable: false,
        enumerable: false
    });

    // Блокируем популярные рекламные API
    window.ad = window.ad = {};
    window.ad.prototype = new Proxy(window.ad.prototype, {
        get() {
            return () => {};
        }
    });
})();