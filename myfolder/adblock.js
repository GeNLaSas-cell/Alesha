(function() {
    'use strict';

    console.log("���������� ������� ������������");

    // ��������� �������� �������� (������� �������)
    const originalAccount = window.Account || {};
    window.Account = {
        ...originalAccount,
        hasPremium: () => true,
        isPremium: true,
        __proto__: originalAccount
    };

    // ������ �������� <video> ��� �������
    const originalCreateElement = document.createElement;
    document.createElement = new Proxy(originalCreateElement, {
        apply(target, thisArg, args) {
            const element = target.apply(thisArg, args);
            
            if (args[0] === "video") {
                console.log("������������� �������� <video> ��� �������!");
                
                // ��������� ������� ����������������
                element.play = function() {
                    console.log("��������� ����� �������������!");
                    setTimeout(() => {
                        element.ended = true;
                        element.dispatchEvent(new Event("ended"));
                    }, 500);
                    return Promise.reject(new DOMException("The play() request was interrupted by a call to pause().", "AbortError"));
                };
                
                // ��������� �������������� ������
                element.load = () => {};
                element.poster = "";
                element.src = "";
                element.innerHTML = "";
            }
            
            return element;
        }
    });

    // ������� ������� �������
    function clearAdTimers() {
        console.log("������� ��������� �������...");
        
        // ����� ����������� ������� ��������
        const highestId = setTimeout(() => {});
        for (let i = 1; i < highestId; i++) {
            clearTimeout(i);
            clearInterval(i);
            cancelAnimationFrame(i);
        }
    }

    // ������� ������� ����� �������� ��������
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", clearAdTimers);
    } else {
        clearAdTimers();
    }

    // �������������� ������
    Object.defineProperty(window, "ads", {
        get: () => [],
        set: () => {},
        configurable: false,
        enumerable: false
    });

    // ��������� ���������� ��������� API
    window.ad = window.ad = {};
    window.ad.prototype = new Proxy(window.ad.prototype, {
        get() {
            return () => {};
        }
    });
})();