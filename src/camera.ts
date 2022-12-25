interface Camera {
    x: number
    y: number
}

let camera: Camera = {
    x: 0,
    y: 0,
}

export const moveCamera = (x: number, y: number) => {
    camera.x += x
    camera.y += y
}

export const getCamera = () => camera
