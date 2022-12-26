//index.test.ts
/// <reference types="jest" />

import { EntityError } from "./context/shared/domain/EntityError";
import { EntityResponseAWS } from "./context/shared/domain/EntityResponseAWS";
import { DtoResponse } from "./context/token/create/domain/DtoResponse";
import { Controller } from "./context/token/create/infraestructure/Controller";

describe('Create Token Test', () => {
    test('When Error in Authorization', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw2';
        let body: string = JSON.stringify({});
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('Autorización inválida');
    });

    test('When card_number property is missing in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({});
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetros de ingreso no presenta la propiedad card_number');
    });

    test('When cvv property is missing in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 123456789 });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetros de ingreso no presenta la propiedad cvv');
    });

    test('When expiration_month property is missing in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 123456789, cvv: 12 });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetros de ingreso no presenta la propiedad expiration_month');
    });

    test('When expiration_year property is missing in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 123456789, cvv: 12, expiration_month: '22' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetros de ingreso no presenta la propiedad expiration_year');
    });

    test('When email property is missing in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 123456789, cvv: 12, expiration_month: '22', expiration_year: '1111' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetros de ingreso no presenta la propiedad email');
    });

    test('When card_number property is not in the correct format in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 123456789, cvv: 12, expiration_month: '22', expiration_year: '1111', email: 'faa' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetro de ingreso: card_number debe tener como mínimo 13 caracteres');
    });

    test('When cvv property is not in the correct format in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 4215478569853, cvv: 12, expiration_month: '22', expiration_year: '1111', email: 'faa' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetro de ingreso: cvv debe tener como mínimo 3 caracteres');
    });

    test('When email property is not in the correct format in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 4215478569853, cvv: 123, expiration_month: '22', expiration_year: '1111', email: 'faa' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('parámetro de ingreso: email debe tener como mínimo 5 caracteres');
    });

    test('When expiration_month property is invalid in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 4215478569853, cvv: 123, expiration_month: '22', expiration_year: '1111', email: 'faaquino' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('Mes de expiración inválido');
    });

    test('When expiration_year property is invalid in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 4215478569853, cvv: 123, expiration_month: '10', expiration_year: '1111', email: 'faaquino' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('Año de expiración inválido');
    });

    test('When email property is invalid in parameter', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 4215478569853, cvv: 123, expiration_month: '10', expiration_year: '2025', email: 'faaquino' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: EntityError = JSON.parse(data.body);

        expect(response.error_description).toBe('Email inválido');
    });

    test('When correct process', async () => {
        let auth: string = 'Bearer pk_test_LsRBKejzCOEEWOsw';
        let body: string = JSON.stringify({ card_number: 4215478569853, cvv: 123, expiration_month: '10', expiration_year: '2025', email: 'faaquinoa@gmail.com' });
        let data: EntityResponseAWS = await Controller(body, auth);
        let response: DtoResponse = JSON.parse(data.body);

        expect(typeof response?.token).toBe('string');
        expect(response?.token?.length).toBe(16);
    });

});