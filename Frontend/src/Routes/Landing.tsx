import FAQ from "@/Components/Landng/FAQ";
import Features from "@/Components/Landng/Features";
import Hero from "@/Components/Landng/Hero";
import HowItWorks from "@/Components/Landng/HowItWorks";
import Navbar from "@/Components/Landng/Navbar";
import Newsletter from "@/Components/Landng/Newsletter";
import Pricing from "@/Components/Landng/Pricing";
import { ScrollArea } from "@/Components/UI/ScrollArea";

const Landing = () => {
  return (
    <ScrollArea className="h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Newsletter />
      <FAQ />
    </ScrollArea>
  );
};

export default Landing;
