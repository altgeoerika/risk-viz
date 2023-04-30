import { Action, Computed } from 'easy-peasy'
import * as dfd from 'danfojs'

import { LAT_LON  } from '../constants'


export interface RiskFactors {
  Drought?: number
  Earthquake?: number
  ['Extreme Cold']?: number
  ['Extreme Heat']?: number
  Flooding?: number
  Hurricane?: number
  ['Sea level rise']?: number
  Tornado?: number
  Volcano?: number
  Wildfires?: number
}

export interface RiskDataObject {
  Lat: number
  Lon: number
  Asset: string
  ['Business Category']: string
  ['Risk Rating']: number
  ['Risk Factors']: RiskFactors
  Year: number
  [LAT_LON]?: string
}

export type RiskData = RiskDataObject[]

export interface RiskFilters {
  [key: string]: string | number
}

export interface RiskDataModel {
  data: RiskData
  selMapLocation: object
  chartAggKey: string
  chartAggVal: string
  yearFilter: number
  useMapLocation: boolean
  dataKeyTypes: Computed<RiskDataModel, object>
  numericKeyList: Computed<RiskDataModel, string[]>
  riskRatingKeys: Computed<RiskDataModel, string[]>
  yearList: Computed<RiskDataModel, number[]>
  dataAggKeys: Computed<RiskDataModel, string[]>
  aggKeyValues: Computed<RiskDataModel, string[]>
  chartData: Computed<RiskDataModel, dfd.Series | dfd.DataFrame>
  flatData: Computed<RiskDataModel, (RiskDataObject & RiskFactors)[]>
  filteredMapData: Computed<RiskDataModel, RiskData>
  update: Action<RiskDataModel, Partial<RiskDataModel>>
}
