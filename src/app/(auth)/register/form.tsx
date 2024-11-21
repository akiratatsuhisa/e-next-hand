"use client";

import { Input, Button } from "@nextui-org/react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchema } from "@/validations/auth";
import { startRegistration } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";

export function Form() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
    },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: async (values) => {
      try {
        const optionsJSONResponse = await fetch(
          `/api/register?email=${values.email}&name=${values.name}`
        );

        const optionsJSON = await optionsJSONResponse.json();

        const response = await startRegistration({ optionsJSON });

        const resultResponse = await fetch("/api/register", {
          method: "POST",
          body: JSON.stringify(response),
        });

        const result = await resultResponse.json();

        if (!result.verified) {
          throw new Error("unverified");
        }

        router.push("/login");
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
        isInvalid={formik.touched.email && !!formik.errors.email}
        errorMessage={formik.errors.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <Input
        label="Display Name"
        placeholder="Enter your name"
        name="name"
        isDisabled={formik.isSubmitting}
        value={formik.values.name}
        isInvalid={formik.touched.name && !!formik.errors.name}
        errorMessage={formik.errors.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <div className="flex flex-col items-stretch mt-4">
        <Button type="submit" color="primary" isDisabled={formik.isSubmitting}>
          Register
        </Button>
      </div>
    </form>
  );
}
