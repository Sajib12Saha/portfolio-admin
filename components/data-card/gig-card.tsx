"use client";

import { PricingInput } from "@/types/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ResponsePricingInput } from "@/actions/gig";

interface Props {
  gig: ResponsePricingInput;
}

const planLabels: Record<keyof PricingInput, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
  orderLink: "Order Link",

};

export const GigCard = ({ gig }: Props) => {
  const planKeys = ["basic", "standard", "premium"] as const;

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="w-full flex gap-y-2 flex-wrap items-center justify-around rounded-md shadow-md">
        {planKeys.map((key) => (
          <TabsTrigger key={key} value={key} className="font-semibold capitalize">
            {planLabels[key]}
          </TabsTrigger>
        ))}
      </TabsList>

    {planKeys.map((key) => {
  const plan = gig[key];

  if (!plan) return null; // <-- add this line to guard against undefined

  return (
    <TabsContent key={key} value={key} className="mt-4">
      <Card>
        <CardContent className="space-y-10">
          <div className="flex flex-col md:flex-row justify-start md:items-center gap-y-4 md:justify-between">
            <div className="flex flex-col items-start gap-y-1.5">
              <h3 className="text-2xl font-bold dark:text-gray-300">{plan.title}</h3>
              <h5 className="font-semibold text-base text-muted-foreground">
                {planLabels[key]} Plan
              </h5>
            </div>
            <Button type="button" className="md:px-10 px-8 py-5 text-lg">
              $ {plan.price}
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">{plan.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
            {plan.features.map((feature, i) => (
                
              <div
                key={i}
                className="flex gap-x-3 flex-wrap break-words leading-8 items-center text-muted-foreground text-base font-semibold"
              >
                <Check className="size-4" /> {feature}
              </div>
            ))}
          </div>

          {gig.orderLink && (
            <a href={gig.orderLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full hover:bg-primary hover:text-foreground transition-all duration-200">
                Order Now
              </Button>
            </a>
          )}
          
        </CardContent>
      </Card>
    </TabsContent>
  );
})}
    </Tabs>
  );
};
