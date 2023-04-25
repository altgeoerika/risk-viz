import { createStore, createTypedHooks } from 'easy-peasy'

import model from './model'
import { RiskDataModel } from './types'


export const RiskStore = createStore<RiskDataModel>(model, { disableImmer: true })

const typedHooks = createTypedHooks<RiskDataModel>()

export const { useStoreActions } = typedHooks
export const { useStoreState } = typedHooks
