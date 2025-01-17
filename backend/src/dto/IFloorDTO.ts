
export interface IFloorDTO {
    id: string;
    floorDescription : string;
    floorSize : {
        width : number;
        depth : number;
    };
    floorMapa: {
        maze: {
            size: {
                width: number;
                depth: number;
            };
            map: number[][];
            exits: [number, number][];
            elevators: [number, number][];
            exitLocation: [number, number];
        };
        ground: {
            size: {
                width: number;
                height: number;
                depth: number;
            };
            segments: {
                width: number;
                height: number;
                depth: number;
            };
            primaryColor: string;
            maps: {
                color: {
                    url: string;
                };
                ao: {
                    url: string;
                    intensity: number;
                };
                displacement: {
                    url: string;
                    scale: number;
                    bias: number;
                };
                normal: {
                    url: string;
                    type: number;
                    scale: {
                        x: number;
                        y: number;
                    };
                };
                bump: {
                    url: string;
                    scale: number;
                };
                roughness: {
                    url: string;
                    rough: number;
                };
            };
            wrapS: number;
            wrapT: number;
            repeat: {
                u: number;
                v: number;
            };
            magFilter: number;
            minFilter: number;
            secondaryColor: string;
        };
        wall: {
            segments: {
                width: number;
                height: number;
            };
            primaryColor: string;
            maps: {
                color: {
                    url: string;
                };
                ao: {
                    url: string;
                    intensity: number;
                };
                displacement: {
                    url: string;
                    scale: number;
                    bias: number;
                };
                normal: {
                    url: string;
                    type: number;
                    scale: {
                        x: number;
                        y: number;
                    };
                };
                bump: {
                    url: string;
                    scale: number;
                };
                roughness: {
                    url: string;
                    rough: number;
                };
            };
            wrapS: number;
            wrapT: number;
            repeat: {
                u: number;
                v: number;
            };
            magFilter: number;
            minFilter: number;
            secondaryColor: string;
        };
        player: {
            initialPosition: [number, number];
            initialDirection: number;
        };
    
    };
    building: string
}