// 'use client'
// import RiskMap from './risk-map'
import dynamic from 'next/dynamic'
import styles from './dashboard.module.scss'


const RiskMap = dynamic(
  () => import('./risk-map'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  },
)

const RiskChart = dynamic(
  () => import('./risk-chart'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  },
)

const Dashboard = () => {
  return (
    <div className={styles.gridContainer}>
      Test
      <div className={styles.gridMap}>
        <RiskMap/>
      </div>
      <div className={styles.gridChart}>
        <RiskChart/>
      </div>
      <div className={styles.gridTable}>Table</div>
    </div>
  )
}

export default Dashboard
