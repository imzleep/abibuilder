import { UAParser } from "ua-parser-js";

export type ParsedUA = {
    browser: string;
    os: string;
    full_ua: string;
};

export function parseUserAgent(
    userAgent: string | null | undefined
): ParsedUA {
    if (!userAgent) {
        return {
            browser: "Unknown",
            os: "Unknown",
            full_ua: "Unknown",
        };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        browser: result.browser.name || "Unknown",
        os: result.os.name || "Unknown",
        full_ua: userAgent.slice(0, 255),
    };
}
