export function generateURL(email: string, tier: number) {
    const baseUrl = 'http://localhost:3000'
    const params = `email=${encodeURIComponent(email)}&tier=${encodeURIComponent(String(tier))}`;
    return `${baseUrl}/?${params}`;
    }

