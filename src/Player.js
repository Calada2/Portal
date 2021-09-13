import { Vector } from './Vector.js';
import {MapData} from "./MapData.js";

const f = n => Math.floor(n);
const angles = [0,Math.PI,-Math.PI/2,Math.PI/2]

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

    move(movement, rotation, delta, mapData, portals)
    {
        const moveVector = new Vector(movement.x, movement.z);
        moveVector.unit();
        moveVector.rotateBy(this.rotX);

        const incrementX = moveVector.x * (delta / 500);
        const incrementZ = moveVector.y * (delta / 500);


        this.aY = this.aY - (delta / 7000);

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


        this.checkPortal(portals);


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

        //Portal side alapján meg vagy a minusz kettőket vagy a plusz kettőket kell kiszedni
        return ((mapData.blockAt(Math.floor(x - .2), Math.floor(y), Math.floor(z - .2)) !== MapData.BLOCK_WALL) && (mapData.blockAt(Math.floor(x + .2), Math.floor(y), Math.floor(z + .2)) !== MapData.BLOCK_WALL)) &&
         ((mapData.blockAt(Math.floor(x - .2), Math.floor(y - .75), Math.floor(z - .2)) !== MapData.BLOCK_WALL) && (mapData.blockAt(Math.floor(x + .2), Math.floor(y - .75), Math.floor(z + .2)) !== MapData.BLOCK_WALL)) &&
         ((mapData.blockAt(Math.floor(x - .2), Math.floor(y - 1.5), Math.floor(z - .2)) !== MapData.BLOCK_WALL) && (mapData.blockAt(Math.floor(x + .2), Math.floor(y - 1.5), Math.floor(z + .2)) !== MapData.BLOCK_WALL))
    }

    checkPortal(portals)
    {
        for(let i = 0; i <= 1; ++i)
        {
            const j = i ? 0 : 1;
            const pPos = portals[i].pos;
            const p2Pos = portals[j].pos;
            const pSide = portals[i].side;
            const p2Side = portals[j].side;


            let distX;
            let distZ;
            let distY;
            let angleChange = 0;
            let canCross = false;




            if(pPos.y + 2 >= this.y && pPos.y <= this.y - 1.5)
            {
                distX = portals[j].pos.x - this.x;
                distZ = (portals[j].pos.z) - this.z;

                if(pSide === 0 && pPos.z - this.z < .24 && this.x >= pPos.x && this.x <= pPos.x + 1)
                {
                    distY = p2Pos.y - (this.y - 1.5);
                    canCross = true;
                }
                else if(pSide === 1 && this.z - (pPos.z + 1) < .24 && this.x >= pPos.x && this.x <= pPos.x + 1)
                {
                    distY = p2Pos.y - (this.y - 1.5);
                    canCross = true;
                }
                else if(pSide === 2 && (pPos.x) - this.x < .24 && this.z >= pPos.z && this.z <= pPos.z + 1)
                {
                    distY = p2Pos.y - (this.y - 1.5);
                    canCross = true;
                }
                else if(pSide === 3 && this.x - (pPos.x + 1)  < .24 && this.z >= pPos.z && this.z <= pPos.z + 1)
                {
                    distY = p2Pos.y - (this.y - 1.5);
                    canCross = true;
                }


            }

            if(canCross)
            {
                angleChange = angles[p2Side] - angles[pSide] + Math.PI;

                if(p2Side === 0)
                {
                    this.x += distX + .5;
                    this.z += distZ - .25;
                    this.y += distY;
                }
                if(p2Side === 1)
                {
                    this.x += distX + .5;
                    this.z += distZ + 1.25;
                    this.y += distY;
                }
                else if(p2Side === 2)
                {
                    this.x += distX - .25;
                    this.z += distZ + .5;
                    this.y += distY;
                }
                else if(p2Side === 3)
                {
                    this.x += distX + 1.25;
                    this.z += distZ + .5;
                    this.y += distY;
                }

                this.rotX += angleChange;
            }






        }
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