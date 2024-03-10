import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

import { FaCodeBranch, FaUser, FaBrain, FaHandPeace } from "react-icons/fa6";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <FaUser />,
    title: "User-Friendly Interface",
    description:
      "Access detailed reports on detected vulnerabilities, enabling quick and efficient remediation.",
  },
  {
    icon: <FaBrain />,
    title: "Cutting-edge AI Technology",
    description:
      "Our proprietary AI-powered model, built by experts in cybersecurity and machine learning.",
  },
  {
    icon: <FaCodeBranch />,
    title: "Efficiency",
    description:
      "Use it easily from any device, and integrate it into your existing development workflow.",
  },
  {
    icon: <FaHandPeace />,
    title: "Peace of Mind",
    description:
      "Rest assured knowing that your code is being protected, allowing you to focus on development.",
  },
];

const Features = () => {
  return (
    <section id="features" className="container mx-auto text-center py-32">
      <h2 className="text-4xl font-bold ">
        Many
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Great Features{" "}
        </span>
      </h2>
      <p className="w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Don't wait until it's too late. Protect your software with Codetective.
      </p>

      <div className="grid grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
