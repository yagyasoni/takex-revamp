import Loader from "./Loader";
import Nav from "./Nav";
import Hero from "./Hero";
import AmbroseView from "./AmbroseView";
import Steps from "./Steps";
import Certificate from "./Certificate";
import Closing from "./Closing";
import Glitch from "./Glitch";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";

export default function Landing() {
  return (
    <SmoothScroll>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <AmbroseView />
        <Steps />
        <Certificate />
        <Closing />
        <Glitch />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
