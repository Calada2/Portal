import {MapData} from "./MapData.js";
import {Tools} from "./Tools.js";
import{Projectile} from "./Projectile.js";

export class Renderer {


    constructor(container) {


        this.containerElement = container;
        this._camera = container;

        this.projectiles = [];

        this.buildScene();
        this.addJozsi_proto();

        this.portals = [
            this.createPortal(0),
            this.createPortal(1)
        ];

        this.cssProperties =
            {
                x: 0,
                y: 0,
                z: 0,
                rotX: 0,
                rotY: 0
            }

    }

    createPortal(type)
    {
        const elem = document.createElement('iframe');
        elem.className = 'portalV2 ' + (type === 0 ? 'portalBlue' : 'portalOrange');
        this._scene.appendChild(elem);
        elem.hidden = true;
        return elem;
    }

    placePortal(id, pos, angle)
    {
        const portal = this.portals[id];
        portal.style.setProperty('--x', Tools.posToCSS(pos.x));
        portal.style.setProperty('--y', Tools.posToCSS(-pos.y));
        portal.style.setProperty('--z', Tools.posToCSS(pos.z));
        portal.hidden = false;

        switch (angle)
        {
            case 0:
                portal.style.setProperty('--rot', '180deg');
                break;

            case 1:
                portal.style.setProperty('--rot', 0);
                break;

            case 2:
                portal.style.setProperty('--rot', '-90deg');
                break;

            case 3:
                portal.style.setProperty('--rot', '90deg');
                break;

        }
    }


    buildScene() {
        this._scene = document.createElement('div')
        this._scene.className = 'scene';
        this._camera.appendChild(this._scene);

    }

    addPortal_proto()
    {
        const portal = document.createElement('iframe');
        portal.src = 'index.html?5';
        portal.className = 'portal';
        this._scene.appendChild(portal);
    }

    addJozsi_proto()
    {
        const portal = document.createElement('div');

        portal.className = 'jozsi';
        this._scene.appendChild(portal);
    }

    buildMap_proto(mapData) {
        const blocks = mapData.blocks;
        for (let x = 0; x < blocks.length; ++x) {
            for (let y = 0; y < blocks[x].length; ++y) {
                for (let z = 0; z < blocks[x][y].length; ++z) {
                    if (blocks[x][y][z] === MapData.BLOCK_WALL) {
                        const face = document.createElement('div');
                        face.className = 'face';
                        face.style.setProperty('--x', (x * 100) + 'px');
                        face.style.setProperty('--y', -(y * 100) + 'px');
                        face.style.setProperty('--z', -(z * 100) + 'px');
                        this._scene.appendChild(face);
                    }

                }
            }
        }
    }

    buildMap(mapData) {
        const blocks = mapData.blocks;
        const size = mapData.size;
        const sideRendered = [];
        for (let x = 0; x < size.x; ++x) {
            sideRendered[x] = [];
            for (let y = 0; y < size.y; ++y) {
                sideRendered[x][y] = [];
                for (let z = 0; z < size.z; ++z) {
                    sideRendered[x][y][z] = [false, false, false, false, false, false];
                }
            }
        }

        for (let i = 0; i < 6; ++i) {


            let startZ = 0;
            let startY = 0;
            let startX = 0;

            for (let x = 0; x < size.x; ++x) {
                for (let y = 0; y < size.y; ++y) {
                    for (let z = 0; z < size.z; ++z) {

                        const thisBlock = mapData.blockAt(x, y, z);
                        const valuesCompFirst = this.createCompValues(i, x, y, z, 0);
                        const nextBlock = mapData.blockAt(valuesCompFirst.x, valuesCompFirst.y, valuesCompFirst.z);
                        if (!sideRendered[x][y][z][i] && thisBlock === MapData.BLOCK_WALL && nextBlock === MapData.BLOCK_EMPTY) {
                            startZ = z;
                            startY = y;
                            startX = y;
                            let width = 0;
                            let height = 0;
                            const limits = this.getLimits(i, {x: x, y: y, z: z}, size);
                            let limitA = limits.a;
                            let limitB = limits.b;

                            loopA:
                                for (let a = 0; a < limitA; ++a) {
                                    let rowComplete = false;
                                    const valuesA = this.createValues(i, x, y, z, a);
                                    const valuesCompA = this.createCompValues(i, x, y, z, a);
                                    if (!sideRendered[valuesA.x][valuesA.y][valuesA.z][i] && mapData.blockAt(valuesA.x, valuesA.y, valuesA.z) === MapData.BLOCK_WALL && mapData.blockAt(valuesCompA.x, valuesCompA.y, valuesCompA.z) === MapData.BLOCK_EMPTY) {
                                        loopB:
                                            for (let b = 0; b < limitB; ++b) {
                                                const valuesB = this.createValues(i, x, y, z, a, b);
                                                const valuesCompB = this.createCompValues(i, x, y, z, a, b);
                                                if (!sideRendered[valuesB.x][valuesB.y][valuesB.z][i] && mapData.blockAt(valuesB.x, valuesB.y, valuesB.z) === MapData.BLOCK_WALL && mapData.blockAt(valuesCompB.x, valuesCompB.y, valuesCompB.z) === MapData.BLOCK_EMPTY) {
                                                    if (a === 0) {
                                                        width++;
                                                    }
                                                } else {
                                                    if (a === 0) {
                                                        limitB = width;
                                                        rowComplete = true;
                                                    }
                                                    break loopB;
                                                }
                                                if (b === limitB - 1) {
                                                    rowComplete = true;
                                                }
                                            }
                                    }
                                    if (rowComplete) {
                                        height++;
                                        for (let b = 0; b < limitB; ++b) {
                                            const values = this.createValues(i, x, y, z, a, b);
                                            sideRendered[values.x][values.y][values.z][i] = true;
                                        }

                                    } else {
                                        break loopA;
                                    }
                                }
                            this.renderSide(x, y, z, width, height, i);

                        }

                    }
                }
            }
        }


    }

