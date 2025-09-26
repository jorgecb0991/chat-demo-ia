import { getGoogleAuthUrl, authenticateAndGetSettings } from "horus-auth-client";
import { HORUS_CONFIG } from "@/config/horus";

export class HorusAuthService {
    static async getGoogleUrl() {
        return getGoogleAuthUrl(
            HORUS_CONFIG.baseUrl,
            HORUS_CONFIG.clientId,
            HORUS_CONFIG.applicationId,
            HORUS_CONFIG.redirectUri
        );
    }

    static async authenticate(authorizationCode: string) {
        return authenticateAndGetSettings(
            HORUS_CONFIG.baseUrl,
            HORUS_CONFIG.clientId,
            HORUS_CONFIG.applicationId,
            authorizationCode
        );
    }
}
