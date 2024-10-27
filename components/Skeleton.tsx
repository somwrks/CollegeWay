// components/Skeleton.tsx
import React from 'react'
import { SkeletonProps } from './types'

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  )
}

export default Skeleton