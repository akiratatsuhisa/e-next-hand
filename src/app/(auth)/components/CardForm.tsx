import {
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
} from "@nextui-org/react";

export function CardFormLoading() {
  return (
    <div className="flex justify-center items-center h-40">
      <CircularProgress />
    </div>
  );
}

export function CardForm({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="flex flex-col items-stretch gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
      </CardHeader>

      <CardBody>{children}</CardBody>
    </Card>
  );
}
