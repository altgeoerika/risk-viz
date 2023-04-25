import { Action } from 'easy-peasy'


export interface RiskFactors {
  Drought?: number
  Earthquake?: number
  'Extreme Cold'?: number
  'Extreme Heat'?: number
  Flooding?: number
  Hurricane?: number
  'Sea level rise'?: number
  Tornado?: number
  Volcano?: number
  Wildfires?: number
}

export interface RiskDataObject {
  Lat: number
  Lon: number
  Asset: string
  'Business Category': string,
  Risk: number
  'Risk Factors': RiskFactors
}

export type RiskData = RiskDataObject[]

export interface RiskDataModel {
  data: RiskData
  update: Action<this, any>
}
