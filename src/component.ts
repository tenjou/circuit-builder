import { ComponentConfigs } from "./component-config"

export type Brand<T, FlavorT> = T & {
    _type?: FlavorT
}

export type ComponentId = Brand<string, "ComponentId">

export interface Pin {
    componentId: ComponentId | null
    pinId: number
    current: number
}

export interface BasicComponent {
    id: ComponentId
    pins: Pin[]
}

export interface OnOffSwitch extends BasicComponent {
    type: "on-off-switch"
    isActive: boolean
}

export interface And extends BasicComponent {
    type: "and"
}

export interface Not extends BasicComponent {
    type: "not"
}

export interface Led extends BasicComponent {
    type: "led"
    isActive: boolean
}

export interface Circuit extends BasicComponent {
    type: "circuit"
    components: Record<ComponentId, Component>
    lastComponentId: number
}

export type Component = OnOffSwitch | Led | And | Not | Circuit
export type ComponentType = Component["type"]

let circuit: Circuit = {
    id: "0",
    type: "circuit",
    components: {},
    lastComponentId: 1,
    pins: [],
}

export const createPins = (num: number): Pin[] => {
    const pins: Pin[] = []

    for (let i = 0; i < num; i++) {
        pins.push({
            componentId: null,
            pinId: i,
            current: 0,
        })
    }

    return pins
}

export const createComponent = (type: ComponentType): Component => {
    const componentCfg = ComponentConfigs[type]

    const id = (circuit.lastComponentId++).toString()
    const numPins = componentCfg.in + componentCfg.out

    let component: Component

    switch (type) {
        case "on-off-switch":
        case "led":
            component = {
                id,
                type,
                pins: createPins(numPins),
                isActive: false,
            }
            break

        case "circuit":
            throw new Error("Circuit cannot be created with createComponent")

        default:
            component = {
                id,
                type,
                pins: createPins(2),
            }
            break
    }

    circuit.components[id] = component

    return component
}

export const getComponent = (id: ComponentId): Component => circuit.components[id]
