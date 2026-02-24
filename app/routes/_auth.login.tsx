import { useEffect } from "react";
import {
  Link,
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Route } from "./+types/login";

import { createUserSession } from "~/utils/session.server";
import { serverAccount } from "~/lib/appwrite.server";
import { loginSchema, type LoginFormData } from "~/lib/validations/auth";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form as HookForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Geting redirect from URL query params
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/backlog";

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { errors };
  }

  try {
    const session = await serverAccount.createEmailPasswordSession(
      email,
      password
    );
    
    return createUserSession({
      request,
      sessionToken: session.secret,
      redirectTo,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      errors: {
        general: error?.message || "Invalid email or password",
      },
    };
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const hookForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (actionData?.errors) {
      Object.entries(actionData.errors).forEach(([field, message]) => {
        if (field === "general") {
          return;
        }
        hookForm.setError(field as keyof LoginFormData, {
          type: "server",
          message: message as string,
        });
      });
    }
  }, [actionData, hookForm]);

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Sign in to your account
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Your tasks is waiting for you!
          </p>

          {actionData?.errors?.general && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-800 font-medium">
                {actionData.errors.general}
              </p>
            </div>
          )}

          <HookForm {...hookForm}>
            <Form
              id="login-form"
              method="post"
              onSubmit={hookForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email */}
              <FormField
                control={hookForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={hookForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                {/* <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div> */}
              </div>

              <Button
                type="submit"
                form="login-form"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  New to our platform?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </Form>
          </HookForm>
        </div>
      </div>
    </div>
  );
}
