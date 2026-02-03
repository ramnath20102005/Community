/**
 * CONTENT MODERATION UTILITY
 * Rule-based system for filtering inappropriate content
 * No ML/AI - Hackathon friendly string matching
 */

const BANNED_KEYWORDS = {
    explicit: [
        'sex', 'porn', 'nude', 'xxx', 'blowjob', 'sexvideo', 'erotic', 'naked', 'pornography'
    ],
    profanity: [
        'fuck', 'bitch', 'asshole', 'bastard', 'shit', 'motherfucker', 'dick', 'pussy'
    ],
    hateSpeech: [
        'racist', 'casteist', 'terrorist', 'nazi', 'hate', 'discrimination', 'religious abuse', 'caste abuse','bitch'
    ],
    scam: [
        'easy money', 'quick cash', 'pay to join', 'earn fast', 'become rich quick', 'lottery winner', 'investment double'
    ],
    suspiciousLinks: [
        't.me/', 'chat.whatsapp.com/', 'bit.ly/scam', 'tinyurl.com/scam', 'telegram link', 'whatsapp group link'
    ]
};

/**
 * Scans text against the banned keywords library
 * Returns an object with { isSafe: boolean, reason: string | null }
 */
const validateContent = (text) => {
    if (!text) return { isSafe: true, reason: null };

    const lowerText = text.toLowerCase();

    for (const category in BANNED_KEYWORDS) {
        for (const keyword of BANNED_KEYWORDS[category]) {
            // Use word boundary check for keywords to avoid partial matches (e.g., "assessment" shouldn't trigger "ass")
            // For links, we don't use word boundaries
            const isLink = category === 'suspiciousLinks';
            const regex = isLink 
                ? new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
                : new RegExp(`\\b${keyword}\\b`, 'i');

            if (regex.test(lowerText)) {
                let reason = "Inappropriate content detected.";
                if (category === 'explicit') reason = "Explicit content is not allowed.";
                if (category === 'profanity') reason = "Abusive language is not allowed.";
                if (category === 'hateSpeech') reason = "Hate speech or discriminatory terms are not allowed.";
                if (category === 'scam') reason = "Potential scam or fraud-related content detected.";
                if (category === 'suspiciousLinks') reason = "External messenger or suspicious links are not allowed.";
                
                return { isSafe: false, reason };
            }
        }
    }

    return { isSafe: true, reason: null };
};

module.exports = {
    validateContent,
    BANNED_KEYWORDS
};
