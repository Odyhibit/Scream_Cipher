// Create fixed mapping with careful attention to unique codes
const encodingMap = {
    'A': 'A',     // Simple A
    'B': 'Ȧ',     // A with dot above (U+0226)
    'C': 'Ą',     // A with ogonek (U+0104)
    'D': 'A\u0331',     // A with combining macron below (U+0331)
    'E': 'Á',     // A with acute (U+00C1)
    'F': 'A\u032e',     // A with combining breve below (U+032e)
    'G': 'A\u030b',     // A with combining double acute (U+030b)
    'H': 'A\u0330',     // A with combining tilde below (U+0330)
    'I': 'Ẳ',     // A with breve and hook above (U+1EB2)
    'J': 'A\u0315',     // A with comgining comma above right (U+0315)
    'K': 'Ạ',     // A with dot below (U+1EA0)
    'L': 'Ă',     // A with breve (U+0102)
    'M': 'Ǎ',     // A with caron (U+01CD)
    'N': 'Â',     // A with circumflex (U+00C2)
    'O': 'Å',     // A with ring above (U+00C5)
    'P': 'A\u032f',     // A with combining inverted breve below (U+032f)
    'Q': 'A\u0324',     // A with combining diaeresis below (U+0324)
    'R': 'Ȃ',     // A with inverted breve (U+0202)
    'S': 'Ã',     // A with tilde (U+00C3)
    'T': 'Ā',     // A with macron (U+0100)
    'U': 'Ä',     // A with diaeresis (U+00C4)
    'V': 'À',     // A with grave (U+00C0)
    'W': 'A\u030f',     // A with combining double grave (U+030f)
    'X': 'A\u036f',     // A with Combining Latin Small Letter X (U+036f)
    'Y': 'Ạ̦',     // A with dot below and comma below
    'Z': 'Ⱥ'      // A with stroke (U+023A)
};

// Creating a precise decoding map with context handling
function getDecodingMap() {
    // First, create a base decoding map
    const decodingMap = {};
    for (const [key, value] of Object.entries(encodingMap)) {
            decodingMap[value] = key;
    }
    return decodingMap;
}

const decodingMap = getDecodingMap();

// Auto-uppercase input as user types
document.getElementById('input').addEventListener('input', function(e) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(start, end);
});

// Encode function with position awareness
function encodeText() {
    const input = document.getElementById('input').value;
    let encoded = '';

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (encodingMap[char]) {
                encoded += encodingMap[char];
        } else {
            // Keep characters that don't have encodings (spaces, numbers, etc.)
            encoded += char;
        }
    }

    document.getElementById('output').value = encoded;
}

// Decode function with improved character disambiguation
function decodeText() {
    const input = document.getElementById('input').value;
    let decoded = '';

    for (let i = 0; i < input.length; i++) {
        // Check for marker characters
        if (input[i] === '\u200B') {
            // Handle multi-character sequences first (for Q and Y)
            let found = false;
            if (i + 1 < input.length) {
                const twoChars = input.substr(i, 2);
                if (twoChars === 'Ạ̇') {
                    decoded += 'Q';
                    i++; // Skip ahead
                    found = true;
                } else if (twoChars === 'Ạ̦') {
                    decoded += 'Y';
                    i++; // Skip ahead
                    found = true;
                }
            }
        }

        // If no multi-character match, try single character
         else {
            const char = input[i];
            if (decodingMap[char]) {
                    decoded += decodingMap[char];
            } else {
                // Keep characters that don't have decodings
                decoded += char;
            }
        }
    }

    document.getElementById('output').value = decoded;
}

// Function to swap input and output text
function swapText() {
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');

    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = temp;
}