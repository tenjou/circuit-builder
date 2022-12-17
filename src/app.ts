interface ComponentBasic {
    id: number
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
    componentsMap: Map<number, Component>
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
        components: [],
        componentsMap: new Map(),
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

    app.components.push(createComponent("on-off-switch", 100, 100))
    app.components.push(createComponent("on-off-switch", 100, 160))
}

const createComponent = (type: ComponentType, x: number, y: number): Component => {
    const id = app.lastComponentId++

    switch (type) {
        case "on-off-switch":
            return {
                id,
                type,
                x,
                y,
                width: 40,
                height: 40,
                isOn: false,
            }
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

    if (app.selectedComponent) {
        renderComponentHighlight(app.selectedComponent, 0.5)
    }
    if (app.hoveredComponent) {
        renderComponentHighlight(app.hoveredComponent, 1)
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

    switch (component.type) {
        case "on-off-switch":
            renderCircle(component.x, component.y, 14, component.isOn ? "rgb(125 211 252)" : "rgb(155, 155, 155)")

            ctx.beginPath()
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
            ctx.moveTo(component.x + 41, component.y + 20)
            ctx.lineTo(component.x + 141, component.y + 20)
            ctx.stroke()

            if (component.isOn) {
                ctx.globalAlpha = 0.5
                ctx.beginPath()
                ctx.strokeStyle = "rgb(56 189 248)"
                ctx.lineWidth = 6
                ctx.moveTo(component.x + 41, component.y + 20)
                ctx.lineTo(component.x + 141, component.y + 20)
                ctx.stroke()
                ctx.globalAlpha = 1
            }
            break
    }

    ctx.closePath()
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
    ctx.arc(x + radius + 20 - radius, y + radius + 20 - radius, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

const renderOnOffSwitch = (component: OnOffSwitch) => {
    renderCircle(100, 200, 16)
    renderCircle(120, 200, 6)
}

const interactWithComponent = (component: Component) => {
    if (component.type === "on-off-switch") {
        component.isOn = !component.isOn
    }
}

const isInside = (component: Component, x: number, y: number) => {
    return x >= component.x && x <= component.x + component.width && y >= component.y && y <= component.y + component.height
}

const getComponentAt = (x: number, y: number) => {
    for (const component of app.components) {
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
