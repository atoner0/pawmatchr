import { AccountFields } from "./adopter";
import { QuestionnaireInput } from "./questionnaireSchema";

export type AuthResponse = {
    token: string;
    adopter: AccountFields & Partial<QuestionnaireInput>;
}

