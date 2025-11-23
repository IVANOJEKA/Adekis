import React, { createContext, useContext, useState } from 'react';

// Currency definitions with symbols and formatting
export const currencies = [
    { code: 'UGX', name: 'Uganda Shilling', symbol: 'UGX', locale: 'en-UG', decimals: 0 },
    { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', decimals: 2 },
    { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', decimals: 2 },
    { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', decimals: 2 },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'UGX', locale: 'en-UG', decimals: 0 },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', locale: 'en-TZ', decimals: 0 },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'RWF', locale: 'en-RW', decimals: 0 },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA', decimals: 2 },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', locale: 'en-NG', decimals: 2 },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', locale: 'en-GH', decimals: 2 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', decimals: 2 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN', decimals: 2 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', decimals: 0 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', decimals: 2 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', decimals: 2 },
];

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]); // Default to UGX

    const formatCurrency = (amount, showSymbol = true) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return showSymbol ? `${selectedCurrency.symbol} 0` : '0';
        }

        const formattedAmount = new Intl.NumberFormat(selectedCurrency.locale, {
            minimumFractionDigits: selectedCurrency.decimals,
            maximumFractionDigits: selectedCurrency.decimals,
        }).format(amount);

        return showSymbol ? `${selectedCurrency.symbol} ${formattedAmount}` : formattedAmount;
    };

    const changeCurrency = (currencyCode) => {
        const currency = currencies.find(c => c.code === currencyCode);
        if (currency) {
            setSelectedCurrency(currency);
            // Optionally save to localStorage
            localStorage.setItem('selectedCurrency', currencyCode);
        }
    };

    // Load saved currency on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved) {
            const currency = currencies.find(c => c.code === saved);
            if (currency) {
                setSelectedCurrency(currency);
            }
        }
    }, []);

    return (
        <CurrencyContext.Provider value={{
            selectedCurrency,
            changeCurrency,
            formatCurrency,
            currencies
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