    getLimits(orientation, startPos, size)
    {
        const limits = {a:0,b:0};

        switch (orientation)
        {
            case 0:
            case 1:

                limits.a = size.y - startPos.y;
                limits.b = size.z - startPos.z;

                break;

            case 2:
            case 3:

                limits.a = size.y - startPos.y;
                limits.b = size.x - startPos.x;

                break;

            case 4:
            case 5:

                limits.a = size.x - startPos.x;
                limits.b = size.z - startPos.z;

                break;
        }

        return limits;
    }

    createValues(orientation,x,y,z,a = 0,b = 0)
    {
        switch (orientation)
        {
            case 0:
            case 1:
                return {
                    x: x,
                    y: y + a,
                    z: z + b
                }

            case 2:
            case 3:
                return {
                    x: x + b,
                    y: y + a,
                    z: z
                }

            case 4:
            case 5:
                return {
                    x: x + a,
                    y: y,
                    z: z + b
                }

            default:
                return {
                    x: x,
                    y: y,
                    z: z
                }
        }
    }

    createCompValues(orientation,x,y,z,a = 0,b = 0)
    {
        const value = this.createValues(orientation,x,y,z,a,b);

        switch (orientation)
        {
            case 0:
                value.x += 1;
                break;

            case 1:
                value.x -= 1;
                break;

            case 2:
                value.z += 1;
                break;

            case 3:
                value.z -= 1;
                break;

            case 4:
                value.y += 1;
                break;

            case 5:
                value.y -= 1;
                break;
        }

        return value;

    }

    blockAtRender(mapData, x,y,z,orientation)
    {
        switch (orientation)
        {
            case 0:
                return mapData.blockAt(x + 1,y,z);

            case 1:
                return mapData.blockAt(x - 1,y,z);

            case 2:
                return mapData.blockAt(x,y,z + 1);

            case 3:
                return mapData.blockAt(x,y,z - 1);

            case 4:
                return mapData.blockAt(x,y + 1,z);

            case 5:
                return mapData.blockAt(x,y - 1,z);

        }
    }

    renderSide(x,y,z,width,height,orientation) {
        const side = document.createElement('div');
        side.className = 'faceV2 orientation' + orientation;

        side.style.setProperty('--x', (x * 100) + 'px');

        if(orientation < 4)
            side.style.setProperty('--y', -(y * 100) + 'px');
        else
            side.style.setProperty('--y', -((y - (height - 1)) * 100) + 'px');

        if(orientation < 2)
            side.style.setProperty('--z', ((width + z) * 100) + 'px');
        else if(orientation < 4)
            side.style.setProperty('--z', ((z) * 100) + 'px');
        else
            side.style.setProperty('--z', ((width + z) * 100) + 'px');


        side.style.setProperty('--width', (width * 100) + 'px');
        side.style.setProperty('--height', (height * 100) + 'px');
        this._scene.appendChild(side);

        side.setAttribute('side', String(orientation));

    }

    updatePosition(properties)
    {

        if(!(properties.x === this.cssProperties.x))
        {
            this.cssProperties.x = properties.x;
            this._camera.style.setProperty('--x', -properties.x * 100 + 'px');
        }
        if(!(properties.y === this.cssProperties.y))
        {
            this.cssProperties.y = properties.y;
            this._camera.style.setProperty('--y', properties.y * 100 + 'px');
        }
        if(!(properties.z === this.cssProperties.z))
        {
            this.cssProperties.z = properties.z;
            this._camera.style.setProperty('--z', -properties.z * 100 + 'px');
        }
        if(!(properties.rotX === this.cssProperties.rotX))
        {
            this.cssProperties.rotX = properties.rotX;
            this._camera.style.setProperty('--rotX', properties.rotX + 'rad');
        }
        if(!(properties.rotY === this.cssProperties.rotY))
        {
            this.cssProperties.rotY = properties.rotY;
            this._camera.style.setProperty('--rotY', properties.rotY + 'rad');
        }

    }

    createProjectile(pos, rot, type)
    {
        let extraClass = '';
        if(type === Projectile.TYPE_BLUE)
            extraClass = 'projectileBlue';
        else if(type === Projectile.TYPE_ORANGE)
            extraClass = 'projectileOrange';
        else if(type === Projectile.TYPE_SHURIKEN)
            extraClass = 'projectileShuriken';


        const elem = document.createElement('div');

        elem.className = 'projectile ' + extraClass;
        elem.style.setProperty('--x', Tools.posToCSS(pos.x));
        elem.style.setProperty('--y', Tools.posToCSS(pos.y));
        elem.style.setProperty('--z', Tools.posToCSS(pos.z));
        elem.style.setProperty('--rotX', -rot.x + 'rad');
        elem.style.setProperty('--rotY', -rot.y + 'rad');
        this._scene.appendChild(elem);

        this.projectiles.push(elem)
    }

    updateProjectile(id, pos)
    {
        const elem = this.projectiles[id];
        elem.style.setProperty('--x', Tools.posToCSS(pos.x));
        elem.style.setProperty('--y', Tools.posToCSS(pos.y));
        elem.style.setProperty('--z', Tools.posToCSS(pos.z));
    }

    removeProjectile(id)
    {
        const proj = this.projectiles[id];
        proj.parentElement.removeChild(proj);
        delete this.projectiles[id];
    }
}