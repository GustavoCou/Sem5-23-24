import { expect } from 'chai';
import { BridgePosition } from '../../../src/domain/Bridge/BridgePosition';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { FloorID } from '../../../src/domain/Floor/FloorID';
import { Bridge } from '../../../src/domain/Bridge/Bridge';

describe('Bridge', () => {
    let validBridgeProps: {
        floorIdX: string;
        floorIdY: string;
        bridgePositionX: BridgePosition;
        bridgePositionY: BridgePosition;
        bridgeId: string;
        buildingX: string;
        buildingY: string
    };

    beforeEach(() => {

        const buildingIdX = BuildingId.create('B1').getValue().toString();
        const buildingIdY = BuildingId.create('A1').getValue().toString();
        const floorIdX = FloorID.create('F1');
        const floorIdY = FloorID.create('F2');

        const floor1String = floorIdX.getValue().toString();
        const floor2String = floorIdY.getValue().toString();



        const bridgePositionYResult = BridgePosition.create({
            posX: 10,
            posY: 20
        });

        const bridgePositionXResult = BridgePosition.create({
            posX: 10,
            posY: 20
        });

        validBridgeProps = {

            buildingX: buildingIdX,
            buildingY: buildingIdY,
            bridgePositionX: bridgePositionXResult.getValue(),
            bridgePositionY: bridgePositionYResult.getValue(),
            floorIdX: floor1String,
            floorIdY: floor2String,
            bridgeId: '1234',
        };
    });

    it('should create a bridge instance with valid properties', () => {
        const bridgeResult = Bridge.create(validBridgeProps);

        expect(bridgeResult.isSuccess).to.be.true;
        const bridge = bridgeResult.getValue();
        expect(bridge.bridgeId.toString()).to.equal(validBridgeProps.bridgeId);

        expect(bridge.bridgePositionX.posX).to.equal(validBridgeProps.bridgePositionX.posX);
        expect(bridge.bridgePositionX.posY).to.equal(validBridgeProps.bridgePositionX.posY);
        expect(bridge.bridgePositionY.posX).to.equal(validBridgeProps.bridgePositionY.posX);
        expect(bridge.bridgePositionY.posY).to.equal(validBridgeProps.bridgePositionY.posY);
        expect(bridge.floorIdX.toString()).to.equal(validBridgeProps.floorIdX);
        expect(bridge.floorIdY.toString()).to.equal(validBridgeProps.floorIdY);

        expect(bridge.buildingX.toString()).to.equal(validBridgeProps.buildingX);
        expect(bridge.buildingY.toString()).to.equal(validBridgeProps.buildingY);

    });

    it('should not create a bridge with a non-existent floor', () => {
        const invalidFloorId = 'INVALID_FLOOR_ID';

        const invalidBridgeProps = {
            ...validBridgeProps,
            floorIdX: invalidFloorId
        };

        const bridgeResult = Bridge.create(invalidBridgeProps);

        expect(bridgeResult.isSuccess).to.be.false;
        expect(bridgeResult.error).to.equal('Floor ID X is not valid');
    });

    it('should not create a bridge with an invalid ID', () => {
        const invalidId = 'INVALID_ID';

        const invalidBridgeProps = {
            ...validBridgeProps,
            bridgeId: invalidId
        };

        const bridgeResult = Bridge.create(invalidBridgeProps);

        expect(bridgeResult.isSuccess).to.be.false;
        expect(bridgeResult.error).to.equal('Not a valid ID');
    });

    it('should not create a bridge without a ID', () => {
        const invalidId = '';

        const invalidBridgeProps = {
            ...validBridgeProps,
            bridgeId: invalidId
        };

        const bridgeResult = Bridge.create(invalidBridgeProps);

        expect(bridgeResult.isSuccess).to.be.false;
        expect(bridgeResult.error).to.equal('Not a valid ID');
    });


    it('should not create a bridge with an id bigger then 4 caracteres', () => {
        const invalidId = '12345';

        const invalidBridgeProps = {
            ...validBridgeProps,
            bridgeId: invalidId
        };

        const bridgeResult = Bridge.create(invalidBridgeProps);
        expect(bridgeResult.isSuccess).to.be.false;
        expect(bridgeResult.error).to.equal('Not a valid ID');
    });
});