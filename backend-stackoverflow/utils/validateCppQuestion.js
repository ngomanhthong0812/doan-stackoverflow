const { classify } = require('programming-language-classifier');

const cppKeywords = [
    'cout', 'cin', '#include', 'std::', '->', '::', 'template', 'vector<',
    'new ', 'delete ', 'int main', 'endl', 'using namespace std'
];

function extractCode(text) {
    const codeBlocks = [];
    const blockRegex = /```(?:cpp|c\+\+)?([\s\S]*?)```/g;
    let match;
    while ((match = blockRegex.exec(text)) !== null) {
        codeBlocks.push(match[1]);
    }
    return codeBlocks.join('\n').trim();
}

function validateCppQuestion(title, content) {
    const raw = `${title}\n${content}`;
    const code = extractCode(content);

    if (code.length > 0) {
        const result = classify(code); // result là array
        console.log('[DEBUG] classify:', result);

        if (Array.isArray(result) && result.length > 0) {
            const lang = result[0].language || '';
            console.log('[DEBUG] Detected language:', lang);

            if (['c++', 'c'].includes(lang.toLowerCase())) return true;
        }

        // Nếu không nhận ra ngôn ngữ → fallback từ khóa
        const lower = raw.toLowerCase();
        return cppKeywords.some(k => lower.includes(k));
    }

    // Không có code → fallback
    const lower = raw.toLowerCase();
    return cppKeywords.some(k => lower.includes(k));
}

module.exports = validateCppQuestion;
