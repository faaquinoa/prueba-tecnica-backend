import { ErrorObject } from "ajv";
import { EnumCardType } from "../domain/EnumCardType";

export class AdapterFunctionGeneric {
    public static decodeErrorAJV(error: ErrorObject<string, Record<string, any>>) {
        let parent = [];
        let error_message = '';

        parent = error.instancePath.split('/')
            .filter((row: string) => row.trim() !== '')
            .map(row => row.replace(/([A-Z0-9])/g, " $1").trim().toLowerCase());

        if (parent.length > 0) { error_message += `el campo ${parent.join(' de ')} `; }

        switch (error.keyword) {
            case 'required':
                error_message += `parámetros de ingreso no presenta la propiedad ${error.params.missingProperty.replace(/([A-Z0-9])/g, " $1").trim().toLowerCase()}`
                break;
            case 'type':
                error_message += `parámetros de ingreso  debe ser de tipo ${error.params.type}`;
                break;
            case 'additionalProperties':
                error_message = `parámetros de ingreso no debe poseer campos adicionales como ${error.params.additionalProperty}`;
                break;
            case 'minLength':
                error_message = `parámetro de ingreso: ${parent} debe tener como mínimo ${error.params.limit} caracteres`;
                break;
            case 'maxLength':
                error_message = `parámetro de ingreso: ${parent} debe tener como máximo ${error.params.limit} caracteres`;
                break;
            case 'length':
                error_message = `parámetro de ingreso: ${parent} debe tener ${error.params.limit} caracteres`;
                break;
            case 'minimum':
                error_message = `parámetro de ingreso: ${parent} debe tener como mínimo ${error.params.limit.toString().length} caracteres`;
                break;
            case 'maximum':
                error_message = `parámetro de ingreso: ${parent} debe tener como máximo ${error.params.limit.toString().length} caracteres`;
                break;
            default:
                error_message = `${error.params.type}`;
                break;
        }

        return error_message;
    }

    public static getCardType(card_number: string): EnumCardType {
        let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
        let mastercard = new RegExp('^5[1-5][0-9]{14}$');
        let amex = new RegExp('^3[47][0-9]{13}$');
        let diners = new RegExp('^3(?:0[0-5]|[68][0-9])[0-9]{11}$');

        let result: EnumCardType = visa.test(card_number)
            ? EnumCardType.VISA
            : mastercard.test(card_number)
                ? EnumCardType.MASTERCARD
                : amex.test(card_number)
                    ? EnumCardType["AMERICAN EXPRESS"]
                    : diners.test(card_number)
                        ? EnumCardType["DINERS CLUB"]
                        : EnumCardType.ERROR;

        return result;
    }

    public static randomString(longitud: number = 16): string {
        let chars: string = "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ12346789";
        let random: string = "";
        for (let i = 0; i < longitud; i++) {
            random += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return random;
    }

    public static isJSON(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
}