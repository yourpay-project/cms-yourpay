import type { FC } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui";
import { Form } from "@/shared/ui/form/Form";
import { FormInput } from "@/shared/ui/form/FormInput";
import { FormInputPassword } from "@/shared/ui/form/FormInputPassword";

import { loginSchema } from "../model";
import type { LoginFormProps } from "./LoginForm.type";

/**
 * Email-password login form section.
 *
 * @param props - Form submit handlers and pending state.
 * @returns Login form with divider before Google section.
 */
export const LoginForm: FC<LoginFormProps> = ({ isPending, onSubmitCredentials }) => {
  const submitLeadingNode = isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null;

  return (
    <Form
      schema={loginSchema}
      onSubmit={onSubmitCredentials}
      formConfig={{
        defaultValues: { email: "", password: "" },
        mode: "onChange",
      }}
      className="space-y-4"
    >
      <FormInput
        name="email"
        id="email"
        size="md"
        autoComplete="email"
        label="Email"
        allowClear
      />
      <FormInputPassword
        name="password"
        id="password"
        size="md"
        autoComplete="current-password"
        label="Password"
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {submitLeadingNode}
        Sign in
      </Button>
    </Form>
  );
};

