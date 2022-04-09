
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720


class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
    }
}

class Platform {
    constructor({x, y, image} ) { 
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height   
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image} ) { 
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height 
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}
const platformImg = createImage("/img/platform.png")
const background = createImage("/img/background.png")
const hills = createImage("/img/hills.png")

const gravity = 2
const player = new Player ()

// PLATFORMS
const platforms = [ //array to add new platforms
    new Platform({
        x: -1,
        y: 600,
        image: platformImg
    }), 
    new Platform({
        x: platformImg.width -3, 
        y: 600,
        image: platformImg
    })
]

// GENERIC/DECORATIVE OBJECTS



const genericObject = [
    new GenericObject({
        x: -1,
        y: -1,
        image: background 
    }),
    new GenericObject({
        x: -1,
        y: 135,
        image: hills
    })
]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0


// ON_SCREEN
function animate () {
    requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    genericObject.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    // move right-left && Background scroll
    if (keys.right.pressed && player.position.x < 400) { //player.position.x < num = right border which the player can move and after that it is scrolling the background
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100){ //same as above, just the left border
        player.velocity.x = -5
    }else {
        player.velocity.x = 0

        if (keys.right.pressed){ 
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5        //movementspeed to right
            })
            genericObject.forEach(genericObject => genericObject.position.x -= 3) //background swipes left when moving right
        }else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5        //movementspeed to left
            })
            genericObject.forEach(genericObject => genericObject.position.x += 3)
        }
    } 

    //console.log(scrollOffset)

    // platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
    })

    if (scrollOffset > 2000){
        console.log("You Win")
    }
}
animate()

// Event listener (keydown = key pressed) (keyup = key released)
window.addEventListener('keydown', ({keyCode}) => {
    //console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            break

        case 87:
            console.log('up')
            player.velocity.y -= 20
            break

        case 83:
            console.log('down')

            break
    }
})

window.addEventListener('keyup', ({keyCode}) => {
    //console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break

        case 68:
            console.log('right')
            keys.right.pressed = false
            break

        case 87:
            console.log('up')
            player.velocity.y -= 20
            break

        case 83:
            console.log('down')

            break
    }
})