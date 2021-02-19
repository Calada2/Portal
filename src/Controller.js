export class Controller
{
    constructor(camera)
    {

        this._camera = camera;

        //Keyboard
        this.keyDown = {
            left: false,
            right: false,
            forward: false,
            backward: false,
            ascend: false,
            descend: false,
            jump: false
        }

        this.movement = {
            x: 0,
            y: 0,
            z: 0
        }

        this.createKeyBinds();

        window.addEventListener('keydown', (e) => {this.keyDownEvent(e.code)});
        window.addEventListener('keyup', (e) => {this.keyUpEvent(e.code)});


        this.mousetracking = false;
        //Mouse
        this.rotation = {
            x: 0,
            y: 0
        }


        this.mouseArea = document.querySelector('#mousearea');
        this.mouseArea.addEventListener('dblclick', ()=>{this.onPointerLockRequest()});
        document.addEventListener('pointerlockchange', ()=>this.onPointerLockChange());
        window.addEventListener('mousemove', e => {this.onMouseMove(e)});

    }

    createKeyBinds()
    {
        this.keybinds = {
            left: 'KeyA',
            right: 'KeyD',
            forward: 'KeyW',
            backward: 'KeyS',
            ascend: 'KeyE',
            descend: 'KeyQ',
            jump: 'Space'
        }
    }

    onPointerLockRequest()
    {
        this._camera.requestPointerLock();
    }
    onPointerLockChange()
    {
        this.mousetracking = !(document.pointerLockElement === null);
    }
    onMouseMove(e)
    {
        if(this.mousetracking)
        {
            this.rotation.x += (e.movementX / 100);
            this.rotation.y -= (e.movementY / 100);
        }



    }

    resetRotation()
    {
        this.rotation.x = this.rotation.y = 0;
    }

    keyDownEvent(code)
    {
        switch (code)
        {
            case this.keybinds.left:
                if(!this.keyDown.left)
                {
                    this.keyDown.left = true;
                    this.movement.x += 1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.right:
                if(!this.keyDown.right)
                {
                    this.keyDown.right = true;
                    this.movement.x += -1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.forward:
                if(!this.keyDown.forward)
                {
                    this.keyDown.forward = true;
                    this.movement.z += 1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.backward:
                if(!this.keyDown.backward)
                {
                    this.keyDown.backward = true;
                    this.movement.z += -1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.ascend:
                if(!this.keyDown.ascend)
                {
                    this.keyDown.ascend = true;
                    this.movement.y += 1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.descend:
                if(!this.keyDown.descend)
                {
                    this.keyDown.descend = true;
                    this.movement.y += -1;
                    this.movementUpdated();
                }
                break;
        }
    }

    keyUpEvent(code)
    {
        switch (code)
        {
            case this.keybinds.left:

                if(this.keyDown.left)
                {
                    this.movement.x -= 1;
                    this.movementUpdated();
                }
                this.keyDown.left = false;

                break;

            case this.keybinds.right:
                if(this.keyDown.right)
                {
                    this.movement.x -= -1;
                    this.movementUpdated();
                }
                this.keyDown.right = false;

                break;

            case this.keybinds.forward:
                if(this.keyDown.forward)
                {
                    this.movement.z -= 1;
                    this.movementUpdated();
                }
                this.keyDown.forward = false;

                break;

            case this.keybinds.backward:
                if(this.keyDown.backward)
                {
                    this.movement.z -= -1;
                    this.movementUpdated();
                }
                this.keyDown.backward = false;

                break;

            case this.keybinds.ascend:
                if(this.keyDown.ascend)
                {
                    this.movement.y -= 1;
                    this.movementUpdated();
                }
                this.keyDown.ascend = false;

                break;

            case this.keybinds.descend:
                if(this.keyDown.descend)
                {
                    this.movement.y -= -1;
                    this.movementUpdated();
                }
                this.keyDown.descend = false;

                break;


        }
    }

    movementUpdated()
    {
        //Runs when movement object is updated

    }
}