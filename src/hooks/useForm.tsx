/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const useForm = (initialValue: any) => {
  const [form, setForm] = useState(initialValue);
  return [
    form,
    (formKey: any, formValue: any) => {
      if (formKey === "reset") {
        return setForm(initialValue);
      }
      return setForm({ ...form, [formKey]: formValue });
    },
  ];
};

export default useForm;