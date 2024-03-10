import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/UI/Accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is my data secure with your product/service?",
    answer:
      "Absolutely. Ensuring the security of your data is our utmost priority. Rest assured, your data is protected with the highest level of care and diligence.",
    value: "item-1",
  },
  {
    question: "Can I upgrade my plan at any time?",
    answer:
      "Certainly! You have the flexibility to upgrade your plan at any time to access additional features or accommodate your growing needs. Simply navigate to your account settings or subscription management page to explore upgrade options. Once upgraded, you'll immediately gain access to the enhanced features and benefits of your new plan.",
    value: "item-2",
  },
  {
    question: "How often is the product/service updated?",
    answer:
      "We are committed to continuously improving our product/service to provide you with the best experience possible. Updates are regularly released to introduce new features, enhance existing functionalities, and address any issues or bugs. Our development team works diligently to ensure that you receive timely updates, typically released on a scheduled basis. Additionally, we strive to keep you informed about upcoming updates and improvements through notifications, newsletters, or announcements on our platform.",
    value: "item-3",
  },
  {
    question: "Are there any limitations on usage?",
    answer:
      "To ensure fair usage and optimal performance for all users, we may impose certain limitations on usage. These limitations vary depending on the specific features and resources associated with your subscription plan. Common limitations may include restrictions on the number of users, projects, or API calls, as well as limits on storage capacity or data transfer. However, we continuously strive to offer flexible solutions that accommodate your needs. If you require additional resources or have specific usage requirements, please don't hesitate to reach out to our support team. We're here to assist you in finding the best solution tailored to your usage needs.",
    value: "item-4",
  },
  {
    question: "Do you offer discounts for nonprofits/educational institutions?",
    answer:
      "At this time, we regret to inform you that we do not offer specific discounts for nonprofits or educational institutions. However, we continuously review our pricing and discount policies to ensure they align with our commitment to supporting organizations with impactful missions. While we may not have specific discounts available for nonprofits or educational institutions currently, we strive to provide competitive pricing and flexible solutions to meet the needs of all our customers.",
    value: "item-5",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="container mx-auto py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          href="mailto:support@codetective.com"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};

export default FAQ;
