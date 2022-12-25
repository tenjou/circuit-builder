import { createRenderer, render } from "./render"
import { Circuit, ComponentType, createComponent } from "./component"
import { uuid } from "./utils/uuid"
import { createEntity, Entity } from "./entity"
import { GridSize } from "./config"
import { moveCamera } from "./camera"

// interface Pin {
//     pinIndex: number
//     isOut: boolean
// }

// interface ComponentBasic {
//     id: number
//     x: number
//     y: number
//     width: number
//     height: number
//     out: number[]
//     in: number[]
// }

// interface OnOffSwitch extends ComponentBasic {
//     type: "on-off-switch"
//     isOn: boolean
// }

// interface LED extends ComponentBasic {
//     type: "led"
//     isOn: boolean
// }

// type Component = OnOffSwitch | LED
// type ComponentType = Component["type"]

// interface App {
//     canvas: HTMLCanvasElement
//     ctx: CanvasRenderingContext2D
//     componentsBuffer: Component[]
//     components: Record<number, Component>
//     wires: number[][]
//     pins: Record<number, Pin>
//     collisions: {
//         components: Record<number, number>
//         pins: Record<number, number>
//     }
//     hoveredPin: {
//         componentedId: number
//         gridX: number
//         gridY: number
//     }
//     hoveredComponent: Component | null
//     selectedComponent: Component | null
//     draggedComponent: Component | null
//     draggedOffsetX: number
//     draggedOffsetY: number
//     isHolding: boolean
//     isDragging: boolean
//     camera: {
//         x: number
//         y: number
//     }
//     lastComponentId: number
//     wire: {
//         startComponentId: number
//         startGridX: number
//         startGridY: number
//         endGridX: number
//         endGridY: number
//         placement: number[]
//     } | null
// }

// let app: App = {} as App

// window.addEventListener("resize", () => {
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight
// })

//     app = {
//         canvas,
//         ctx,
//         componentsBuffer: [],
//         components: {},
//         wires: [],
//         pins: {},
//         hoveredPin: {
//             componentedId: 0,
//             gridX: 0,
//             gridY: 0,
//         },
//         hoveredComponent: null,
//         selectedComponent: null,
//         draggedComponent: null,
//         draggedOffsetX: 0,
//         draggedOffsetY: 0,
//         isHolding: false,
//         isDragging: false,
//         collisions: {
//             components: {},
//             pins: {},
//         },
//         camera: {
//             x: 0,
//             y: 0,
//         },
//         lastComponentId: 1,
//         wire: null,
//     }

//     app.componentsBuffer.push(createComponent("on-off-switch", 100, 100))
//     app.componentsBuffer.push(createComponent("on-off-switch", 100, 160))
//     app.componentsBuffer.push(createComponent("led", 300, 160))

//     connectToComponent(app.components[1], app.components[3], 0, 0)

//     app.wires.push([2, 3, 5, 3])
// }

// const createComponent = (type: ComponentType, x: number, y: number): Component => {
//     const id = app.lastComponentId++

//     let component: Component

//     switch (type) {
//         case "on-off-switch":
//             component = {
//                 id,
//                 type,
//                 x,
//                 y,
//                 width: 40,
//                 height: 40,
//                 isOn: false,
//                 in: [],
//                 out: [0],
//             }
//             break

//         case "led":
//             component = {
//                 id,
//                 type,
//                 x,
//                 y,
//                 width: 40,
//                 height: 40,
//                 isOn: false,
//                 in: [0],
//                 out: [],
//             }
//             break
//     }

//     app.components[id] = component

//     moveComponent(component, x, y)

//     console.log("Created component", component)

//     return component
// }

// const moveComponent = (component: Component, x: number, y: number) => {
//     if (component.x !== x || component.y !== y) {
//         const prevStartGridX = Math.floor(component.x / GridSize)
//         const prevStartGridY = Math.floor(component.y / GridSize)
//         const prevEndGridX = Math.floor((component.x + component.width) / GridSize)
//         const prevEndGridY = Math.floor((component.y + component.height) / GridSize)

//         for (let gridY = prevStartGridY; gridY < prevEndGridY; gridY += 1) {
//             for (let gridX = prevStartGridX; gridX < prevEndGridX; gridX += 1) {
//                 const gridId = gridX + gridY * GridIndexSize
//                 delete app.collisions.components[gridId]
//             }
//         }

//         for (let i = 0; i < component.in.length; i += 1) {
//             const pinX = component.x
//             const pinY = component.y + component.height / 2
//             const pinGridId = Math.floor(pinX / GridSize) + Math.floor(pinY / GridSize) * GridIndexSize
//             delete app.collisions.pins[pinGridId]
//         }

