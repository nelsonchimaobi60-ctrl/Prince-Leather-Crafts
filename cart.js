// GET BASKET FROM LOCALSTORAGE
function getBasket() {
    return JSON.parse(localStorage.getItem("princeBasket")) || [];
}

// SAVE BASKET
function saveBasket(basket) {
    localStorage.setItem("princeBasket", JSON.stringify(basket));
    updateBasketCount();
}

// ADD PRODUCT
function addToBasket(name, price, image, size, quantity) {
    if (!size) {
        alert("Please select your shoe size!");
        return;
    }

    quantity = Number(quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter a valid quantity!");
        return;
    }

    let basket = getBasket();
    let existing = basket.find(item => item.name === name && item.size === size);

    if (existing) {
        existing.image = image;
        existing.price = price;
        existing.quantity += quantity;
    } else {
        basket.push({ name, price, image, size, quantity });
    }

    saveBasket(basket);
    alert(name + " (Size " + size + ") added to your basket!");
}

// UPDATE HEADER COUNT
function updateBasketCount() {
    let basket = getBasket();
    let total = basket.reduce((sum, item) => sum + item.quantity, 0);
    let count = document.getElementById("cart-count");
    if (count) count.textContent = total;
}

// BASKET PAGE QUANTITY CHANGE
function changeQuantity(index, amount) {
    let basket = getBasket();
    if (!basket[index]) return;
    basket[index].quantity += amount;
    if (basket[index].quantity <= 0) basket.splice(index, 1);
    saveBasket(basket);
    displayBasket();
}

// BASKET PAGE REMOVE PRODUCT
function removeProduct(index) {
    let basket = getBasket();
    basket.splice(index, 1);
    saveBasket(basket);
    displayBasket();
}

// BASKET PAGE DISPLAY
function displayBasket() {
    let container = document.getElementById("basket-items");
    let totalElement = document.getElementById("basket-total");
    if (!container || !totalElement) return;

    let basket = getBasket();
    container.innerHTML = "";

    if (basket.length === 0) {
        container.innerHTML = `
            <div class="empty-basket">
                <h2>Your Basket is Empty!</h2>
                <p>You haven't selected any footwear yet.</p>
                <a href="order.html" class="btn">Continue Shopping</a>
            </div>
        `;
        totalElement.textContent = "₦0";
        return;
    }

    let total = 0;
    basket.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        container.innerHTML += `
            <div class="basket-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="basket-details">
                    <h3>${item.name}</h3>
                    <p>Selected Shoe Size: ${item.size}</p>
                    <p>Price: ₦${item.price.toLocaleString("en-NG")}</p>
                    <div class="quantity-control">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <p>Subtotal: ₦${subtotal.toLocaleString("en-NG")}</p>
                    <button class="remove-btn" onclick="removeProduct(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    totalElement.textContent = "₦" + total.toLocaleString("en-NG");
}

document.addEventListener("DOMContentLoaded", function() {
    updateBasketCount();
    displayBasket();
});