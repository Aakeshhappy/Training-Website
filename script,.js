// Utility to get and set cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const [key, val] = cookies[i].split('=');
        if (key === name) return val;
    }
    return null;
}

// Load user details and check if already present
window.onload = function () {
    const age = getCookie('age');
    const goal = getCookie('goal');
    const experience = getCookie('experience');
    const plan = getCookie('plan');

    if (age && goal && experience && plan) {
        displayPlan(plan, getCookie('timerDuration'));
    }
};

document.getElementById('generate-plan-btn').addEventListener('click', async function () {
    const age = document.getElementById('age-selector').value;
    const goal = document.getElementById('goal-selector').value;
    const experience = document.getElementById('experience-selector').value;

    const requestData = {
        age,
        goal,
        experience
    };

    // Mock ChatGPT API integration
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_API_KEY`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a fitness coach.'
                },
                {
                    role: 'user',
                    content: `Generate a 7-day fitness plan for age: ${age}, goal: ${goal}, experience level: ${experience}.`
                }
            ]
        })
    });

    const data = await response.json();
    const plan = data.choices[0].message.content;
    const timerDuration = 7 * 24 * 60 * 60; // Example: 7 days in seconds

    // Save details in cookies
    setCookie('age', age, 7);
    setCookie('goal', goal, 7);
    setCookie('experience', experience, 7);
    setCookie('plan', plan, 7);
    setCookie('timerDuration', timerDuration, 7);

    displayPlan(plan, timerDuration);
});

function displayPlan(plan, timerDuration) {
    document.getElementById('user-input-form').style.display = 'none';
    document.getElementById('plan-display').style.display = 'block';
    document.getElementById('generated-plan').innerText = plan;

    const timerElement = document.getElementById('timer');
    let timeLeft = timerDuration;

    const countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.innerText = 'Plan Completed!';
        } else {
            const days = Math.floor(timeLeft / (24 * 60 * 60));
            const hours = Math.floor((timeLeft % (24 * 60 * 60)) / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            timerElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            timeLeft--;
        }
    }, 1000);
}

