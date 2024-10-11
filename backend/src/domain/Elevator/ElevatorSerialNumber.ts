import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorSerialNumberProps {
    serialNumber: string;
}

export class ElevatorSerialNumber extends ValueObject<ElevatorSerialNumberProps> {
    get serialNumber(): string {
        return this.props.serialNumber;
    }

    set serialNumber(value: string) {
        this.props.serialNumber = value;
    }

    private constructor(props: ElevatorSerialNumberProps) {
        super(props);
    }

    public toString(): string {
        return this.serialNumber;
    }


    public static create(value: string | undefined): Result<ElevatorSerialNumber> {
        if (value === undefined || value === null) {
            return Result.ok<ElevatorSerialNumber>(new ElevatorSerialNumber({ serialNumber: value }));
        }

        const regex = /^[0-9]+$/;

        if (value.length > 50) {
            return Result.fail<ElevatorSerialNumber>("The maximum length of the serial number is 50 numbers");
        }

        if (!value.toString().match(regex)) {
            return Result.fail<ElevatorSerialNumber>("The serial number only allows numbers");
        }

        return Result.ok<ElevatorSerialNumber>(new ElevatorSerialNumber({ serialNumber: value }));
    }
}