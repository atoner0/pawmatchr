import { AccountFields } from "./adopter";
import { QuestionnaireInput } from "./questionnaireSchema";

export type AuthResponse = {
    token: string;
    user: AccountFields & Partial<QuestionnaireInput>;
}

