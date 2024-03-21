import { useState } from "react";

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

const ProfileSection = () => {
  const [email, setEmail] = useState<string>("example@codetective.com");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordAgain, setNewPasswordAgain] = useState<string>("");
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
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          id="email"
          type="text"
          placeholder="Email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Change password</Label>
        <Input
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          id="password"
          type="password"
          placeholder="Change password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password again</Label>
        <Input
          value={newPasswordAgain}
          onChange={e => setNewPasswordAgain(e.target.value)}
          id="password"
          type="password"
          placeholder="Password again"
        />
      </div>
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
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button className="w-fit px-10">Save Profile</Button>
    </section>
  );
};

export default ProfileSection;
