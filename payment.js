document.addEventListener('DOMContentLoaded', function() {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    const orderSummary = document.getElementById('order-summary');

    if (lastOrder) {
        orderSummary.innerHTML =`Order No: ${lastOrder.orderNumber} <br> Items: ${lastOrder.items.join(', ')} <br> Total Cost: ₹${lastOrder.totalCost} <br> Pickup Code: ${lastOrder.pickupCode}`;
    }

    document.getElementById('pay-online').addEventListener('click', function() {
        const totalCost = lastOrder.totalCost; // Ensure lastOrder is defined and contains totalCost
        const upiId = "kavyadevi192@oksbi";  // Your UPI ID
        const transactionNote = "Canteen Order Payment";
    
        // Create UPI URL
        const upiUrl = `upi://pay?pa=${upiId}&pn=KAVYA%20DEVI%20NATTUDUR&am=${totalCost}&cu=INR&tn=${transactionNote.replace(/ /g, '%20')}`;
        
        // Redirect to Google Pay
        window.location.href = upiUrl; 
    });
    

    document.getElementById('cash-on-delivery').addEventListener('click', function() {
        alert("Thank you! You can pay at the counter on pickup.");
        window.location.href = 'index.html'; // Redirect back to the main page
    });
});