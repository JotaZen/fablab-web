import { getVesselToken, getVesselUrl } from '@/features/inventory/actions/token-settings.actions';
// import 'server-only';

export async function getServerVesselToken(): Promise<string | null> {
    try {
        return await getVesselToken();
    } catch (e) {
        return null;
    }
}

export async function getServerVesselUrl(): Promise<string | null> {
    try {
        return await getVesselUrl();
    } catch (e) {
        return null;
    }
}
