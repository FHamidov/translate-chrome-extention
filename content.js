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

        const oldTooltip = document.getElementById('az-translation-tooltip');
        if (oldTooltip) {
            oldTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.id = 'az-translation-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: white;
            color: #212529;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(0, 0, 0, 0.1);
            transition: opacity 0.2s ease-in-out;
            opacity: 0;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
        `;

        const title = document.createElement('div');
        title.textContent = 'Türkcə tərcümə';
        title.style.cssText = `
            font-weight: 500;
            color: #495057;
            font-size: 12px;
        `;

        const closeButton = document.createElement('span');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            cursor: pointer;
            color: #adb5bd;
            font-size: 14px;
            padding: 4px;
            line-height: 1;
            transition: color 0.2s ease;
        `;
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = '#495057';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#adb5bd';
        });
        closeButton.addEventListener('click', () => tooltip.remove());

        const translationText = document.createElement('div');
        translationText.style.cssText = `
            color: #212529;
            line-height: 1.5;
            font-size: 14px;
        `;
        translationText.textContent = message.translation;

        header.appendChild(title);
        header.appendChild(closeButton);
        tooltip.appendChild(header);
        tooltip.appendChild(translationText);
        document.body.appendChild(tooltip);

        const tooltipRect = tooltip.getBoundingClientRect();
        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 8;

        // Ekrandan kənara çıxmasın
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 16;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top + window.scrollY - tooltipRect.height - 8;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';

        // Animasiya
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
    }
}); 