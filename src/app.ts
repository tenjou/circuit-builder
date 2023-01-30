import { GridSize } from "./app-config"
import { getCamera, moveCamera } from "./camera"
import { ComponentType, connectComponent, createComponent, interactWithComponent } from "./component"
import { createEntities, createEntity, createWire, Entity, EntityId, getEntity, getEntityAt, moveEntity } from "./entity"
import { createRenderer, render, setDebugPosition, setHoveredEntity } from "./render"
import { uuid } from "./utils/uuid"

interface App {
    id: string
    name: string
}

interface AppState {
    draggingEntity: Entity | null
    draggingOffsetX: number
    draggingOffsetY: number
    holdX: number
    holdY: number
    isHolding: boolean
    isDragging: boolean
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
    createWire(fromEntityId, toEntityId, pinId)
}

const handleMouseDown = (event: MouseEvent) => {
    const camera = getCamera()
    const mouseX = event.clientX - camera.x
    const mouseY = event.clientY - camera.y

    if (event.button === 0) {
        state.holdX = event.clientX
        state.holdY = event.clientY
        state.isHolding = true

        state.draggingEntity = getEntityAt(mouseX, mouseY)
        if (state.draggingEntity) {
            state.draggingOffsetX = mouseX - state.draggingEntity.x
            state.draggingOffsetY = mouseY - state.draggingEntity.y
        }
    }
}

const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 0) {
        if (!state.isDragging && state.draggingEntity) {
            interactWithComponent(state.draggingEntity.componentId)
        }

        state.draggingEntity = null
        state.isDragging = false
        state.isHolding = false
    }
}

const handleMouseMove = (event: MouseEvent) => {
    const camera = getCamera()
    const mouseX = event.clientX - camera.x
    const mouseY = event.clientY - camera.y

    const gridX = Math.round(mouseX / GridSize)
    const gridY = Math.round(mouseY / GridSize)
    console.log(`(${gridX}, ${gridY})`)
    setDebugPosition(gridX, gridY)

    if (!state.isHolding) {
        const hoveredEntity = getEntityAt(mouseX, mouseY)
        setHoveredEntity(hoveredEntity)
        document.body.style.cursor = hoveredEntity ? "pointer" : "default"
        return
    }

    if (state.draggingEntity) {
        const newX = Math.round((mouseX - state.draggingOffsetX) / GridSize) * GridSize
        const newY = Math.round((mouseY - state.draggingOffsetY) / GridSize) * GridSize
        moveEntity(state.draggingEntity, newX, newY)
    } else {
        moveCamera(event.movementX, event.movementY)
    }

    state.isDragging = true
}

const start = () => {
    app = {
        id: uuid(),
        name: "Untitled",
    }

    state = {
        holdX: 0,
        holdY: 0,
        isHolding: false,
        isDragging: false,
        draggingEntity: null,
        draggingOffsetX: 0,
        draggingOffsetY: 0,
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
