import { ComponentId, getComponent } from "./component"
import { GridSize } from "./config"

export interface Entity {
    componentId: ComponentId
    x: number
    y: number
    width: number
    height: number
}

let entities: Entity[] = []

export const createEntity = (componentId: ComponentId, x: number, y: number): Entity => {
    const component = getComponent(componentId)

    let width = GridSize
    let height = GridSize

    switch (component.type) {
        case "on-off-switch":
            width = GridSize * 2
            height = GridSize * 2
            break
    }

    const entity: Entity = {
        componentId,
        x,
        y,
        width,
        height,
    }

    entities.push(entity)

    return entity
}

export const loadEntities = (newEntities: Entity[]) => (entities = newEntities)

export const getEntities = () => entities
