import { Scene } from "phaser";

class GameOverScene extends Scene {
  constructor() {
    super({
      key: "GameOverScene",
    });
  }

  init() {}

  preload() {}

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.add
      .text(screenCenterX, screenCenterY, "U re ded!", {
        font: "30px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.add
      .text(screenCenterX, screenCenterY + 30, "press a button to restart", {
        font: "15px Arial",
        fill: "#ABB2B9",
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown", () =>
      this.cameras.main.fadeOut(1000, 0, 0, 0),
    );

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.start("GameScene");
      },
    );
  }

  update() {
    //waiting for a button to be pressed to restart level / go back to game
  }
}

export default GameOverScene;