//         for (let n = 0; n < component.out.length; n += 1) {
//             const pinX = component.x + component.width
//             const pinY = component.y + component.height / 2
//             const pinGridId = Math.floor(pinX / GridSize) + Math.floor(pinY / GridSize) * GridIndexSize
//             delete app.collisions.pins[pinGridId]
//         }
//     }

//     component.x = x
//     component.y = y

//     const startGridX = Math.floor(x / GridSize)
//     const startGridY = Math.floor(y / GridSize)
//     const endGridX = Math.floor((x + component.width) / GridSize)
//     const endGridY = Math.floor((y + component.height) / GridSize)

//     for (let gridY = startGridY; gridY < endGridY; gridY += 1) {
//         for (let gridX = startGridX; gridX < endGridX; gridX += 1) {
//             const gridId = gridX + gridY * GridIndexSize
//             app.collisions.components[gridId] = component.id
//         }
//     }

//     for (let i = 0; i < component.in.length; i += 1) {
//         const pinX = x
//         const pinY = y + component.height / 2
//         const pinGridId = Math.floor(pinX / GridSize) + Math.floor(pinY / GridSize) * GridIndexSize
//         app.collisions.pins[pinGridId] = component.id
//     }

//     for (let n = 0; n < component.out.length; n += 1) {
//         const pinX = x + component.width
//         const pinY = y + component.height / 2
//         const pinGridId = Math.floor(pinX / GridSize) + Math.floor(pinY / GridSize) * GridIndexSize
//         app.collisions.pins[pinGridId] = component.id
//     }
// }

// const connectToComponent = (from: Component, to: Component, fromPinIndex: number, toPinIndex: number) => {
//     console.log("Connecting from:", from, "to:", to, fromPinIndex, toPinIndex)

//     from.out[fromPinIndex] = to.id
//     to.in[toPinIndex] = from.id
// }

// const render = () => {
//     const { ctx } = app

// ctx.resetTransform()

// ctx.fillStyle = "rgb(229 231 235)"
// ctx.fillRect(0, 0, app.canvas.width, app.canvas.height)

//     renderGrid()

//     ctx.translate(app.camera.x, app.camera.y)

//     for (const wire of app.wires) {
//         renderWire(wire)
//     }
//     if (app.wire) {
//         renderWire(app.wire.placement)
//     }

//     for (const component of app.componentsBuffer) {
//         renderComponent(component)
//     }

//     if (app.selectedComponent) {
//         renderComponentHighlight(app.selectedComponent, 0.5)
//     }

//     if (app.hoveredPin.componentedId) {
//         renderPinHiglight()
//     } else {
//         if (app.hoveredComponent) {
//             renderComponentHighlight(app.hoveredComponent, 1)
//         }
//     }

//     requestAnimationFrame(render)
// }

// const renderWire = (wire: number[]) => {
//     const { ctx } = app

//     ctx.beginPath()
//     ctx.strokeStyle = "black"
//     ctx.lineWidth = 4

//     ctx.moveTo(wire[0] * GridSize, wire[1] * GridSize)

//     for (let n = 2; n < wire.length; n += 2) {
//         ctx.lineTo(wire[n] * GridSize, wire[n + 1] * GridSize)
//     }

//     ctx.stroke()
//     ctx.closePath()
// }

// const renderComponent = (component: Component) => {
//     const ctx = app.ctx

//     switch (component.type) {
//         case "led": {
//             const halfWidth = component.width / 2
//             const halfHeight = component.height / 2
//             renderCircle(component.x + halfWidth, component.y + halfHeight, 20, component.isOn ? "rgb(125 211 252)" : "rgb(155, 155, 155)")
//             break
//         }

//         case "on-off-switch": {
// const halfWidth = component.width / 2
// const halfHeight = component.height / 2

// ctx.beginPath()
// ctx.fillStyle = "black"
// ctx.strokeStyle = "black"
// ctx.lineWidth = 2
// ctx.roundRect(component.x, component.y, component.width, component.height, 3)
// ctx.stroke()

//             renderCircle(component.x + halfWidth, component.y + halfHeight, 14, component.isOn ? "rgb(125 211 252)" : "rgb(155, 155, 155)")

//             // if (component.isOn) {
//             //     ctx.globalAlpha = 0.5
//             //     ctx.beginPath()
//             //     ctx.strokeStyle = "rgb(56 189 248)"
//             //     ctx.lineWidth = 6
//             //     ctx.moveTo(component.x + 41, component.y + 20)
//             //     ctx.lineTo(component.x + 141, component.y + 20)
//             //     ctx.stroke()
//             //     ctx.globalAlpha = 1
//             // }

//             break
//         }
//     }

//     if (component.in.length > 0) {
//         const pinX = component.x
//         const pinY = component.y + 20
//         renderCircle(pinX, pinY, 4, "black")
//     }

