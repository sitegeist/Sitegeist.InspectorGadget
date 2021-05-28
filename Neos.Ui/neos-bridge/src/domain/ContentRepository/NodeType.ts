import {Any} from 'ts-toolbelt';
import {useNodeTypesRegistry} from './NodeTypesRegistry';

export type NodeTypeName = Any.Type<string, 'NodeTypeName'>;
export function NodeTypeName(name: string): NodeTypeName {
    return name as NodeTypeName;
}

export interface INodeType {
    name: NodeTypeName
    label: string
    ui?: {
        icon?: string
    }
    properties: {
        [key: string]: {
            type: string
        }
    }
}

export function useNodeType(nodeTypeName: NodeTypeName): null | INodeType {
    const nodeTypesRegistry = useNodeTypesRegistry();
    return nodeTypesRegistry.get(nodeTypeName) ?? null;
}
