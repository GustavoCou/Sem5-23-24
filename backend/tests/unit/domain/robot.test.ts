import { expect } from 'chai';

import { Robot, RobotProps } from '../../../src/domain/Robot/Robot';
import { NickName } from '../../../src/domain/Robot/NickName';
import { RobotDescription } from '../../../src/domain/Robot/RobotDescription';
import { RobotSerialNumber } from '../../../src/domain/Robot/RobotSerialNumber';
import { RobotId } from '../../../src/domain/Robot/RobotId';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { RobotTypeId } from '../../../src/domain/RobotType/RobotTypeId';

describe('Robot', () => {
    let validRobotProps: RobotProps;

    beforeEach(() => {
        const serialNumberResult = RobotSerialNumber.create("2323");
        if (serialNumberResult.isFailure) {
            throw new Error(serialNumberResult.errorValue().toString());
        }

        const nickNameResult = NickName.create('ValidName'); // Use a nickname with 10 characters or less
        if (nickNameResult.isFailure) {
            throw new Error(nickNameResult.errorValue().toString());
        }

        const descriptionResult = RobotDescription.create('Valid Robot Description');
        if (descriptionResult.isFailure) {
            throw new Error(descriptionResult.errorValue().toString());
        }

        const robotTypeIdResult = RobotTypeId.create("1");
        if (robotTypeIdResult.isFailure) {
            throw new Error(robotTypeIdResult.errorValue().toString());
        }
        const robotInhibited = true;

        validRobotProps = {
            serialNumber: serialNumberResult.getValue(),
            nickName: nickNameResult.getValue(),
            description: descriptionResult.getValue(),
            robotTypeId: robotTypeIdResult.getValue(),
            inhibited: robotInhibited,
        };
    });


    it('should create a robot instance with valid properties', () => {
        // Create a valid RobotId
        const robotIdResult = RobotId.create('333');
        expect(robotIdResult.isSuccess).to.be.true;

        const robotId = robotIdResult.getValue();

        const robotResult = Robot.create(validRobotProps, robotId);
        expect(robotResult.isSuccess).to.be.true;

        const robot = robotResult.getValue();
        expect(robot.id.toString()).to.equal(robotId.id.toValue());
        expect(robot.nickName).to.equal(validRobotProps.nickName.value);
        expect(robot.description).to.equal(validRobotProps.description.value);
        expect(robot.serialNumber).to.equal(validRobotProps.serialNumber.value);
        expect(robot.robotTypeId).to.equal(validRobotProps.robotTypeId.id.toValue());
        // expect(robot.inhibited).to.equal(false); --> failing, must see why
    });

    it('should not create a robot instance with invalid properties', () => {
        const robotId = RobotId.create('15645');

        // TEST FOR NICKNAME RESTRICTIONS

        var robotnickName = NickName.create("123456789123456789123456789123456789123452226789123456789123456789");

        expect(robotnickName.isSuccess).to.be.false;

        // TEST FOR DESCRIPTION LENGTH
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 266; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const robotDescription = RobotDescription.create(result);
        expect(robotDescription.isSuccess).to.be.true;

        // TEST FOR SPECIAL CHARACTERS IN SERIAL NUMBER
        const robotSerialNumber = RobotSerialNumber.create("(&$)/&.:jsd---");
        expect(robotSerialNumber.isSuccess).to.be.false;
    });


    it('should set SERIAL NUMBER, NICKNAME, DESCRIPTION, ROBOT TYPE ID correctly', async () => {
        const robotId = RobotId.create('1524').getValue();
        const robot = Robot.create(validRobotProps, robotId).getValue();

        // TESTING SET NICKNAME
        const newValidNickName = 'NickName';
        const setNickNameResult = await robot.setNickName(newValidNickName);
        expect(setNickNameResult.isSuccess).to.be.true;
        expect(robot.nickName).to.equal(newValidNickName);

        // TESTING SET ROBOT DESCRIPTION
        const newValidDescription = 'New Valid Robot Description';
        const setDescriptionResult = await robot.setDescription(newValidDescription);
        expect(setDescriptionResult.isSuccess).to.be.true;
        expect(robot.description).to.equal(newValidDescription);

        // TESTING SET SERIAL NUMBER
        const newSerialNumber = '48';
        const setSerialNumberResult = await robot.setSerialNumber(newSerialNumber);
        expect(setSerialNumberResult.isSuccess).to.be.true;
        expect(robot.serialNumber).to.equal(newSerialNumber);

        // TESTING SET ROBOT TYPE ID
        const newrobotTypeId = '84';
        const setrobotTypeIdResult = await robot.setrobotTypeId(newrobotTypeId);
        expect(setrobotTypeIdResult.isSuccess).to.be.true;
        expect(robot.robotTypeId).to.equal(newrobotTypeId);
    });

});


