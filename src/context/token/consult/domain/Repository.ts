import { RepositoryGeneric } from "../../../shared/domain/RepositoryGeneric";
import { DtoRequest } from "./DtoRequest";
import { DtoResponse } from "./DtoResponse";

export interface Repository extends RepositoryGeneric {
    getToken(client: any, params: DtoRequest): Promise<DtoResponse | null>;
};