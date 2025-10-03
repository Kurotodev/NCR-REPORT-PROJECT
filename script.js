function initializeCustomerNotification() {
    document.querySelectorAll('input[name="customernotification"]').forEach(radio => {
      radio.addEventListener('change', function() {
          console.log('Radio button changed to:', this.value);
            const messageArea = document.getElementById('customerMessageArea');
            messageArea.style.display = this.value === 'yes' ? 'block' : 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCustomerNotification();
});