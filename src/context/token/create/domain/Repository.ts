import { RepositoryGeneric } from "../../../shared/domain/RepositoryGeneric";
import { EntityToken } from "./EntityToken";
import { EnumCardType } from "../../../shared/domain/EnumCardType";

export interface Repository extends RepositoryGeneric {
    code(): string;

    getCardType(card_number: string): Promise<EnumCardType>;

    validateCVV(card_type: EnumCardType, cvv: string): Promise<void>;
    validateExpirationMonth(expiration_month: number): Promise<void>;
    validateExpirationYear(expiration_year: number): Promise<void>;
    validateEmail(email: string): Promise<void>;

    generateToken(client: any): Promise<string>;

    saveToken(client: any, session: any, params: EntityToken): Promise<void>;
};