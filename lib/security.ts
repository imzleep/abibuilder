import { UAParser } from "ua-parser-js";

/**
 * Safely parses the User-Agent string to extract browser and OS information.
 * This prevents raw User-Agent strings (which can contain SQL injection attacks)
 * from being stored directly in the database.
 * 
 * @param userAgent - The raw user-agent string from headers
 * @returns Object containing sanitized browser and OS names
 */
export function parseUserAgent(userAgent: string | null | undefined): { browser: string; os: string; full_ua: string } {
    if (!userAgent) {
        return { browser: "Unknown", os: "Unknown", full_ua: "Unknown" };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        browser: result.browser.name || "Unknown",
        os: result.os.name || "Unknown",
        // Truncate raw UA just in case we ever need to log it, but generally avoid doing so.
        // Limit to 255 chars as recommended by security best practices.
        full_ua: userAgent.slice(0, 255)
    };
}
