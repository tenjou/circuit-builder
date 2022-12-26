import { ComponentId, getComponent } from "./component"
import { ComponentConfigs } from "./component-config"
import { GridIndexSize, GridSize } from "./config"

export interface Entity {
    componentId: ComponentId
    x: number
    y: number
    width: number
    height: number
}

interface Collisions {
    entities: Record<number, Entity>
}

let entities: Entity[] = []
let collisions: Collisions = {
    entities: {},
}

export const createEntity = (componentId: ComponentId, x: number, y: number): Entity => {
    const component = getComponent(componentId)
    const componentConfig = ComponentConfigs[component.type]

    const entity: Entity = {
        componentId,
        x,
        y,
        width: componentConfig.width,
        height: componentConfig.height,
    }

    entities.push(entity)

    moveEntity(entity, x, y)

    return entity
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
                delete collisions.entities[gridId]
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
            collisions.entities[gridId] = entity
        }
    }
}

export const getEntityAt = (x: number, y: number) => {
    const gridX = Math.floor(x / GridSize)
    const gridY = Math.floor(y / GridSize)
    const gridId = gridX + gridY * GridIndexSize

    const entity = collisions.entities[gridId]

    return entity || null
}

export const loadEntities = (newEntities: Entity[]) => (entities = newEntities)

export const getEntities = () => entities
