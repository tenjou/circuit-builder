import { ComponentConfigs } from "./component-config"
import { Brand } from "./types"

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
                pins: createPins(numPins),
            }
            break
    }

    circuit.components[id] = component

    return component
}

export const connectComponent = (fromComponentId: ComponentId, pinId: number, toComponentId: ComponentId, toPinId: number) => {
    const fromComponent = circuit.components[fromComponentId]
    const toComponent = circuit.components[toComponentId]

    const componentFromPin = fromComponent.pins[pinId]
    const componentToPin = toComponent.pins[toPinId]
    if (componentFromPin.componentId !== null || componentToPin.componentId !== null) {
        throw new Error("Pin is already connected")
    }

    fromComponent.pins[pinId].componentId = toComponent.id
    fromComponent.pins[pinId].pinId = toPinId

    toComponent.pins[toPinId].componentId = fromComponent.id
    toComponent.pins[toPinId].pinId = pinId

    if (allPinsConnected(fromComponent)) {
        updateComponent(fromComponent)
    }
    if (allPinsConnected(toComponent)) {
        updateComponent(toComponent)
    }
}

export const interactWithComponent = (component: Component) => {
    if (component.type === "on-off-switch") {
        component.isActive = !component.isActive

        const current = component.isActive ? 1 : 0

        togglePin(component, 0, current)
    }
}

const togglePin = (component: Component, pinId: number, current: number) => {
    const pinOut = component.pins[pinId]
    if (pinOut.current === current || pinOut.componentId === null) {
        return false
    }

    pinOut.current = current

    const pinTargetComponent = circuit.components[pinOut.componentId]
    const pinIn = pinTargetComponent.pins[pinOut.pinId]
    if (pinIn.current === current || pinIn.componentId === null) {
        return false
    }

    pinIn.current = current

    updateComponent(pinTargetComponent)
}

const updateComponent = (component: Component) => {
    if (component.type === "and") {
        const pinA = component.pins[0]
        const pinB = component.pins[1]

        const result = pinA.current && pinB.current

        togglePin(component, 2, result)
    } else if (component.type === "not") {
        const pinA = component.pins[0]

        const result = pinA.current === 0 ? 1 : 0

        togglePin(component, 1, result)
    } else if (component.type === "led") {
        const isActive = component.pins[0].current === 1

        component.isActive = isActive
    }
}

const allPinsConnected = (component: Component) => {
    for (const pin of component.pins) {
        if (pin.componentId === null) {
            return false
        }
    }

    return true
}

export const getComponent = (id: ComponentId): Component => circuit.components[id]
