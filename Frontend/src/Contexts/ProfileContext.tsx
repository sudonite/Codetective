import { createContext, useState, useContext } from "react";
import { ApiKeys, GitKeys, User } from "@/Types";

interface UserProfile {
  user: User;
  gitKeys: GitKeys;
  apiKeys: ApiKeys;
}

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: (userData: UserProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
