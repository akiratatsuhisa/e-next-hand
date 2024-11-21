import { BackGround } from "../components/BackGround";
import { CardForm } from "../components/CardForm";
import { bgClass, title } from "./constants";
import { Form } from "./form";

export default function Logout() {
  return (
    <BackGround bgClass={bgClass}>
      <CardForm title={title}>
        <Form />
      </CardForm>
    </BackGround>
  );
}
