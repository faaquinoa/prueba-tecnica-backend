import ajv, { ErrorObject, Schema, ValidateFunction } from 'ajv';
import { AdapterFunctionGeneric } from '../../../shared/infraestructure/AdapterFunctionGeneric';
import { DtoRequest } from "../domain/DtoRequest";

const AJV = new ajv({ removeAdditional: true, logger: false });

export class AdapterValidator {

    public static validateParams(params: DtoRequest) {
        let schema: Schema = {
            type: 'object',
            properties: {
                card_number: {
                    type: 'number',
                    minimum: 1000000000000,
                    maximum: 9999999999999999,
                },
                cvv: {
                    type: 'number',
                    minimum: 100,
                    maximum: 9999
                },
                expiration_month: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 2
                },
                expiration_year: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 4
                },
                email: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 100
                }
            },
            required: ['card_number', 'cvv', 'expiration_month', 'expiration_year', 'email'],
            additionalProperties: false
        };

        const validate: ValidateFunction<unknown> = AJV.compile(schema);
        const valid: boolean = validate(params);

        const message: ErrorObject<string, Record<string, any>> | null = validate.errors ? validate.errors[0] : null;

        const error = message !== null ? AdapterFunctionGeneric.decodeErrorAJV(message) : '';
        return { valid, error };
    }

}