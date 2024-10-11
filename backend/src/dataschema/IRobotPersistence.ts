export interface IRobotPersistence {
    serialNumber: string;
    nickName: string;
    description: string;
    robotTypeId: string;
    inhibited: boolean
    /* robot type id here? -- usar schema no pedido*/
}