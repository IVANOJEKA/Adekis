const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

console.log('Reading schema.prisma...');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Step 1: Remove all duplicate Wallet, WalletTransaction, Ward, Bed, Admission model definitions
// Keep only the first occurrence
const models = ['Wallet', 'WalletTransaction', 'Ward', 'Bed', 'Admission'];

models.forEach(modelName => {
    const regex = new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`, 'g');
    const matches = Array.from(schema.matchAll(regex));

    console.log(`Found ${matches.length} ${modelName} model(s)`);

    if (matches.length > 1) {
        console.log(`Removing duplicate ${modelName} models...`);
        // Keep the LAST match (usually the most complete one if appended), remove others
        // Actually, let's keep the FIRST match to be safe, or check which one is better.
        // For now, keeping the LAST match as I just appended the correct ones.
        for (let i = 0; i < matches.length - 1; i++) {
            schema = schema.replace(matches[i][0], '');
        }
    }
});

// Step 2: Remove duplicate relations in Hospital model
const hospitalModelRegex = /model Hospital \{([\s\S]*?)\n\}/;
const hospitalMatch = schema.match(hospitalModelRegex);

if (hospitalMatch) {
    let hospitalBody = hospitalMatch[1];

    const fields = ['wallets', 'walletTransactions', 'wards', 'beds', 'admissions'];

    fields.forEach(field => {
        // Regex to match the field definition line
        // e.g. "  wallets Wallet[]"
        const fieldRegex = new RegExp(`\\s+${field}\\s+[A-Za-z]+\\[\\]`, 'g');
        const matches = hospitalBody.match(fieldRegex) || [];

        console.log(`Found ${matches.length} '${field}' field(s) in Hospital model`);

        if (matches.length > 1) {
            console.log(`Removing duplicate ${field} field from Hospital...`);
            let firstFound = false;
            hospitalBody = hospitalBody.replace(fieldRegex, (match) => {
                if (!firstFound) {
                    firstFound = true;
                    return match;
                }
                return '';
            });
        }
    });

    schema = schema.replace(hospitalModelRegex, `model Hospital {${hospitalBody}\n}`);
}

// Clean up extra blank lines
schema = schema.replace(/\n{3,}/g, '\n\n');

// Write back to file
fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log('✅ Schema cleaned successfully!');
