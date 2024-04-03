import { Separator } from "@/Components/UI/Separator";
import { useProfile } from "@/Contexts/ProfileContext";
import ApiCard from "@/Components/Settings/ApiCard";

const ApiSection = () => {
  const { profile } = useProfile();

  return (
    <section className="flex flex-col space-y-6">
      <div className="space-y-0.5">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Third Party Apps
        </h2>
        <p className="text-muted-foreground">
          Connect your Git accounts to run scan on your private repositories.
        </p>
      </div>
      <Separator className="my-6" />
      {profile?.apiKeys.map(apiKey => (
        <ApiCard apiKey={apiKey} />
      ))}
    </section>
  );
};
export default ApiSection;
