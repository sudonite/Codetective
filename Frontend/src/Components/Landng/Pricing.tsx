import { Link } from "react-router-dom";

import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/UI/Card";

import { FaCheck } from "react-icons/fa6";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

enum PlanAvaialbleType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  available: PlanAvaialbleType;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Free",
    available: 1,
    popular: 1,
    price: 0,
    description: "Offers limited features tailored for testing purposes.",
    buttonText: "Get Started",
    benefitList: [
      "Languages: C / C++",
      "1 Team member",
      "2 GB Storage",
      "1 Scan / Week",
      "Community support",
    ],
  },
  {
    title: "Premium",
    available: 0,
    popular: 0,
    price: 5,
    description: "Upgrade to our Premium package for enhanced capabilities.",
    buttonText: "Start Free Trial",
    benefitList: [
      "1 Selectable language",
      "3 Team member",
      "10 GB Storage",
      "1 Scan / Day",
      "7/24 Support",
    ],
  },
  {
    title: "Enterprise",
    available: 0,
    popular: 0,
    price: 40,
    description: "Unlock unlimited potential with our Enterprise package.",
    buttonText: "Contact US",
    benefitList: [
      "All languages",
      "Unlimited Members",
      "Unlimited Storage",
      "Unlimited Scan",
      "7/24 Priority Support",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="container mx-auto py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Unlimited{" "}
        </span>
        Access
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Choose the one that suits you from among our favorable offers.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between h-8">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Link to="/auth/register">
                <Button className="w-full" disabled={!pricing.available}>
                  {pricing.buttonText}
                </Button>
              </Link>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex items-center">
                    <FaCheck className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
