
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера для Stuffed Toys
    initSlider(
        'toys-list-stuffed', 
        'prev-btn-stuffed', 
        'next-btn-stuffed', 
        'progress-line-stuffed',
        '.categories__stuffed-toys-item'
    );
    
    // Инициализация слайдера для Wooden Toys
    initSlider(
        'toys-list-wooden', 
        'prev-btn-wooden', 
        'next-btn-wooden', 
        'progress-line-wooden',
        '.categories__wooden-toys-item'
    );
    
    function initSlider(listId, prevBtnId, nextBtnId, progressLineId, itemSelector) {
        const list = document.getElementById(listId);
        const items = list.querySelectorAll(itemSelector);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const progressLine = document.getElementById(progressLineId);
        
        if (!list || !prevBtn || !nextBtn || !progressLine || items.length === 0) {
            console.error('Не найдены элементы слайдера:', {listId, prevBtnId, nextBtnId, progressLineId});
            return;
        }
        
        // Конфигурация слайдера
        const itemWidth = items[0].offsetWidth + 30; // width + gap
        const visibleItems = 4; // Сколько элементов видно одновременно
        let currentPosition = 0;
        const maxPosition = (items.length - visibleItems) * itemWidth;
        const stepPositions = items.length - visibleItems; // Количество шагов для прокрутки по одному элементу
        const stepWidth = 87 / stepPositions; // Процент ширины на каждый шаг
        
        // Обновление состояния кнопок
        function updateControls() {
            prevBtn.disabled = currentPosition === 0;
            nextBtn.disabled = currentPosition >= maxPosition;
        }
        
        // Обновление позиции зеленой линии
        function updateProgressLine() {
            const currentStep = Math.round(currentPosition / itemWidth);
            progressLine.style.left = (currentStep * stepWidth) + '%';
        }
        
        // Перемещение слайдера
        function moveSlider() {
            list.style.transform = `translateX(-${currentPosition}px)`;
            updateControls();
            updateProgressLine();
        }
        
        // Обработчики событий для кнопок
        prevBtn.addEventListener('click', function() {
            if (currentPosition > 0) {
                currentPosition -= itemWidth; // Прокрутка на один элемент
                if (currentPosition < 0) currentPosition = 0;
                moveSlider();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (currentPosition < maxPosition) {
                currentPosition += itemWidth; // Прокрутка на один элемент
                if (currentPosition > maxPosition) currentPosition = maxPosition;
                moveSlider();
            }
        });
        
        // Инициализация
        updateControls();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', function() {
            // Пересчитываем позиции при изменении размера окна
            const newItemWidth = items[0].offsetWidth + 30;
            const newMaxPosition = (items.length - visibleItems) * newItemWidth;
            currentPosition = Math.min(currentPosition, newMaxPosition);
            moveSlider();
        });
    }
});