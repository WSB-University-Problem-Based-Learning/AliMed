import { apiService } from '../services/api';
import type { Dokument, LekarzWizytaSummary } from '../types/api';

export interface DoctorStats {
    wizyty: number;
    pacjenci: number;
    dokumentacja: number;
}

export const fetchDoctorStats = async (): Promise<DoctorStats> => {
    const dateOnly = new Date().toISOString().split('T')[0];

    const [wizytyTygodnia, pacjenci] = await Promise.all([
        apiService.getLekarzWizytyTydzien(dateOnly),
        apiService.getLekarzPacjenci(),
    ]);

    const countDocuments = async (wizyty: LekarzWizytaSummary[]) => {
        if (!wizyty.length) return 0;
        const docs = await Promise.all(
            wizyty.map(w => apiService.getDokumentyWizytyLekarz(w.wizytaId).catch(() => [] as Dokument[]))
        );
        return docs.reduce((sum, list) => sum + list.length, 0);
    };

    const dokumentyCount = await countDocuments(wizytyTygodnia);

    return {
        wizyty: wizytyTygodnia.length,
        pacjenci: pacjenci.length,
        dokumentacja: dokumentyCount,
    };
};
