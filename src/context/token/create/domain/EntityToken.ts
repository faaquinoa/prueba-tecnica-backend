export interface EntityToken {
    _id: string;

    card_number: number;
    cvv: number;
    expiration_month: string;
    expiration_year: string;
    email: string;

    token: string;
    date_expiration: Date;
}