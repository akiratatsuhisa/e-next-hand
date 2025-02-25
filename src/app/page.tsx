import { Button, Container, Overlay, Text, Title } from "@mantine/core";
import classes from "@/app/page.module.css";
import { getAuth, signIn, signOut } from "@/lib/auth";

export default async function Page() {
  const user = await getAuth();

  async function handleButton() {
    "use server";

    if (user) {
      await signOut();
    } else {
      await signIn();
    }
  }

  return (
    <>
      <div className={classes.hero}>
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={1}
          zIndex={0}
        />
        <Container className={classes.container} size="md">
          <Title className={classes.title}>
            A fully featured React components library
          </Title>
          <Text className={classes.description} size="xl" mt="xl">
            Build fully functional accessible web applications faster than ever
            – Mantine includes more than 120 customizable components and hooks
            to cover you in any situation
          </Text>

          <Button
            variant="gradient"
            size="xl"
            radius="xl"
            className={classes.control}
            onClick={handleButton}
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Container>
      </div>
      {user && <pre>{JSON.stringify(user, undefined, "\t")}</pre>}
    </>
  );
}
