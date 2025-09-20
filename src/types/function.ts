export type FunctionType = 'normal' | 'value'

export interface FunctionData<ID extends string = string> {
  id: ID
  content: string
  type: FunctionType
  useLocalVariables: boolean
  localVariables?: LocalVariableData<ID>[]
}

export interface LocalVariableData<ID extends string> {
  id: `${ID}_${string}`
  name: string
  value: unknown
}
