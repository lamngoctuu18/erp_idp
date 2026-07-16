import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./ServerError.module.css";

export function ServerError() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>401</div>
        <Title className={classes.title}>Bạn chưa đăng nhập...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Xin vui lòng quay trở lại
        </Text>
        <Group justify="center">
          <Button variant="white" size="md">
            Refresh the page
          </Button>
        </Group>
      </Container>
    </div>
  );
}
