'use client'
import { ReactNode } from 'react'
import { StoreProvider } from 'easy-peasy'
import { RiskStore } from '../../store'


interface Props {
  children?: ReactNode
}

const Providers = ({ children }: Props) => (
  <StoreProvider store={RiskStore}>
    {children}
  </StoreProvider>
)

export default Providers
