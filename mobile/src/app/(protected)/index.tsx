import { useEffect } from "react";
import { useRouter } from "expo-router";
import { apiFetch } from "@/lib/api";
import { QuestionnaireResponse } from "@/types/adopter";

export default function ProtectedIndex() {
    const router = useRouter()
    console.log("1: component rendering")

    useEffect(() => {
        console.log("2: effect running")
        apiFetch<QuestionnaireResponse>('/adopter/questionnaire')
            .then((response) => {
                console.log("3: got response", response)
                if (response.adopter.completed_at) {
                    router.replace('/(protected)/matches/swipe')
                } else {
                    router.replace('/(protected)/questionnaire')
                }
            })
            .catch((err) => {
                console.log("4: caught error", err)
                router.replace('/(protected)/questionnaire')
            })
    }, [])

    return null
}