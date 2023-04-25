export interface RiskFactors {
  [key: string]: number
}

export interface RiskDataObject {
  [key: string]: string | number | RiskFactors
}
