import {Tools} from './Tools.js';
import {Vector} from "./Vector.js";

export class Projectile
{
    static TYPE_BLUE = 0;
    static TYPE_ORANGE = 1;
    constructor(pos, rot, type)
    {
        this.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z
        }

        this.rot = {
            x: rot.x,
            y: rot.y
        }




        this.type = type;

        const yfactor = (1 - Math.abs(Math.sin(rot.y) ** 5));
        this.moveVector = new Vector( yfactor * Math.sin(rot.x), Math.sin(rot.y), yfactor * -Math.cos(rot.x));
        console.log(this.moveVector);

    }

    move(delta)
    {
        this.pos.x += this.moveVector.x / 150 * delta;
        this.pos.y += this.moveVector.y / 150 * delta;
        this.pos.z += this.moveVector.z / 150 * delta;
    }
}