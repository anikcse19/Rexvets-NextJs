import CEOSection from "./CEOSection";
import HeroContent from "./HeroContent";
import { Button } from "./ui/button";
import VideoPlayer from "./VideoPlayer";

const RexVetsLanding: React.FC = () => {
  return (
    <div className="  min-h-screen ">
      <main className="px-6 py-12">
        <div className="max-w-[1536px]  mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <HeroContent />
            </div>

            <div className="">
              <CEOSection />
              <VideoPlayer />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg px-6 py-3">
          Chat live with an agent now!
        </Button>
      </div>
    </div>
  );
};

export default RexVetsLanding;
