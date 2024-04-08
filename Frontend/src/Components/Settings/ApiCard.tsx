import { useState } from "react";
import { GiArtificialHive } from "react-icons/gi";
import { FaKaggle, FaSave, FaTrash } from "react-icons/fa";
import { SiGooglecolab } from "react-icons/si";
import { TbLetterP } from "react-icons/tb";

import { Badge } from "@/Components/UI/Badge";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { useToast } from "@/Components/UI/useToast";
import { useProfile, UserProfile } from "@/Contexts/ProfileContext";
import { ApiKey, ApiPlatformToStr, ApiPlatformType } from "@/Types";
import { DeleteApiKeyAPI, SaveApiKeyAPI } from "@/API";
import ApiCardHelp from "./ApiCardHelp";

const CardIcon = ({ platform }: { platform: ApiPlatformType }) => {
  switch (platform) {
    case ApiPlatformType.GPT:
      return <GiArtificialHive className="mr-2 w-6 h-6" />;
    case ApiPlatformType.Perplexity:
      return <TbLetterP className="mr-2 w-6 h-6" />;
    case ApiPlatformType.Kaggle:
      return <FaKaggle className="mr-2 w-6 h-6" />;
    case ApiPlatformType.Colab:
      return <SiGooglecolab className="mr-2 w-6 h-6" />;
  }
};

const ApiCard = ({ apiKey }: { apiKey: ApiKey }) => {
  const { toast } = useToast();
  const { profile, setProfile } = useProfile();
  const [key, setKey] = useState(apiKey?.key ?? "");

  const handleDelete = async (keyID: string) => {
    let response = await DeleteApiKeyAPI(keyID);
    if (response.status === 200) {
      let newProfile = { ...profile };
      if (newProfile.apiKeys !== undefined) {
        newProfile.apiKeys = newProfile.apiKeys.map(key => {
          if (key.id === keyID) {
            key.key = "";
          }
          return key;
        });
        setProfile(newProfile as UserProfile);
        setKey("");
      }
      toast({
        title: "Success",
        description: "Key deleted",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while deleting key",
      });
    }
  };

  const handleSave = async (keyID: string) => {
    if (key.length < 1) {
      toast({
        title: "Error",
        description: "Key cannot be empty",
      });
      return;
    }
    let response = await SaveApiKeyAPI(keyID, key);
    if (response.status === 200) {
      let newProfile = { ...profile };
      if (newProfile.apiKeys !== undefined) {
        newProfile.apiKeys = newProfile.apiKeys.map(apiKey => {
          if (apiKey.id === keyID) {
            apiKey.key = key;
          }
          return apiKey;
        });
        setProfile(newProfile as UserProfile);
      }
      toast({
        title: "Success",
        description: "Key saved",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while saving key",
      });
    }
  };

  return (
    <div className="flex flex-col rounded-lg border p-4 space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <CardIcon platform={apiKey?.platform} />
          <div className="text-lg font-semibold">
            {ApiPlatformToStr(apiKey?.platform)}
          </div>
        </div>
        <Badge variant="outline">
          {apiKey?.key
            ? new Date(apiKey?.date).toDateString()
            : "Not Connected"}
        </Badge>
      </div>
      <div className="flex flex-row space-x-2">
        <Input
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="API Key"
        />
        <Button variant="outline" onClick={() => handleSave(apiKey.id)}>
          <FaSave className="mr-2 w-4 h-4" />
          Save
        </Button>
        {apiKey?.key && (
          <Button variant="outline" onClick={() => handleDelete(apiKey.id)}>
            <FaTrash className="mr-2 w-4 h-4" />
            Delete
          </Button>
        )}
        <ApiCardHelp platform={apiKey.platform} />
      </div>
    </div>
  );
};

export default ApiCard;
