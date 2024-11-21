import { BackGround } from "../components/BackGround";
import { CardForm, CardFormLoading } from "../components/CardForm";
import { bgClass, title } from "./constants";

export default function Loading() {
  return (
    <BackGround bgClass={bgClass}>
      <CardForm title={title}>
        <CardFormLoading />
      </CardForm>
    </BackGround>
  );
}
