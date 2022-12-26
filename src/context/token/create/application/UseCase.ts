import { DtoRequest } from "../domain/DtoRequest";
import { EntityToken } from "../domain/EntityToken";
import { EnumCardType } from "../../../shared/domain/EnumCardType";
import { Repository } from "../domain/Repository";
import { DtoResponse } from "../domain/DtoResponse";

export class UseCase {
    private repository: Repository;

    constructor(_repository: Repository) {
        this.repository = _repository;
    }

    public async exec(params: DtoRequest): Promise<DtoResponse> {
        await this.validate(params);

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

    private async validate(params: DtoRequest) {
        let card_type: EnumCardType = await this.repository.getCardType(`${params.card_number}`);
        await this.repository.validateCVV(card_type, `${params.cvv}`);
        await this.repository.validateExpirationMonth(Number(params.expiration_month));
        await this.repository.validateExpirationYear(Number(params.expiration_year));
        await this.repository.validateEmail(params.email);
    }

    private async _exec(client: any, params: DtoRequest): Promise<DtoResponse> {
        let session: any = await this.repository.session(client);
        try {
            let token: string = await this.repository.generateToken(client);
            let date_expiration: Date = new Date();

            const obj: EntityToken = {
                _id: this.repository.code(),
                card_number: params.card_number,
                cvv: params.cvv,
                expiration_month: params.expiration_month,
                expiration_year: params.expiration_year,
                email: params.email,
                token,
                date_expiration
            };

            await this.repository.startTransaction(session);
            await this.repository.saveToken(client, session, obj);
            await this.repository.commitTransaction(session);

            const result: DtoResponse = {
                token: obj.token
            };

            return result;
        } catch (error) {
            await this.repository.rollbackTransaction(session);
            throw error;
        } finally {
            await this.repository.closeSession(session);
        }
    }

}