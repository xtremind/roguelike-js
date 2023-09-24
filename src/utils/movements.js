exports.prepareWalk = function (mob, dx, dy) {
    mob.x += dx;
    mob.y += dy;
    mob.soffset_x = -dx * 8;
    mob.soffset_y = -dy * 8;
    mob.offset_x = mob.soffset_x;
    mob.offset_y = mob.soffset_y;
    mob.action = 'WALK'
}

exports.walk = function(mob, tick){

    mob.offset_x = mob.soffset_x * (1 - tick);
    mob.offset_y = mob.soffset_y * (1 - tick);
}

exports.prepareBump = function (mob, dx, dy) {
    mob.soffset_x = dx * 8;
    mob.soffset_y = dy * 8;
    mob.offset_x = 0;
    mob.offset_y = 0;
    mob.action = 'BUMP'
}

exports.bump = function (mob, tick){

    const tme = tick >= 0.5 ? 1 - tick : tick;
    mob.offset_x = mob.soffset_x * (tme);
    mob.offset_y = mob.soffset_y * (tme);
}