import UserDTO from "../dto/UserDTO";
import { UserModel } from "../model/userModel";

export class UserMapper {
    public static toUserModel(userDto: UserDTO): UserModel {

        return {
            id: userDto.Id,
            nomeCompleto: userDto.nomeCompleto,
            email: userDto.email,
            password: userDto.password,
            func: userDto.func,
            telefone: userDto.telefone,
            numMecanografico: userDto.numMecanografico,
            numeroContribuinte: userDto.numeroContribuinte

        };
    }

    public static toUserDTO(userModel: UserModel): UserDTO {
        return {
            Id: userModel.id,
            nomeCompleto: userModel.nomeCompleto,
            email: userModel.email,
            password: userModel.password,
            func: userModel.func,
            telefone: userModel.telefone,
            numMecanografico: userModel.numMecanografico,
            numeroContribuinte: userModel.numeroContribuinte

        };
    }
}