//     if (component.out.length > 0) {
//         const pinX = component.x + component.width
//         const pinY = component.y + 20
//         renderCircle(pinX, pinY, 4, "black")
//     }
// }

// const renderComponentHighlight = (component: Component, alpha = 1) => {
//     const ctx = app.ctx
//     const offset = 2

//     ctx.beginPath()
//     ctx.globalAlpha = alpha
//     ctx.strokeStyle = "rgb(255, 0, 0)"
//     ctx.lineWidth = 2
//     ctx.roundRect(component.x - offset, component.y - offset, component.width + offset * 2, component.height + offset * 2, 3)
//     ctx.stroke()
//     ctx.globalAlpha = 1
// }

// const renderPinHiglight = () => {
//     const { ctx, hoveredPin } = app

//     const x = hoveredPin.gridX * GridSize
//     const y = hoveredPin.gridY * GridSize

//     ctx.beginPath()
//     ctx.strokeStyle = "rgb(255, 0, 0)"
//     ctx.lineWidth = 2
//     ctx.arc(x, y, PinRadius, 0, 2 * Math.PI)
//     ctx.stroke()
// }

// const interactWithComponent = (component: Component) => {
//     if (component.type !== "on-off-switch") {
//         return
//     }

//     component.isOn = !component.isOn

//     for (const pin of component.out) {
//         if (pin === 0) {
//             continue
//         }

//         const connectedComponent = app.components[pin]
//         connectedComponent.isOn = component.isOn
//     }
// }

// const getComponentAt = (x: number, y: number) => {
//     const gridX = Math.floor(x / GridSize)
//     const gridY = Math.floor(y / GridSize)
//     const gridId = gridX + gridY * GridIndexSize

//     const componentId = app.collisions.components[gridId]
//     if (componentId !== undefined) {
//         const component = app.components[componentId]
//         return component
//     }

//     return null
// }

// const updateHoveredPin = (mouseX: number, mouseY: number) => {
//     const gridX = Math.floor((mouseX + GridSize * 0.5) / GridSize)
//     const gridY = Math.floor((mouseY + GridSize * 0.5) / GridSize)
//     const pinGridId = gridX + gridY * GridIndexSize

//     let hoveredPin = app.collisions.pins[pinGridId]
//     if (hoveredPin) {
//         const offsetFromCenterX = mouseX - gridX * GridSize
//         const offsetFromCenterY = mouseY - gridY * GridSize
//         const isHoveringPin = offsetFromCenterX * offsetFromCenterX + offsetFromCenterY * offsetFromCenterY < PinRadius * PinRadius
//         hoveredPin = isHoveringPin ? hoveredPin : 0
//     }

//     app.hoveredPin.componentedId = hoveredPin
//     app.hoveredPin.gridX = gridX
//     app.hoveredPin.gridY = gridY
// }

// const handleMouseMove = (event: MouseEvent) => {
//     // const { wirePlacement } = app

//     const mouseX = event.clientX - app.camera.x
//     const mouseY = event.clientY - app.camera.y

//     updateHoveredPin(mouseX, mouseY)

//     if (app.wire) {
//         app.wire.placement = generateWire(app.wire.startGridX, app.wire.startGridY, app.hoveredPin.gridX, app.hoveredPin.gridY)
//     } else if (!app.hoveredPin.componentedId) {
//         app.hoveredComponent = getComponentAt(mouseX, mouseY)

//         if (app.isHolding) {
//             if (app.draggedComponent) {
//                 const newX = Math.round((mouseX - app.draggedOffsetX) / GridSize) * GridSize
//                 const newY = Math.round((mouseY - app.draggedOffsetY) / GridSize) * GridSize
//                 moveComponent(app.draggedComponent, newX, newY)
//             } else {
//                 // app.camera.x += event.movementX
//                 // app.camera.y += event.movementY
//             }

//             app.isDragging = true
//         }
//     }

//     // const startGridX = app.wirePlacement[0]
//     // const startGridY = app.wirePlacement[1]

//     // if (startGridX === gridX && startGridY === gridY) {
//     //     wirePlacement.length = 4
//     //     wirePlacement[2] = gridX
//     //     wirePlacement[3] = gridY
//     // } else {
//     //     const diffX = Math.abs(gridX - startGridX)
//     //     const diffY = Math.abs(gridY - startGridY)

//     //     wirePlacement.length = 8

