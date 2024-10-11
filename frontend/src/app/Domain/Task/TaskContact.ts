
interface TaskContactProps {
  name: string;
  phone: number;
}

// Criar a classe TaskContact como um Value Object
 export class  TaskContact  {

private contact :TaskContactProps;

  private constructor(props: TaskContactProps) {
    this.contact=props;
  }

  public static create(name: string, phoneNumber: number): TaskContact {



    return new TaskContact({name: name, phone:phoneNumber})

  }

   get name(): string {
    return this.contact.name;
  }


  get phone(): number {
    return this.contact.phone;
  }



}


