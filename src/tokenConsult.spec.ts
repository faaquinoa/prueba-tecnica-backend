//index.test.ts
/// <reference types="jest" />

import { EntityError } from "./context/shared/domain/EntityError";
import { EntityResponseAWS } from "./context/shared/domain/EntityResponseAWS";
import { DtoResponse } from "./context/token/consult/domain/DtoResponse";
import { Controller } from "./context/token/consult/infraestructure/Controller";

describe('Consult Token Test', () => {
    test('When Error in Authorization', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw2';
        let body: string = JSON.stringify({});
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('Autorización inválida');
    });

    test('When token property is missing in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({});
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetros de ingreso no presenta la propiedad token');
    });

    test('When token property is invalid in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ token: "123456789012345" });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetro de ingreso: token debe tener como mínimo 16 caracteres');
    });

    test('When token is invalid', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ token: "1234567890123456" });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('Token inválido');
    });

    test('When token is valid', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ token: "n1mvTStoWUYgDEIt" });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: DtoResponse = JSON.parse(data.body);

        expect(typeof response?.card_number).toBe('number');
        expect(typeof response?.expiration_year).toBe('string');
        expect(typeof response?.expiration_month).toBe('string');
        expect(typeof response?.email).toBe('string');
    });

});