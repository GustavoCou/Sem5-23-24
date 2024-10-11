import { Floor } from "./floor";

export interface Elevator {
    floorIds: string[];
    elevatorUniqueCodBuilding: number;
    elevatorId: string;
    elevatorPosition: {
        posX: number;
        posY: number;
    };
    buildingId: string;
    elevatorBrand?: string;
    elevatorModel?: string;
    elevatorSerialNumber?: string;
    elevatorDescription?: string;
}