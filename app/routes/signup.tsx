// app/routes/signup.tsx

import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { account } from "~/lib/appwrite.server";
import { ID } from "appwrite";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Server-side validation
  const errors: Record<string, string> = {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    errors.email = "Valid email is required";
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Create user in Appwrite
    await account.create(
      ID.unique(),
      email as string,
      password as string,
      email as string // name defaults to email
    );

    // Auto login after signup
    await account.createEmailPasswordSession(email as string, password as string);

    return redirect("/backlog");
  } catch (error: any) {
    return json(
      { errors: { general: error.message || "Failed to create account" } },
      { status: 400 }
    );
  }
}

export default function Signup() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start organizing your tasks recursively
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input mt-1"
                placeholder="you@example.com"
              />
              {actionData?.errors?.email && (
                <p className="mt-1 text-sm text-red-600">{actionData.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input mt-1"
                placeholder="Min. 8 characters"
              />
              {actionData?.errors?.password && (
                <p className="mt-1 text-sm text-red-600">{actionData.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="input mt-1"
                placeholder="Repeat password"
              />
              {actionData?.errors?.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {actionData.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {actionData?.errors?.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{actionData.errors.general}</p>
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign up
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
