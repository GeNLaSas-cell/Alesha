(function () {
    'use strict';

    console.log("Блокировка рекламы активирована");

    // Подменяем проверку подписки (премиум аккаунт)
    const originalCreateElement = document.createElement;
    const originalHasPremium = window.Account?.hasPremium;

    // Безопасное создание объектов
    window.Account = window.Account || {};
    Object.defineProperty(window.Account, 'hasPremium', {
        value: () => true,
        writable: false,
        configurable: false
    });

    // Перехват создания элементов
    document.createElement = new Proxy(originalCreateElement, {
        apply(target, thisArg, args) {
            const [tagName] = args;
            
            if (tagName.toLowerCase() === 'video') {
                console.log("Перехватываем создание <video> для рекламы!");
                
                const videoElement = target.apply(thisArg, args);
                
                // Сохраняем оригинальные методы
                const originalPlay = videoElement.play;
                const originalAddEventListener = videoElement.addEventListener;
                
                // Переопределяем play
                videoElement.play = function() {
                    console.log("Рекламное видео заблокировано!");
                    
                    // Эмулируем быстрое завершение
                    setTimeout(() => {
                        if (!this.ended) {
                            this.ended = true;
                            this.dispatchEvent(new Event('ended'));
                        }
                    }, 100);
                    
                    return Promise.resolve(); // Возвращаем успешный промис
                };
                
                // Блокируем обработчики событий рекламы
                videoElement.addEventListener = function(type, listener, options) {
                    if (type === 'timeupdate' || type === 'progress') {
                        console.log(`Блокируем обработчик события: ${type}`);
                        return;
                    }
                    originalAddEventListener.call(this, type, listener, options);
                };
                
                return videoElement;
            }
            
            return target.apply(thisArg, args);
        }
    });

    // Эффективная очистка таймеров
    function clearAdTimers() {
        console.log("Очищаем рекламные таймеры...");
        
        // Более эффективный подход к очистке таймеров
        let id = setTimeout(() => {});
        while (id--) {
            clearTimeout(id);
            clearInterval(id);
        }
    }

    // Убираем рекламу с помощью MutationObserver
    function removeAds() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const element = node;
                        // Удаляем элементы с классами/атрибутами рекламы
                        if (
                            element.className && 
                            (typeof element.className === 'string' &&
                            (element.className.includes('ad') || 
                             element.className.includes('adv') ||
                             element.className.includes('banner')))
                        ) {
                            element.remove();
                            console.log("Рекламный баннер удален");
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Запускаем при полной загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            clearAdTimers();
            removeAds();
        });
    } else {
        clearAdTimers();
        removeAds();
    }

    // Восстановление оригинальных функций при необходимости
    window.__adBlockRestore = function() {
        document.createElement = originalCreateElement;
        if (originalHasPremium) {
            window.Account.hasPremium = originalHasPremium;
        }
        console.log("Оригинальные функции восстановлены");
    };

})();