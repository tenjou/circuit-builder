import { getCamera } from "./camera"
import { getComponent, getPin } from "./component"
import { ComponentConfigs } from "./component-config"
import { CellSize, GridSize } from "./app-config"
import { Entity, getEntities, getEntity, getWires } from "./entity"

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
    const wires = getWires()
    const camera = getCamera()

    ctx.resetTransform()

    ctx.fillStyle = "rgb(229 231 235)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderGrid()

    ctx.translate(camera.x, camera.y)

    if (hoveredEntity) {
        renderEntityHover(hoveredEntity)
    }

    for (const wire of wires) {
        const fromEntity = getEntity(wire.fromEntityId)
        const toEntity = getEntity(wire.toEntityId)
        const x1 = fromEntity.x + fromEntity.width / 2
        const y1 = fromEntity.y + fromEntity.height / 2
        const x2 = toEntity.x + toEntity.width / 2
        const y2 = toEntity.y + toEntity.height / 2

        const pin = getPin(fromEntity.componentId, wire.pinId)

        renderWire(x1, y1, x2, y2, pin.current > 0)
    }

    for (const entity of entities) {
        renderEntity(entity)
    }

    renderCircle(debugX * GridSize, debugY * GridSize, 4, "red")

    requestAnimationFrame(render)
}

const renderEntity = (entity: Entity) => {
    const component = getComponent(entity.componentId)
    const componentConfig = ComponentConfigs[component.type]

    const halfWidth = entity.width / 2
    const halfHeight = entity.height / 2

    switch (component.type) {
        default:
            ctx.beginPath()
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
            ctx.roundRect(entity.x, entity.y, entity.width, entity.height, 3)
            ctx.fill()
            ctx.stroke()
            break
    }

    if (componentConfig.in > 0) {
        for (let i = 0; i < componentConfig.in; i += 1) {
            const x = entity.x - 10
            const y = entity.y + halfHeight + (i - (componentConfig.in - 1) / 2) * 20
            renderLine(entity.x, y, x, y)
            renderCircle(x, y, 4)
        }
    }
    if (componentConfig.out > 0) {
        for (let i = 0; i < componentConfig.out; i += 1) {
            const x = entity.x + entity.width + 10
            const y = entity.y + halfHeight + (i - (componentConfig.out - 1) / 2) * 25
            renderLine(entity.x + entity.width, y, x, y)
            renderCircle(x, y, 4)
        }
    }

    if (componentConfig.label) {
        const centerX = entity.x + halfWidth
        const centerY = entity.y + halfHeight
        renderText(componentConfig.label, centerX, centerY)
    }
}

const renderLine = (x1: number, y1: number, x2: number, y2: number, color = "rgb(45, 45, 45)") => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

const renderWire = (x1: number, y1: number, x2: number, y2: number, isActive: boolean) => {
    ctx.beginPath()
    ctx.strokeStyle = isActive ? "rgb(14 165 233)" : "rgb(0, 0, 0)"
    ctx.lineWidth = 3
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

const renderCircle = (x: number, y: number, radius: number, color = "rgb(255, 255, 255)") => {
    ctx.beginPath()
    ctx.strokeStyle = "rgb(45, 45, 45)"
    ctx.fillStyle = color
    ctx.lineWidth = 2
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

const renderText = (text: string, x: number, y: number, color = "rgb(45, 45, 45)") => {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.font = "12px Verdana"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, x, y)
    ctx.closePath()
}

const renderGrid = () => {
    const camera = getCamera()

    ctx.beginPath()
    ctx.strokeStyle = "rgb(200, 200, 200)"
    ctx.lineWidth = 1

    const signX = -Math.sign(camera.x)
    const signY = -Math.sign(camera.y)
    const offsetX = signX * CellSize - Math.abs(camera.x % CellSize) * signX
    const offsetY = signY * CellSize - Math.abs(camera.y % CellSize) * signY

    for (let x = offsetX; x < canvas.width; x += CellSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
    }

    for (let y = offsetY; y < canvas.height; y += CellSize) {
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

let debugX = 0
let debugY = 0

export const setDebugPosition = (x: number, y: number) => {
    debugX = x
    debugY = y
}
