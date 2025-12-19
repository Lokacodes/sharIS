export const formatPhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    let formatted = digits;

    // Example: format as 4-4-4 (0812-3456-7890)
    if (digits.length > 4 && digits.length <= 8) {
        formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else if (digits.length > 8) {
        formatted = `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
    }

    return formatted;
};

/**
 * Sanitize a phone number.
 *
 * - strips non-digit characters (keeps a leading '+' if present)
 * - normalizes leading 0 to the provided country code (default "62")
 * - returns either international (+countryCode...) or national (digits only) form
 *
 * Examples:
 *  sanitizePhoneNumber("0812-3456-7890") -> "+6281234567890"
 *  sanitizePhoneNumber("+62 812 3456 7890") -> "+6281234567890"
 *  sanitizePhoneNumber("6281234567890", { international: false }) -> "6281234567890"
 */
export const sanitizePhoneNumber = (value, options = {}) => {
    const { countryCode = "62", international = true } = options;
    if (!value && value !== 0) return "";

    let s = String(value).trim();

    // preserve leading + if present, remove other non-digits
    const hasPlus = s.startsWith("+");
    s = s.replace(/\D/g, "");
    if (hasPlus) s = `+${s}`;

    // If starts with +, assume it's already international
    if (s.startsWith("+")) {
        // Ensure it has the country code if requested (if not, return as-is)
        return international ? s : s.slice(1);
    }

    // now s contains only digits
    if (s.startsWith(countryCode)) {
        return international ? `+${s}` : s;
    }

    if (s.startsWith("0")) {
        const rest = s.slice(1);
        return international ? `+${countryCode}${rest}` : s;
    }

    // fallback: assume local missing leading 0, prefix with countryCode
    return international ? `+${countryCode}${s}` : `${countryCode}${s}`;
};

export default { formatPhone, sanitizePhoneNumber };