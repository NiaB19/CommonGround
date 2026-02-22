 document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('chatbotBtn');
    const win = document.getElementById('chatWindow');
    const send = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    const msgs = document.getElementById('chatMessages');

    function appendMessage(text, who) {
        const d = document.createElement('div');
        d.className = 'msg ' + who;
        d.textContent = text;
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
    }

    async function askGemini(userText) {
        // 1. Add thinking bubble
        const typing = document.createElement('div');
        typing.className = 'msg assistant';
        typing.textContent = 'Thinking...';
        msgs.appendChild(typing);

        try {
            // 2. Point to your PHP file
          const response = await fetch('../backend/api/chat.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText })
});

            const data = await response.json();
            msgs.removeChild(typing); // Remove thinking

            if (data.status === 'success') {
                appendMessage(data.answer, 'assistant');
            } else {
                appendMessage("Error: " + data.message, 'assistant');
            }
        } catch (error) {
            if (typing.parentNode) msgs.removeChild(typing);
            appendMessage("Check terminal: Is PHP server running?", 'assistant');
        }
    }

    // Controls
    btn.onclick = () => { win.style.display = 'flex'; };
    document.getElementById('chatClose').onclick = () => { win.style.display = 'none'; };

    send.onclick = () => {
        const v = input.value.trim();
        if (!v) return;
        appendMessage(v, 'user');
        input.value = '';
        askGemini(v); // This calls the PHP function
    };
});