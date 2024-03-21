import { FaApple, FaCreditCard, FaPaypal } from "react-icons/fa";

import { generateRandomDate } from "@/Utils";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Label } from "@/Components/UI/Label";
import { RadioGroup, RadioGroupItem } from "@/Components/UI/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/Select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/UI/Dialog";

import { Separator } from "@/Components/UI/Separator";

const SubscriptionSection = () => {
  return (
    <section className="flex flex-col space-y-6">
      <div className="space-y-0.5">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Subscription
        </h2>
        <p className="text-muted-foreground">
          Manage your subscriptions and payment methods.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full mb-6">
          <tbody>
            <tr className="m-0 border-t p-0">
              <td className="font-bold border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Subscription type:
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Free Plan
              </td>
            </tr>
            <tr className="m-0 border-t p-0">
              <td className="font-bold border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Expires on:
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {generateRandomDate().toDateString()}
              </td>
            </tr>
          </tbody>
        </table>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Subscription</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <FaCreditCard className="mb-3 h-6 w-6" />
                  Card
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <FaPaypal className="mb-3 h-6 w-6" />
                  Paypal
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="apple"
                  id="apple"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="apple"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <FaApple className="mb-3 h-6 w-6" />
                  Apple
                </Label>
              </div>
            </RadioGroup>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="First Last" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Card number</Label>
              <Input id="number" placeholder="" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="month">Expires</Label>
                <Select>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Select>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={`${new Date().getFullYear() + i}`}
                      >
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="CVC" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full">Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
export default SubscriptionSection;
