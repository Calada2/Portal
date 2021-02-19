import { Vector } from './Vector.js';

export class Player
{
    constructor() {
        this.x = 0;
        this.y = 2;
        this.z = 0;

        this.rotX = 0;
        this.rotY = 0;
    }

    move(movement, rotation, delta)
    {
        const moveVector = new Vector(movement.x, movement.z);
        moveVector.unit();
        moveVector.rotateBy(this.rotX);

        this.x += moveVector.x * (delta / 700);
        this.z += moveVector.y * (delta / 700);

        this.y += movement.y * (delta / 700);

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