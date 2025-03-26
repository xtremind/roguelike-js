import Room from "models/room";
import {Directions, Tiles} from "utils/constants";

let rng, map;
let rooms = [];
let flags = [[]];

function createMap(scene, mp, level) {
    rng = scene.rng
    map = mp;

    createRooms();
    createCorridors();
    createPaths()
}

function createRooms(){
    let maxRooms = 5, errors = 5, maxHeight = 5, maxWidth = 5;
    let room;

    do {
        room = placeRoom(generateRoom(maxHeight, maxWidth));
        if(room){
            console.log('room placed', room)
            rooms.push(room);
            maxRooms--;
        } else {
            console.log('room not placed')
            errors--;
            maxHeight > maxWidth ? maxHeight = Math.max(3, maxHeight-1) : maxWidth = Math.max(3, maxWidth-1);
        }
    } while (maxRooms > 0 && errors > 0);
}

function generateRoom(maxHeight, maxWidth){
    const height = rng.nextInt(3, maxHeight)
    const width = middle(3, maxWidth+1, 35/height)
    return new Room(0, 0, height, width);
}

function placeRoom(room){
    let candidates = []

    for(let x = 0; x < map.width - room.width; x++){
        for(let y = 0; y < map.height - room.height; y++){
            if(doesRoomFit({x: x, y:y, height: room.height, width: room.width}))
                candidates.push({x, y});
        }
    }

    if(candidates.length !== 0){
        let candidate = candidates[rng.nextInt(0, candidates.length-1)];
        room.x = candidate.x
        room.y = candidate.y
        createRoom(room);
        return room;
    }

    return false;
}

function doesRoomFit(room){
    const fromX = room.x === 0 ? 0 : room.x - 1,
        toX = room.x + room.width === map.width ? map.width : room.x + room.width + 1,
        fromY = room.y === 0 ? 0 : room.y - 1,
        toY = room.y + room.height === map.height ? map.height : room.y + room.height + 1;

    if(toX >= map.width || toY >= map.height)
        return false;

    for(let i = fromX; i < toX; i++){
        for(let j = fromY; j < toY; j++){
            if(map.getTileAt(i, j).index !== Tiles.WALL)
                return false;
        }
    }
    return true;
}

function createRoom(room){
    const fromX = room.x, toX = room.x + room.width, fromY = room.y, toY = room.y + room.height;
    for(let i = fromX; i < toX; i++){
        for(let j = fromY; j < toY; j++){
            replaceBy(i,j, Tiles.FLOOR);
        }
    }
}

//*******************************************************************//
function createCorridors(){
    let candidate, candidates;

    do {
        candidates = [];
        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {
                candidate = getCandidateForCorridor(x, y);
                if (candidate) {
                    candidates.push(candidate);
                }
            }
        }

        if (candidates.length !== 0) {
            candidate = candidates[rng.nextInt(0, candidates.length - 1)];
            createCorridor(candidate);
        }
    } while (candidates.length !== 0)

}

function getCandidateForCorridor(x, y){
    if(isCarvable(x, y) && !isNearRoom(x, y)){
        return {x, y}
    }
    return null;
}

function isCarvable(x, y){
    let tile = map.getTileAt(x, y);
    if(!tile || tile.index !== Tiles.WALL) return false;
    let sign = signature(x, y)
    const carvables = [
        {signature: 0b11111111, mask: 0b00000000},
        {signature: 0b01111111, mask: 0b00001100},
        {signature: 0b10111111, mask: 0b00000011},
        {signature: 0b11011111, mask: 0b00001001},
        {signature: 0b11101111, mask: 0b00000110}
    ];
    return carvables.some((el) => compareBinary(sign, el.signature, el.mask));
}

function isNearRoom(x, y){
    for(let i = 0; i < 8; i++){
        let dx = x + Directions.x[i], dy = y + Directions.y[i], tile = map.getTileAt(dx, dy)
        if(tile && tile.index === Tiles.FLOOR) return true;
    }
    return false;
}

