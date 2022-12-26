import { Collection, MongoClient } from "mongodb";
import { RepositoryImplMongo } from "../../../shared/infraestructure/RepositoryImplMongo";
import { DtoRequest } from "../domain/DtoRequest";
import { DtoResponse } from "../domain/DtoResponse";
import { Repository } from "../domain/Repository";

export class RepositoryImpl extends RepositoryImplMongo implements Repository {
    private database: string;
    private schema: string;
    private entity: string;

    constructor(_uri: string, _database: string, _schema: string, _entity: string) {
        super(_uri);
        this.database = _database;
        this.schema = _schema;
        this.entity = _entity;
    }

    public async getToken(client: MongoClient, params: DtoRequest): Promise<DtoResponse | null> {
        let col: Collection<DtoResponse> = client.db(this.database).collection(`${this.schema}_${this.entity}`);
        let result: DtoResponse | null = await col.findOne({ token: params.token }, { projection: { _id: 0, card_number: 1, expiration_month: 1, expiration_year: 1, email: 1 } });
        return result;
    }


}