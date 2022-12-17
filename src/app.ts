interface ComponentBasic {
    x: number
    y: number
    width: number
    height: number
}

interface OnOffSwitch extends ComponentBasic {
    type: "on-off-switch"
    isOn: boolean
}

type Component = OnOffSwitch
type ComponentType = Component["type"]

interface App {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    components: Component[]
    highlightedComponent: Component | null
    draggedComponent: Component | null
    camera: {
        x: number
        y: number
        isDragging: boolean
    }
}

const GridSize = 20

let app: App = {} as App

const create = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) {
        throw new Error("Could not get canvas context")
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    app = {
        canvas,
        ctx,
        components: [],
        highlightedComponent: null,
        draggedComponent: null,
        camera: {
            x: 0,
            y: 0,
            isDragging: false,
        },
    }

    app.components.push(createComponent("on-off-switch", 100, 100))
    app.components.push(createComponent("on-off-switch", 300, 200))
}

const createComponent = (type: ComponentType, x: number, y: number): Component => {
    switch (type) {
        case "on-off-switch":
            return {
                type,
                x,
                y,
                width: 40,
                height: 40,
                isOn: false,
            }
    }
}

const handleMouseMove = (event: MouseEvent) => {
    app.highlightedComponent = null

    const mouseX = event.clientX - app.camera.x
    const mouseY = event.clientY - app.camera.y

    for (const component of app.components) {
        if (isInside(component, mouseX, mouseY)) {
            app.highlightedComponent = component
            break
        }
    }

    if (app.draggedComponent) {
        const midMouseX = mouseX - app.draggedComponent.width / 2
        const midMouseY = mouseY - app.draggedComponent.height / 2
        app.draggedComponent.x = Math.round(midMouseX / GridSize) * GridSize
        app.draggedComponent.y = Math.round(midMouseY / GridSize) * GridSize
    } else if (app.camera.isDragging) {
        app.camera.x += event.movementX
        app.camera.y += event.movementY
    }

    app.canvas.style.cursor = app.highlightedComponent ? "pointer" : "default"
}

const handleMouseDown = (event: MouseEvent) => {
    app.camera.isDragging = true

    if (app.highlightedComponent) {
        app.draggedComponent = app.highlightedComponent
    }
}

const handleMouseUp = (event: MouseEvent) => {
    app.camera.isDragging = false

    if (app.draggedComponent) {
        app.draggedComponent = null
    }
}

const render = () => {
    app.ctx.resetTransform()

    app.ctx.fillStyle = "rgb(229 231 235)"
    app.ctx.fillRect(0, 0, app.canvas.width, app.canvas.height)

    drawGrid()

    app.ctx.translate(app.camera.x, app.camera.y)

    for (const component of app.components) {
        renderComponent(component)
    }

    if (app.highlightedComponent) {
        renderComponentHighlight(app.highlightedComponent)
    }

    requestAnimationFrame(render)
}

const drawGrid = () => {
    const { ctx, camera, canvas } = app

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

const renderComponent = (component: Component) => {
    const ctx = app.ctx
    const width = 40
    const height = 40

    ctx.beginPath()
    ctx.fillStyle = "black"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.roundRect(component.x, component.y, width, height, 3)
    ctx.stroke()
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // switch (component.type) {
    //     case "AC":
    //         ctx.font = `20px Verdana`
    //         ctx.fillText("AC", component.x + width / 2, component.y + height / 2)
    //         break

    //     case "DC":
    //         ctx.font = `20px Verdana`
    //         ctx.fillText("DC", component.x + width / 2, component.y + height / 2)
    //         ctx.font = `12px Verdana`
    //         ctx.fillText("9V", component.x + width / 2, component.y + height / 2 + 14)
    //         break
    // }

    ctx.closePath()
}

const renderComponentHighlight = (component: Component) => {
    const ctx = app.ctx
    const offset = 3
    const width = 40
    const height = 40

    ctx.beginPath()
    ctx.strokeStyle = "rgb(255, 0, 0)"
    ctx.lineWidth = 2
    ctx.roundRect(component.x - offset, component.y - offset, width + offset * 2, height + offset * 2, 3)
    ctx.stroke()
}

const renderCircle = (x: number, y: number, radius: number) => {
    const ctx = app.ctx

    ctx.beginPath()
    ctx.strokeStyle = "rgb(45, 45, 45)"
    ctx.fillStyle = "rgb(155, 155, 155)"
    ctx.lineWidth = 2
    ctx.arc(x + radius + 20 - radius, y + radius + 20 - radius, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

const renderOnOffSwitch = (component: OnOffSwitch) => {
    renderCircle(100, 200, 16)
    renderCircle(120, 200, 6)
}

const isInside = (component: Component, x: number, y: number) => {
    return x >= component.x && x <= component.x + component.width && y >= component.y && y <= component.y + component.height
}

try {
    create()
    requestAnimationFrame(render)
} catch (err) {
    console.error(err)
}