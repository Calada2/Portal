export class Portal
{

    static TYPE_BLUE = 0;
    static TYPE_ORANGE = 1;

    constructor(id) {
        this.id = id;
        this.pos = {
            x: -1,
            y: -1,
            z: -1
        }
        this.rot = {
            x: 0,
            y: 0
        }
        this.side = -1;
        this.active = false;
    }
    activate()
    {
        this.active = true;
    }
    updatePosition(pos, side)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.pos.z = pos.z;

        this.side = side;
    }
}