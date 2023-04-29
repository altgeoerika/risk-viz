import { cache } from 'react'
import { S3 } from '@aws-sdk/client-s3'
import csv from 'csvtojson'

import { enrichLatLonCol } from './data-functions'
import { RiskData } from '../store/types'


const s3 = new S3({
  region: <string> process.env.NEXT_PUBLIC_REGION,
  credentials: <{
    accessKeyId: string,
    secretAccessKey: string,
  }> {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
})

const getParams: { Bucket: string, Key: string } = {
  Bucket: 'rtaicodesample',
  Key: 'rtai_sample_data.csv',
}

// fetches csv file from aws s3 bucket
export const getRiskData = cache(async () => {
  try {
    const getObjectResponse: {Body?: any} = await s3.getObject(getParams)
    const fileBodyString: string = await getObjectResponse.Body?.transformToString() || ''

    const data: RiskData = await csv({
      noheader: false,
      headers: ['Asset Name', 'lat', 'lon', 'Business Category', 'Risk Rating', 'Risk Factors', 'Year'],
      colParser: {
        ['Risk Factors']: (item: string) => JSON.parse(item),
        'Risk Rating': 'number',
        lat: 'number',
        lon: 'number',
        Year: 'number',
      },
    }).fromString(fileBodyString) || []

    const enrichedData = enrichLatLonCol(data)
    return enrichedData
  } catch (err) {
    console.error(err)
  }
})
