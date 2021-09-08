import { Vector } from './Vector.js';
import {MapData} from "./MapData.js";

export class Player
{
    constructor() {
        this.x = 5.5;
        this.y = 2.5;
        this.z = 1.5;

        this.rotX = 3.14;
        this.rotY = 0;

        this.shootCooldown = 0;

        this.aY = 0;
    }

    move(movement, rotation, delta, mapData)
    {
        const moveVector = new Vector(movement.x, movement.z);
        moveVector.unit();
        moveVector.rotateBy(this.rotX);

        const incrementX = moveVector.x * (delta / 500);
        const incrementZ = moveVector.y * (delta / 500);
        //const incrementY = (delta / 500);//movement.y * (delta / 700)
       /* this.x += moveVector.x * (delta / 700);
        this.z += moveVector.y * (delta / 700);*/

        this.aY = this.aY - (delta / 7000);

        //if(mapData.blockAt(Math.floor(this.x + incrementX), Math.floor(this.y), Math.floor(this.z)) !== MapData.BLOCK_WALL)
        if(this.checkCollision(mapData, this.x + incrementX, this.y, this.z))
            this.x += incrementX;

        if(this.checkCollision(mapData, this.x, this.y, this.z + incrementZ))
            this.z += incrementZ;

        if(this.checkCollision(mapData, this.x, this.y + this.aY, this.z))
            this.y += this.aY;
        else
            this.aY = 0;


        this.rotX += rotation.x;
        this.rotY += rotation.y;

        if (this.rotY < -Math.PI / 2)
            this.rotY = -Math.PI / 2;

        else if (this.rotY > Math.PI / 2)
            this.rotY = Math.PI / 2;



        //DEBUG
        const posDisplay = document.querySelectorAll('.f3pos');
        posDisplay[0].innerHTML = Math.floor(1000 * this.x) / 1000;
        posDisplay[1].innerHTML = Math.floor(1000 * this.y) / 1000;
        posDisplay[2].innerHTML = Math.floor(1000 * this.z) / 1000;
    }

    jump()
    {
        if(this.aY === 0)
            this.aY = .05;
    }

    checkCollision(mapData, x,y,z)
    {
        return ((mapData.blockAt(Math.floor(x - .2), Math.floor(y), Math.floor(z - .2)) !== MapData.BLOCK_WALL) && (mapData.blockAt(Math.floor(x + .2), Math.floor(y), Math.floor(z + .2)) !== MapData.BLOCK_WALL)) &&
         ((mapData.blockAt(Math.floor(x - .2), Math.floor(y - .75), Math.floor(z - .2)) !== MapData.BLOCK_WALL) && (mapData.blockAt(Math.floor(x + .2), Math.floor(y - .75), Math.floor(z + .2)) !== MapData.BLOCK_WALL)) &&
         ((mapData.blockAt(Math.floor(x - .2), Math.floor(y - 1.5), Math.floor(z - .2)) !== MapData.BLOCK_WALL) && (mapData.blockAt(Math.floor(x + .2), Math.floor(y - 1.5), Math.floor(z + .2)) !== MapData.BLOCK_WALL))
    }

    getProperties()
    {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            rotX: this.rotX,
            rotY: this.rotY
        }
    }
}