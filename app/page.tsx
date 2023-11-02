import HeroCarousel from "@/components/HeroCarousel"
import SearchBar from "@/components/SearchBar"
import { getAllProducts } from "@/lib/action";
import Image from "next/image"
import ProductCard from "@/components/ProductCard";


const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-24 ">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Check Out the Shopping Cart
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
                />
                
            </p>
            <h1 className="head-text">
                  Unleash the Power of <span className="text-primary">
                    PriceTracker
                  </span>
                </h1>
                <p className="mt-6">Track prices effortlessly. Never overpay again. Your smart shopping companion.</p>
                <SearchBar/>
          </div>
          <HeroCarousel/>
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">
          Trending
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
              <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
