import Room from "models/room";
import {Directions, Tiles} from "utils/constants";

let rng, map;
let rooms = [];

function createMap(scene, mp, level) {
    rng = scene.rng
    map = mp;

    createRooms();
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
            if(doesRoomFit(map, {x: x, y:y, height: room.height, width: room.width}))
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
            map.getTileAt(i,j).destroy();
            map.putTileAt(Tiles.FLOOR, i, j);
        }
    }
}

function signature(x, y){
    let result = 0;
    let dx, dy, tile;

    for(let i = 0; i++; i < 8){
        dx = x + Directions.x[i] ;
        dy = y + Directions.y[i] ;
        tile = map.getTileAt(x, y)
        result |= (!tile || tile.properties?.solid ? 1 : 0 )<<(7-i);
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


export default createMap;