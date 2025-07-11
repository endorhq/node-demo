function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    if (distance < 0) {
        document.getElementById('countdown-timer').style.display = 'none';
        document.getElementById('countdown-status').innerHTML = '🚀 LAUNCHED! 🚀';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').innerHTML = String(days).padStart(2, '0');
    document.getElementById('hours').innerHTML = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerHTML = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerHTML = String(seconds).padStart(2, '0');
    
    if (distance < 60000) { // Less than 1 minute
        document.getElementById('countdown-status').innerHTML = '🔥 T-minus ' + seconds + ' seconds! 🔥';
    } else if (distance < 3600000) { // Less than 1 hour
        document.getElementById('countdown-status').innerHTML = '⏰ Launch imminent! ⏰';
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);