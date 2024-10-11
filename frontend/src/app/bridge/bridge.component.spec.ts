import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BridgeComponent } from './bridge.component';
import { Router } from '@angular/router';

describe('BridgeComponent', () => {
    let component: BridgeComponent;
    let fixture: ComponentFixture<BridgeComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BridgeComponent],
            imports: [RouterTestingModule.withRoutes([])]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BridgeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have all show flags set to false initially', () => {
        expect(component.showCreateBridge).toBeFalse();
        expect(component.showListBridge).toBeFalse();
        expect(component.showListFloorsBridge).toBeFalse();
        expect(component.showEditBridge).toBeFalse();
    });

    it('should reset all options when resetOption is called', () => {

        component.showCreateBridge = true;
        component.showListBridge = true;
        component.showListFloorsBridge = true;
        component.showEditBridge = true;

        component.resetOption();

        expect(component.showCreateBridge).toBeFalse();
        expect(component.showListBridge).toBeFalse();
        expect(component.showListFloorsBridge).toBeFalse();
        expect(component.showEditBridge).toBeFalse();
    });

    it('should navigate to "/home" when backToMenu is called', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.backToMenu();
        expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });

});
