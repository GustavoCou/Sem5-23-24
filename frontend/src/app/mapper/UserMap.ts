import {UserView} from "../Domain/User/UserView";
import UserDTO from "../dto/UserDTO";

export class UserMap {

public static toCreateDTO(user: UserView):UserDTO{
  return {

    nomeCompleto: user.nomeCompleto,
    email: user.email,
    password: user.password,
    func: user.func,
    telefone: user.telefone,
    numMecanografico: user.numMecanografico,
    numeroContribuinte: user.numeroContribuinte

  }as UserDTO;

}

}
