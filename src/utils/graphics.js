////
exports.clear = function (scene) {

}

////////////////////////////// FEEDBACK //////////////////////////////
exports.drawWind = function (scene, wind) {
  wind.sprite = scene.add.container(
    scene.cameras.main.worldView.x + scene.cameras.main.width / (2 * scene.cameras.main.zoom),
    scene.cameras.main.worldView.y + scene.cameras.main.height / (2 * scene.cameras.main.zoom),
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
        float.x, float.y,
        "arcade",
        float.txt,
      )
      //.setOrigin(0.5)
      .setScale(0.2)
      .setTintFill(float.color.value);
}

////////////////////////////// MAPS //////////////////////////////

exports.drawFog = function (scene, fog){
  for(let x = 0; x < fog.length; x++){
    for(let y = 0; y < fog[0].length; y++){
      scene.getTileAt(x, y).visible = fog[x][y];
    } 
  }
}

////////////////////////////// INVENTORY //////////////////////////////

exports.drawInventory = function (scene, hero, show){
  let inventory = hero.inventory;
  //clear
  inventory.sprite?.destroy()
  if(!show) return;
  //Draw 4 lines
  inventory.sprite = scene.add.container(
    scene.cameras.main.worldView.x + scene.cameras.main.width / (2 * scene.cameras.main.zoom),
    scene.cameras.main.worldView.y + scene.cameras.main.height / (2 * scene.cameras.main.zoom),
  );

  let elementsToDisplay = [...inventory.elements].map(e => e.name());
  
  while (6 - elementsToDisplay.length != 0) {
    elementsToDisplay.push('...' )    
  }

  elementsToDisplay = elementsToDisplay.map((element, index) => (inventory.position == index++ ? '> ' : '  ') + element + ' '.repeat(Math.max(0, 24-element.length)))

  const text = scene.add.text(0, 0, elementsToDisplay.join("\n"), { align: "center" });
  text.setFont("Courier");
  text.setFontSize(7);
  text.setOrigin(0.5);

  text.setDisplaySize(text.width, text.height);

  inventory.sprite.add(
    scene.add.rectangle(0, 0, text.width + 4, text.height + 4, 0x000000),
  );
  inventory.sprite.add(
    scene.add.rectangle(0, 0, text.width + 3, text.height + 3, 0xffffff),
  );
  let r1 = scene.add.rectangle(0, 0, text.width + 1, text.height + 1, 0x000000);
  inventory.sprite.add(r1);

  Phaser.Display.Align.In.Center(text, r1);
  inventory.sprite.add(text);
  inventory.sprite.setDepth(10);

  //draw cadre
  //draw fleche
  //
}

exports.drawSubInventory = function (scene, hero, show){

  let subInventory = hero.inventory.subInventory;
  //clear
  subInventory.sprite?.destroy()
  if(!show) return;

  subInventory.sprite = scene.add.container(
    50 + scene.cameras.main.worldView.x + scene.cameras.main.width / (2 * scene.cameras.main.zoom),
    20 + scene.cameras.main.worldView.y + scene.cameras.main.height / (2 * scene.cameras.main.zoom),
  );

  let elementsToDisplay = ["drink ", "launch", "drop  "]
  elementsToDisplay = elementsToDisplay.map((element, index) => (subInventory.position == index++ ? '> ' : '  ') + element)

  const text = scene.add.text(0, 0, elementsToDisplay.join("\n"), { align: "center" });
  text.setFont("Courier");
  text.setFontSize(7);
  text.setOrigin(0.5);
  
  text.setDisplaySize(text.width, text.height);

  subInventory.sprite.add(
    scene.add.rectangle(0, 0, text.width + 4, text.height + 4, 0x000000),
  );
  subInventory.sprite.add(
    scene.add.rectangle(0, 0, text.width + 3, text.height + 3, 0xffffff),
  );
  let r1 = scene.add.rectangle(0, 0, text.width + 1, text.height + 1, 0x000000);
  subInventory.sprite.add(r1);

  Phaser.Display.Align.In.Center(text, r1);
  subInventory.sprite.add(text);
  subInventory.sprite.setDepth(10);
}

////////////////////////////// UI //////////////////////////////

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
    (Math.floor( click / ((currentHealth * 8) / maxHealth)) % 8) +
    ".ase";

  return scene.add.image(
    scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 6, 5,
    "ui",
    heartSprite,
  );
}

const drawCurrentHealth = function(scene, currentHealth){
  return scene.add
    .bitmapText(
      scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 5, 13,
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
      scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 5, 18,
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
    scene.cameras.main.worldView.x + scene.cameras.main.width / 2 - 5, 23,
    "arcade",
    maxHealth,
  )
  .setOrigin(0.5)
  .setScale(0.2)
  .setTintFill(0xff0000);
}