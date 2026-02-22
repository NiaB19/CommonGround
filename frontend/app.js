document.addEventListener('DOMContentLoaded', () => {
    const btn   = document.getElementById('chatbotBtn');
    const win   = document.getElementById('chatWindow');
    const send  = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    const msgs  = document.getElementById('chatMessages');

    function appendMessage(text, who) {
        const d = document.createElement('div');
        d.className = 'msg ' + who;
        d.textContent = text;
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
    }

    async function askGemini(userText) {
        const typing = document.createElement('div');
        typing.className = 'msg assistant';
        typing.textContent = 'Thinking...';
        msgs.appendChild(typing);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            const data = await response.json();
            if (typing.parentNode) msgs.removeChild(typing);

            if (data.status === 'success') {
                appendMessage(data.response, 'assistant');
            } else {
                appendMessage('⚠️ ' + (data.message || 'Unknown error.'), 'assistant');
            }
        } catch (error) {
            if (typing.parentNode) msgs.removeChild(typing);
            appendMessage('❌ ' + error.message, 'assistant');
            console.error(error);
        }
    }

    btn.onclick = () => { win.style.display = 'flex'; };
    document.getElementById('chatClose').onclick = () => { win.style.display = 'none'; };

    send.onclick = sendMessage;
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    function sendMessage() {
        const v = input.value.trim();
        if (!v) return;
        appendMessage(v, 'user');
        input.value = '';
        askGemini(v);
    }
});