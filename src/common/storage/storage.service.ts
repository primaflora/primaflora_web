// TODO: save tokens in cookies !!!!

export class StorageService {
    private static languageKey = 'language';

    public static removeToken(key: TToken): void {
        localStorage.removeItem(key);
    }
    public static setToken(key: TToken, value: string): void {
        localStorage.setItem(key, value);
    }
    public static getToken(key: TToken): string | null {
        return localStorage.getItem(key);
    }

    public static setLanguage(language: string): void {
        localStorage.setItem(this.languageKey, language);
    }
    public static getLanguage(): string | null {
        return localStorage.getItem(this.languageKey);
    }
}

type TToken = 'accessToken' | 'refreshToken';
