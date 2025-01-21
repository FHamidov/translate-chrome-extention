document.addEventListener('mouseup', function() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.runtime.sendMessage({
            action: 'translate',
            text: selectedText
        });
    }
});
document.addEventListener('mousedown', function() {
    const tooltip = document.getElementById('az-translation-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showTranslation') {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Əvvəlki tooltip-i təmizləyək
        const oldTooltip = document.getElementById('az-translation-tooltip');
        if (oldTooltip) {
            oldTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.id = 'az-translation-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: #333;
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 2px;
            right: 5px;
            cursor: pointer;
            font-size: 12px;
            color: #ccc;
        `;
        closeButton.addEventListener('click', () => tooltip.remove());

        const translationText = document.createElement('div');
        translationText.style.marginRight = '15px'; 
        translationText.textContent = message.translation;

        tooltip.appendChild(closeButton);
        tooltip.appendChild(translationText);
        document.body.appendChild(tooltip);

        tooltip.style.left = rect.left + window.scrollX + 'px';
        tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px';
    }
}); 