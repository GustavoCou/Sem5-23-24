import {ValueObject} from "../../core/domain/ValueObject";
import {Result} from "../../../../backend/src/core/logic/Result";
import {Guard} from "../../../../backend/src/core/logic/Guard";

interface TaskContactProps {
  name: string;
  phone: number;
}

// Criar a classe TaskContact como um Value Object
 export class  TaskContact extends ValueObject<TaskContactProps>{

  private constructor(props: TaskContactProps) {
    super(props);
  }

  public static create(name: string, phoneNumber: number): Result<TaskContact> {


    if (name ==null || phoneNumber==null ) {
      return Result.fail<TaskContact>('Contact must have name and phone number');
    }

    if (!TaskContact.isValidName(name)) {
      return Result.fail<TaskContact>('Nome inválido.');
    }

    if (!TaskContact.isValidPhoneNumber(phoneNumber)) {
      return Result.fail<TaskContact>('Número de telefone inválido. (9 numeros)');
    }

    return  Result.ok<TaskContact>(new TaskContact({name, phone: phoneNumber}));
  }

  // Método para obter o nome do contato
  get name(): string {
    return this.props.name;
  }

  // Método para obter o número de telefone do contato
  get phone(): number {
    return this.props.phone;
  }

  // Método estático para validar o nome
  private static isValidName(name: string): boolean {

    return name.trim().length > 0;
  }

  private static isValidPhoneNumber(phoneNumber: number): boolean {

    const cadenaNumero = phoneNumber.toString();
    return cadenaNumero.length ==9;
  }
}


