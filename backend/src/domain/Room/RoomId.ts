import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface RoomIdProps {
	roomId: UniqueEntityID;
}

export class RoomId extends ValueObject<RoomIdProps> {

	get id(): UniqueEntityID {
		return this.props.roomId;
	}

	private constructor(id: RoomIdProps) {
		super(id);
	}

	public static create(id: string): Result<RoomId> {
		const guardResult = Guard.againstNullOrUndefined(id, 'id');


		if (!guardResult.succeeded) {
			return Result.fail<RoomId>(guardResult.message);
		}
		else {
			const idPattern = /^[A-Za-z0-9\s]+$/;

			if (id && (!id.toString().match(idPattern) || id.length > 50)) {
				return Result.fail<RoomId>("The ID cannot contain more than 50 characters.");
			}
			else {
				const uniqueID = new UniqueEntityID(id);

				return Result.ok<RoomId>(new RoomId({ roomId: uniqueID }))
			}
		}
	}

}