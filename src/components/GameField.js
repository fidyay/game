import { useState, useCallback, useEffect } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions.js";
import getRandomPosition from "../functions/getRandomPosition.js";
import getNewObstacleType from "../functions/getNewObstacleType.js";
import CageClass from "../classes/Cage.js";
import FloorClass from "../classes/Floor.js";
import ChairClass from "../classes/Chair.js";
import BackpackClass from "../classes/Backpack.js";
import ParrotClass from "../classes/Parrot.js";
import GirlClass from "../classes/Girl.js";
import Particle from "../classes/Particle.js";
import FloorSource from "../sprites/floor.png";
import CageSource from "../sprites/cage.png";
import ChairSource from "../sprites/chair.png";
import BackpackSource from "../sprites/backpack.png";
import ParrotSource from "../sprites/parrot.png";
import GirlRunningSource from "../sprites/girl_running.png";
import GirlJumpingSource from "../sprites/girl_jumping.png";
import GirlSlidingSource from "../sprites/girl_sliding.png";
import BoyRunningSource from "../sprites/boy_running.png";
import PowerUpAudio from "../audio/powerUp.wav";
import HurtAudio from "../audio/hurt.wav";
import Controls from "./Controls.js";
import isMobile from "../functions/isMobile.js";
import BoyClass from "../classes/Boy.js";

const Floor = new Image();
Floor.src = FloorSource;
const Cage = new Image();
Cage.src = CageSource;
const Chair = new Image();
Chair.src = ChairSource;
const Backpack = new Image();
Backpack.src = BackpackSource;
const Parrot = new Image();
Parrot.src = ParrotSource;
const BoyRunning = new Image();
BoyRunning.src = BoyRunningSource;
const GirlRunning = new Image();
GirlRunning.src = GirlRunningSource;
const GirlJumping = new Image();
GirlJumping.src = GirlJumpingSource;
const GirlSliding = new Image();
GirlSliding.src = GirlSlidingSource;

const floorWidth = 192;
const floorHeight = 72;
const cageHeight = 102;
const cageWidth = 94;
const chairHeight = 95;
const chairWidth = 53;
const backpackHeight = 82;
const backpackWidth = 85;
const parrotWidth = 46;
const parrotHeight = 28;
const boyWidth = 66;
const boyHeight = 132;
const girlRunningWidth = 66;
const girlRunningHeight = 132;
const girlJumpingWidth = 78;
const girlJumpingHeight = 156;
const girlSlidingWidth = 120;
const girlSlidingHeight = 78;

const hurt = new Audio(HurtAudio);

