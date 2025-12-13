import { IUser } from '../model/User';
interface RegisterUserDto {
    email: string;
    password: string;
    name: string;
    firm_name: string;
    role?: 'admin' | 'investor' | 'analyst';
}
export declare class AuthService {
    private readonly JWT_SECRET;
    private readonly REFRESH_SECRET;
    private readonly JWT_EXPIRE;
    private readonly REFRESH_EXPIRE;
    private readonly TOKEN_BLACKLIST_PREFIX;
    private readonly REFRESH_TOKEN_PREFIX;
    registerUser(userData: RegisterUserDto): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findUserByEmailWithPassword(email: string): Promise<IUser | null>;
    findUserById(userId: string): Promise<IUser | null>;
    findUserByIdWithPassword(userId: string): Promise<IUser | null>;
    generateAccessToken(userId: string): string;
    generateRefreshToken(userId: string): string;
    generateTokens(userId: string): {
        access: {
            token: string;
            expires: Date;
        };
        refresh: {
            token: string;
            expires: Date;
        };
    };
    verifyAccessToken(token: string): {
        userId: string;
    } | null;
    verifyRefreshToken(token: string): {
        userId: string;
    } | null;
    saveRefreshToken(userId: string, token: string): Promise<void>;
    getRefreshToken(userId: string): Promise<string | null>;
    deleteRefreshToken(userId: string): Promise<void>;
    blacklistToken(token: string): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    updateUserPreferences(userId: string, preferences: any): Promise<IUser>;
    validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
    };
    generatePasswordResetToken(userId: string): string;
    verifyPasswordResetToken(token: string): {
        userId: string;
    } | null;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map