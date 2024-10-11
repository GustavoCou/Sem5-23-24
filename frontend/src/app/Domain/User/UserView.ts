

interface UserProps {

  Id?: string,
  nomeCompleto: string,
  email: string,
  password: string,
  func: string,
  telefone: string,
  numMecanografico: string,
  numeroContribuinte: string
  approvalStatus?: number,
}



export class UserView {
  private props: UserProps;


  private constructor(props: UserProps) {
    this.props = props;
  }
  public static createUser(userProps: UserProps): UserView {
    // here, you can to realize validations and additional logic before to create the instance


    this.validarPassword(userProps.password);

      this.validarNIF(userProps.numeroContribuinte);
      this.validarContactoTelefonico(userProps.telefone);
      this.validarNumeroMecanografico(userProps.numMecanografico);

    return new UserView(userProps);
  }


    private static validarPassword(psswd: string) {
    const patronContrasenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{10,}$/;

    if (!patronContrasenha.test(psswd)) {
      throw new Error("A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um dígito, um caracter não alfanumérico ou espaço em branco e ter pelo menos 10 caracteres.");
    }

    return true;
  }

  private static  validarNIF(nif: string) {
    if (!nif || nif.length !== 9 || !/^\d+$/.test(nif)) {
      throw new Error("O Número de Identificação Fiscal (NIF) deve ter exatamente 9 caracteres numéricos e não pode estar vazio.");
    }

    return true;
  }
  private static  validarContactoTelefonico(contacto: string) {
    if (!contacto) {
      throw new Error("O Contacto Telefónico não pode estar vazio.");
    }

    return true;
  }

  private static  validarNumeroMecanografico(numeroMecanografico : string) {
    if (!numeroMecanografico) {
      throw new Error("O Número Mecanográfico não pode estar vazio.");
    }

    return true;
  }

  public get Id(): string | undefined {
    return this.props.Id;
  }

  public get nomeCompleto(): string {
    return this.props.nomeCompleto;
  }

  public get email(): string {
    return this.props.email;
  }

  public get password(): string {
    return this.props.password;
  }

  public get func(): string {
    return this.props.func;
  }

  public get telefone(): string {
    return this.props.telefone;
  }

  public get numMecanografico(): string {
    return this.props.numMecanografico;
  }

  public get numeroContribuinte(): string {
    return this.props.numeroContribuinte;
  }

}