//     //     if (diffY > diffX) {
//     //         wirePlacement[2] = startGridX
//     //         wirePlacement[3] = gridY - Math.floor((gridY - startGridY) / 2)
//     //         wirePlacement[4] = gridX
//     //         wirePlacement[5] = gridY - Math.floor((gridY - startGridY) / 2)
//     //         wirePlacement[6] = gridX
//     //         wirePlacement[7] = gridY
//     //     } else {
//     //         wirePlacement[2] = gridX - Math.floor((gridX - startGridX) / 2)
//     //         wirePlacement[3] = startGridY
//     //         wirePlacement[4] = gridX - Math.floor((gridX - startGridX) / 2)
//     //         wirePlacement[5] = gridY
//     //         wirePlacement[6] = gridX
//     //         wirePlacement[7] = gridY
//     //     }
//     // }

//     app.canvas.style.cursor = app.hoveredComponent || app.hoveredPin.componentedId ? "pointer" : "default"
// }

// const handleMouseDown = (event: MouseEvent) => {
//     const mouseX = event.clientX - app.camera.x
//     const mouseY = event.clientY - app.camera.y

//     updateHoveredPin(mouseX, mouseY)

//     if (app.hoveredPin.componentedId) {
//         app.wire = {
//             startComponentId: app.hoveredPin.componentedId,
//             startGridX: app.hoveredPin.gridX,
//             startGridY: app.hoveredPin.gridY,
//             endGridX: app.hoveredPin.gridX,
//             endGridY: app.hoveredPin.gridY,
//             placement: [],
//         }
//         console.log("Pin clicked", app.hoveredPin.componentedId)
//     } else if (app.hoveredComponent) {
//         app.draggedComponent = app.hoveredComponent
//         app.draggedOffsetX = mouseX - app.draggedComponent.x
//         app.draggedOffsetY = mouseY - app.draggedComponent.y
//     }

//     // const gridX = Math.floor((mouseX + GridSize) / GridSize)
//     // const gridY = Math.floor((mouseY + GridSize) / GridSize)
//     // app.wirePlacement = [gridX, gridY, gridX, gridY]

//     app.isHolding = true
// }

// const handleMouseUp = (event: MouseEvent) => {
//     const mouseX = event.clientX - app.camera.x
//     const mouseY = event.clientY - app.camera.y

//     app.isHolding = false
//     app.isDragging = false

//     if (app.wire) {
//         updateHoveredPin(mouseX, mouseY)
//         if (app.hoveredPin.componentedId) {
//             console.log("Pin connect to", app.hoveredPin.componentedId)
//         } else {
//             console.log("Pin connect to nothing")
//         }

//         app.wire = null
//         return
//     }

//     if (app.draggedComponent) {
//         app.draggedComponent = null
//     }

//     if (!app.isDragging) {
//         const component = getComponentAt(mouseX, mouseY)

//         if (event.detail % 2 === 0 && component) {
//             interactWithComponent(component)
//         } else {
//             app.selectedComponent = component
//         }
//     }
// }

// const generateWire = (startGridX: number, startGridY: number, endGridX: number, endGridY: number) => {
//     const diffX = Math.abs(endGridX - startGridX)
//     const diffY = Math.abs(endGridY - startGridY)

//     const wire: number[] = []

//     wire.push(startGridX, startGridY)
//     wire.push(endGridX, endGridY)

//     // if (diffY > diffX) {
//     //     wirePlacement[0] = startGridX
//     //     wirePlacement[1] = endGridY - Math.floor((endGridY - startGridY) / 2)
//     //     wirePlacement[2] = endGridX
//     //     wirePlacement[3] = endGridY - Math.floor((endGridY - startGridY) / 2)
//     //     wirePlacement[4] = endGridX
//     //     wirePlacement[5] = endGridY
//     // } else {
//     //     wirePlacement[0] = endGridX - Math.floor((endGridX - startGridX) / 2)
//     //     wirePlacement[1] = startGridY
//     //     wirePlacement[2] = endGridX - Math.floor((endGridX - startGridX) / 2)
//     //     wirePlacement[3] = endGridY
//     //     wirePlacement[4] = endGridX
//     //     wirePlacement[5] = endGridY
//     // }

//     return wire
// }

interface App {
    id: string
    name: string
}

interface AppState {
    isDragging: boolean
}

let app: App = {} as App
let state: AppState = {} as AppState

const addComponent = (componentType: ComponentType, x: number, y: number) => {
    const component = createComponent(componentType)
    createEntity(component.id, x, y)
}

const handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
        state.isDragging = true
    }
}

const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 0) {
        state.isDragging = false
    }
}

const handleMouseMove = (event: MouseEvent) => {
    if (state.isDragging) {
        moveCamera(event.movementX, event.movementY)
    }
}

const start = () => {
    app = {
        id: uuid(),
        name: "Untitled",
    }

    state = {
        isDragging: false,
    }

    createRenderer()

    addComponent("on-off-switch", 100, 100)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    requestAnimationFrame(render)
}

try {
    start()
} catch (err) {
    console.error(err)
}
