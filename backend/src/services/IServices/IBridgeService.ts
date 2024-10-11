import { Result } from "../../core/logic/Result";
import { BridgeId } from "../../domain/Bridge/BridgeId";
import IBridgeDTO from "../../dto/IBridgeDTO";
import IBridgeInformationDTO from "../../dto/IBridgeInformationDTO";


export default interface IBridgeService {
    getAllFloorsWithBridges(buildingX: string): Promise<Result<{ bridgeInformationDTO: IBridgeInformationDTO[] }>>;
    createBridge(bridgeDTO: IBridgeDTO): Promise<Result<IBridgeDTO>>;
    getBridge(bridgeId: string): Promise<Result<BridgeId>>;
    updateBridge(bridgeDTO: IBridgeDTO): Promise<Result<{ bridgeDTO: IBridgeDTO }>>;
    getAll(): Promise<Result<IBridgeDTO[]>>;
    listBridgesOfBuildings(buildingX: string, buildingY: string): Promise<Result<IBridgeDTO[]>>
}