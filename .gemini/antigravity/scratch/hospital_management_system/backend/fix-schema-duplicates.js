const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

console.log('Reading schema.prisma...');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Step 1: Remove all duplicate Wallet and WalletTransaction model definitions
// Keep only the first occurrence (should be around line 71-109)
const walletModelRegex = /model Wallet \{[\s\S]*?\n\}/g;
const walletTransactionModelRegex = /model WalletTransaction \{[\s\S]*?\n\}/g;

const walletMatches = Array.from(schema.matchAll(walletModelRegex));
const walletTransactionMatches = Array.from(schema.matchAll(walletTransactionModelRegex));

console.log(`Found ${walletMatches.length} Wallet model(s)`);
console.log(`Found ${walletTransactionMatches.length} WalletTransaction model(s)`);

// Remove all Wallet models except the first one
if (walletMatches.length > 1) {
    console.log('Removing duplicate Wallet models...');
    for (let i = walletMatches.length - 1; i > 0; i--) {
        schema = schema.replace(walletMatches[i][0], '');
    }
}

// Remove all WalletTransaction models except the first one
if (walletTransactionMatches.length > 1) {
    console.log('Removing duplicate WalletTransaction models...');
    for (let i = walletTransactionMatches.length - 1; i > 0; i--) {
        schema = schema.replace(walletTransactionMatches[i][0], '');
    }
}

// Step 2: Remove duplicate wallet relations in Hospital model
// Check if Hospital model has duplicate wallet fields
const hospitalModelRegex = /model Hospital \{([\s\S]*?)\n\}/;
const hospitalMatch = schema.match(hospitalModelRegex);

if (hospitalMatch) {
    let hospitalBody = hospitalMatch[1];
    const walletsLineCount = (hospitalBody.match(/wallets\s+Wallet\[\]/g) || []).length;
    const walletTransactionsLineCount = (hospitalBody.match(/walletTransactions\s+WalletTransaction\[\]/g) || []).length;

    console.log(`Found ${walletsLineCount} 'wallets' field(s) in Hospital model`);
    console.log(`Found ${walletTransactionsLineCount} 'walletTransactions' field(s) in Hospital model`);

    if (walletsLineCount > 1) {
        console.log('Removing duplicate wallets field from Hospital...');
        let firstFound = false;
        hospitalBody = hospitalBody.replace(/(\s+wallets\s+Wallet\[\])/g, (match) => {
            if (!firstFound) {
                firstFound = true;
                return match;
            }
            return '';
        });
    }

    if (walletTransactionsLineCount > 1) {
        console.log('Removing duplicate walletTransactions field from Hospital...');
        let firstFound = false;
        hospitalBody = hospitalBody.replace(/(\s+walletTransactions\s+WalletTransaction\[\])/g, (match) => {
            if (!firstFound) {
                firstFound = true;
                return match;
            }
            return '';
        });
    }

    schema = schema.replace(hospitalModelRegex, `model Hospital {${hospitalBody}\n}`);
}

// Clean up extra blank lines
schema = schema.replace(/\n{3,}/g, '\n\n');

// Write back to file
fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log('✅ Schema cleaned successfully!');
