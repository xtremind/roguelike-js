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

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
      
    const mainTextStyle = { font: "30px Arial", fill: "#ffffff" };
    const subTextStyle = { font: "15px Arial", fill: "#ABB2B9" };

    // Main game over text
    this.add
      .text(screenCenterX, screenCenterY, "U re ded!", mainTextStyle)
      .setOrigin(0.5);
      
    // Subtext for restarting the game
    this.add
      .text(screenCenterX, screenCenterY + 30, "press a button to restart", subTextStyle)
      .setOrigin(0.5);

    // Listen for any key press to restart the game
    this.input.keyboard.once("keydown", () =>
      this.cameras.main.fadeOut(1000, 0, 0, 0),
    );

    // Additional logic for when the fade out completes
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
