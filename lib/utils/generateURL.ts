export function generateURL(id: string, email: string) {
    const baseUrl = 'http://localhost:3000'
    const params = `referral=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`;
    return `${baseUrl}/signup/?${params}`;
    }

