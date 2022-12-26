import { config } from 'dotenv';
config();

//Domain
import { EntityResponseAWS } from "../../../shared/domain/EntityResponseAWS";
import { DtoRequest } from "../domain/DtoRequest";
import { DtoResponse } from "../domain/DtoResponse";

//Application
import { UseCase } from "../application/UseCase";

//Infraestructure
import { AdapterAuthorization } from '../../../shared/infraestructure/AdapterAuthorization';
import { AdapterFunctionGeneric } from "../../../shared/infraestructure/AdapterFunctionGeneric";
import { AdapterConfigure } from "./AdapterConfigure";
import { AdapterValidator } from "./AdapterValidator";
import { RepositoryImpl } from "./RepositoryImpl";

export const Controller = async (body: string , auth: string): Promise<EntityResponseAWS> => {
    try {
        AdapterAuthorization.validate(auth);

        let params: DtoRequest = AdapterFunctionGeneric.isJSON(body)
            ? JSON.parse(body)
            : {};

        let { valid, error } = AdapterValidator.validateParams(params);
        if (!valid) {
            throw new Error(error);
        }

        const repository: RepositoryImpl = new RepositoryImpl(AdapterConfigure.URI, AdapterConfigure.DATABASE, AdapterConfigure.SCHEMA, AdapterConfigure.ENTITY);
        const result: DtoResponse = await (new UseCase(repository)).exec(params);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        return {
            statusCode: 406,
            body: JSON.stringify({
                error_name: (error as Error).name,
                error_description: (error as Error).message
            })
        };
    } finally { }
}