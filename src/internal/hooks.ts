import { useRef } from 'react'
import generateHash from '@/utils/hash'

/**
 * 정해진 길이로 만들어진 무작위 id를 리턴하는 hook입니다.
 * @private
 * @param length 무작위 id의 길이
 * @returns 정해진 길이로 만들어진 무작위 id
 */
export function useEntryId(length = 4) {
  const idRef = useRef('')
  return idRef.current ||= generateHash(length)
}

/**
 * 배열마다 중복 값이 들어가는 것을 방지하기 위한 `WeakMap`입니다.
 * @private
 */
const paramsMap = new WeakMap<unknown[], symbol[]>()

/**
 * 배열에 특정 항목을 중복 없이 넣어주는 hook입니다.
 * @private
 * @param params 매개변수가 들어갈 배열
 * @param descriptor 배열에 들어갈 값의 descriptor
 */
export function useParam<T>(params: T[], descriptor: PropertyDescriptor<T>) {
  const symbol = useRef(Symbol('param')).current

  const paramSymbols = paramsMap.get(params) || []
  paramsMap.set(params, paramSymbols)

  const i = paramSymbols.indexOf(symbol)
  if (i >= 0) {
    params.splice(i, 1)
    paramSymbols.splice(i, 1)
  }

  Object.defineProperty(params, params.length, {
    configurable: true,
    enumerable: true,
    writable: true,
    ...descriptor,
  })
  paramSymbols.push(symbol)
}

interface BasePropertyDescriptor {
  configurable?: boolean
  enumerable?: boolean
}

interface DataPropertyDescriptor<T> extends BasePropertyDescriptor {
  value?: T
  writable?: boolean
}

interface AccessorPropertyDescriptor<T> extends BasePropertyDescriptor {
  get?(): T
  set?(v: T): void
}

type PropertyDescriptor<T> = DataPropertyDescriptor<T> | AccessorPropertyDescriptor<T>
