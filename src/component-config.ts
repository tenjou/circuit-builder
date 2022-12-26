import { ComponentType } from "./component"
import { GridSize } from "./app-config"

interface ComponentConfig {
    type: ComponentType
    label: string
    width: number
    height: number
    in: number
    out: number
}

export const ComponentConfigs: Record<ComponentType, ComponentConfig> = {
    and: {
        type: "and",
        label: "AND",
        width: GridSize * 3,
        height: GridSize * 2,
        in: 2,
        out: 1,
    },
    not: {
        type: "not",
        label: "NOT",
        width: GridSize * 3,
        height: GridSize * 2,
        in: 1,
        out: 1,
    },
    circuit: {
        type: "circuit",
        label: "",
        width: 0,
        height: 0,
        in: 0,
        out: 0,
    },
    led: {
        type: "led",
        label: "",
        width: GridSize * 2,
        height: GridSize * 2,
        in: 1,
        out: 0,
    },
    "on-off-switch": {
        type: "on-off-switch",
        label: "",
        width: GridSize * 2,
        height: GridSize * 2,
        in: 0,
        out: 1,
    },
}
