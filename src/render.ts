import { getCamera } from "./camera"
import { getComponent } from "./component"
import { GridSize } from "./config"
import { Entity, getEntities } from "./entity"

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let hoveredEntity: Entity | null = null

export const createRenderer = () => {
    canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    if (!ctx) {
        throw new Error("Could not get canvas context")
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })

    document.body.appendChild(canvas)
}

export const render = () => {
    const entities = getEntities()
    const camera = getCamera()

    ctx.resetTransform()

    ctx.fillStyle = "rgb(229 231 235)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderGrid()

    ctx.translate(camera.x, camera.y)

    if (hoveredEntity) {
        renderEntityHover(hoveredEntity)
    }

    for (const entity of entities) {
        renderEntity(entity)
    }

    requestAnimationFrame(render)
}

const renderEntity = (entity: Entity) => {
    const component = getComponent(entity.componentId)

    switch (component.type) {
        case "on-off-switch":
            const halfWidth = entity.width / 2
            const halfHeight = entity.height / 2

            ctx.beginPath()
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
            ctx.roundRect(entity.x, entity.y, entity.width, entity.height, 3)
            ctx.fill()
            ctx.stroke()
            break
    }
}

const renderCircle = (x: number, y: number, radius: number, color = "rgb(155, 155, 155)") => {
    ctx.beginPath()
    ctx.strokeStyle = "rgb(45, 45, 45)"
    ctx.fillStyle = color
    ctx.lineWidth = 2
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

const renderGrid = () => {
    const camera = getCamera()

    ctx.beginPath()
    ctx.strokeStyle = "rgb(200, 200, 200)"
    ctx.lineWidth = 1

    const signX = -Math.sign(camera.x)
    const signY = -Math.sign(camera.y)
    const offsetX = signX * GridSize - Math.abs(camera.x % GridSize) * signX
    const offsetY = signY * GridSize - Math.abs(camera.y % GridSize) * signY

    for (let x = offsetX; x < canvas.width; x += GridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
    }

    for (let y = offsetY; y < canvas.height; y += GridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
    }

    ctx.stroke()
    ctx.closePath()
}

const renderEntityHover = (entity: Entity) => {
    const offset = 5

    ctx.beginPath()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = "rgb(150, 150, 150)"
    ctx.roundRect(entity.x - offset, entity.y - offset, entity.width + offset * 2, entity.height + offset * 2, 3)
    ctx.fill()
    ctx.closePath()

    ctx.globalAlpha = 1
}

export const setHoveredEntity = (entity: Entity | null) => {
    hoveredEntity = entity
}
