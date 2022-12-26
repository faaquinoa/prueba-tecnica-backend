import ajv, { ErrorObject, Schema, ValidateFunction } from 'ajv';
import { AdapterFunctionGeneric } from '../../../shared/infraestructure/AdapterFunctionGeneric';
import { DtoRequest } from "../domain/DtoRequest";

const AJV = new ajv({ removeAdditional: true, logger: false });

export class AdapterValidator {

    public static validateParams(params: DtoRequest) {
        let schema: Schema = {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    minLength: 16,
                    maxLength: 16
                }
            },
            required: ['token'],
            additionalProperties: false
        };

        const validate: ValidateFunction<unknown> = AJV.compile(schema);
        const valid: boolean = validate(params);

        const message: ErrorObject<string, Record<string, any>> | null = validate.errors ? validate.errors[0] : null;

        const error = message !== null ? AdapterFunctionGeneric.decodeErrorAJV(message) : '';
        return { valid, error };
    }

}