interface ComponentBasic {
    type: "AC" | "DC"
    x: number
    y: number
}

interface OnOffSwitch {
    type: "on-off-switch"
    x: number
    y: number
    isOn: boolean
}

type Component = ComponentBasic | OnOffSwitch
type ComponentType = Component["type"]

interface App {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    components: Component[]
    highlightedComponent: Component | null
    camera: {
        x: number
        y: number
        isDragging: boolean
    }
}

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
        camera: {
            x: 0,
            y: 0,
            isDragging: false,
        },
    }

    app.components.push({
        type: "AC",
        x: 0,
        y: 0,
    })
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

    if (app.camera.isDragging) {
        app.camera.x += event.movementX
        app.camera.y += event.movementY
    }

    app.canvas.style.cursor = app.highlightedComponent ? "pointer" : "default"
}

const handleMouseDown = (event: MouseEvent) => {
    app.camera.isDragging = true
}

const handleMouseUp = (event: MouseEvent) => {
    app.camera.isDragging = false
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

    const size = 20
    const signX = -Math.sign(camera.x)
    const signY = -Math.sign(camera.y)
    const offsetX = signX * size - Math.abs(camera.x % size) * signX
    const offsetY = signY * size - Math.abs(camera.y % size) * signY

    for (let x = offsetX; x < canvas.width; x += size) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
    }

    for (let y = offsetY; y < canvas.height; y += size) {
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

    switch (component.type) {
        case "AC":
            ctx.font = `20px Verdana`
            ctx.fillText("AC", component.x + width / 2, component.y + height / 2)
            break

        case "DC":
            ctx.font = `20px Verdana`
            ctx.fillText("DC", component.x + width / 2, component.y + height / 2)
            ctx.font = `12px Verdana`
            ctx.fillText("9V", component.x + width / 2, component.y + height / 2 + 14)
            break
    }

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
    ctx.strokeStyle = "rgb(0, 0, 0)"
    ctx.fillStyle = "rgb(30, 30, 30)"
    ctx.lineWidth = 1
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

const renderOnOffSwitch = (component: OnOffSwitch) => {
    renderCircle(100, 200, 16)
    renderCircle(120, 200, 6)
}

const isInside = (component: Component, x: number, y: number) => {
    return x > component.x && x < component.x + 40 && y > component.y && y < component.y + 40
}

try {
    create()
    requestAnimationFrame(render)
} catch (err) {
    console.error(err)
}
