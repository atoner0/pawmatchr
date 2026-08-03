import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAdopter } from "@/context/AdopterContext";

export default function ProtectedIndex() {
    const router = useRouter()
    const { refetch } = useAdopter();

    useEffect(() => {
        refetch().then((adopter) => {
            if (!adopter) {
                router.replace("/(protected)/questionnaire");
                return;
            }

            if (adopter.matches_reviewed) {
                router.replace("/(protected)/home");
            } else if (adopter.completed_at) {
                router.replace("/(protected)/matches/swipe");
            } else {
                router.replace("/(protected)/questionnaire")
            }
        })
    }, [])

    return null
}