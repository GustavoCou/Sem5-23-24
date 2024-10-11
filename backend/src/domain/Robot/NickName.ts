import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface NickNameProps {
    value: string;
}

export class NickName extends ValueObject<NickNameProps> {

    get value(): string {
        return this.props.value;
    }


    private constructor(props: NickNameProps) {
        super(props);
    }

    public static create(nickName: string): Result<NickName> {
        const guardResult = Guard.againstNullOrUndefined(nickName, 'nickName');


        if (!guardResult.succeeded) {
            return Result.fail<NickName>(guardResult.message);
        } else {
            const idPattern = /^[A-Za-z0-9]+$/;

            if (nickName && !nickName.toString().match(idPattern)) {

                return Result.fail<NickName>("The nickName must be alphanumeric and can't contain spaces.");

            } else if (nickName.length > 30) {

                return Result.fail<NickName>("The maximum length of the nickName is 30 characters");

            }

            return Result.ok<NickName>(new NickName({ value: nickName }))
        }
    }
}
