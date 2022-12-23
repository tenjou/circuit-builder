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

export interface Block extends BasicComponent {
    type: "block"
    components: Record<ComponentId, Component>
    lastComponentId: number
}

export type Component = OnOffSwitch | Led | And | Not | Block
export type ComponentType = Component["type"]
