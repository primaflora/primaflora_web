export class StorageService {
    public static removeToken(key: TToken): void {
        localStorage.removeItem(key);
    }

    public static setToken(key: TToken, value: string): void {
        localStorage.setItem(key, value);
    }

    public static getToken(key: TToken): string | null {
        return localStorage.getItem(key);
    }
}

type TToken = 'accessToken' | 'refreshToken';
