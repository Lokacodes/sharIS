/**
 * Format a number into a localized currency/number string.
 *
 * Usage:
 *   formatCurrency(1234567); // "Rp1.234.567" (default id-ID, IDR)
 *   formatCurrency(1234.5, { locale: 'en-US', currency: 'USD' }); // "$1,234.50"
 *
 * @param {number|string} value - value to format
 * @param {Object} [opts]
 * @param {string} [opts.locale='id-ID'] - BCP 47 locale
 * @param {string} [opts.currency='IDR'] - ISO 4217 currency code
 * @param {'currency'|'decimal'|'percent'} [opts.style='currency']
 * @param {number} [opts.minimumFractionDigits]
 * @param {number} [opts.maximumFractionDigits]
 * @param {boolean} [opts.useGrouping=true]
 * @returns {string} formatted string (or empty string for invalid input)
 */
function formatCurrency(value, opts = {}) {
    const {
        locale = 'id-ID',
        currency = 'IDR',
        style = 'currency',
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping = true,
    } = opts;

    if (value === null || value === undefined || value === '') return '';

    // Normalize input: accept numbers or numeric strings (strip non-numeric symbols except . and -)
    const normalized =
        typeof value === 'number'
            ? value
            : Number(String(value).replace(/,/g, '').replace(/[^\d.-]/g, ''));

    if (!isFinite(normalized)) return '';

    const nfOptions = { style, useGrouping };
    if (style === 'currency') nfOptions.currency = currency;
    if (typeof minimumFractionDigits === 'number') nfOptions.minimumFractionDigits = minimumFractionDigits;
    if (typeof maximumFractionDigits === 'number') nfOptions.maximumFractionDigits = maximumFractionDigits;

    try {
        return new Intl.NumberFormat(locale, nfOptions).format(normalized);
    } catch (e) {
        // Fallback for environments without Intl or on error
        const frac = typeof maximumFractionDigits === 'number'
            ? maximumFractionDigits
            : (typeof minimumFractionDigits === 'number' ? minimumFractionDigits : 0);
        const fixed = Number(normalized).toFixed(frac);
        if (style === 'currency') return `${currency} ${fixed}`;
        return fixed;
    }
}

export default formatCurrency;
export { formatCurrency };