export interface IRoomDTO {
    roomId: string;
    description: string;
    size: {
        width: number;
        depth: number;
    };
    position: {
        posX: number;
        posY: number;
    };
    roomType: string;
    floor: string;
}