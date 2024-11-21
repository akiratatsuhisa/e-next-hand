import { Container } from "@/components/Container";
import { getServerSession } from "@/lib/auth";
import { bucket } from "@/lib/firebase";
import dayjs from "dayjs";

export default async function Home() {
  const session = await getServerSession();
  const [url] = await bucket.file("enh-medias/nature-1.jpg").getSignedUrl({
    action: "read",
    expires: dayjs().add(15, "minutes").toDate(),
  });

  return (
    <Container>
      <p>Home Page</p>
      <pre>{JSON.stringify(session ?? "", undefined, 2)}</pre>
      <img src={url} />
    </Container>
  );
}
