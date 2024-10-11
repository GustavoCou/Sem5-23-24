export interface Floor {
    id: string;
    floorDescription : string | null;
    floorSize : {
        width : number;
        depth : number;
    };
    building: string
}