"use client";

import { Input, Button } from "@nextui-org/react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema } from "@/validations/auth";
import { startAuthentication } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";

export function Form({ onSubmit }: { onSubmit?: () => void }) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values) => {
      try {
        const optionsJSONResponse = await fetch(
          `/api/login?email=${values.email}`
        );

        const response = await startAuthentication({
          optionsJSON: await optionsJSONResponse.json(),
        });

        const resultResponse = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(response),
        });

        const result = await resultResponse.json();

        if (!result.verified) {
          throw new Error("unverified");
        }

        if (onSubmit) {
          onSubmit();
        } else {
          router.push("/");
        }
      } catch (error) {
        alert("Something was wrong");
        throw error;
      }
    },
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <Input
        label="Email"
        placeholder="Enter your email"
        name="email"
        isDisabled={formik.isSubmitting}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={formik.touched.email && !!formik.errors.email}
        errorMessage={formik.errors.email}
      />

      <div className="flex flex-col items-stretch mt-4">
        <Button type="submit" color="primary" isDisabled={formik.isSubmitting}>
          Login
        </Button>
      </div>
    </form>
  );
}
