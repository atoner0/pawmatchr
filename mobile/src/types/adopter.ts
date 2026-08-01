import { QuestionnaireInput } from "./questionnaireSchema";

export type AccountFields = {
    adopter_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    postcode: string
}

export type QuestionnaireResponse = {
    adopter: AccountFields & QuestionnaireInput
}