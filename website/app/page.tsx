import {BodyFont} from "@/app/components/Fonts";
import CurrentProjectsSection from "@/app/components/supported_projects/CurrentProjectsSection";

export default function Home() {
  return (
    <div className={BodyFont.className}>
        <CurrentProjectsSection />
    </div>
  );
}
