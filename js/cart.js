
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const cartElement = document.querySelector('.header__cart');
    const cartCountElement = document.querySelector('.header__cart-count span');
    const cartDropdown = document.createElement('div');
    cartDropdown.className = 'cart-dropdown';
    cartElement.appendChild(cartDropdown);
    const overlay = document.getElementById('overlay');
    
    // Данные корзины
    let cartItems = [];
    let cartTotal = 0;
    let itemCount = 0;
    
    // Функция для обновления счетчика корзины
    function updateCartCount() {
        cartCountElement.textContent = itemCount;
        cartCountElement.parentElement.classList.add('pulse');
        setTimeout(() => {
            cartCountElement.parentElement.classList.remove('pulse');
        }, 500);
    }
    
    // Функция для отображения/скрытия корзины
    function toggleCart() {
        cartDropdown.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (cartDropdown.classList.contains('active')) {
            renderCartItems();
        }
    }
    
    // Функция для добавления товара в корзину
    function addToCart(item) {
        // Проверяем, есть ли уже такой товар в корзине
        const existingItemIndex = cartItems.findIndex(cartItem => 
            cartItem.name === item.name && cartItem.price === item.price
        );
        
        if (existingItemIndex !== -1) {
            // Увеличиваем количество существующего товара
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Добавляем новый товар
            cartItems.push({
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
        
        // Обновляем общее количество товаров и общую стоимость
        itemCount += 1;
        cartTotal += parseFloat(item.price.replace('$', '').trim());
        
        // Обновляем интерфейс
        updateCartCount();
        
        // Показываем уведомление о добавлении в корзину
        showNotification(`"${item.name}" добавлен в корзину!`);
    }
    
    // Функция для удаления товара из корзины
    function removeFromCart(index) {
        const removedItem = cartItems[index];
        itemCount -= removedItem.quantity;
        cartTotal -= parseFloat(removedItem.price.replace('$', '').trim()) * removedItem.quantity;
        
        cartItems.splice(index, 1);
        updateCartCount();
        renderCartItems();
    }
    
    // Функция для изменения количества товара
    function changeQuantity(index, change, event) {
        event.stopPropagation(); // Останавливаем всплытие события
        
        const item = cartItems[index];
        const price = parseFloat(item.price.replace('$', '').trim());
        
        if (change > 0) {
            // Увеличиваем количество
            item.quantity += 1;
            itemCount += 1;
            cartTotal += price;
        } else if (change < 0 && item.quantity > 1) {
            // Уменьшаем количество (но не меньше 1)
            item.quantity -= 1;
            itemCount -= 1;
            cartTotal -= price;
        }
        
        updateCartCount();
        renderCartItems();
    }
    
    // Функция для удаления товара из корзины
    function removeFromCart(index, event) {
        event.stopPropagation(); // Останавливаем всплытие события
        
        const removedItem = cartItems[index];
        itemCount -= removedItem.quantity;
        cartTotal -= parseFloat(removedItem.price.replace('$', '').trim()) * removedItem.quantity;
        
        cartItems.splice(index, 1);
        updateCartCount();
        renderCartItems();
    }

    // Функция для отрисовки товаров в корзине
    function renderCartItems() {
        if (cartItems.length === 0) {
            cartDropdown.innerHTML = `
                <h3 class="cart-dropdown__title">Cart</h3>
                <div class="cart-dropdown__empty">Your cart is empty</div>
            `;
            return;
        }
        
        let cartHTML = `
            <h3 class="cart-dropdown__title">Cart</h3>
            <div class="cart-dropdown__items">
        `;
        
        cartItems.forEach((item, index) => {
            cartHTML += `
                <div class="cart-dropdown__item">
                    <img src="${item.image}" alt="${item.name}" class="cart-dropdown__item-img">
                    <div class="cart-dropdown__item-info">
                        <h4 class="cart-dropdown__item-name">${item.name}</h4>
                        <div class="cart-dropdown__item-price">${item.price}</div>
                        <div class="cart-dropdown__item-quantity">
                            <button class="quantity-btn" data-index="${index}" data-change="-1">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" data-index="${index}" data-change="1">+</button>
                            <button class="cart-dropdown__remove" data-index="${index}">×</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
            </div>
            <div class="cart-dropdown__summary">
                <div class="cart-dropdown__total">
                    <span class="cart-dropdown__total-text">Total:</span>
                    <span class="cart-dropdown__total-price">$${cartTotal.toFixed(2)} USD</span>
                </div>
                <button class="cart-dropdown__checkout" id="checkout-btn">Order</button>
            </div>
        `;
        
        cartDropdown.innerHTML = cartHTML;
        
        // Добавляем обработчики событий для новых кнопок
        cartDropdown.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const index = parseInt(this.getAttribute('data-index'));
                const change = parseInt(this.getAttribute('data-change'));
                changeQuantity(index, change, e);
            });
        });
        
        cartDropdown.querySelectorAll('.cart-dropdown__remove').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index, e);
            });
        });
        
        document.getElementById('checkout-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            checkout();
        });
    }

    // Убираем глобальные функции, так как теперь используем обработчики событий
    window.changeQuantity = null;
    window.removeFromCart = null;
    window.checkout = null;
    
    
    // Функция для оформления заказа
    function checkout() {
        if (cartItems.length === 0) {
            alert('Ваша корзина пуста!');
            return;
        }
        
        alert(`Заказ оформлен! Общая сумма: $${cartTotal.toFixed(2)} USD`);
        
        // Очищаем корзину после оформления заказа
        cartItems = [];
        itemCount = 0;
        cartTotal = 0;
        updateCartCount();
        renderCartItems();
        toggleCart();
    }
    
    // Функция для показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#A5C926';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }
    
    // Обработчик клика по корзине
    cartElement.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCart();
    });
    
    // Закрытие корзины при клике вне ее области
    document.addEventListener('click', function(e) {
        if (cartDropdown.classList.contains('active') && 
            !cartElement.contains(e.target) &&
            !cartDropdown.contains(e.target)) {
            toggleCart();
        }
    });
    
    // Обработчики для кнопок "Add to Cart" на товарах
    document.querySelectorAll('.categories__stuffed-toys-item, .categories__wooden-toys-item').forEach(item => {
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.style.marginTop = '10px';
        addButton.style.padding = '8px 16px';
        addButton.style.backgroundColor = '#A5C926';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '4px';
        addButton.style.cursor = 'pointer';
        addButton.style.transition = 'background-color 0.3s ease';
        
        addButton.addEventListener('mouseenter', () => {
            addButton.style.backgroundColor = '#8fb320';
        });
        
        addButton.addEventListener('mouseleave', () => {
            addButton.style.backgroundColor = '#A5C926';
        });
        
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const name = item.querySelector('.categories__stuffed-toys-item-name, .categories__wooden-toys-item-name').textContent;
            const price = item.querySelector('.categories__stuffed-toys-price, .categories__wooden-toys-price').textContent;
            const image = item.querySelector('img').src;
            
            addToCart({ name, price, image });
        });
        
        item.appendChild(addButton);
    });
    
    // Делаем функции глобальными для использования в inline обработчиках
    window.changeQuantity = changeQuantity;
    window.removeFromCart = removeFromCart;
    window.checkout = checkout;
    
    // Инициализация слайдеров (ваш существующий код)
    // ... остальной код для слайдеров ...
});