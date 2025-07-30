function updateTimer() {
    const now = new Date();

    const target = new Date();
    target.setFullYear(2025);
    target.setMonth(7); 
    target.setDate(15);
    target.setHours(21, 0, 0, 0);

    if (now > target) {
        target.setDate(target.getDate() + 1);
    }

    const diff = target - now;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    console.log(`${days}D ${hours}H ${minutes}M ${seconds}S`);
}

updateTimer();
const interval = setInterval(updateTimer, 1000);