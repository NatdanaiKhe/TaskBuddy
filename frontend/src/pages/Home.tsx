import CategorySection from "@/components/CategorySection";
import Hero from "../components/Hero";
import PopularTaskSection from "@/components/PopularTaskSection";
import HowItWorks from "@/components/HowItWorks";
import { useAuth } from "@/context/useAuth";
import ProviderDashboard from "./ProviderDashboard";

function Home() {
  const {user} = useAuth();

  if(user?.role == "provider"){
    return <ProviderDashboard/>
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] h-auto bg-gray-50">
      <Hero />
      <CategorySection />
      <PopularTaskSection/>
      <HowItWorks/>
    </div>
  );
}

export default Home;
