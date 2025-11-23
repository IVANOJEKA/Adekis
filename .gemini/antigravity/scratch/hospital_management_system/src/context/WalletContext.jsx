import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    // Initialize wallet balances from localStorage
    const [walletBalances, setWalletBalances] = useState(() => {
        const saved = localStorage.getItem('hmsWalletBalances');
        return saved ? JSON.parse(saved) : {};
    });

    // Initialize wallet transactions from localStorage
    const [walletTransactions, setWalletTransactions] = useState(() => {
        const saved = localStorage.getItem('hmsWalletTransactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist wallet balances to localStorage
    useEffect(() => {
        localStorage.setItem('hmsWalletBalances', JSON.stringify(walletBalances));
    }, [walletBalances]);

    // Persist wallet transactions to localStorage
    useEffect(() => {
        localStorage.setItem('hmsWalletTransactions', JSON.stringify(walletTransactions));
    }, [walletTransactions]);

    /**
     * Get wallet balance for a patient
     * @param {string} patientId - Patient ID
     * @returns {number} Current balance
     */
    const getBalance = (patientId) => {
        return walletBalances[patientId] || 0;
    };

    /**
     * Add funds to wallet
     * @param {string} patientId - Patient ID
     * @param {number} amount - Amount to add
     * @param {string} method - Payment method used (Cash, Mobile Money, Card, etc.)
     * @param {string} reference - Transaction reference
     */
    const topUpWallet = (patientId, amount, method = 'Cash', reference = '') => {
        const transaction = {
            id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            patientId,
            type: 'credit',
            amount,
            method,
            reference,
            description: 'Wallet Top-up',
            timestamp: new Date().toISOString(),
            balanceAfter: (walletBalances[patientId] || 0) + amount
        };

        setWalletBalances(prev => ({
            ...prev,
            [patientId]: (prev[patientId] || 0) + amount
        }));

        setWalletTransactions(prev => [transaction, ...prev]);

        return transaction;
    };

    /**
     * Deduct funds from wallet for payment
     * @param {string} patientId - Patient ID
     * @param {number} amount - Amount to deduct
     * @param {string} description - Payment description
     * @param {string} referenceId - Bill/Invoice ID
     * @returns {object|null} Transaction object if successful, null if insufficient funds
     */
    const deductFromWallet = (patientId, amount, description = 'Payment', referenceId = '') => {
        const currentBalance = walletBalances[patientId] || 0;

        if (currentBalance < amount) {
            return null; // Insufficient funds
        }

        const transaction = {
            id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            patientId,
            type: 'debit',
            amount,
            method: 'HMS Wallet',
            reference: referenceId,
            description,
            timestamp: new Date().toISOString(),
            balanceAfter: currentBalance - amount
        };

        setWalletBalances(prev => ({
            ...prev,
            [patientId]: currentBalance - amount
        }));

        setWalletTransactions(prev => [transaction, ...prev]);

        return transaction;
    };

    /**
     * Get wallet transaction history for a patient
     * @param {string} patientId - Patient ID
     * @param {number} limit - Number of transactions to return (0 = all)
     * @returns {array} Array of transactions
     */
    const getTransactions = (patientId, limit = 0) => {
        const patientTransactions = walletTransactions.filter(t => t.patientId === patientId);
        return limit > 0 ? patientTransactions.slice(0, limit) : patientTransactions;
    };

    /**
     * Get total wallet statistics
     * @returns {object} Statistics object
     */
    const getWalletStats = () => {
        const totalWallets = Object.keys(walletBalances).length;
        const totalBalance = Object.values(walletBalances).reduce((sum, bal) => sum + bal, 0);
        const totalTransactions = walletTransactions.length;
        const totalCredits = walletTransactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalDebits = walletTransactions
            .filter(t => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalWallets,
            totalBalance,
            totalTransactions,
            totalCredits,
            totalDebits
        };
    };

    /**
     * Check if patient has sufficient wallet balance
     * @param {string} patientId - Patient ID
     * @param {number} amount - Amount to check
     * @returns {boolean} True if sufficient balance
     */
    const hasSufficientBalance = (patientId, amount) => {
        return (walletBalances[patientId] || 0) >= amount;
    };

    /**
     * Process payment using wallet
     * @param {string} patientId - Patient ID
     * @param {number} amount - Payment amount
     * @param {string} billId - Bill/Invoice ID
     * @param {string} description - Payment description
     * @returns {object} { success: boolean, transaction: object|null, message: string }
     */
    const processWalletPayment = (patientId, amount, billId, description) => {
        if (!hasSufficientBalance(patientId, amount)) {
            return {
                success: false,
                transaction: null,
                message: `Insufficient wallet balance. Available: UGX ${getBalance(patientId).toLocaleString()}, Required: UGX ${amount.toLocaleString()}`
            };
        }

        const transaction = deductFromWallet(patientId, amount, description, billId);

        return {
            success: true,
            transaction,
            message: 'Payment successful via HMS Wallet'
        };
    };

    const value = {
        walletBalances,
        walletTransactions,
        getBalance,
        topUpWallet,
        deductFromWallet,
        getTransactions,
        getWalletStats,
        hasSufficientBalance,
        processWalletPayment
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext;
