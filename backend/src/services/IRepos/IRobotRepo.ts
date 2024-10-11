import { Repo } from "../../core/infra/Repo";
import { Robot } from "../../domain/Robot/Robot";
import { RobotId } from "../../domain/Robot/RobotId";
import { NickName } from "../../domain/Robot/NickName";

export default interface IRobotRepo extends Repo<Robot> {
    save(Robot: Robot): Promise<Robot>;
    findById(RobotId: RobotId | string): Promise<Robot>;
    findByNickName(NickName: NickName | string): Promise<Robot>;
    listAll(): Promise<Robot[]>
    updateOne(Robot: Robot): Promise<Robot>;
}