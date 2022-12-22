export type Brand<T, FlavorT> = T & {
    _type?: FlavorT
}

export type ComponentId = Brand<string, "ComponentId">

interface Pin {
    componentId: ComponentId | null
    pinId: number
    current: number
}

interface BasicComponent {
    id: ComponentId
    pins: Pin[]
}

interface OnOffSwitch extends BasicComponent {
    type: "on-off-switch"
    isActive: boolean
}

interface And extends BasicComponent {
    type: "and"
}

interface Not extends BasicComponent {
    type: "not"
}

interface Led extends BasicComponent {
    type: "led"
    isActive: boolean
}

type Component = OnOffSwitch | Led | And | Not
type ComponentType = Component["type"]

const components: Record<string, Component> = {}
let lastComponentId = 1

const createPins = (num: number): Pin[] => {
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

const createComponent = (type: ComponentType): Component => {
    const id = (lastComponentId++).toString()

    let component: Component

    switch (type) {
        case "on-off-switch":
            component = {
                id,
                type,
                pins: createPins(1),
                isActive: false,
            }
            break

        case "led":
            component = {
                id,
                type,
                pins: createPins(1),
                isActive: false,
            }
            break

        case "and":
            component = {
                id,
                type,
                pins: createPins(3),
            }
            break

        case "not":
            component = {
                id,
                type,
                pins: createPins(2),
            }
            break
    }

    components[id] = component

    return component
}

const connectComponent = (component: Component, pinId: number, otherComponent: Component, otherPinId: number) => {
    const componentToPin = component.pins[pinId]
    if (componentToPin.componentId !== null) {
        throw new Error("Pin is already connected")
    }

    component.pins[pinId].componentId = otherComponent.id
    component.pins[pinId].pinId = otherPinId

    otherComponent.pins[otherPinId].componentId = component.id
    otherComponent.pins[otherPinId].pinId = pinId

    if (allPinsConnected(component)) {
        updateComponent(component)
    }
    if (allPinsConnected(otherComponent)) {
        updateComponent(otherComponent)
    }
}

const interactWithComponent = (component: Component) => {
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

    const pinTargetComponent = components[pinOut.componentId]
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

const test = () => {
    const switchA = createComponent("on-off-switch")
    const switchB = createComponent("on-off-switch")
    const and = createComponent("and")
    const not = createComponent("not")
    const led = createComponent("led") as Led

    // connectComponent(switchA, 0, and, 0)
    // connectComponent(switchB, 0, and, 1)
    // connectComponent(and, 2, led, 0)

    connectComponent(switchA, 0, not, 0)
    connectComponent(not, 1, led, 0)

    console.log("Led:", led.isActive)

    interactWithComponent(switchA)
    console.log("Led:", led.isActive)

    interactWithComponent(switchA)
    console.log("Led:", led.isActive)

    // interactWithComponent(switchB)
    // console.log("Led:", led.isActive)
}

try {
    test()
} catch (e) {
    if (e instanceof Error) console.log(e.message)
}
