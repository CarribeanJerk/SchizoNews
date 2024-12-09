const allowedDomains: string[] = ['cnn.com', 'foxnews.com', 'bbc.com', 'nytimes.com', 'theguardian.com', 'reuters.com', 'apnews.com', 'aljazeera.com', 'bloomberg.com', 'huffpost.com'];

export function isValidDomain(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return allowedDomains.includes(parsedUrl.hostname);
    } catch {
        return false;
    }
}