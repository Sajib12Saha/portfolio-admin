'use client';

import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { CustomForm } from "./custom-form";
import { Card, CardContent } from "../ui/card";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  passKey: z.string().min(8, {
    message: "Pass Key must be at least 8 characters.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passKey: "",
    },
  });

const onSubmit = (data: LoginFormValues) => {
  startTransition(async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passKey: data.passKey }),
    });

    const result = await res.json();

    if (res.status === 404) {
      form.setError("passKey", { message: result.message });
    }

    if (res.status === 200) {
      toast.success(result.message);
      router.push("/dashboard");
    }
  });
};


  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center justify-center"
          >
            <FormField
              control={form.control}
              name="passKey"
              render={({ field }) => (
                <CustomForm
                  field={field}
                  label="Password"
                  placeHolder="Enter your password"
                  fieldType="input"
                  inputType="password"
                  important
                  allowShowHidePassword
                />
              )}
            />
            <Button
              type="submit"
              className="hover:bg-primary hover:text-background transition-all duration-200"
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
