import { ClientSession, Collection, InsertOneResult, MongoClient, ObjectId, WithId } from "mongodb";
import { EnumCardType } from "../../../shared/domain/EnumCardType";
import { AdapterFunctionGeneric } from "../../../shared/infraestructure/AdapterFunctionGeneric";
import { AdapterMongoDB } from "../../../shared/infraestructure/AdapterMongoDB";
import { RepositoryImplMongo } from "../../../shared/infraestructure/RepositoryImplMongo";
import { EntityToken } from "../domain/EntityToken";
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

    public code(): string {
        let _id = new ObjectId();
        return _id.toString();
    }

    public async getCardType(card_number: string): Promise<EnumCardType> {
        let card_type: EnumCardType = AdapterFunctionGeneric.getCardType(`${card_number}`);
        if (card_type === EnumCardType.ERROR) {
            throw new Error('Número de tarjeta inválido');
        }
        return card_type;
    }

    public async validateCVV(card_type: EnumCardType, cvv: string): Promise<void> {
        switch (card_type) {
            case EnumCardType.VISA:
            case EnumCardType.MASTERCARD:
            case EnumCardType["DINERS CLUB"]:
                if (cvv.length !== 3) {
                    throw new Error('CVV inválido');
                }
                break;
            case EnumCardType["AMERICAN EXPRESS"]:
                if (cvv.length !== 4) {
                    throw new Error('CVV inválido');
                }
                break;
            default:
                throw new Error('CVV inválido');
        }
    }

    public async validateExpirationMonth(expiration_month: number): Promise<void> {
        if (expiration_month < 1 || expiration_month > 12) {
            throw new Error('Mes de expiración inválido');
        }
    }

    public async validateExpirationYear(expiration_year: number): Promise<void> {
        let year: number = new Date().getFullYear();
        if (expiration_year < year || expiration_year > (year + 5)) {
            throw new Error('Año de expiración inválido');
        }
    }

    public async validateEmail(email: string): Promise<void> {
        let validateEmail: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!validateEmail.test(email)) {
            throw new Error('Email inválido');
        }

        let splitEmail: Array<string> = email.split('@');

        let domainEmail: string = splitEmail[splitEmail.length - 1].toLowerCase();
        let domains: Array<string> = ['gmail.com', 'hotmail.com', 'yahoo.es'];
        if (!domains.includes(domainEmail)) {
            throw new Error('Email inválido');
        }
    }

    public async generateToken(client: MongoClient): Promise<string> {
        let col: Collection<EntityToken> = client.db(this.database).collection(`${this.schema}_${this.entity}`);
        let token: string = await this._getToken(col);
        return token;
    }

    private async _getToken(col: Collection<EntityToken>): Promise<string> {
        let token: string = AdapterFunctionGeneric.randomString(16);
        let existsToken: EntityToken | null = await col.findOne({ token });
        if (!existsToken) {
            return token;
        } else {
            let newToken: string = await this._getToken(col);
            return newToken;
        }

    }

    public async saveToken(client: MongoClient, session: ClientSession, params: EntityToken): Promise<void> {
        AdapterMongoDB.validateDocument(params);

        let col: Collection<EntityToken> = client.db(this.database).collection(`${this.schema}_${this.entity}`);
        let response: InsertOneResult<EntityToken> = await col.insertOne(params, { session });

        if (!response.acknowledged) {
            throw new Error("Ocurrió un error al guardar los datos");
        }
    }

}