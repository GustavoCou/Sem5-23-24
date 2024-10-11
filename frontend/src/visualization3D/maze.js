import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import WallWithoutDoor from "./wall_Without_Door.js";
import Door from "./door.js";
import Elevator from "./elevator.js";
import Roof from "./roof.js";
import _ from "lodash";
import Bridge from "./Bridge.js";


/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {

    constructor(parameters) {

        this.onLoad = function (description) {
            // Store the maze's mapper and size
            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.elevatorExit = this.cellToCartesian(description.elevatorExit);
            this.initialDirection = description.initialDirection;
            this.elevatorFloors = description.elevatorFloors;
            this.initialPositionBridge  = this.cellToCartesian(parameters.initialPositionBridge)
            this.initialDirectionBridge = parameters.initialDirectionBridge

            //store available Bridge arrays
            this.bridgesPoint = description.bridgesPoint;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create the roof
            this.roof = new Roof({ textureUrl: description.roofTextureUrl, size: description.size });
            this.object.add(this.roof.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });

            // Create a wall with out Door
            this.wallWithoutDoor = new WallWithoutDoor({ textureUrl: description.wallTextureUrl });

            // Create a wall with out Door
            this.Door = new Door({ textureUrl: description.doorTextureUrl });

            this.elevator = new Elevator({ textureUrl: description.wallTextureUrl, doorTextureUrl: description.doorElevatorTextureUrl, wallElevatorTexture: description.wallElevatorTextureUrl, floorElevatorTexture: description.floorElevatorUrl });

            // Create the Bridge

            this.bridge = new Bridge({ textureUrl: description.bridgeTexture, textureUrl2: description.bridgeDoorTexture, textureUrl3: description.groundBridgeTexture, textureUrl4: description.roofBridgeTextureUrl });


            // Build the maze
            let wallObject;
            let wallWithoutDoorObject;
            let doorObject;
            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the mapper width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the mapper height is one row greater than the actual maze height
                    /*
                     * description.mapper[][] | North wall | West wall  | North wall wiht Door | West wall wiht Door
                     * --------------------+------------+------------+------------+--------------------
                     *          0          |            |            |                      |
                     *          1          |            |    Yes     |                      |
                     *          2          |    Yes     |            |                      |
                     *          3          |    Yes     |    Yes     |                      |
                     *          4          |            |            |         No           |        Yes
                     *          5          |            |            |         Yes          |        No
                     *          6          |            |     Yes    |         Yes          |        No
                     *          7          |     Yes    |            |         No           |        Yes
                     *
                     *    Elevator
                     * description.mapp[][] | North | West | Sul | Oeste
                     *          8           | No    | No   | No  | Yes
                     *          9           | Yes   | No   | No  | No
                     *          10          | No    | No   | Yes | No
                     *          11          | No    | Yes  | No  | No
                     *
                     *    Bridge
                     * description.mapp[][] | North | West | Sul | Oeste
                     *          12          | Yes   | No   | No  | No
                     *          13          | No    | NO   | Yes | No
                     *          14          | No    | Yes  | No  | No
                     *          15          | No    | No   | No  | Yes
                     *
                    */
                    if (description.map[j][i] == 2 || description.map[j][i] == 3 || description.map[j][i] == 6) { //  North wall
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0);
                        this.object.add(wallObject);
                    }
                    if (description.map[j][i] == 1 || description.map[j][i] == 3 || description.map[j][i] == 7) { //  West wall
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.size.width / 2.0, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                    if (description.map[j][i] == 4) { // wall with door West
                        wallWithoutDoorObject = this.wallWithoutDoor.object.clone();
                        wallWithoutDoorObject.rotateY(Math.PI / 2.0);
                        wallWithoutDoorObject.position.set(i - description.size.width / 2.0, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallWithoutDoorObject);

                        doorObject = this.Door.object.clone();
                        doorObject.rotateY(Math.PI / 2.0 + 0.9);
                        doorObject.position.set(i - description.size.width / 2.0 - 0.2, 1, j - description.size.height / 2.0 + 0.5 + 0.1);
                        this.object.add(doorObject);
                    }
                    if (description.map[j][i] == 5) {  // wall with door Nort
                        wallWithoutDoorObject = this.wallWithoutDoor.object.clone();

                        wallWithoutDoorObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0);
                        this.object.add(wallWithoutDoorObject);
                        doorObject = this.Door.object.clone();
                        doorObject.rotateY(0.9);
                        doorObject.position.set(i - description.size.width / 2.0 + 0.5 - 0.1, 1, j - description.size.height / 2.0 - 0.2);
                        this.object.add(doorObject);

                    }


                    if (description.map[j][i] == 6) { // wall with door West
                        wallWithoutDoorObject = this.wallWithoutDoor.object.clone();
                        wallWithoutDoorObject.rotateY(Math.PI / 2.0);
                        wallWithoutDoorObject.position.set(i - description.size.width / 2.0, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallWithoutDoorObject);

                        doorObject = this.Door.object.clone();
                        doorObject.rotateY(-0.9);
                        doorObject.position.set(i - description.size.width / 2.0 - 0.105, 1, j - description.size.height / 2.0 + 0.5 + 0.025);
                        this.object.add(doorObject);
                    }

                    if (description.map[j][i] == 7) {  // wall with door Nort
                        wallWithoutDoorObject = this.wallWithoutDoor.object.clone();

                        wallWithoutDoorObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0);
                        this.object.add(wallWithoutDoorObject);
                        doorObject = this.Door.object.clone();
                        doorObject.rotateY(0.9);
                        doorObject.position.set(i - description.size.width / 2.0 + 0.5 - 0.1, 1, j - description.size.height / 2.0 - 0.2);
                        this.object.add(doorObject);


                    }
                    if (description.map[j][i] == 8) {
                        let elevatorObject = this.elevator.object.clone();
                        elevatorObject.rotateY(Math.PI / 2.0);
                        elevatorObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(elevatorObject);
                    }

                    if (description.map[j][i] == 9) {
                        let elevatorObject = this.elevator.object.clone();
                        elevatorObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(elevatorObject);
                    }

                    if (description.map[j][i] == 10) {
                        let elevatorObject = this.elevator.object.clone();
                        elevatorObject.rotateY(Math.PI);
                        elevatorObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(elevatorObject);
                    }

                    if (description.map[j][i] == 11) {
                        let elevatorObject = this.elevator.object.clone();
                        elevatorObject.rotateY(-Math.PI / 2.0);
                        elevatorObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(elevatorObject);
                    }
                    if (description.map[j][i] == 12) {
                        let bridgeObject = this.bridge.object.clone();
                        bridgeObject.rotateY(Math.PI);
                        bridgeObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0 + 1);
                        this.object.add(bridgeObject);

                    }

                    if (description.map[j][i] == 13) {
                        let bridgeObject = this.bridge.object.clone();

                        bridgeObject.position.set(i - description.size.width / 2.0 + 0.5, 1, j - description.size.height / 2.0 - 1);
                        this.object.add(bridgeObject);
                    }

                    if (description.map[j][i] == 14) {

                        let bridgeObject = this.bridge.object.clone();
                        bridgeObject.rotateY(Math.PI - Math.PI / 2);
                        bridgeObject.position.set(i - description.size.width / 2.0 - 1, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(bridgeObject);

                    }

                    if (description.map[j][i] == 15) {
                        let bridgeObject = this.bridge.object.clone();
                        bridgeObject.rotateY(Math.PI + Math.PI / 2);
                        bridgeObject.position.set(i - description.size.width / 2.0 + 1, 1, j - description.size.height / 2.0 + 0.5);
                        this.object.add(bridgeObject);
                    }
                }

            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );
    }



    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        if(position==null)
            return Infinity;
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        let value = [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];

        if (value[0] < 0) {
            value[0] = 0;
            return value;
        } else if (value[0] >= this.size.height) {
            value[0] = (this.size.height) - 1;

            return value;
        } else {
            return value;
        }
    }

    distanceToWestWall(position) {

        const indices = this.cartesianToCell(position);

        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        //wall without door
        if (this.map[indices[0]][indices[1]] == 7) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }



        return Infinity;

    }

    distanceToWestWallwithoutDoor(position) {
        const indices = this.cartesianToCell(position);

        if (this.map[indices[0]][indices[1]] == 4 || this.map[indices[0]][indices[1]] == 6) {

            if (position.z - this.cellToCartesian(indices).z > 0.080 || position.z - this.cellToCartesian(indices).z < -0.080) {
                return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
            } else
                return Infinity;
        }

        // elevator Door Wall  oeste

        if (this.map[indices[0]][indices[1]] == 11) {

            if (position.z - this.cellToCartesian(indices).z > 0.080 || position.z - this.cellToCartesian(indices).z < -0.080) {
                return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
            } else
                return Infinity;
        }


        return Infinity;
    }


    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);


        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        //wall without door
        if (this.map[indices[0]][indices[1]] == 7) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }

        return Infinity;


    }

    distanceToEastWallwithoutDoor(position) {
        const indices = this.cartesianToCell(position);


        indices[1]++;

        if (this.map[indices[0]][indices[1]] == 4 || this.map[indices[0]][indices[1]] == 6) {

            if (position.z - this.cellToCartesian(indices).z > 0.080 || position.z - this.cellToCartesian(indices).z < -0.080) {
                return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
            } else
                return Infinity;
        }

        // elevator Door Wall  este
        indices[1]--;
        if (this.map[indices[0]][indices[1]] == 8) {

            if (position.z - this.cellToCartesian(indices).z > 0.080 || position.z - this.cellToCartesian(indices).z < -0.080) {
                return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
            } else
                return Infinity;
        }

        return Infinity;

    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);


        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {

            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;

        }

        //wall without door
        if (this.map[indices[0]][indices[1]] == 6) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }



        return Infinity;
    }

    distanceToNorthWallWithoutDoor(position) {
        const indices = this.cartesianToCell(position);

        if (this.map[indices[0]][indices[1]] == 5 || this.map[indices[0]][indices[1]] == 7) {

            if ((position.x - this.cellToCartesian(indices).x > 0.080 || position.x - this.cellToCartesian(indices).x < -0.080)) {
                return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
            } else
                return Infinity;
        }

        // elevator Door Wall norte

        if (this.map[indices[0]][indices[1]] == 10) {

            if ((position.x - this.cellToCartesian(indices).x > 0.080 || position.x - this.cellToCartesian(indices).x < -0.080)) {
                return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
            } else
                return Infinity;
        }

        return Infinity
    }



    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);

        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }

        //wall without door
        if (this.map[indices[0]][indices[1]] == 6) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }


        return Infinity;

    }

    distanceToSouthWallWithoutDoor(position) {
        const indices = this.cartesianToCell(position);

        indices[0]++;

        if (this.map[indices[0]][indices[1]] == 5 || this.map[indices[0]][indices[1]] == 7) {

            if (position.x - this.cellToCartesian(indices).x > 0.080 || position.x - this.cellToCartesian(indices).x < -0.080) {
                return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;

            } else
                return Infinity;
        }

        // elevator Door Wall  sul
        indices[0]--;
        if (this.map[indices[0]][indices[1]] == 9) {

            if ((position.x - this.cellToCartesian(indices).x > 0.080 || position.x - this.cellToCartesian(indices).x < -0.080)) {
                return - position.z + this.cellToCartesian(indices).z + this.scale.z / 2.0;
            } else
                return Infinity;
        }


        return Infinity
    }

    distanceElevatorWestWall(position) {
        const indices = this.cartesianToCell(position);

        if (this.map[indices[0]][indices[1]] == 11) {
            console.log("west wall 11 ", indices[0], " ", indices[1], " ", this.map[indices[0]][indices[1]]);
            return this.cellToCartesian(indices).x - position.x + this.scale.x / 2.0;
        }

        if (this.map[indices[0]][indices[1]] == 9 || this.map[indices[0]][indices[1]] == 10) {
            console.log("west wall 9 10 ", indices[0], " ", indices[1], " ", this.map[indices[0]][indices[1]]);
            return this.cellToCartesian(indices).x - position.x + this.scale.x / 2.0;
        }

        return Infinity;

    }

    distanceElevatorEastWall(position) {
        const indices = this.cartesianToCell(position);
        const indices2 = this.cartesianToCell(position);

        indices[1]++;

        if (this.map[indices[0]][indices[1]] == 8) {
            console.log("east wall 8 ", indices2[0], " ", indices2[1], " ", this.map[indices2[0]][indices2[1]]);
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        if (this.map[indices[0]][indices[1]] == 9 || this.map[indices[0]][indices[1]] == 10) {
            console.log("east wall 9/10 ", indices2[0], " ", indices2[1], " ", this.map[indices2[0]][indices2[1]]);
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }

        return Infinity;

    }

    distanceElevatorNorthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;


        //wall elevator  north  wall
        if (this.map[indices[0]][indices[1]] == 11 || this.map[indices[0]][indices[1]] == 8) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;

        }

        if (this.map[indices[0]][indices[1]] == 9) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }


        return Infinity;

    }
    distanceElevatorSouthWall(position) {

        const indices = this.cartesianToCell(position);

        if (this.map[indices[0]][indices[1]] == 11 || this.map[indices[0]][indices[1]] == 8) {
            console.log("south wall 11 8 ", indices[0], " ", indices[1], " ", this.map[indices[0]][indices[1]]);

            return - position.z + this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }

        if (this.map[indices[0]][indices[1]] == 10) {
            console.log("south wall 10 ", indices[0], " ", indices[1], " ", this.map[indices[0]][indices[1]]);
            return - position.z + this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }


        return Infinity;

    }


    foundExit(position) {
        //  return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };



    enterElevator(position, previousPosition) {
        const indices = this.cartesianToCell(position);
        const indices2 = this.cartesianToCell(previousPosition);
        //console.log("indice", indices);
        //console.log("indices2", indices2);
        let result = false;
        if (this.map[indices[0]][indices[1]] == 8 && indices[0] == indices2[0] && indices[1] - indices2[1] == -1) { //porta a direita
            result = true;
            console.log("tentou entrar na porta da direita para a esquerda");

        }
        else if (this.map[indices[0]][indices[1]] == 9 && indices[0] - indices2[0] == -1 && indices[1] == indices2[1]) { //porta a baixo
            result = true;
            console.log("tentou entrar na porta de baixo para cima");
        }
        else if (this.map[indices[0]][indices[1]] == 10 && indices[0] - indices2[0] == 1 && indices[1] == indices2[1]) { //porta a cima
            result = true;
            console.log("tentou entrar na porta de cima para baixo");

        }
        else if (this.map[indices[0]][indices[1]] == 11 && indices[0] == indices2[0] && indices[1] - indices2[1] == 1) { //porta a esquerda
            result = true;
            console.log("tentou entrar na porta da esquerda para a direita");
        }
        return result;
    }


    enterBridge(position) {
        const indices = [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];


        if ((this.map[indices[0]] != null)) {

            if (this.map[indices[0]][indices[1]] == 12) {
                console.log(this.map[indices[0]][indices[1]] + " X ")
                return this.selectNextFilePathFloorByBridge(indices);
            }

            if (this.map[indices[0]][indices[1]] == 15) {

                console.log(this.map[indices[0]][indices[1]] + " z ")
                return this.selectNextFilePathFloorByBridge(indices);
            }
            indices[1]++
            if (this.map[indices[0]][indices[1]] == 14) {
                console.log(this.map[indices[0]][indices[1]] + " z " )
                return this.selectNextFilePathFloorByBridge(indices);
            }
        }
        indices[0]++;

        if (this.map[indices[0]][indices[1]] == 13) {
            console.log(this.map[indices[0]][indices[1]] + " y " + indices)

            return this.selectNextFilePathFloorByBridge(indices);
        }

        return Infinity;
    }

    selectNextFilePathFloorByBridge(indice) {

        for (let i = 0; i < this.bridgesPoint.length; i++) {

            if (this.bridgesPoint[i].cell[0] == indice[0] && this.bridgesPoint[i].cell[1] == indice[1])

                return this.bridgesPoint[i];
        }
    }
    /*
        loadinInitialPositionBrideByFilePath(filePath){

            console.log(this.bridgesPoint)
            for (let i = 0; i < this.bridgesPoint.length; i++) {

                if(this.bridgesPoint[i].filePath== filePath){

                    console.log("CONFIRM")
                        this.initialDirectionBridge= this.bridgesPoint[i].EntryDirection;
                        this.initialPositionBridge=  this.bridgesPoint[i].cell;
                }

            }

        }*/

}
