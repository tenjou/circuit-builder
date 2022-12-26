import { ComponentId, getComponent } from "./component"
import { ComponentConfigs } from "./component-config"
import { GridIndexSize, GridSize } from "./config"
import { Brand } from "./types"

export type EntityId = Brand<string, "EntityId">

export interface Entity {
    id: EntityId
    componentId: ComponentId
    x: number
    y: number
    width: number
    height: number
}

export interface Wire {
    fromEntityId: EntityId
    toEntityId: EntityId
}

interface EntitiesState {
    buffer: Entity[]
    wires: Wire[]
    lastId: number
    collisions: {
        entities: Record<number, Entity>
    }
}

let state: EntitiesState = {} as EntitiesState
let entitiesMap: Record<EntityId, Entity> = {}

export const createEntity = (componentId: ComponentId, x: number, y: number): Entity => {
    const component = getComponent(componentId)
    const componentConfig = ComponentConfigs[component.type]
    const entityId = (state.lastId++).toString()

    const entity: Entity = {
        id: entityId,
        componentId,
        x,
        y,
        width: componentConfig.width,
        height: componentConfig.height,
    }

    state.buffer.push(entity)
    entitiesMap[entityId] = entity

    moveEntity(entity, x, y)

    return entity
}

export const createWire = (fromEntityId: EntityId, toEntityId: EntityId) => {
    const wire: Wire = {
        fromEntityId,
        toEntityId,
    }

    state.wires.push(wire)
}

export const moveEntity = (entity: Entity, x: number, y: number) => {
    if (entity.x !== x || entity.y !== y) {
        const prevStartGridX = Math.floor(entity.x / GridSize)
        const prevStartGridY = Math.floor(entity.y / GridSize)
        const prevEndGridX = Math.floor((entity.x + entity.width) / GridSize)
        const prevEndGridY = Math.floor((entity.y + entity.height) / GridSize)

        for (let gridY = prevStartGridY; gridY < prevEndGridY; gridY += 1) {
            for (let gridX = prevStartGridX; gridX < prevEndGridX; gridX += 1) {
                const gridId = gridX + gridY * GridIndexSize
                delete state.collisions.entities[gridId]
            }
        }
    }

    entity.x = x
    entity.y = y

    const startGridX = Math.floor(x / GridSize)
    const startGridY = Math.floor(y / GridSize)
    const endGridX = Math.floor((x + entity.width) / GridSize)
    const endGridY = Math.floor((y + entity.height) / GridSize)

    for (let gridY = startGridY; gridY < endGridY; gridY += 1) {
        for (let gridX = startGridX; gridX < endGridX; gridX += 1) {
            const gridId = gridX + gridY * GridIndexSize
            state.collisions.entities[gridId] = entity
        }
    }
}

export const getEntityAt = (x: number, y: number) => {
    const gridX = Math.floor(x / GridSize)
    const gridY = Math.floor(y / GridSize)
    const gridId = gridX + gridY * GridIndexSize

    const entity = state.collisions.entities[gridId]

    return entity || null
}

export const createEntities = () => {
    state = {
        buffer: [],
        wires: [],
        lastId: 0,
        collisions: {
            entities: {},
        },
    }
    entitiesMap = {}
}

export const loadEntities = (newState: EntitiesState) => {
    state = newState
    entitiesMap = {}

    for (const entity of state.buffer) {
        entitiesMap[entity.id] = entity
    }
}

export const getEntities = () => state.buffer

export const getEntity = (entityId: EntityId) => entitiesMap[entityId]

export const getWires = () => state.wires
