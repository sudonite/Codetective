import { useState, useEffect } from "react";
import AppsCard from "@/Components/Settings/AppsCard";
import { AppKey, AppKeys } from "@/Types";
import { getAppKeys } from "@/fakeAPI";
import { Separator } from "@/Components/UI/Separator";

const AppsSection = () => {
  const [appKeys, setAppKeys] = useState<AppKeys>([]);

  useEffect(() => {
    const response = getAppKeys();
    if (response.status === 200) {
      setAppKeys(response.data);
    }
  }, []);

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
      <AppsCard
        variant="GPT"
        appKey={appKeys.find(k => k.platform === "gpt") as AppKey}
      />
      <AppsCard
        variant="Perplexity"
        appKey={appKeys.find(k => k.platform === "perplexity") as AppKey}
      />
      <AppsCard
        variant="Colab"
        appKey={appKeys.find(k => k.platform === "colab") as AppKey}
      />
      <AppsCard
        variant="Kaggle"
        appKey={appKeys.find(k => k.platform === "kaggle") as AppKey}
      />
    </section>
  );
};
export default AppsSection;
