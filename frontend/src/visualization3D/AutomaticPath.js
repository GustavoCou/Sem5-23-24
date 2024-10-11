import * as THREE from 'three';
import Maze from "./maze";
export default class AutomaticPath extends THREE.Group {

  constructor(player, paths = {}, speed = 0.03, maze, userInterface) {
    super();
    this.nextIdentifier = "";
    this.moveSpeed = speed;
    this.player = player;
    this.paths = paths; // Mudança para um objeto
    this.currentPath = []; // Agora armazena o caminho atual como um array de Vector3
    this.currentTargetIndex = 0;
    this.isMoving = false;
    this.maze = maze;
    this.userInterface = userInterface;
    this.getJsonFromMaze(); // Adiciona esta linha
  }

  setMaze(newMaze) {
    this.maze = newMaze;
    this.getJsonFromMaze(); // Chama novamente para atualizar com base no novo maze
  }

  getJsonFromMaze() {
    this.currentJsonFile = this.maze.url.split('/').pop().split('.')[0];
    console.log(this.currentJsonFile + "GET JSON FROM MAZE ");
    this.setPathsBasedOnJson();
  }

  setPathsBasedOnJson() {
    if (this.paths[this.currentJsonFile]) {
      console.log(this.paths + "THIS. PATHS");
      this.currentPath = this.paths[this.currentJsonFile];
      console.log(this.currentPath + "THIS.CURRENT PATH")
    } else {
      console.log("Nenhum caminho encontrado para o JSON atual: " + this.currentJsonFile);
      this.currentPath = [];
    }
    this.currentTargetIndex = 0;
  }

  setPaths(newPaths) {
    this.paths = newPaths; // Supondo que newPaths seja um objeto formatado corretamente
    this.currentPath = this.paths[this.currentJsonFile] || []; // Inicializa com o caminho do JSON atual
    this.currentTargetIndex = 0;
  }

  start() {
    console.log("Iniciando AutomaticPath com caminho:", this.currentPath);
    if (this.currentPath && this.currentPath.length > 0) {
      this.isMoving = true;
      this.moveToNextPoint();
    } else {
      console.log("Caminho atual está vazio ou indefinido.");
    }
  }

  moveToNextPoint() {
    this.nextIdentifier = this.findNextPathIdentifier();

    if (this.currentTargetIndex < this.currentPath.length) {
      this.targetPosition = this.currentPath[this.currentTargetIndex];
      // console.log("Movendo para o próximo ponto:", this.targetPosition);
      this.currentTargetIndex++;

    } else {
      const nextPathIdentifier = this.findNextPathIdentifier();

      setTimeout(() => {

        const newJsonFile = this.maze.url.split('/').pop().split('.')[0];

        if (nextPathIdentifier && newJsonFile === nextPathIdentifier) {
          this.currentJsonFile = nextPathIdentifier; // Atualiza o identificador do caminho
          this.setPathsBasedOnJson(); // Atualiza o caminho
          console.log("Transição para", nextPathIdentifier);
          this.moveToNextPoint(); // Continua o movimento no novo caminho
        } else {
          console.log("Nenhum próximo caminho encontrado ou JSON incompatível. Parando movimento.");
          this.maze.flagAutomaticPathElevator = false;
          this.isMoving = false;
          this.currentTargetIndex = 0;
        }
      }, 7000);

    }
  }

  findNextPathIdentifier() {
    // Delay the method execution for 4 seconds
    // Obtem a lista de identificadores de caminho
    const pathIdentifiers = Object.keys(this.paths);

    // Encontra o índice do identificador atual
    const currentIndex = pathIdentifiers.indexOf(this.currentJsonFile);

    // Verifica se existe um próximo identificador
    if (currentIndex >= 0 && currentIndex < pathIdentifiers.length - 1) {
      return pathIdentifiers[currentIndex + 1];
    }

    // Retorna null se não houver próximo identificador
    return null;
  }

  handleElevatorCollision(nextIdentifier) {
    console.log("NEXT IDENTIFIER " + nextIdentifier);
    if (nextIdentifier) {
      console.log("IF DO NEXT IDENTIFIER");
      this.simulateElevatorButtonPress();
    }
  }

  simulateElevatorButtonPress() {
    // userinterface.loadMapFromUrl -> fechar o popup aberto -> continuar caminho
    this.userInterface.loadMapFromURL(this.currentJsonFile);
  }


  update()
  {
    const newJsonFile = this.maze.url.split('/').pop().split('.')[0];
    if (newJsonFile !== this.currentJsonFile) {
      console.log("Mudança de JSON detectada, atualizando caminho para", newJsonFile);
      this.currentJsonFile = newJsonFile;
      this.setPathsBasedOnJson();

      // Reiniciar o movimento se já estiver em movimento
      if (this.isMoving) {
        this.start();
      }
    }

    if (this.isMoving && this.targetPosition) {
      const distanceToTarget = this.targetPosition.distanceTo(this.player.position);
      const lerpFactor = Math.min(this.moveSpeed / distanceToTarget, 1);
      this.player.position.lerp(this.targetPosition, lerpFactor);

      if (distanceToTarget < 0.1 * this.moveSpeed) {
        this.moveToNextPoint();
      }
    }
  }
}
