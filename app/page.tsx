import { SignedIn, SignedOut } from '@clerk/nextjs'
import CrawlPage from '@/components/ScrapingPage'
import React from 'react'
import LandingPage from '@/components/LandingPage'

const HomePage = () => {
  return (
    <div>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <CrawlPage />
      </SignedIn>
    </div>
  )
}

export default HomePage