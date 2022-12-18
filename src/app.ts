interface Pin {}

interface ComponentBasic {
    id: number
    x: number
    y: number
    width: number
    height: number
    out: Pin[]
    in: Pin[]
}

interface OnOffSwitch extends ComponentBasic {
    type: "on-off-switch"
    isOn: boolean
}

interface LED extends ComponentBasic {
    type: "led"
    isOn: boolean
}

type Component = OnOffSwitch | LED
type ComponentType = Component["type"]
type Wire = number[]

interface App {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    componentsBuffer: Component[]
    components: Record<number, Component>
    wires: Wire[][]
    hoveredComponent: Component | null
    selectedComponent: Component | null
    draggedComponent: Component | null
    draggedOffsetX: number
    draggedOffsetY: number
    isHolding: boolean
    isDragging: boolean
    camera: {
        x: number
        y: number
    }
    lastComponentId: number
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
        componentsBuffer: [],
        components: {},
        wires: [],
        hoveredComponent: null,
        selectedComponent: null,
        draggedComponent: null,
        draggedOffsetX: 0,
        draggedOffsetY: 0,
        isHolding: false,
        isDragging: false,
        camera: {
            x: 0,
            y: 0,
        },
        lastComponentId: 0,
    }

    app.componentsBuffer.push(createComponent("on-off-switch", 100, 100))
    app.componentsBuffer.push(createComponent("on-off-switch", 100, 160))
    app.componentsBuffer.push(createComponent("led", 300, 160))

    connectToComponent(app.components[1], app.components[2], 0, 0)

    app.wires.push([
        [100, 140],
        [200, 140],
    ])
}

const createComponent = (type: ComponentType, x: number, y: number): Component => {
    const id = app.lastComponentId++

    let component: Component

    switch (type) {
        case "on-off-switch":
            component = {
                id,
                type,
                x,
                y,
                width: 40,
                height: 40,
                isOn: false,
                in: [],
                out: [-1],
            }
            break

        case "led":
            component = {
                id,
                type,
                x,
                y,
                width: 40,
                height: 40,
                isOn: false,
                in: [-1],
                out: [],
            }
            break
    }

    app.components[id] = component

    console.log("Created component", component)

    return component
}

const connectToComponent = (from: Component, to: Component, fromPinIndex: number, toPinIndex: number) => {
    console.log("Connecting", from, to, fromPinIndex, toPinIndex)

    from.out[fromPinIndex] = to.id
    to.in[toPinIndex] = from.id
}

const render = () => {
    app.ctx.resetTransform()

    app.ctx.fillStyle = "rgb(229 231 235)"
    app.ctx.fillRect(0, 0, app.canvas.width, app.canvas.height)

    renderGrid()

    app.ctx.translate(app.camera.x, app.camera.y)

    for (const wire of app.wires) {
        renderWire(wire)
    }

    for (const component of app.componentsBuffer) {
        renderComponent(component)
    }

    if (app.selectedComponent) {
        renderComponentHighlight(app.selectedComponent, 0.5)
    }
    if (app.hoveredComponent) {
        renderComponentHighlight(app.hoveredComponent, 1)
    }

    requestAnimationFrame(render)
}

