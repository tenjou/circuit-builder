import { ComponentType } from "./component"

interface ComponentConfig {
    type: ComponentType
    label: string
}

export const ComponentConfigs: Record<ComponentType, ComponentConfig> = {
    and: {
        type: "and",
        label: "AND",
    },
    not: {
        type: "not",
        label: "NOT",
    },
    circuit: {
        type: "circuit",
        label: "",
    },
    led: {
        type: "led",
        label: "",
    },
    "on-off-switch": {
        type: "on-off-switch",
        label: "",
    },
}
