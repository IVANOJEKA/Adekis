/**
 * Payment Gateway Service
 * Handles card payment processing with support for multiple payment gateways
 * Currently implements simulated payments for development
 */

// Simulated card test numbers
export const TEST_CARDS = {
    VISA_SUCCESS: '4242424242424242',
    MASTERCARD_SUCCESS: '5555555555554444',
    VISA_DECLINED: '4000000000000002',
    INSUFFICIENT_FUNDS: '4000000000009995',
    EXPIRED_CARD: '4000000000000069'
};

/**
 * Detect card type from card number
 * @param {string} cardNumber - Card number
 * @returns {string} Card type (visa, mastercard, etc.)
 */
export const detectCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';

    return 'unknown';
};

/**
 * Validate card number using Luhn algorithm
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if valid
 */
export const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d+$/.test(cleaned)) return false;
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

/**
 * Validate expiry date
 * @param {string} month - Expiry month (MM)
 * @param {string} year - Expiry year (YY or YYYY)
 * @returns {boolean} True if valid and not expired
 */
export const validateExpiry = (month, year) => {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const fullYear = yearNum < 100 ? 2000 + yearNum : yearNum;

    if (fullYear < currentYear) return false;
    if (fullYear === currentYear && monthNum < currentMonth) return false;

    return true;
};

/**
 * Validate CVV
 * @param {string} cvv - CVV code
 * @param {string} cardType - Card type
 * @returns {boolean} True if valid
 */
export const validateCVV = (cvv, cardType) => {
    if (!/^\d+$/.test(cvv)) return false;

    const length = cvv.length;
    if (cardType === 'amex') return length === 4;
    return length === 3;
};

/**
 * Format card number with spaces
 * @param {string} cardNumber - Card number
 * @returns {string} Formatted card number
 */
export const formatCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
};

/**
 * Mask card number (show only last 4 digits)
 * @param {string} cardNumber - Card number
 * @returns {string} Masked card number
 */
export const maskCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return cardNumber;
    return '**** **** **** ' + cleaned.slice(-4);
};

/**
 * Simulate payment processing (for development)
 * In production, this would call real payment gateway APIs
 * 
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Payment result
 */
export const processCardPayment = async (paymentData) => {
    const {
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardholderName,
        amount,
        currency = 'UGX',
        description,
        metadata = {}
    } = paymentData;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate card details
    if (!validateCardNumber(cardNumber)) {
        return {
            success: false,
            error: 'Invalid card number',
            code: 'INVALID_CARD_NUMBER'
        };
    }

    if (!validateExpiry(expiryMonth, expiryYear)) {
        return {
            success: false,
            error: 'Card has expired or invalid expiry date',
            code: 'EXPIRED_CARD'
        };
    }

    const cardType = detectCardType(cardNumber);
    if (!validateCVV(cvv, cardType)) {
        return {
            success: false,
            error: 'Invalid CVV',
            code: 'INVALID_CVV'
        };
    }

    // Simulate different responses based on test card numbers
    const cleaned = cardNumber.replace(/\s/g, '');

    if (cleaned === TEST_CARDS.VISA_DECLINED || cleaned === TEST_CARDS.INSUFFICIENT_FUNDS) {
        return {
            success: false,
            error: cleaned === TEST_CARDS.INSUFFICIENT_FUNDS ? 'Insufficient funds' : 'Card declined by issuer',
            code: cleaned === TEST_CARDS.INSUFFICIENT_FUNDS ? 'INSUFFICIENT_FUNDS' : 'CARD_DECLINED',
            transactionId: generateTransactionId(),
            cardType,
            last4: cleaned.slice(-4)
        };
    }

    // Successful payment
    return {
        success: true,
        transactionId: generateTransactionId(),
        authorizationCode: generateAuthCode(),
        cardType,
        last4: cleaned.slice(-4),
        amount,
        currency,
        status: 'approved',
        gateway: 'simulated', // In production: 'flutterwave', 'paystack', etc.
        timestamp: new Date().toISOString(),
        metadata
    };
};

/**
 * Generate unique transaction ID
 * @returns {string} Transaction ID
 */
const generateTransactionId = () => {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

/**
 * Generate authorization code
 * @returns {string} Authorization code
 */
const generateAuthCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Verify transaction status (for webhooks/callbacks)
 * @param {string} transactionId - Transaction ID to verify
 * @returns {Promise<Object>} Transaction status
 */
export const verifyTransaction = async (transactionId) => {
    // In production, this would call the payment gateway API
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        transactionId,
        status: 'approved',
        verified: true
    };
};

/**
 * Refund a transaction
 * @param {string} transactionId - Transaction ID to refund
 * @param {number} amount - Amount to refund (optional, full refund if not specified)
 * @returns {Promise<Object>} Refund result
 */
export const refundTransaction = async (transactionId, amount = null) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        success: true,
        refundId: 'REF-' + Date.now(),
        transactionId,
        amount,
        status: 'refunded',
        timestamp: new Date().toISOString()
    };
};

// Export for potential future gateway integrations
export const SUPPORTED_GATEWAYS = {
    SIMULATED: 'simulated',
    FLUTTERWAVE: 'flutterwave',
    PAYSTACK: 'paystack',
    STRIPE: 'stripe',
    PESAPAL: 'pesapal'
};

export default {
    processCardPayment,
    verifyTransaction,
    refundTransaction,
    detectCardType,
    validateCardNumber,
    validateExpiry,
    validateCVV,
    formatCardNumber,
    maskCardNumber,
    TEST_CARDS,
    SUPPORTED_GATEWAYS
};
