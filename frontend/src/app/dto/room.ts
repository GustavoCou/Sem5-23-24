export interface Room {
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