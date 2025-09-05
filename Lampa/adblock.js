(function () {
    'use strict';

    console.log("Блокировка рекламы активирована (оптимизировано для Lampa)");

    // Более безопасный подход к перехвату создания элементов
    const originalCreateElement = document.createElement;
    
    // Перехват создания элементов только для явно рекламных видео
    document.createElement = function(tagName) {
        if (tagName.toLowerCase() === 'video') {
            // Проверяем, является ли это рекламным видео
            const videoElement = originalCreateElement.apply(this, arguments);
            
            // Добавляем обработчик для определения рекламы
            const originalPlay = videoElement.play;
            videoElement.play = function() {
                // Проверяем источник видео на наличие рекламных маркеров
                const src = this.src || '';
                if (src.includes('ad') || src.includes('adv') || 
                    src.includes('banner') || this.classList.contains('ad')) {
                    console.log("Рекламное видео заблокировано!");
                    
                    // Эмулируем быстрое завершение только для рекламы
                    setTimeout(() => {
                        if (!this.ended) {
                            this.ended = true;
                            this.dispatchEvent(new Event('ended'));
                        }
                    }, 100);
                    
                    return Promise.resolve();
                }
                
                // Для нерекламного видео используем оригинальный метод
                return originalPlay.apply(this, arguments);
            };
            
            return videoElement;
        }
        
        return originalCreateElement.apply(this, arguments);
    };

    // Улучшенная очистка только рекламных таймеров
    function clearAdTimers() {
        console.log("Очищаем рекламные таймеры...");
        
        // Более избирательный подход
        for (let i = 1; i < 10000; i++) {
            try {
                clearTimeout(i);
                clearInterval(i);
            } catch (e) {
                // Игнорируем ошибки
            }
        }
    }

    // Более точное удаление рекламы
    function removeAds() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const element = node;
                        // Более специфичные проверки для рекламы
                        const classNames = element.className?.toString().toLowerCase() || '';
                        const id = element.id?.toLowerCase() || '';
                        
                        if ((classNames.includes('ad') && 
                             !classNames.includes('adaptive') && // Исключаем ложные срабатывания
                             !classNames.includes('add')) ||
                            classNames.includes('banner') ||
                            id.includes('ad') ||
                            id.includes('banner')) {
                            
                            // Дополнительная проверка перед удалением
                            if (element.querySelector('iframe[src*="ad"]') || 
                                element.querySelector('img[src*="banner"]')) {
                                element.remove();
                                console.log("Рекламный элемент удален");
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // Удаляем существующую рекламу
        setTimeout(() => {
            const adSelectors = [
                '[class*="ad"]:not([class*="adaptive"]):not([class*="add"])',
                '[id*="ad"]',
                '[class*="banner"]',
                '[id*="banner"]'
            ];
            
            adSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    if (element.querySelector('iframe') || element.querySelector('img')) {
                        element.remove();
                    }
                });
            });
        }, 2000);
    }

    // Запускаем с задержкой, чтобы не мешать инициализации приложения
    setTimeout(() => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                clearAdTimers();
                removeAds();
            });
        } else {
            clearAdTimers();
            removeAds();
        }
    }, 3000);

    // Функция для быстрого восстановления
    window.__adBlockRestore = function() {
        document.createElement = originalCreateElement;
        console.log("Оригинальные функции восстановлены");
    };

})();
