import { ComponentId } from "./component"

export interface Entity {
    componentId: ComponentId
    x: number
    y: number
    width: number
    height: number
}

export const createEntity = (componentId: ComponentId, x: number, y: number, width: number, height: number): Entity => {
    return {
        componentId,
        x,
        y,
        width,
        height,
    }
}