const renderGrid = () => {
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

const renderWire = (wire: Wire[]) => {
    const { ctx } = app

    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2

    const prev = wire[0]
    ctx.moveTo(prev[0], prev[1])

    for (let i = 1; i < wire.length; i++) {
        const next = wire[i]
        ctx.lineTo(next[0], next[1])
    }

    ctx.stroke()
    ctx.closePath()
}

const renderComponent = (component: Component) => {
    const ctx = app.ctx

    switch (component.type) {
        case "led": {
            const halfWidth = component.width / 2
            const halfHeight = component.height / 2
            renderCircle(component.x + halfWidth, component.y + halfHeight, 20, component.isOn ? "rgb(125 211 252)" : "rgb(155, 155, 155)")
            break
        }

        case "on-off-switch": {
            const halfWidth = component.width / 2
            const halfHeight = component.height / 2

            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
            ctx.roundRect(component.x, component.y, component.width, component.height, 3)
            ctx.stroke()

            renderCircle(component.x + halfWidth, component.y + halfHeight, 14, component.isOn ? "rgb(125 211 252)" : "rgb(155, 155, 155)")

            // ctx.beginPath()
            // ctx.strokeStyle = "black"
            // ctx.lineWidth = 2
            // ctx.moveTo(component.x + 41, component.y + 20)
            // ctx.lineTo(component.x + 141, component.y + 20)
            // ctx.stroke()

            // if (component.isOn) {
            //     ctx.globalAlpha = 0.5
            //     ctx.beginPath()
            //     ctx.strokeStyle = "rgb(56 189 248)"
            //     ctx.lineWidth = 6
            //     ctx.moveTo(component.x + 41, component.y + 20)
            //     ctx.lineTo(component.x + 141, component.y + 20)
            //     ctx.stroke()
            //     ctx.globalAlpha = 1
            // }

            break
        }
    }

    if (component.in.length > 0) {
        const pinX = component.x - 1
        const pinY = component.y + 20
        renderCircle(pinX, pinY, 4, "black")
    }

    if (component.out.length > 0) {
        const pinX = component.x + component.width + 1
        const pinY = component.y + 20
        renderCircle(pinX, pinY, 4, "black")
    }
}

const renderComponentHighlight = (component: Component, alpha = 1) => {
    const ctx = app.ctx
    const offset = 3
    const width = 40
    const height = 40

    ctx.beginPath()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = "rgb(255, 0, 0)"
    ctx.lineWidth = 2
    ctx.roundRect(component.x - offset, component.y - offset, width + offset * 2, height + offset * 2, 3)
    ctx.stroke()
    ctx.globalAlpha = 1
}

const renderCircle = (x: number, y: number, radius: number, color = "rgb(155, 155, 155)") => {
    const ctx = app.ctx

    ctx.beginPath()
    ctx.strokeStyle = "rgb(45, 45, 45)"
    ctx.fillStyle = color
    ctx.lineWidth = 2
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

const interactWithComponent = (component: Component) => {
    if (component.type !== "on-off-switch") {
        return
    }

    component.isOn = !component.isOn

    for (const pin of component.out) {
        if (pin === -1) {
            continue
        }

        const connectedComponent = app.componentsBuffer[pin as number]
        connectedComponent.isOn = component.isOn
    }
}

const isInside = (component: Component, x: number, y: number) => {
    return x >= component.x && x <= component.x + component.width && y >= component.y && y <= component.y + component.height
}

const getComponentAt = (x: number, y: number) => {
    for (const component of app.componentsBuffer) {
        if (isInside(component, x, y)) {
            return component
        }
    }

    return null
}

const handleMouseMove = (event: MouseEvent) => {
    const mouseX = event.clientX - app.camera.x
    const mouseY = event.clientY - app.camera.y

    app.hoveredComponent = getComponentAt(mouseX, mouseY)
    app.canvas.style.cursor = app.hoveredComponent ? "pointer" : "default"

    if (app.isHolding) {
        if (app.draggedComponent) {
            app.draggedComponent.x = Math.round((mouseX - app.draggedOffsetX) / GridSize) * GridSize
            app.draggedComponent.y = Math.round((mouseY - app.draggedOffsetY) / GridSize) * GridSize
        } else {
            app.camera.x += event.movementX
            app.camera.y += event.movementY
        }

        app.isDragging = true
    }
}

const handleMouseDown = (event: MouseEvent) => {
    const mouseX = event.clientX - app.camera.x
    const mouseY = event.clientY - app.camera.y

    if (app.hoveredComponent) {
        app.draggedComponent = app.hoveredComponent
        app.draggedOffsetX = mouseX - app.draggedComponent.x
        app.draggedOffsetY = mouseY - app.draggedComponent.y
    }

    app.isHolding = true
}

const handleMouseUp = (event: MouseEvent) => {
    const mouseX = event.clientX - app.camera.x
    const mouseY = event.clientY - app.camera.y

    if (app.draggedComponent) {
        app.draggedComponent = null
    }

    if (!app.isDragging) {
        const component = getComponentAt(mouseX, mouseY)

        if (event.detail % 2 === 0 && component) {
            interactWithComponent(component)
        } else {
            app.selectedComponent = component
        }
    }

    app.isHolding = false
    app.isDragging = false
}

try {
    create()
    requestAnimationFrame(render)
} catch (err) {
    console.error(err)
}
