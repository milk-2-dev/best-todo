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

import type { Route } from "./+types/signup";

import { createUserSession } from "~/utils/session.server";
import { account } from "~/lib/appwrite.server";
import { signupSchema, type SignupFormData } from "~/lib/validations/auth";

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
import { ID } from "node-appwrite";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Getting redirect from URL query params
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/backlog";

  const result = signupSchema.safeParse({ name, email, password, confirmPassword });

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { errors };
  }

  try {
    // Create user account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Automatically log in the user after registration
    const session = await account.createEmailPasswordSession(email, password);

    return createUserSession({
      request,
      sessionToken: session.secret,
      redirectTo,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle specific Appwrite errors
    let errorMessage = "An error occurred during registration";
    
    if (error?.code === 409) {
      errorMessage = "An account with this email already exists";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return {
      errors: {
        general: errorMessage,
      },
    };
  }
}

export default function SignupPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const hookForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (actionData?.errors) {
      Object.entries(actionData.errors).forEach(([field, message]) => {
        if (field === "general") {
          return;
        }
        hookForm.setError(field as keyof SignupFormData, {
          type: "server",
          message: message as string,
        });
      });
    }
  }, [actionData, hookForm]);

  const onSubmit = (data: SignupFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Create your account
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Start managing your tasks today!
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
              id="signup-form"
              method="post"
              onSubmit={hookForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Name */}
              <FormField
                control={hookForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={hookForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="text-gray-900">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                form="signup-form"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
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