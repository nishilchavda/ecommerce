import React from 'react'
import Hero from '../Components/Home/Hero'
import Categories from '../Components/Home/Categories'
import TrendingProducts from '../Components/Home/TrendingProducts'
import PromoBanner from '../Components/Home/PromoBanner'
import TrustBadges from '../Components/Home/TrustBadges'
import Newsletter from '../Components/Home/Newsletter'

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <TrendingProducts />
      <PromoBanner />
      <TrustBadges />
      <Newsletter />
    </>
  )
}

export default Home