export default function GameField({
  setGameStarted,
  setGameLost,
  gameStarted,
  gameLostOnce,
}) {
  const { height, width } = useWindowDimensions();
  const [canvas, setCanvas] = useState(null);

  const getCanvas = useCallback(
    (element) => {
      if (element === null) return;
      setCanvas(element);
    },
    [setCanvas]
  );

  let Player;

  function startGame() {
    if (!canvas) return;
    const cd = canvas.getContext("2d");
    const floorUnits = Math.ceil(width / floorWidth);
    const floors = [];
    const obstacles = [];
    const particles = [];
    let animationFrameId;
    let movingSpeed = 10;
    let perf = performance.now();
    Player = new GirlClass();
    let pointsPerf = performance.now();
    let points = 0;
    let record = localStorage.getItem("record") || 0;
    let gameLost = false;

    // just draw the scene for start menu

    function drawOnce() {
      // drawing wallpaper
      cd.fillStyle = "rgb(190, 178, 178)";
      cd.fillRect(0, 0, width, height);

      if (floors.length === 0) {
        for (let i = 0; i < floorUnits; i++) {
          floors.push(new FloorClass(i * floorWidth));
        }
      }
      floors.forEach((floor) => {
        cd.drawImage(Floor, floor.x, height - floorHeight);
      });
      cd.drawImage(
        GirlRunning,
        0,
        0,
        girlRunningWidth,
        girlRunningHeight,
        width * 0.2,
        height - floorHeight + 12 - girlRunningHeight,
        girlRunningWidth,
        girlRunningHeight
      );
    }

    if (!gameStarted && !gameLostOnce) {
      drawOnce();
      return;
    }
    if (!gameStarted) return;

    document.addEventListener("keydown", (e) => {
      const code = e.code;
      if (!Player) return;
      if (
        Player.currentAction !== "jumping" &&
        Player.currentAction !== "sliding"
      ) {
        if (code === "KeyW" || code === "ArrowUp" || code === "Space") {
          Player.jump();
        }
      }
      if (
        Player.currentAction !== "sliding" &&
        Player.currentAction !== "jumping"
      ) {
        if (code === "KeyS" || code === "ArrowDown") {
          Player.slide();
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      const code = e.code;
      if (!Player) return;
      if (Player.currentAction === "sliding") {
        if (code === "KeyS" || code === "ArrowDown") {
          Player.run();
        }
      }
    });

    function looseGame() {
      Player = null;
      cancelAnimationFrame(animationFrameId);
      gameLost = true;
      setGameStarted(false);
      setGameLost(true);

      hurt.play();
    }

    function draw() {
      if (!gameStarted) return;

      // computing the game lost
      for (const obstacle of obstacles) {
        if (Player.currentAction === "sliding" && obstacle.type !== "parrot") {
          if (
            width * 0.2 + Player.hitboxSlidingWidth > obstacle.hitboxX &&
            width * 0.2 + Player.hitboxSlidingWidth <
              obstacle.hitboxX + obstacle.hitboxWidth
          ) {
            looseGame();
            return;
          } else if (
            width * 0.2 > obstacle.hitboxX &&
            width * 0.2 < obstacle.hitboxX + obstacle.hitboxWidth
          ) {
            looseGame();
            return;
          }
        } else if (Player.currentAction !== "sliding") {
          if (
            height - Player.y >
            height - (obstacle.y + obstacle.hitboxHeight)
          ) {
            if (
              width * 0.2 + Player.hitboxRunningWidth > obstacle.hitboxX &&
              width * 0.2 + Player.hitboxRunningWidth <
                obstacle.hitboxX + obstacle.hitboxWidth
            ) {
              looseGame();
              return;
            } else if (
              width * 0.2 + Player.paddingLeft > obstacle.hitboxX &&
              width * 0.2 + Player.paddingLeft <
                obstacle.hitboxX + obstacle.hitboxWidth
            ) {
              looseGame();
              return;
            }
          }
        }
      }

      // initialize state to start

      if (floors.length === 0) {
        for (let i = 0; i < floorUnits; i++) {
          floors.push(new FloorClass(i * floorWidth));
        }
      }

      if (obstacles.length === 0) {
        obstacles.push(new CageClass(width + getRandomPosition()));
      }

      if (Player.currentAction !== "sliding" && particles.length > 0) {
        particles.length = 0;
      }

      // drawing current state of the game

      cd.clearRect(0, 0, width, height);

      // drawing wallpaper
      cd.fillStyle = "rgb(190, 178, 178)";
      cd.fillRect(0, 0, width, height);

      floors.forEach((floor) => {
        cd.drawImage(Floor, floor.x, height - floorHeight);
      });
      obstacles.forEach((obstacle) => {
        switch (obstacle.type) {
          case "cage":
            cd.drawImage(
              Cage,
              obstacle.x,
              height - floorHeight + 12 - cageHeight
            );
            break;
          case "chair":
            cd.drawImage(
              Chair,
              obstacle.x,
              height - floorHeight + 12 - chairHeight
            );
            break;
          case "backpack":
            cd.drawImage(
              Backpack,
              obstacle.x,
              height - floorHeight + 12 - backpackHeight
            );
            break;
          case "parrot":
            cd.drawImage(
              Parrot,
              obstacle.imageX,
              0,
              parrotWidth,
              parrotHeight,
              obstacle.x,
              height - floorHeight + 12 - parrotHeight - 100,
              parrotWidth,
              parrotHeight
            );
            break;
          case "boy":
            cd.drawImage(
              BoyRunning,
              obstacle.imageX,
              0,
              boyWidth,
              boyHeight,
              obstacle.x,
              height - floorHeight + 12 - boyHeight,
              boyWidth,
              boyHeight
            );
            break;
          default:
            cd.drawImage(
              Cage,
              obstacle.x,
              height - floorHeight + 12 - cageHeight
            );
            break;
        }
      });

      // drawing player

      if (Player.currentAction === "running") {
        cd.drawImage(
          GirlRunning,
          Player.imageX,
          0,
          girlRunningWidth,
          girlRunningHeight,
          width * 0.2,
          height - floorHeight + 12 - girlRunningHeight,
          girlRunningWidth,
          girlRunningHeight
        );
      } else if (Player.currentAction === "jumping") {
        cd.drawImage(
          GirlJumping,
          Player.jumpImageX,
          0,
          girlJumpingWidth,
          girlJumpingHeight,
          width * 0.2,
          height - floorHeight + 12 - girlJumpingHeight - Player.jumpY,
          girlJumpingWidth,
          girlJumpingHeight
        );
      } else if (Player.currentAction === "sliding") {
        cd.drawImage(
          GirlSliding,
          Player.imageX,
          0,
          girlSlidingWidth,
          girlSlidingHeight,
          width * 0.2,
          height - floorHeight + 12 - girlSlidingHeight,
          girlSlidingWidth,
          girlSlidingHeight
        );
      }

      // drawing particles

      if (Player.currentAction === "sliding") {
        const transparentParticlesIndex = [];
        particles.forEach((particle, index) => {
          if (particle._opacity <= 0) {
            transparentParticlesIndex.push(index);
          }
        });
        transparentParticlesIndex.forEach((index) => {
          particles.splice(index, 1);
        });
        particles.forEach((particle) => {
          cd.fillStyle = `rgba(238, 211, 164, ${particle.opacity})`;
          cd.fillRect(particle.x, particle.y, particle.width, particle.height);
        });
      }

      // drawing game points
      cd.font = "30px Roboto";
      cd.fillStyle = "#e5da1f";
      cd.lineWidth = 2;
      const pointsMeasurement = cd.measureText(points);
      cd.fillText(points, width - 50 - pointsMeasurement.width, 50);
      cd.strokeText(points, width - 50 - pointsMeasurement.width, 50);
      // drawing record
      cd.fillStyle = "#957b09";
      const recordMeasurement = cd.measureText(record);
      cd.fillText(
        record,
        width - 60 - pointsMeasurement.width - recordMeasurement.width,
        50
      );
      cd.strokeText(
        record,
        width - 60 - pointsMeasurement.width - recordMeasurement.width,
        50
      );

      // computing next state

      // adding particles while sliding
      if (Player.currentAction === "sliding") {
        particles.push(new Particle(width, height, floorHeight));
      }

      // computing points
      if (performance.now() - pointsPerf >= 60) {
        pointsPerf = performance.now();
        points++;
        if (points > record) {
          record = points;
          localStorage.setItem("record", record);
        }

        // playing powerUp
        if (points % 100 === 0) {
          const powerUp = new Audio(PowerUpAudio);
          powerUp.play();
        }
      }

      if (performance.now() - perf >= 16) {
        perf = performance.now();
        // computing moving speed
        if (movingSpeed < 25) {
          movingSpeed += 0.005;
        }

        // computing floors

        floors.forEach((floor) => {
          floor.x -= movingSpeed;
        });

        if (floors[0].x + floorWidth <= 0) {
          floors.shift();
        }

        if (floors[floors.length - 1].x + floorWidth <= width) {
          floors.push(new FloorClass(floors[floors.length - 1].x + floorWidth));
        }

        // computing obstacles
        obstacles.forEach((obstacle) => {
          obstacle.x -= movingSpeed;
        });

        if (obstacles[0].x + cageWidth <= 0) {
          obstacles.shift();
        }

        if (obstacles[obstacles.length - 1].x + cageWidth <= width) {
          const type = getNewObstacleType();
          let previousObstacleWidth;
          switch (obstacles[obstacles.length - 1].type) {
            case "cage":
              previousObstacleWidth = cageWidth;
              break;
            case "chair":
              previousObstacleWidth = chairWidth;
              break;
            case "backpack":
              previousObstacleWidth = backpackWidth;
              break;
            case "parrot":
              previousObstacleWidth = parrotWidth;
              break;
            case "boy":
              previousObstacleWidth = boyWidth;
              break;
            default:
              previousObstacleWidth = cageWidth;
              break;
          }
          switch (type) {
            case "cage":
              obstacles.push(
                new CageClass(
                  obstacles[obstacles.length - 1].x +
                    previousObstacleWidth +
                    getRandomPosition()
                )
              );
              break;
            case "chair":
              obstacles.push(
                new ChairClass(
                  obstacles[obstacles.length - 1].x +
                    previousObstacleWidth +
                    getRandomPosition()
                )
              );
              break;
            case "backpack":
              obstacles.push(
                new BackpackClass(
                  obstacles[obstacles.length - 1].x +
                    previousObstacleWidth +
                    getRandomPosition()
                )
              );
              break;
            case "parrot":
              obstacles.push(
                new ParrotClass(
                  obstacles[obstacles.length - 1].x +
                    previousObstacleWidth +
                    getRandomPosition()
                )
              );
              break;
            case "boy":
              obstacles.push(
                new BoyClass(
                  obstacles[obstacles.length - 1].x +
                    previousObstacleWidth +
                    getRandomPosition()
                )
              );
              break;
            default:
              obstacles.push(
                new CageClass(
                  obstacles[obstacles.length - 1].x +
                    previousObstacleWidth +
                    getRandomPosition()
                )
              );
              break;
          }
        }
      }

      if (!gameLost && gameStarted) {
        animationFrameId = requestAnimationFrame(draw);
      }
    }

    if (gameStarted) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  useEffect(startGame, [
    canvas,
    width,
    height,
    gameStarted,
    gameLostOnce,
    setGameStarted,
    setGameLost,
  ]);

  return (
    <>
      <canvas ref={getCanvas} height={height} width={width} />
      {isMobile() && (
        <Controls
          jump={() => {
            if (!Player) return;
            if (
              Player.currentAction !== "jumping" &&
              Player.currentAction !== "sliding"
            ) {
              Player.jump();
            }
          }}
          startSliding={() => {
            if (!Player) return;
            if (
              Player.currentAction !== "jumping" &&
              Player.currentAction !== "sliding"
            ) {
              Player.slide();
            }
          }}
          stopSliding={() => {
            if (!Player) return;
            if (Player.currentAction === "sliding") {
              Player.run();
            }
          }}
        />
      )}
    </>
  );
}
