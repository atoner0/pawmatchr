import { apiFetch } from "./api";
import { Application, ApplicationWithDetails } from "@/types/application";

export const getApplications = async (): Promise<ApplicationWithDetails[]> => {
    const response = await apiFetch<{applications: ApplicationWithDetails[]}>("/adopter/applications");
    return response.applications
}

export const getApplicationById = async (id: number): Promise<ApplicationWithDetails> => {
    const response = await apiFetch<{application: ApplicationWithDetails}>(`/adopter/applications/${id}`)
    return response.application
}

export const createApplication = async (dog_id: number): Promise<Application> => {
    const response = await apiFetch<{ application: Application }>("/adopter/applications", {
        method: "POST",
        body: JSON.stringify({ dog_id })
    })
    return response.application
} 

export const updateChecklist = async (id: number, readiness_checklist: boolean): Promise<ApplicationWithDetails> => {
    const response = await apiFetch<{ application: ApplicationWithDetails }>(`/adopter/applications/${id}/checklist`, {
        method: "PATCH",
        body: JSON.stringify({ readiness_checklist })
    })
    return response.application
}

export const withdrawApplication = async (id: number): Promise<ApplicationWithDetails> => {
    const response = await apiFetch<{ application: ApplicationWithDetails }>(`/adopter/applications/${id}/withdraw`, {
        method: "PATCH"
    })
    return response.application
}