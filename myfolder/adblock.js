(функция () {
    console.log("Блокировка рекламы активирована");

    // Подменяем подписку на проверку (премиум-аккаунт)
    окно.Счет = окно.Счет || {};
    window.Account.hasPremium = () => true;

    // Ломаем создание <видео> для рекламы
    document.createElement = новый Прокси(document.createElement, {
        применить(цель, этотАрг, аргументы) {
            если (args[0] === "видео") {
                console.log("Перехватываем создание <видео> для рекламы!");

                пусть fakeVideo = target.apply(thisArg, args);

                // Запрещаем рекламе воспроизводиться
                поддельноеВидео.воспроизведение = функция () {
                    console.log("Рекламное видео заблокировано!");
                    setTimeout(() => {
                        fakeVideo.ended = true;
                        fakeVideo.dispatchEvent(новое событие("завершилось")); // Эмулируемое завершение рекламы
                    }, 500);
                };

                вернуть поддельное Видео;
            }
            вернуть цель.apply(thisArg, args);
        }
    });

    // Очищаем таймеры рекламы
    функция clearAdTimers() {
        console.log("Очищаем рекламные таймеры...");
        пусть maximumTimeout = setTimeout(() => {}, 0);
        для (пусть i = 0; i <= maximumTimeout; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
    }

    // Убираем рекламу после загрузки страницы
    document.addEventListener("DOMContentLoaded", clearAdTimers);
})();
 
ош