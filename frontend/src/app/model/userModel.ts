export interface UserModel {
    id?: string;
    nomeCompleto: string;
    email: string;
    password: string;
    func: string;
    telefone: string;
    numMecanografico: string;
    numeroContribuinte: string;
    approvalStatus?: number;
}