function createCorridor(candidate){
    let direction = rng.nextInt(0, 3), step = 0;

    do{
        replaceBy(candidate.x,candidate.y, Tiles.FLOOR);
        if(!isCarvable(candidate.x + Directions.x[direction], candidate.y + Directions.y[direction]) || (rng.nextInt(0,1) ===1 && step >= 2)){
            direction = 8;
            step = 0;

            for (let i = 0; i < 4; i++){
                if(isCarvable(candidate.x + Directions.x[i], candidate.y + Directions.y[i])){
                    if(direction === 8 || rng.nextInt(0,1) === 1) {
                        direction = i;
                        break;
                    }
                }
            }
        }

        candidate.x += Directions.x[direction]
        candidate.y += Directions.y[direction]
        step++

    } while (direction !== 8 )

}
//*******************************************************************//
function createPaths(){
    let candidate, candidates, tile, currentFlag = 1;
    initiateFlags();

    do {
        candidates = [];
        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {
                tile = map.getTileAt(x, y)
                if((tile?.index !== Tiles.WALL) && flags[x][y] === -1){
                    growFlags(x, y, currentFlag++)
                }
                candidate = getCandidateForPath(x,y)
                if(candidate)
                    candidates.push(candidate)
            }
        }

        if (candidates.length !== 0) {
            candidate = candidates[rng.nextInt(0, candidates.length - 1)];
            replaceBy(candidate.x, candidate.y, Tiles.FLOOR)
            growFlags(candidate.x, candidate.y, candidate.flag)
        }

    } while (candidates.length !== 0)
}

function getCandidateForPath(x, y){
    let tile = map.getTileAt(x, y)
    if(tile.properties?.solid){
        let flg1, flg2
        let sign = signature(x, y);
        if(compareBinary(sign, 0b11000000, 0b00001111)) {
            flg1 = flags[x-1][y]
            flg2 = flags[x+1][y]
        } else if (compareBinary(sign, 0b00110000, 0b00001111)) {
            flg1 = flags[x][y-1]
            flg2 = flags[x][y+1]
        }

        if(flg1 !== flg2){
            return {x, y, flag : flg1}
        }
    }
    return null;
}

function initiateFlags(){
    for (let x = 0; x < map.width; x++) {
        flags.push([])
        for (let y = 0; y < map.height; y++) {
            flags[x].push(-1)
        }
    }
}

function growFlags(x, y, weight){
    flags[x][y] = weight
    let tile;

    for( let d = 0; d < 4 ; d++){
        let dx = x + Directions.x[d], dy = y + Directions.y[d]
        tile = map.getTileAt(dx, dy)
        if((tile && tile.index !== Tiles.WALL) && flags[dx][dy] !== weight){
            growFlags(dx, dy, weight)
        }
    }
}
//*******************************************************************//
function computeDistanceMap(x, y){
    initiateFlags()
    let candidates = [{x, y, flag: 0}], candidate , tile, dx, dy;
    flags[x][y] = 0;

    do{
        candidate = candidates.pop();
        for(let i = 0; i < 4; i++){
            dx = candidate.x + Directions.x[i]
            dy = candidate.y + Directions.y[i]
            tile = map.getTileAt(dx, dy)
            if(tile && flags[dx][dy]===-1){
                flags[dx][dy] = candidate.flag + 1
                if(!tile.properties?.solid)
                    candidates.push({x:dx, y:dy, flag: candidate.flag + 1})
            }
        }
    } while (candidates.length !== 0)
}

//*******************************************************************//
function replaceBy(x, y, tile){
    map.getTileAt(x, y).destroy();
    map.putTileAt(tile, x, y);
}

function compareBinary(b1, b2, mask){
    return (b1 | mask) === (b2 | mask)
}

function signature(x, y){
    let result = 0;
    let dx, dy, tile;

    for(let i = 0; i < 8; i++){
        dx = x + Directions.x[i] ;
        dy = y + Directions.y[i] ;
        tile = map.getTileAt(dx, dy)
        result |= (!tile || tile.index === Tiles.WALL ? 1 : 0 )<<(7-i);
    }

    return result
}

function middle(a, b, c) {
    let x = a - b;
    let y = b - c;
    let z = a - c;

    if (x * y > 0) return b;
    else if (x * z > 0) return c;
    else return a;
}

//*******************************************************************//
export default createMap;