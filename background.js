async function translateText(text) {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('Boş mətn tərcümə edilə bilməz');
        }

        console.log('Tərcümə sorğusu göndərilir:', text);
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|tr`;
        console.log('Sorğu URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP xətası: ${response.status}`);
        }

        const data = await response.json();
        console.log('API cavabı:', data);
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else if (data.responseStatus === 403) {
            return 'Gündəlik tərcümə limiti bitdi. Zəhmət olmasa sabah yenidən cəhd edin.';
        } else if (data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            throw new Error(data.responseDetails || 'Naməlum tərcümə xətası');
        }
    } catch (error) {
        console.error('Tərcümə xətası:', error);
        if (error.message.includes('fetch')) {
            return 'İnternet bağlantısını yoxlayın';
        }
        return `Tərcümə xətası: ${error.message}`;
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        translateText(request.text).then(translation => {
            chrome.tabs.sendMessage(sender.tab.id, {
                action: 'showTranslation',
                translation: translation
            });
        });
    }
}); 