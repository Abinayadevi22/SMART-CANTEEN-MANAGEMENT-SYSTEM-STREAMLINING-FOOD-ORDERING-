document.addEventListener('DOMContentLoaded', function () {
    // Toggle menu visibility
    document.getElementById('toggle-menu-button').addEventListener('click', function () {
        const menuSection = document.getElementById('menu-section');
        const loginSection = document.getElementById('login-section'); // Added to hide login when menu is toggled
        menuSection.style.display = menuSection.style.display === 'none' ? 'block' : 'none';
        loginSection.style.display = 'none';  // Hide the login section when menu is shown
        this.textContent = menuSection.style.display === 'block' ? 'Hide Menu' : 'Show Menu';
    });

    // Order submission functionality
    let orderCount = parseInt(localStorage.getItem('orderCount')) || 0;

    document.getElementById('submit-order').addEventListener('click', function () {
        const items = document.querySelectorAll('.item');
        const quantities = document.querySelectorAll('.quantity');
        let totalCost = 0;
        const orders = [];
        const phoneNumber = document.getElementById('phone-number').value;
        const customerName = document.getElementById('customer-name').value;

        if (!phoneNumber || !customerName) {
            alert("Please enter your name and phone number.");
            return;
        }

        items.forEach((item, index) => {
            if (item.checked) {
                const price = Number(item.getAttribute('data-price'));
                const quantity = Math.max(1, Number(quantities[index].value) || 1); // Ensure quantity is at least 1
                totalCost += price * quantity;
                orders.push(`${item.parentNode.innerText.trim()} x${quantity}`);
            }
        });

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (orders.length > 0) {
            orderCount++;
            localStorage.setItem('orderCount', orderCount);

            const uniqueCode = Math.floor(100000 + Math.random() * 900000);

            const orderDetails = {
                orderNumber: orderCount,
                items: orders,
                totalCost: totalCost,
                status: 'Pending',
                phoneNumber: phoneNumber,
                customerName: customerName,
                pickupCode: uniqueCode,
                paymentMethod: paymentMethod,
                date: new Date().toISOString().split('T')[0]  // Save current date
            };

            // Get today's orders (filtered by today's date)
            const today = new Date().toISOString().split('T')[0];  // Get the date part (YYYY-MM-DD)
            let ordersForToday = JSON.parse(localStorage.getItem(today)) || [];
            ordersForToday.push(orderDetails);

            // Store the orders for today
            localStorage.setItem(today, JSON.stringify(ordersForToday));

            // Display order summary
            const summaryDetails = document.getElementById('summary-details');
            summaryDetails.innerHTML = `
                <strong>Order No:</strong> ${orderDetails.orderNumber}<br>
                <strong>Items:</strong> ${orderDetails.items.join(', ')}<br>
                <strong>Total Cost:</strong> ₹${orderDetails.totalCost}<br>
                <strong>Pickup Code:</strong> ${orderDetails.pickupCode}<br>
                <strong>Payment Method:</strong> ${orderDetails.paymentMethod}<br>
            `;

            document.getElementById('order-summary').style.display = 'block';

            document.getElementById('confirm-payment').addEventListener('click', function () {
                if (paymentMethod === "Online Payment") {
                    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
                    window.location.href = 'payment.html';
                } else {
                    alert("Order placed successfully! Please pay at the counter upon pickup.");
                    window.location.href = 'index.html';
                }
            });
        } else {
            alert("Please select at least one item.");
        }
    });

    // Owner login functionality
    document.getElementById('login-button').addEventListener('click', function () {
        const password = document.getElementById('owner-password').value;

        if (password === "owner123") {
            const orderDetailsSection = document.getElementById('order-details');
            orderDetailsSection.style.display = 'block';

            const ordersList = document.getElementById('orders-list');
            ordersList.innerHTML = '';

            const today = new Date().toISOString().split('T')[0];  // Get today's date

            const orders = JSON.parse(localStorage.getItem(today)) || [];

            orders.forEach(order => {
                const orderItem = document.createElement('li');
                orderItem.innerHTML = `
                    <strong>Order No:</strong> ${order.orderNumber}<br>
                    <strong>Items:</strong> ${order.items.join(', ')}<br>
                    <strong>Total Cost:</strong> ₹${order.totalCost}<br>
                    <strong>Pickup Code:</strong> ${order.pickupCode}<br>
                    <strong>Payment Method:</strong> ${order.paymentMethod}<br>
                    <strong>Status:</strong> <span class="status ${order.status === 'Delivered' ? 'delivered' : ''}">${order.status}</span>
                    <button class="mark-delivered" data-order-number="${order.orderNumber}">Mark as Delivered</button>
                `;
                ordersList.appendChild(orderItem);
            });

            document.querySelectorAll('.mark-delivered').forEach(button => {
                button.addEventListener('click', function () {
                    const orderNumber = this.getAttribute('data-order-number');
                    const orders = JSON.parse(localStorage.getItem(today));

                    const updatedOrders = orders.map(order => {
                        if (order.orderNumber == orderNumber) {
                            order.status = 'Delivered';  // Update status in localStorage
                        }
                        return order;
                    });

                    // Update the status in localStorage
                    localStorage.setItem(today, JSON.stringify(updatedOrders));

                    // Find the status element and update it
                    const statusElement = this.parentElement.querySelector('.status'); // Find the status element
                    statusElement.textContent = 'Delivered'; // Update the text to "Delivered"
                    statusElement.classList.add('delivered'); // Optional, if you want to add a class for styling

                    alert(`Order ${orderNumber} marked as delivered!`);
                });
            });
        } else {
            alert("Incorrect password. Please try again.");
        }
    });

});