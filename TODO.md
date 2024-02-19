# Creating a roguelike

## Statements

- light color when interaction is possible
- dark color when no interaction
- no diagonal movement

## tasks

### Step 1 : basic movement

- [x] TILES : draw character (4 frames to animate, with up/down head animation)
- [x] TILES : draw ground tile (simple dot at center to help know the space for each room)
- [x] TILES : draw wall tile (brick like)
- [x] TILES : draw down stair tile
- [x] TILES : draw up stair tile
- [x] STAGE : define the stages of your game (START, GAME, GAMEOVER)
- [x] STAGE : display an empty screen with a specific color
- [x] TILESET : draw a first map/level
- [x] DRAW GAME : display the first map/level
- [x] DRAW GAME : display one frame of the character
- [x] UPDATE GAME : move the character in four directions one case at a time
- [x] DRAW GAME : change color of the character from grey to yellow

### Step 2 : animate character, and allow move between case

- [x] ANIMATION : hero
- [x] REFACTO : compute next frame for error depending on frameCount from list of sprites of object(hero)
- [x] REFACTO : draw element from sprite, position and color
- [x] STAGE : create new stage for compute movement between 2 cases (PTURN)
- [x] UPDATE GAME : add an offset (x/y) of 8 pixels, depending on direction
- [x] UPDATE GAME : if offset > 0, then go, to stage PTURN
- [x] UPDATE PTURN : reduce offset from value to 0
- [x] UPDATE PTURN : if offset = 0, then go, to stage GAME

### Step 3 : Token optimization

- [x] HERO : create tables with value depending on directions
- [x] HERO : create a function move that take into account a direction pressed
- [x] UPDATE GAME : change method by calling move hero with direction
- [x] HERO : create a timer variable
- [x] HERO : create starting offset variables
- [x] UPDATE : the timer is equal the minimum between itself + value and 1
- [x] UPDATE : update current offset with starting offset and timer
- [x] UPDATE : if timer is equals to one, to stage GAME

### Step 4 : Wall collisions

- [x] DRAW GAME : draw a flip hero when moving to the left
- [x] DRAW GAME : a flip hero stay flipped if moving up/down
- [x] INTERACTION : define which tiles are solid
- [x] INTERACTION : define next tile
- [x] INTERACTION : if next tile is solid, don't move
- [x] INTERACTION : if next tile is solid, add feedback (bump => forward then backward)

### Step 5 : Object interaction

