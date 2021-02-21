import {Logic} from "./Logic.js";
import {MapData} from "./MapData.js";
import {Renderer} from "./Renderer.js";
import {Controller} from "./Controller.js";
import {Player} from "./Player.js";
import {Projectile} from "./Projectile.js";

export class Game
{
    constructor()
    {
        this._logic = new Logic();
        this.buildTestMap();
        this._renderer = new Renderer(document.querySelector('#camera'));
        //this._renderer.buildMap_proto(this._mapData);
        this._renderer.buildMap(this._mapData);
        this._controller = new Controller(document.querySelector('#camera'));

        this._player = new Player();

        this._projectiles = [];

        this._previousTimestamp = Date.now();

        this.loop();


    }

    buildTestMap()
    {
        const map = [];
        for(let x = 0; x < 10; ++x)
        {
            map[x] = [];
            for(let y = 0; y < 9; ++y)
            {
                map[x][y] = [];
                for(let z = 0; z < 10; ++z)
                {
                    map[x][y][z] = ((y === 0 || y === 8) || (x === 0 || x === 9) || (z === 0 || z === 9)) ? MapData.BLOCK_WALL : MapData.BLOCK_EMPTY;
                }
            }
        }

        this._mapData = new MapData(map);

        this._mapData.updateAtPosition(6,6,6,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(1,5,5,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(1,6,5,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(1,5,6,MapData.BLOCK_WALL);

        this._mapData.updateAtPosition(5,4,5,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(5,4,4,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(5,4,3,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(3,4,5,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(3,4,4,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(3,4,3,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(4,4,3,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(4,4,5,MapData.BLOCK_WALL);

        this._mapData.updateAtPosition(1,1,1,MapData.BLOCK_WALL);
        this._mapData.updateAtPosition(8,2,8,MapData.BLOCK_WALL);

    }

    loop()
    {
        const currentTimestamp = Date.now();
        const delta = currentTimestamp - this._previousTimestamp;
        this._previousTimestamp = currentTimestamp;

        this._player.move(this._controller.movement, this._controller.rotation, delta)
        this._controller.resetRotation();
        this._renderer.updatePosition(this._player.getProperties());

        for(let i = 0; i < this._projectiles.length; ++i)
        {
            this._projectiles[i].move(delta);
            this._renderer.updateProjectile(i , this._projectiles[i].pos);
        }

        this._player.shootCooldown = Math.max(0, this._player.shootCooldown - delta);
        if((this._controller.keyDown.lmb || this._controller.keyDown.rmb || this._controller.keyDown.mmb) && this._player.shootCooldown === 0)
        {
            let portalType
            if(this._controller.keyDown.lmb)
                portalType = Projectile.TYPE_BLUE;
            else if(this._controller.keyDown.rmb)
                portalType = Projectile.TYPE_ORANGE;
            else if(this._controller.keyDown.mmb)
                portalType = Projectile.TYPE_SHURIKEN;



            const newProjectile = new Projectile({x: this._player.x, y: this._player.y, z: this._player.z}, {x: this._player.rotX, y: this._player.rotY}, portalType,  this._mapData);
            this._renderer.createProjectile(newProjectile.pos, newProjectile.rot, newProjectile.type);

            this._projectiles.push(newProjectile);

            this._player.shootCooldown = 500;
        }

        const this2 = this;
        window.requestAnimationFrame(function (){this2.loop()});
    }
}