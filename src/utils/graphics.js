exports.drawWind = function (scene, wind) {
  wind.sprite = scene.add.container(
    scene.cameras.main.worldView.x +
      scene.cameras.main.width / (2 * scene.cameras.main.zoom),
    scene.cameras.main.worldView.y +
      scene.cameras.main.height / (2 * scene.cameras.main.zoom),
  );

  const text = scene.add.text(0, 0, wind.txt.join("\n"), { align: "center" });
  text.setFont("Courier");
  text.setFontSize(10);
  text.setOrigin(0.5);

  wind.width = wind.width ? wind.width : text.width;
  wind.height = wind.height ? wind.height : text.height;

  text.setDisplaySize(wind.width, wind.height);

  wind.sprite.add(
    scene.add.rectangle(0, 0, wind.width + 4, wind.height + 4, 0x000000),
  );
  wind.sprite.add(
    scene.add.rectangle(0, 0, wind.width + 3, wind.height + 3, 0xffffff),
  );
  let r1 = scene.add.rectangle(0, 0, wind.width + 1, wind.height + 1, 0x000000);
  wind.sprite.add(r1);

  Phaser.Display.Align.In.Center(text, r1);
  wind.sprite.add(text);
  wind.sprite.setDepth(10);
};


exports.drawFloat = function (scene, float) {
  float.sprite?.destroy();
  float.sprite = scene.add
      .bitmapText(
        float.x,
        float.y,
        "arcade",
        float.txt,
      )
      //.setOrigin(0.5)
      .setScale(0.2)
      //.setTintFill(float.color);
}

exports.drawFog = function (scene, fog){
  for(let x = 0; x < fog.length; x++){
    for(let y = 0; y < fog[0].length; y++){
      scene.getTileAt(x, y).visible = fog[x][y];
    } 
  }
}

exports.drawUi = function (scene, ui, hero, click) {
  //this.#hero;
  ui.heart?.destroy();
  ui.health?.destroy();
  ui.separator?.destroy();
  ui.maxHealth?.destroy();


  ui.heart = drawBeatingHeart(scene, hero.health, hero.maxHealth, click)
  ui.health = drawCurrentHealth(scene, hero.health)
  ui.separator = drawSeparator(scene);
  ui.maxHealth = drawMaxHealth(scene, hero.maxHealth);
  
}


const drawBeatingHeart = function(scene, currentHealth, maxHealth, click){

  let heartSprite =
    "heart " +
    (Math.floor(
      click / ((currentHealth * 8) / maxHealth),
    ) %
      8) +
    ".ase";

  return scene.add.image(
    scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 6,
    5,
    "ui",
    heartSprite,
  );
}

const drawCurrentHealth = function(scene, currentHealth){
  return scene.add
    .bitmapText(
      scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 5,
      13,
      "arcade",
      currentHealth,
    )
    .setOrigin(0.5)
    .setScale(0.2)
    .setTintFill(0xff0000);
}

const drawSeparator = function(scene){
  return scene.add
    .bitmapText(
      scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 5,
      18,
      "arcade",
      "-",
    )
    .setOrigin(0.5)
    .setScale(0.2)
    .setTintFill(0xff0000);
}

const drawMaxHealth = function(scene, maxHealth){
  return scene.add
  .bitmapText(
    scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 5,
    23,
    "arcade",
    maxHealth,
  )
  .setOrigin(0.5)
  .setScale(0.2)
  .setTintFill(0xff0000);
}