- [x] LEVEL DESIGN : create a sort of first level
- [x] TILES : draw up door tile
- [x] TILES : draw up closed chest tile
- [x] TILES : draw up opened chest tile
- [x] TILES : draw up jar tile
- [x] TILES : draw up panel tile
- [x] INTERACTION : update solid tiles with new tiles
- [x] INTERACTION : define which tiles are interactive
- [x] LEVEL DESIGN : update first level with all new tiles
- [x] INTERACTION : when detect bumping, check if expected destination is interactive tiles
- [x] INTERACTION : when detect bumping into a jar, destroy it
- [x] INTERACTION : when detect bumping into a closed chest, open it
- [x] INTERACTION : when detect bumping into a door, destroy it
- [x] INTERACTION : when detect bumping into a panel, ...
- [x] UPDATE GAME : add a button buffer, that will contain all pressed buttons (only one more button is enough, since it's a roguelike)
- [x] UPDATE GAME : from button buffer, move player

### Step 6 : Text Boxes

=> https://sfxr.me/

- [x] SOUND : create "walking" sound
- [x] SOUND : create "opening door" sound
- [x] SOUND : create "opening chest" sound
- [x] SOUND : create "bad things" sound
- [x] SOUND : create "breaking vase" sound
- [x] INTERACTION : add sound effect for each action
- [x] REFACTO : extract buffer button usage in a function
- [x] TEXTBOX : create a function that create a text do display
- [x] TEXTBOX : update previous function by adding the object in a list / array
- [x] TEXTBOX : create a function that draw a box with border
- [x] TEXTBOX : update previous function by displaying text
- [x] TEXTBOX : update previous function by multiple textbox (like multi-tab)

### Step 7 : Messages System

- [x] INTERACTION : show textbox when interacting with panel
- [x] TEXTBOX : compute the width of the box containing the message
- [x] TEXTBOX : centering the textbox
- [x] TEXTBOX : add space after/before message in textbox
- [x] TEXTBOX : displayed message disappear after a certain amount of time
- [x] TEXTBOX : add animation when message disappear (like parchment is opened)
- [x] TALK : message without duration, but disappear after button pressed
- [O] TALK : display button to push to close the textbox on the bottom right
- [O] TALK : displayed button move up and down
- [x] TALK : don't move until talk disappear
- [x] PANEL : add multiple panel, with different text in it

### Step 8 : Monsters

- [x] TILES : draw a monster : slime (4 frames to animate, with up/down head animation)
- [x] DRAW GAME : display slime
- [x] MOB : create a list than contain mobs
- [x] MOB : create a function to add a mob
- [x] DRAW GAME : draw mob from list

### Step 9 : Mob System

- [x] CHARACTER : use it to define a mob
- [x] MOB : create multiple mob
- [x] MOB : create a function to create a mob on a certain position
- [ ] INTERACTION : create a function to determine if a position is walkable
- [ ] INTERACTION : create a function to determine if a position is in bound
- [x] INTERACTION : create a function to retrieve a mob from a position if existing
- [x] INTERACTION : do bump when hitting a mob
- [x] INTERACTION : create an empty function to that will attack a mob
- [x] GLOBAL : make p_timer a global variable

### Step 10 : Combat

- [x] CHARACTER : add attack / current energy / max energy depending on type
- [x] INTERACTION : create a function that will reduce the energy from the mob depending on the attack
- [x] CHARACTER : create a function that will determine if it's dead (HP <= 0)
- [x] INTERACTION : create a function that delete a mob if killed
- [x] INTERACTION : create a function that will change the color of the attacked mob if attacked to white
- [x] SOUND : create "attack a mob" sound
- [x] SOUND : create "been hit" sound
- [x] INTERACTION : create a function that show the reduce of life upper the mob

### Step 11 : Simple Path Finding

- [o] MAP : put monster sprite
- [o] LEVEL : use monster sprite as a mob character generator at the starting game
- [o] LEVEL : change monster sprite by floor once generated
- [x] UTILS : create a function that compute distance between 2 points
- [x] UPDATE : create a function that will loop on all mobs
- [x] UPDATE : find the lower distance from mob to hero after moving
- [x] UPDATE : move mob depending on lowest distance
- [x] UPDATE : create an update mob turn function
- [x] UPDATE : call the new function on update mob turn
- [x] UPDATE : go update mob turn once update player turn is done
- [x] UPDATE : go update player turn once update mob turn is done
- [x] UPDATE : verify that the lower distance is walkable
- [x] UPDATE : if the distance between mob and player is 1, attack player (BUMP + ATTACK), else move to player
- [x] UPDATE : add sound when been attacked
- [x] SPRITE : add flashed player sprite

### Step 12 : Death

- [x] UPDATE : create a function to check death of player
- [x] UPDATE : if player is dead, change upd and drw to gameover function
- [x] UPDATE : once player has played and before AI turn, check player death
- [x] DRAW : on GameOver, display a new screen
- [x] UPDATE : on GameOver screen, restart game once pushing a button
- [x] UPDATE : create a function to initiate game
- [x] DRAW : show floor on mob position
- [x] INIT : don't override mob by floor
- [x] UPDATE : mob can move only if alive
- [x] UPDATE : once player has played and before AI turn, check mob death
- [x] DRAW : blink mob if dead, and before removing it
- [x] DRAW : Draw player on top of all mobs

### Step 13 : HP Display

- [x] FADE PREREQUIRE : change palette color manually
- [x] DRAW : create a function that will allow fading in
- [x] DRAW : create a function that will allow fading out
- [x] DRAW : fading in once game start
- [x] DRAW : fading out once hero die
- [x] DRAW : update fadeout function by adding wait between each draw
- [x] DRAW : create function that will display hero's current health
- [x] DRAW : update function that will display hero's max health
- [x] DRAW : update function that will display a heart sprite
- [x] DRAW : heart sprite blink faster on lower

### Step 14 : AI

- [x] INTERACTION : create a function that will say if there's a clear path between 2 points (LINE DRAWING ALGORITHM)
- [x] UPDATE : if mob has seen player, then next turn is move
- [x] UPDATE : if mob has seen player, float to show that it has view hero (!)
- [x] UPDATE : if mob has seen player, add player position has new target
- [x] UPDATE : if mob has arrived at target, then next turn is wait
- [x] UPDATE : if mob has arrived at target, add float to show that it didn't see any more view hero (?)

### Step 15 : Fog

- [x] FLOOR : create another array that will store if tile has been seen
- [x] FLOOR : create a function that will allow to tell that tile has been seen
- [x] DRAW : display tile only if it has been seen
- [x] INTERACTION : extract from seen function so that we can use two coordinate
- [x] START : once floor and hero create, unfog tiles
- [x] UPDATE : once hero create has moved, unfog tiles

### Step 16 : Fog polish

- [x] TILES : define which tiles blocked the sight
- [x] INTERACTION : add a flag on lineofsight, to define if we need to check walkable or blocking view tiles
- [x] UPDATE : if a tile is unfogged, check also if the neighboored tiles are blocking view
- [x] CHARACTER : add a sight range
- [x] INTERACTION : mob detect hero once in mob sight range
- [x] UPDATE : unfog tile once in hero sight range

### Step 17 : token tweaks

- [x] REVIEW : declare all variables of same type for a function in one line
- [x] REVIEW : review how are affected variables (+=, ...)
- [x] REVIEW : use ternary operation ( ... ? ... : ... )

### Step 18 : Pathfinding (Dijkstra)

- [x] UTILS : create a map with the distance of a case from the position
- [x] UTILS : create a function that return the computed array
- [x] UTILS : create a function that will take a position and a weight, save it in the map if not affected or lower and walkable, and call the map for the adjacent case with weight+1
- [x] UPDATE : update distance map once mob target is acquired or updated
- [x] UPDATE : move mob to the lower value from distance map previously created

### Step 19 : Path Tweaking

- [x] UPDATE : mob choose randomly a path if multiple possibilities
- [x] UPDATE : mob don't move where there's already a mob

####

- [ ] UPDATE : mob don't move when player don't move (skip turn by bumping for example)
- [ ] UPDATE : if mob don't move for a certain time => remove target && WAIT (optional)
- [ ] UTILS : create a function walkable (not outside and not solid)
- [ ] UTILS : add option to dijkstra map so that it stopped once origin is found (optional)

### Step 20 : Inventory UI

- [ ] CACHE : create an array to list up to 6 inventory elements
- [ ] CACHE : create an array of 2 elements to list equiped elements (weapon, armor)
- [ ] UPDATE : create a function "game inventory"
- [ ] UTILS : create a function that will change update function to "game inventory"
- [ ] UTILS : display a box in full screen
- [ ] UPDATE : if "button" is pushed, launch utils function
- [ ] UPDATE "game inventory" : if button is pushed, change update to move player
- [ ] UPDATE "game inventory" : if button is pushed, hide inventory window
- [ ] UTILS : display element from equipment
- [ ] UTILS : display element from inventory
- [ ] UTILS : display dots if empty slot in inventory
- [ ] UTILS : display separator between equipment and inventory
- [ ] UTILS : save/edit cursor position
- [ ] UTILS : display text a bit on the right
- [ ] UTILS : draw cursor position left of the text
- [ ] UPDATE : move the cursor between lines
- [ ] UPDATE : add attention to cursor (move left & right with time)
- [ ] DRAW : change color text depending of element
- [ ] DRAW : display hero's stats on to of inventory
- [ ] ITEM : define an class ITEM (name)
- [ ] ITEM : initiate a list of existing item
- [ ] UTILS : define a function that will return an empty slot in inventory
- [ ] UTILS : define take item if existing empty slot, and put item in inventory
- [ ] DRAW : change color text depending of item
- [ ] DRAW : display 'weapon' if empty slot
- [ ] DRAW : display 'armor' if empty slot
- [ ] UTILS : add element in equipment
- [ ] DRAW : don't animate character when inventory is opened

### Step 21 : Use Menu

- [ ] UTILS : change int into Button
- [ ] MENU : cycle when top/bottom when moving in menu
- [ ] DRAW : draw mocked 'use menu' on over and right of 'inventory'
- [ ] UPDATE : when pussing 'button A' in 'inventory', display 'use menu'
- [ ] UPDATE : when pussing 'button A' in 'inventory' on empty slot, don't display 'use menu'
- [ ] UPDATE : when pussing 'button B' in 'use menu', display 'inventory'
- [ ] UPDATE : when pussing 'button menu' in 'use menu', return to game
- [ ] DRAW : draw selected line in 'use menu'
- [ ] UPDATE : when pussing 'up/down' in 'use menu', update selected line
- [ ] UPDATE : when pussing 'up/down' in 'use menu', cycle when top/bottom when moving
- [ ] DRAW : compute position of use menu depending of inventory selected line
- [ ] ITEM : define a type of item (weapon, armor, food, action/throwable)
- [ ] DRAW : define use menu depending of weapon item : equip / trash
- [ ] DRAW : define use menu depending of armor item : equip / trash
- [ ] DRAW : define use menu depending of food item : eat / throw / trash
- [ ] DRAW : define use menu depending of throwable item : throw / trash

### Step 22 : Equipment

- [ ] UPDATE : create a function that will manage 'use item'
- [ ] USE ITEM : determine action from sub menu selection
- [ ] USE ITEM : add switch depending of action
- [ ] USE ITEM : once use, return into menu (or game -> not sure)
- [ ] USE ITEM : create a function for trashing things
- [ ] TRASH ITEM : remove item from inventory / equipment
- [ ] USE ITEM : create a function for equip things
- [ ] EQUIP ITEM : add/replace item into equipment, depending of type (weapon / armor)
- [ ] EQUIP ITEM : remove item from inventory (other option, swap equipment and inventory item)
- [ ] ITEM : adding stat1 that will impact user depending of item type
- [ ] MOB : create a function that will update stats
- [ ] EQUIP ITEM : once equiped, change hero stats
- [ ] DRAW MENU : display dynamic value for hero attack
- [ ] ATTACK MOB : compute with new attack value
- [ ] FLOAT : display dynamic value from last attack
- [ ] UPDATE STATS : change hero armor depending of equipment from stat1
- [ ] ATTACK MOB : compute with max(0, new attack value - random(0, armor.max))
- [ ] REFACTO : use String in place of char\*

####

- [ ] INVENTORY : don't select equipment, only inventory

### Step 23 : Eating

- [ ] MOB : create a function that will eat something
- [ ] EAT : add energy to health mob
- [ ] EAT : energy can't go higher then max health
- [ ] EAT : flash mob
- [ ] EAT : if delta energy > 0, add float in green (restore)
- [ ] EAT : if delta energy < 0, add float in purple (poison)
- [ ] UPDATE : add a function that once hero has eat, a turn is done
- [ ] USE ITEM : delete eated food
- [ ] UPDATE : create a throw update function
- [ ] CACHE : save a direction throw
- [ ] THROW UPDATE : if pressed button is direction, save it
- [ ] THROW UPDATE : if pressed button is B, return into update game
- [ ] UPDATE : create a function that will prepare throw
- [ ] THROW UPDATE : if pressed button is A, prepare throw
- [ ] DRAW : create a function throw
- [ ] THROW DRAW : if throw direction is defined, draw a (blinking) line from hero to 2 block

### Step 24 : Throw UI

- [ ] THROW DRAW : draw line until tile / end of floor
- [ ] THROW DRAW : draw line until mob
- [ ] THROW DRAW : draw dotted line from pattern (010101 => . . .)
- [ ] THROW DRAW : draw black lines around dotted line
- [ ] THROW DRAW : draw dotted line from block around hero
- [ ] THROW DRAW : draw cross (x or +) on tile where it will hit
- [ ] THROW DRAW : draw cross (x or +) on tile before it escape screen (mid ?)
- [ ] THROW DRAW : animate dotted line (from hero to end)

### Step 25 : Throwing

- [ ] UPDATE THROW : animate hero with bump toward the direction of the throw once throwing
- [ ] UPDATE THROW : delete thrown item
- [ ] UPDATE THROW : if thrown item if throwable and hit mob, hit mob with stat
- [ ] UPDATE THROW : if thrown item if food and hit mob, mob eat item
- [ ] UPDATE THROW : once throwing, a turn is done
- [ ] UPDATE THROW : when preparing throw, if target is mob, made it blink

### Step 26 : Gameplay Test

- [ ] INTERACT : create a function tha will give an random item, 1 out of 6 chances
- [ ] INTERACT CHEST : call get item
- [ ] INTERACT VASE : call get item
- [ ] UPDATE HERO : don't do a turn when bumping a wall

### Step 27 : Random Room

- [ ] FLOOR : create a function to generate a new floor
- [ ] GENERATE FLOOR : initiate floor with wall everywhere
- [ ] GENERATE FLOOR : create a function to generate rooms
- [ ] GENERATE ROOMS : create a function to generate one room with maximum width / height as a parameter
- [ ] GENERATE ROOM : define width of room (random better 3 and maximum width)
- [ ] GENERATE ROOM : define height of room (random better 3 and maximum height)
- [ ] GENERATE ROOM : define a first coordinate
- [ ] GENERATE ROOMS : define a function to place a room
- [ ] PLACE ROOM : define a list of candidate where to place a room
- [ ] PLACE ROOM : check if a room fit, for all position in floor , and add the position in candidate
- [ ] PLACE ROOM : if no candidate, return false
- [ ] PLACE ROOM : define a function to put a room on floor
- [ ] PUT ROOM : change floor to empty where room fit
- [ ] PLACE ROOM : if candidates, put room in one of them, and return true
- [ ] PLACE ROOM : define a function to verify if a room fit in a position
- [ ] ROOM FIT : return true
- [ ] PLACE ROOM : define a function to get a random candidate
- [ ] RANDOM CANDIDATE : return a candidate from a list of candidates
- [ ] ROOM FIT : verify if empty space exist on floor, on room passed as parameter
- [ ] ROOM FIT : verify if empty space exist on floor, on 1 case around room passed as parameter
- [ ] GENERATE ROOMS : generate room until 5 are put
- [ ] GENERATE ROOMS : accept up until 5 failures
- [ ] GENERATE ROOMS : if a room is put, reduce max height or max width depending on size of the room
- [ ] GENERATE ROOM : define width / height so it doesn't exceed a certain area

### Step 28 : Tile Signature

- [ ] FLOOR : create a function get signature for a position
- [ ] GET SIGNATURE : look at all positons around the one in parameter
- [ ] GET SIGNATURE : define a binary as a signature
- [ ] GET SIGNATURE : if position is walkable, add 0 else 1 in signature then shift left (ex : 1 => 10, ...)

### Step 29 : Signature Mask

- [ ] FLOOR : create a function to create the maze between rooms
- [ ] MAZE : for all tiles, check if tile is wall and signature is 0B11111111 (surrounded by wall)
- [ ] TILE : create a new tile PATH, with same pattern as wall but in another color
- [ ] MAZE : if check is true, set current tile as PATH
- [ ] FLOOR : create a function to verify if 2 binary are equals, with a possible mask (see bellow)
- [ ] FLOOR : create a function to verify if a tile can be carve (inbound and one binary comparison match)
- [ ] MAZE : use binary comparison to check signature

| BINARY    | MAP                          |
| --------- | ---------------------------- |
| 1111 1111 | <pre>FFF<br>FFF<br>FFF</pre> |
| 1110 ?11? | <pre>?.?<br>FFF<br>FFF</pre> |
| 1011 11?? | <pre>?FF<br>.FF<br>?FF</pre> |
| 1101 ??11 | <pre>FF?<br>FF.<br>FF?</pre> |
| 0111 1??1 | <pre>FFF<br>FFF<br>?.?</pre> |

### Step 30 : Maze Worm

- [ ] MAZE : create a list of candidates with a tiles with only wall around
- [ ] FLOOR : create a new function do create path
- [ ] MAZE : if at list there's one candidate, get a random one
- [ ] MAZE : pass the candidate to the function PATH
- [ ] PATH : define a direction as DOWN first
- [ ] PATH : while current position is carvable, set position as floor
- [ ] PATH : compute next position from direction
- [ ] PATH : define a direction randomly
- [ ] PATH : while carving, if next position is not carvable, find next carvable from surrounding
- [ ] MAZE : repeat until no more candidate
- [ ] PATH : 50% chance to change direction while carving
- [ ] PATH : try changing direction at least 2 step after a change

### Step 31 : Merging Areas

- [ ] FLOOR : create a function place flags
- [ ] PLACE FLAG : create number current flag
- [ ] PLACE FLAG : for all tiles, if walkable and current position is 0, pu in position value current flag
- [ ] PLACE FLAG : increment flag
- [ ] PLACE FLAG : create function to compute flag from a position if not
- [ ] GROW FLAG : use the same logic as dijshra, but where all positions from the same room have the same step value
- [ ] FLOOR : create a function carve door
- [ ] CARVE DOORS : for all the tiles, if position is not walkable, get signature from tile
- [ ] CARVE DOORS : if signature allow to walk through, put door in place
- [ ] CARVE DOORS : UPDATE - if signature allow to walk through, verify the flag of the 2 side of the wall
- [ ] CARVE DOORS : if flags are different, put door in place
- [ ] CARVE DOORS : UPDATE - if flags are different, add position to a candidate list
- [ ] CARVE DOORS : if at least one candidate, put randomly a floor tile
- [ ] CARVE DOORS : grow flag from candidate
- [ ] CARVE DOORS : repeat until all rooms are connected (same flags)

| BINARY    | MAP                          |
| --------- | ---------------------------- |
| 0110 ???? | <pre>?.?<br>FFF<br>?.?</pre> |
| 1001 ???? | <pre>?F?<br>.F.<br>?F?</pre> |

### Step 32 : Shortcuts

- [ ] FLOOR : create a function carve shortcut, similar to carve door
- [ ] CARVE SHORTCUT : for all the tiles, if position is not walkable
- [ ] CARVE SHORTCUT : use dijshra to compute distance between two tiles separate by a wall
- [ ] CARVE SHORTCUT : if distance > 20?, add position into candidate
- [ ] CARVE SHORTCUT : if at least one candidate, put randomly a floor tile
- [ ] CARVE SHORTCUT : repeat until no more shortcut candidate
- [ ] CARVE SHORTCUT : repeat until at least 3 shortcuts
- [ ] FLOOR : create a function to fill dead-end
- [ ] FILL DEAD-END : for all the tiles, if position is walkable
- [ ] FILL DEAD-END : if signature is deadend, fild it with wall
- [ ] FILL DEAD-END : if fill dead end, do another loop

| BINARY    | MAP                          |
| --------- | ---------------------------- |
| 0111 ???? | <pre>?F?<br>F.F<br>?.?</pre> |
| 1011 ???? | <pre>?F?<br>..F<br>?F?</pre> |
| 1101 ???? | <pre>?F?<br>F..<br>?F?</pre> |
| 1110 ???? | <pre>?.?<br>F.F<br>?F?</pre> |

### Step 33 : Stairs

- [ ] FLOOR : create a function to create entry points (start and end)
- [ ] CREATE ENTRY POINT : randomly pick a position that is walkable
- [ ] CREATE ENTRY POINT : put downstair at that position
- [ ] CREATE ENTRY POINT : compute distance map from that position
- [ ] CREATE ENTRY POINT : UPDATE - put downstair on farthest walkable position
- [ ] CREATE ENTRY POINT : compute distance map from starting position
- [ ] CREATE ENTRY POINT : put upstair on farthest walkable position which is a wall
- [ ] CREATE ENTRY POINT : put downstair in corner of room ???
- [ ] FLOOR : store where the initial rooms are created
- [ ] CREATE DOORS : if doors create near a room, place a door
- [ ] CREATE SHORTCUT : if shortcut created near a room, place a door
- [ ] OPTIMIZATION : don't put a door near another

### Step 34 : Floors

- [ ] OPTIMIZATION : no door on exit
- [ ] OPTIMIZATION : use MID to found size of room in place of max
- [ ] OPTIMIZATION : put endpoint before deleting dead-end. attention : start and end are walkable
- [ ] OPTIMIZATION : no exit near start
- [ ] FLOOR : add a int parameter to constructor, which represent the level
- [ ] CACHE : add an integer which will contain the current level
- [ ] UPDATE : create a function which will trigger the next level
- [ ] UPDATE : if hero on upstair, go to next level
- [ ] FLOOR : add a message with level in it

### Step 35 : Sheperding

- [ ] IMPROVE FLOOR : export max rooms number and max doors number
- [ ] IS CARVABLE DOOR : check signature to verify presence of wall
- [ ] IS CARVABLE DOOR : no door on stairs, only on floor
- [ ] MAZE WORM : get candidate where 2 walls breaked can allow an isolated room to be accessible
- [ ] START / END : verify that the endpoint are put in a position that can be carved, or is walkable with further distance

| BINARY    | MAP                          |
| --------- | ---------------------------- |
| 0110 ???? | <pre>?.?<br>FFF<br>?.?</pre> |
| 1001 ???? | <pre>?F?<br>.F.<br>?F?</pre> |

### Step 36 : Hub Floor

- [ ] FLOOR : create a new function that will get a define map level when floor is 0 (use default CPP function memcpy)
- [ ] FLOOR : define a first hub level
- [ ] FIRST FLOOR : put a panel, with a specific message (Welcome to ....)
- [ ] CONSTANTS : define a final level number
- [ ] FLOOR : create a new function that will get a define map level when floor is final (9?)
- [ ] FLOOR : define a final hub level
- [ ] FINAL FLOOR : put a panel
- [ ] FINAL FLOOR : once push panel, display a end screen (similar to dead screen - U WIN)
- [ ] OPTIMIZATION : define an initial level only with floor, to replace the code where the level is initialized
- [ ] LOOT : don't loot on first level
- [ ] FLOOR : create a new function to spawn mobs, depending on level number
- [ ] ROOM STRUCT : add a bool start, if start is near room
- [ ] ROOM STRUCT : add a mob number in the room
- [ ] SPAWN MOB : create a function infest room
- [ ] SPAWN MOB : get a random room, infest it if number of mob is 0 && room hasn't start near
- [ ] ROOM : define if a room is near the start
- [ ] SPAWN MOB : repeat until all rooms are infested or number of mob > define number
- [ ] INFEST ROOM : define randomly how many mob to infest in room (2->4)
- [ ] INFEST ROOM : get randomly a position
- [ ] INFEST ROOM : if position is walkable and no mob, put a mob in position
- [ ] INFEST ROOM : increased number of mob in room
- [ ] INFEST ROOM : repeat until spawn mob number is equal to target
- [ ] INFEST ROOM : return number of mob put

- [ ] OPTIONAL - INFEST ROOM : compute max nb of mobs per room depending of size

### Step 37 : Optimization

- [ ] DEBUG : find a way to display map each time an item is generated in floor (draw floor each time, with a wait ?)
- [ ] DEAD-END : don't use candidate, but remove dead-end directly until there's no more dead end removed
- [ ] WORM MAZE : a candidate has to not be near a room and not a signature equals to 1111 1111 => a worm can start near another worm, but not a room
- [ ] WORM MAZE : remove the sheperding

### Step 38 : Tile Borders

- [ ] TILES : define new function that will test if tiles is wall
- [ ] ALL : replace test of wall by new function
- [ ] SPRITES : design new 48 tiles for wall ([see here](https://www.boristhebrave.com/wp-content/uploads/2013/07/blob_example.png))
- [ ] TILES : define char corresponding to new sprites
- [ ] TILES : review olf tiles id
- [ ] FLOOR : update first and last floors with new tiles

### Step 39 : Pretty Walls

- [ ] FLOOR : create a function that will replace old wall tile by pretty ones
- [ ] PRETTY TILES : for all positions, compute signature
- [ ] PRETTY TILES : change position by new tile if signature correspond by one defined (array ...)

### Step 40 : Wall Overlap

- [ ] TILES : improve design of wall
- [ ] TILES : create a floor tile that will show wall (3D effect)
- [ ] PRETTY TILES : add new tile below a horizontal wall
- [ ] TILES : create a wall tile that will contain a window (only for final scene)
- [ ] TILES : set default wall tile as full black

### Step 41 : Decorations

- [ ] SPRITE : create more alternatives of floor (carpet, torch, grass, plant, debris)
- [ ] SPRITE : create a enormous treasure for the last floor
- [ ] INTERACTION : when interating with big treasure, end game
- [ ] FLOOR : create a function to put decoration in room
- [ ] DECORATIONS : create a function that will populate a room with carpet
- [ ] POPULATE CARPET : for all tiles in room, put carpet tile
- [ ] POPULATE CARPET : don't put carpet next to wall
- [ ] DECORATIONS : create a function that will populate a room with dirt
- [ ] POPULATE DIRT : for all tiles in room, put carpet tile
- [ ] POPULATE DIRT : don't put carpet next to wall
- [ ] DECORATIONS : randomly choose which populate to used (use function save as variable)
- [ ] DECORATIONS : put all function in array, then randomly choose one
- [ ] POPULATE DIRT : randomly put clean tile or dirt tile
- [ ] DECORATIONS : create a function that will populate a room with torch
- [ ] POPULATE TORCH : put torch only on the edge of the room
- [ ] POPULATE TORCH : put torch only modulo 2
- [ ] POPULATE TORCH : don't put torch on floor/door tile
- [ ] POPULATE TORCH : randomly put torch
- [ ] POPULATE CARPET : put torch sometime in carpet room

### Step 42 : Managing Stats

- [ ] FIX : on new level, don't recreate a new hero, but move it
- [ ] FIX : once game is finish (dead or win), recreate hero on new start
- [ ] FIX : room are mostly 3 case wide
- [ ] FIRST FLOOR : add plants and dirt on first floor
- [ ] DECORATIONS : create a function that will populate a room with plants
- [ ] POPULATE PLANTS : for all tiles in room, put plants tile
- [ ] POPULATE PLANTS : put more high plants when low plants
- [ ] LINE OF SIGHT : high plants blocked view
- [ ] DECORATIONS : create a function that will populate a room with vase
- [ ] POPULATE VASE : for all tiles in room, put vase tile
- [ ] POPULATE VASE : don't put vase on mob
- [ ] POPULATE VASE : don't put vase next to door
- [ ] POPULATE VASE : don't put vase if signature tile = 0
- [ ] UI : add floor number on hub
- [ ] ITEM : add 2 properties to determine between which floors the item can spawn (minFloor and maxFloor)
- [ ] MOB : add 2 properties to determine between which floors mobs can spawn (minFloor and maxFloor)

### Step 43 : More Monsters

- [ ] ITEMS : create more items (6 per type)
- [ ] MOBS : create more mobs (3 max per type)
- [ ] SPRITE : create new mobs
- [ ] DECORATIONS : decorate only empty tiles
- [ ] SPAWN MOB : create an array of valid type of mobs to spawn on floor
- [ ] INFEST ROOM : random choose from previous array
- [ ] SPAWN MOB : create min/max array with number of monster per floor
- [ ] SPAWN MOB : use previous array to determine randomly how many monster to create on floor
- [ ] FOG : no fog on first and last floor

### Step 44 : Chests

- [ ] FLOOR : create a function to spanw a chest
- [ ] FLOOR : call that function before spawning the mobs
- [ ] INFEST ROOM : computer how many monsters depending on the size of the room
- [ ] INFEST ROOM : limit the number of time we randomly compute a place to spawn a monster
- [ ] SPAWN CHEST : create a function that will place a chest in a room
- [ ] SPAWN CHEST : for all rooms, call place chest
- [ ] PLACE CHEST : compute the center of the room, and change it into a chest
- [ ] SPAWN CHEST : choose how many chests to put in floor randomly
- [ ] LOOT : all items are lootable from chest given a certain floor
- [ ] LOOT : food and throwable or sometime mob (slime ?) are loot from jar given a certain floor
- [ ] LOOT : on one floor, only one weapon or armor can be loot
- [ ] INTERACT : don't destroy chest / jar if inventory is full

### Step 45 : Random Food

- [ ] DECORATE : first room should contain jar
- [ ] INTERACTION : put debris once jar is broken
- [ ] UPDATE : create a function to generate food name
- [ ] UPDATE : call previous method only once at floor 0
- [ ] GENERATE FOOD NAME : create array with name and adjective
- [ ] GENERATE FOOD NAME : compute name by randomly concat words from thoses lists
- [ ] GENERATE FOOD NAME : don't have two foods with same name or adjective
- [ ] EAT FOOD : depending on food, give a different effect (heal, heal++, maxHP+, stun, poison, curse, bliss)
- [ ] EAT FOOD : once used, show a message on effect
- [ ] LOOT : looting food should be with probability (maxHP+ should appear lesser than heal)
- [ ] CHARACTER : add binary to represent effect applied on mob
- [ ] CHARACTER : if character is stunned, doesn't move next turn, and display float "STUN"

### Step 46 : Curses

- [ ] CHARACTER : if character is curse, hit \* 2
- [ ] CHARACTER : if character is blessed, hit / 2
- [ ] UPDATE : curse remove blessed effect, and bless remove curse effect
- [ ] EAT : display float "CURSE" OR "BLESSED"
- [ ] inventory : add status blessed or cursed
- [ ] CHARACTER : bless and curse disappear on next level or once attacked
- [ ] CHARACTER : add int to represent how many time a mob can use an effect
- [ ] MOB : if stunning monster, its attack will stunned the hero only once
- [ ] MOB : do charge don't do attack
- [ ] MOB : define a mob that is slow :
  - [ ] can move only each 2 turn
- [ ] MOB : define a mob that is ghost :
  - [ ] can curse the player after hitting player
  - [ ] can be defeated by blessing
  - [ ] OPTIONAL : disappear once has seen the player, until near player

### Step 47 : Stats

- [ ] GROW FLAG : count how many flag are still on floor
- [ ] GENERATE FLOOR : repeat generation of floor until last flag <> 1 (generate room to create hallway)
- [ ] TILE : create tiles to represent game over
- [ ] TILE : create tiles to represent win
- [ ] TILE : create tiles to represent a logo of the game
- [ ] DRAW : draw logo
- [ ] DRAW : animate logo, so it disappear on the top after a certain amount of time
- [ ] DRAW : show descriptif below the logo
- [ ] UPDATE : once started, show logo until a button is pressed
- [ ] DRAW END : merge game over / win function
- [ ] DRAW END : show stats
  - [ ] WIN : steps, kills, meals
  - [ ] DEAD : killer, floor, steps, kills, meals
- [ ] DRAW END : show a blinking message to restart

### Step 48 : Freestanding

- [ ] MUSIC : create game music
- [ ] MUSIC : create dead music
- [ ] MUSIC : create win music
- [ ] SOUND EFFECT : create sound effect when using inventory : (eat, throw, equip, go stair, move inventory, valid action, back, ...)
- [ ] UPDATE : add music depending on floor, event, ...
- [ ] GENERATE ROOM : first room should be really big
- [ ] PUT START : compute best position depending on signature below, if tile is in room, if tile is carvable, ...

| BINARY    | MAP                           |
| --------- | ----------------------------- |
| 0000 ?000 | <pre>..?<br>.X.<br>...</pre>  |
| 0000 0?00 | <pre>...<br>.X.<br>..?</pre>  |
| 0000 00?0 | <pre>...<br>.X.<br>?..</pre>  |
| 0000 000? | <pre>?..<br>.X.<br>...</pre>  |
| 1000 0??0 | <pre>...<br>.X.<br>?F?</pre>  |
| 0100 00?? | <pre>?..<br>FX.<br>?..</pre>  |
| 0010 ??00 | <pre>..?<br>.XF<br>...?</pre> |
| 0001 ?00? | <pre>?F?<br>.X.<br>...</pre>  |
| 1100 0?1? | <pre>?..<br>FX.<br>FF?</pre>  |
| 0101 ?0?1 | <pre>FF?<br>FX.<br>?..</pre>  |
| 0011 1?0? | <pre>?FF<br>.XF<br>..?</pre>  |
| 1010 ?10? | <pre>..?<br>.XF<br>?FF</pre>  |

### Step 49 : BugFixing

- [ ] MUSIC : make transition between intro / game music (in loop, if !playing, if intro => intro music, else game music)
- [ ] STUN : remove the status, even if no monster are moving, once a turn has been played
- [ ] DEAD : verify that player is displayed once killed. If not, use flashed player
- [ ] SOUND EFFECT : play surprise effect when a mob is added once breaking a jar
- [ ] INVENTORY : add effect name on food once used, else ??? below inventory once food is selected
- [ ] USE FOOD : don't show effect on screen once known
- [ ] DRAW EFFECT : once hitted, shake mob until next turn
- [ ] INFECT : no mob in starting room
- [ ] LINE OF SIGHT : verify that once a mob is seen, it see the hero too

### Step 50 : What Now

- [ ] STUN : 2 turn stun, not 1 so that we cna see the effect
- [ ]

### Step 51 : Daily Challenge

- [ ]
- [ ]

### Step 52 : Game Launched

- [ ]
- [ ]

### Step 53 : Improvements

- [ ] GAME : add more diversity :
  - [ ] MOBS : each type should have different patterns of attack
  - [ ] FLOOR : add trap
  - [ ] MOBS : having a final boss
- [ ] COMMON : improve memory management
