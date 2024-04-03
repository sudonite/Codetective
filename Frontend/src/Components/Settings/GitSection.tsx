import { Separator } from "@/Components/UI/Separator";

import GitCard from "@/Components/Settings/GitCard";
import { useProfile } from "@/Contexts/ProfileContext";

const GitSection = () => {
  const { profile } = useProfile();

  return (
    <section className="flex flex-col space-y-6">
      <div className="space-y-0.5">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Git Accounts
        </h2>
        <p className="text-muted-foreground">
          Connect your Git accounts to run scan on your private repositories.
        </p>
      </div>
      <Separator className="my-6" />
      {profile?.gitKeys.map(gitKey => (
        <GitCard gitKey={gitKey} />
      ))}
    </section>
  );
};
export default GitSection;
