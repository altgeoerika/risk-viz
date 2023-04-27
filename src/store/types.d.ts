import { Action, Computed } from 'easy-peasy'


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
  'Business Category': string
  Risk: number
  'Risk Factors': RiskFactors
  Year: number
}

export type RiskData = RiskDataObject[]

export interface RiskFilters {
  [key: string]: string | number
}

export interface RiskDataModel {
  data: RiskData
  yearFilter: number
  yearList: Computed<RiskDataModel, number[]>
  flatData: Computed<RiskDataModel, (RiskDataObject & RiskFactors)[]>
  filteredMapData: Computed<RiskDataModel, RiskData>
  update: Action<RiskDataModel, Partial<RiskDataModel>>
}
