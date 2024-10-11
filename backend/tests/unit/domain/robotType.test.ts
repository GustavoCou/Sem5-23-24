import { expect } from 'chai';

import { RobotType, RobotTypeProps } from '../../../src/domain/RobotType/RobotType';
import { RobotTypeModel } from '../../../src/domain/RobotType/RobotTypeModel';
import { RobotTypeDescription } from '../../../src/domain/RobotType/RobotTypeDescription';
import { RobotTypeBrand } from '../../../src/domain/RobotType/RobotTypeBrand';
import { RobotTypeId } from '../../../src/domain/RobotType/RobotTypeId';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';


describe('RobotType', () => {
    let validRobotTypeProps: RobotTypeProps;

    beforeEach(() => {


        const robotModelResult = RobotTypeModel.create('Valid Model'); // Use a nickname with 10 characters or less
        if (robotModelResult.isFailure) {
            throw new Error(robotModelResult.errorValue().toString());
        }

        const descriptionResult = RobotTypeDescription.create('Valid RobotType Description');
        if (descriptionResult.isFailure) {
            throw new Error(descriptionResult.errorValue().toString());
        }

        const brandResult = RobotTypeDescription.create('Valid RobotType Brand');
        if (brandResult.isFailure) {
            throw new Error(brandResult.errorValue().toString());
        }




        validRobotTypeProps = {

            robotModel: robotModelResult.getValue(),
            description: descriptionResult.getValue(),
            brand: brandResult.getValue(),

        };
    });


    it('should create a robotType instance with valid properties', () => {
        // Create a valid RobotTypeId
        const robotTypeIdResult = RobotTypeId.create('666');
        expect(robotTypeIdResult.isSuccess).to.be.true;

        const robotTypeId = robotTypeIdResult.getValue();

        const robotTypeResult = RobotType.create(validRobotTypeProps, robotTypeId);
        expect(robotTypeResult.isSuccess).to.be.true;

        const robotType = robotTypeResult.getValue();
        expect(robotType.id.toString()).to.equal(robotTypeId.id.toValue());
        expect(robotType.model).to.equal(validRobotTypeProps.robotModel.value);
        expect(robotType.description).to.equal(validRobotTypeProps.description.value);
        expect(robotType.brand).to.equal(validRobotTypeProps.brand.value);

    });

    it('should not create a robotType instance with invalid properties', () => {
        const robotTypeId = RobotTypeId.create('15645');



        // TEST FOR DESCRIPTION LENGTH
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 266; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const robotTypeDescription = RobotTypeDescription.create(result);
        expect(robotTypeDescription.isSuccess).to.be.true;
        // TEST FOR SPECIAL CHARACTERS IN BRAND
        const robotBrand = RobotTypeBrand.create("(&$)/&.:jsd---");
        expect(robotBrand.isSuccess).to.be.false;

    });


    it('should set MODEL, DESCRIPTION, BRAND', async () => {
        const robotTypeId = RobotTypeId.create('1524').getValue();
        const robotType = RobotType.create(validRobotTypeProps, robotTypeId).getValue();

        // TESTING SET ROBOT MODEL
        const newValidRobotModel = 'RobotModel';
        const setRobotModelResult = await robotType.setModel(newValidRobotModel);
        expect(setRobotModelResult).to.be.true;
        expect(robotType.model).to.equal(newValidRobotModel);

        // TESTING SET ROBOT TYPE DESCRIPTION
        const newValidDescription = 'New Valid RobotType Description';
        const setDescriptionResult = await robotType.setDescription(newValidDescription);
        expect(setDescriptionResult).to.be.true;
        expect(robotType.description).to.equal(newValidDescription);

        // TESTING SET BRAND
        const newBrand = 'BMW';
        const setBrandResult = (await robotType.setBrand(newBrand));
        expect(setBrandResult).to.be.true;
        expect(robotType.brand).to.equal(newBrand);


    });

});


