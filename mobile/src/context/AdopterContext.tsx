import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { QuestionnaireResponse, AccountFields } from "@/types/adopter";

type AdopterContextType = {
    adopter: AccountFields | null;
    loading: boolean;
    refetch: () => Promise<AccountFields | null>;
}

const AdopterContext = createContext<AdopterContextType | undefined>(undefined);

export function AdopterProvider({ children }: { children: ReactNode }) {
    const [adopter, setAdopter] = useState<AccountFields | null>(null);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        try {
            const response = await apiFetch<QuestionnaireResponse>('/adopter/questionnaire');
            setAdopter(response.adopter);
            return response.adopter;
        } catch (err) {
            console.error("Failed to load adopter profile", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AdopterContext.Provider value={{ adopter, loading, refetch}}>
            {children}
        </AdopterContext.Provider>
    );
}

export function useAdopter() {
    const context = useContext(AdopterContext);
    if (!context) {
        throw new Error("useAdopter must be used within an AdopterProvider");
    }
    return context;
}