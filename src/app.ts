import { getCamera, moveCamera } from "./camera"
import { ComponentId, ComponentType, connectComponent, createComponent } from "./component"
import { GridSize } from "./config"
import { createEntities, createEntity, createWire, Entity, EntityId, getEntity, getEntityAt, moveEntity } from "./entity"
import { createRenderer, render, setHoveredEntity } from "./render"
import { uuid } from "./utils/uuid"

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
// const newX = Math.round((mouseX - app.draggedOffsetX) / GridSize) * GridSize
// const newY = Math.round((mouseY - app.draggedOffsetY) / GridSize) * GridSize
// moveComponent(app.draggedComponent, newX, newY)
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

interface App {
    id: string
    name: string
}

interface AppState {
    isDragging: boolean
    dragging: {
        entity: Entity
        offsetX: number
        offsetY: number
    } | null
}

let app: App = {} as App
let state: AppState = {} as AppState

const addComponent = (componentType: ComponentType, x: number, y: number): EntityId => {
    const component = createComponent(componentType)
    const entity = createEntity(component.id, x, y)

    return entity.id
}

const addConnection = (fromEntityId: EntityId, pinId: number, toEntityId: EntityId, otherPinId: number) => {
    const fromEntity = getEntity(fromEntityId)
    const toEntity = getEntity(toEntityId)

    connectComponent(fromEntity.componentId, pinId, toEntity.componentId, otherPinId)
    createWire(fromEntityId, toEntityId)
}

const handleMouseDown = (event: MouseEvent) => {
    const camera = getCamera()
    const mouseX = event.clientX - camera.x
    const mouseY = event.clientY - camera.y

    if (event.button === 0) {
        const hoveredEntity = getEntityAt(mouseX, mouseY)
        if (hoveredEntity) {
            state.dragging = {
                entity: hoveredEntity,
                offsetX: mouseX - hoveredEntity.x,
                offsetY: mouseY - hoveredEntity.y,
            }
        } else {
            state.isDragging = true
        }
    }
}

const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 0) {
        state.dragging = null
        state.isDragging = false
    }
}

const handleMouseMove = (event: MouseEvent) => {
    const camera = getCamera()
    const mouseX = event.clientX - camera.x
    const mouseY = event.clientY - camera.y

    if (state.dragging) {
        const newX = Math.round((mouseX - state.dragging.offsetX) / GridSize) * GridSize
        const newY = Math.round((mouseY - state.dragging.offsetY) / GridSize) * GridSize
        moveEntity(state.dragging.entity, newX, newY)
        return
    }

    const hoveredEntity = getEntityAt(mouseX, mouseY)
    setHoveredEntity(hoveredEntity)
    document.body.style.cursor = hoveredEntity ? "pointer" : "default"

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
        dragging: null,
    }

    createRenderer()
    createEntities()

    const switchA = addComponent("on-off-switch", 100, 100)
    const switchB = addComponent("on-off-switch", 100, 220)
    const and = addComponent("and", 220, 160)
    const not = addComponent("not", 340, 160)
    const led = addComponent("led", 480, 160)

    addConnection(switchA, 0, and, 0)
    addConnection(switchB, 0, and, 1)
    addConnection(and, 2, not, 0)
    addConnection(not, 1, led, 0)

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
