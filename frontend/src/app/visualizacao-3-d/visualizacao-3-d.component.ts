// @ts-ignore
// @ts-check
// @ts-nocheck
// @ts-expect-error
// @ts-ignore
// @ts-expect-error
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import Orientation from "../../visualization3D/orientation";
import ThumbRaiser from "../../visualization3D/thumb_raiser.js";


@Component({
  selector: 'app-visualizacao-3-d',
  templateUrl: './visualizacao-3-d.component.html',
  styleUrls: ['./visualizacao-3-d.component.css']
})


export class Visualizacao3DComponent implements OnInit, AfterViewInit, OnDestroy {

  static thumbRaiser: any;
  static change: any;
  static selectedFloor: any;
  static selectedFloorModal: any;

  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.initialize();
    Visualizacao3DComponent.animate();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


  selectedFloor: number = 1; // Default floor value
  selectedFloorModal: number = 2;
  change: boolean = false;

  initialize() {
    // Create the game

    Visualizacao3DComponent.thumbRaiser = new ThumbRaiser(
      {}, // General Parameters
      { scale: new THREE.Vector3(1.0, 0.5, 1.0), map: this.selectedFloor }, // Maze parameters
      {}, // Player parameters
      {
        ambientLight: { intensity: 0.5 },
        pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
        pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) }
      }, // Lights parameters
      {}, // Fog parameters
      { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Fixed view camera parameters
      {
        view: "first-person",
        multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5),
        initialOrientation: new Orientation(0.0, -10.0),
        initialDistance: 2.0,
        distanceMin: 1.0,
        distanceMax: 4.0
      }, // First-person view camera parameters
      {
        view: "third-person",
        multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5),
        initialOrientation: new Orientation(0.0, -20.0),
        initialDistance: 2.0,
        distanceMin: 1.0,
        distanceMax: 4.0
      }, // Third-person view camera parameters
      {
        view: "top",
        multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5),
        initialOrientation: new Orientation(0.0, -90.0),
        initialDistance: 4.0,
        distanceMin: 1.0,
        distanceMax: 16.0
      }, // Top view camera parameters
      {
        view: "mini-mapper",
        multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3),
        initialOrientation: new Orientation(180.0, -90.0),
        initialZoom: 0.64
      } // Mini-msp view camera parameters
    );
  }

  applyFloor(floor: number) {
    if (floor != 0) {
      Visualizacao3DComponent.thumbRaiser.changeMap(floor);

    }
  }

  static animate() {
    requestAnimationFrame(Visualizacao3DComponent.animate);
    // Update the game

    if (Visualizacao3DComponent.change) {

      Visualizacao3DComponent.change = false;
      Visualizacao3DComponent.thumbRaiser.changeMap(Visualizacao3DComponent.selectedFloor);
      Visualizacao3DComponent.thumbRaiser.changeMapElevator(Visualizacao3DComponent.selectedFloor);

    }
    Visualizacao3DComponent.thumbRaiser.update();
  }

  applyFloorElevator(floor: number) {
    this.closeModal();
    Visualizacao3DComponent.thumbRaiser.changeMapElevator(floor);

  }


  closeModal() {
    let modal = document.getElementById("popUpModal");
    modal.style.display = "none";
  }
}



