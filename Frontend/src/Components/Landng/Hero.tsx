import { SiGithub, SiGitlab, SiGitea, SiBitbucket } from "react-icons/si";
import { Button } from "@/Components/UI/Button";
import { HashLink as Link } from "react-router-hash-link";

const Hero = () => {
  return (
    <div className="min-w-screen min-h-[calc(100vh-5rem)] flex">
      <div className="w-2/5 m-36 mr-0">
        <div className="h-full flex flex-col gap-y-10">
          <div className="space-y-6">
            <h1 className="scroll-m-20 font-extrabold tracking-tight text-7xl">
              Check your code
            </h1>
            <h1 className="scroll-m-20 font-extrabold tracking-tight text-7xl">
              with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                Codetective
              </span>
            </h1>
          </div>
          <div className="">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Our cutting-edge source code security scanner is designed to
              meticulously analyze your program's source code, identifying
              potential security vulnerabilities before they can be exploited by
              malicious actors.
            </p>
          </div>
          <div className="space-x-2">
            <Button className="h-16 w-1/3" asChild>
              <Link to="/auth/register">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Try for free
                </h3>
              </Link>
            </Button>
            <Button variant="ghost" className="h-16 w-1/3" asChild>
              <Link smooth to="/#how-it-works">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  How it works
                </h4>
              </Link>
            </Button>
          </div>
          <div className="flex grow items-end">
            <div className="flex items-center">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight align-start">
                Import code from
              </h4>
              <div className="flex grow justify-start mx-12 gap-x-12">
                <SiGithub className="w-10 h-10" />
                <SiGitlab className="w-10 h-10" />
                <SiGitea className="w-10 h-10" />
                <SiBitbucket className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/5 flex justify-center items-center">
        <img src="/hero.png" className="w-8/12" />
      </div>
    </div>
  );
};
export default Hero;
