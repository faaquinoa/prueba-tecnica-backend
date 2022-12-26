import { DtoRequest } from "../domain/DtoRequest";
import { DtoResponse } from "../domain/DtoResponse";
import { Repository } from "../domain/Repository";

export class UseCase {
    private repository: Repository;

    constructor(_repository: Repository) {
        this.repository = _repository;
    }

    public async exec(params: DtoRequest): Promise<DtoResponse> {
        let client: any = await this.repository.connection();
        try {
            let response: DtoResponse = await this._exec(client, params);
            return response;
        } catch (error) {
            throw error;
        } finally {
            await this.repository.closeConnection(client);
        }
    }

    private async _exec(client: any, params: DtoRequest): Promise<DtoResponse> {
        try {
            let result: DtoResponse | null = await this.repository.getToken(client, params);
            if (!result) {
                throw new Error('Token inválido');
            }
            return result;
        } catch (error) {
            throw error;
        } finally { }
    }

}