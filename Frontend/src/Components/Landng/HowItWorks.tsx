import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/UI/Card";

import { FaFingerprint, FaHammer, FaGit } from "react-icons/fa6";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Repository",
    description:
      "Simply connect your GitHub or GitLab or Gitea or Bitbucket account and select the repositories you want to scan.",
    icon: <FaGit />,
  },
  {
    title: "AI Analysis",
    description:
      "Our advanced AI model gets to work, analyzing your codebase for potential security vulnerabilities.",
    icon: <FaFingerprint />,
  },
  {
    title: "Detailed Reports",
    description:
      "Receive detailed reports outlining identified vulnerabilities, which you can easily fix.",
    icon: <FaHammer />,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="container mx-auto py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            How It
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Works
            </span>
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Save time and resources with automated scanning and actionable
            reports.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-2 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-end">
          <img src="howitworks.png" className="w-9/12" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
