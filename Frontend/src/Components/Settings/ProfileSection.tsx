import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Label } from "@/Components/UI/Label";
import { Input } from "@/Components/UI/Input";
import { Separator } from "@/Components/UI/Separator";
import { Button } from "@/Components/UI/Button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/UI/AlertDialog";

import { useProfile } from "@/Contexts/ProfileContext";

import { EditProfileAPI, DeleteProfileAPI } from "@/API";
import { useToast } from "@/Components/UI/useToast";

const ProfileSection = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(profile?.user?.firstName);
  const [lastName, setLastName] = useState(profile?.user?.lastName);
  const [email, setEmail] = useState(profile?.user?.email);
  const [newPassword, setNewPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const handleDeleteProfile = async () => {
    const response = await DeleteProfileAPI();
    if (response.status === 200) {
      localStorage.removeItem("jwtToken");
      navigate("/");
      toast({
        title: "Success",
        description: "Your profile has been deleted.",
      });
    } else if (response.status === 401) {
      toast({
        title: "Error",
        description: "Wrong password. Please try again.",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while deleting your profile.",
      });
    }
  };

  const handleEditProfile = async () => {
    if (newPassword !== passwordAgain) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }
    const data = {
      firstName,
      lastName,
      email,
      password: newPassword,
    };
    const response = await EditProfileAPI(data);
    if (response.status === 200) {
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
      });
    }
  };
  return (
    <section className="flex flex-col space-y-6">
      <div className="space-y-0.5">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Profile
        </h2>
        <p className="text-muted-foreground">
          Manage your account settings and connect with external services.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-row space-x-2">
        <div className="w-1/2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            id="firstName"
            type="text"
            placeholder="First Name"
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            id="lastName"
            type="text"
            placeholder="Last Name"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          id="email"
          type="text"
          placeholder="Email"
        />
      </div>
      <div className="flex flex-row space-x-2">
        <div className="w-1/2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            id="newPassword"
            type="password"
            placeholder="New Password"
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="passwordAgain">Password Again</Label>
          <Input
            value={passwordAgain}
            onChange={e => setPasswordAgain(e.target.value)}
            id="passwordAgain"
            type="text"
            placeholder="Password Again"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="link"
              className="flex justify-start p-0 w-fit text-foreground"
            >
              Delete profile
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                profile and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProfile}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Button onClick={handleEditProfile} className="w-fit px-10">
        Save Profile
      </Button>
    </section>
  );
};

export default ProfileSection;
