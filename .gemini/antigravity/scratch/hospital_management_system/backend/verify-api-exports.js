// Script to verify there are no duplicate API exports in api.js
const fs = require('fs');
const path = require('path');

const apiFile = path.join(__dirname, '..', 'src', 'services', 'api.js');
const content = fs.readFileSync(apiFile, 'utf-8');

// Find all export const declarations
const exportRegex = /export const (\w+API)/g;
const apiExports = [];
let match;

while ((match = exportRegex.exec(content)) !== null) {
    apiExports.push(match[1] + 'API');
}

console.log('===== API Exports Found =====');
console.log('Total exports:', apiExports.length);
console.log('\nList of all API exports:');
apiExports.forEach((exp, idx) => {
    console.log(`  ${idx + 1}. ${exp}`);
});

// Check for duplicates
const duplicates = apiExports.filter((item, index) => apiExports.indexOf(item) !== index);
if (duplicates.length > 0) {
    console.log('\n❌ DUPLICATES FOUND:');
    duplicates.forEach(dup => console.log(`  - ${dup}`));
} else {
    console.log('\n✅ NO DUPLICATES - ALL EXPORTS ARE UNIQUE');
}

// Specifically check maternityAPI
const maternityCount = apiExports.filter(e => e === 'maternityAPI').length;
console.log(`\nMaternityAPI count: ${maternityCount}`);
if (maternityCount === 1) {
    console.log('✅ maternityAPI is declared exactly ONCE (correct)');
} else if (maternityCount === 0) {
    console.log('❌ maternityAPI NOT FOUND');
} else {
    console.log(`❌ maternityAPI is declared ${maternityCount} times (ERROR)`);
}
