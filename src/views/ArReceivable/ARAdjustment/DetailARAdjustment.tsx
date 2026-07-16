import { Box, Button, Card, Grid, Title, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailARAdjustment() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box>
      <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)} mb="lg">
        Quay lại
      </Button>
      <Card withBorder>
        <Title order={4} mb="md" c="indigo">Chi tiết ARAdjustment #{id}</Title>
        <Grid>
          <Grid.Col span={6}><Text size="sm">ID: <b>{id}</b></Text></Grid.Col>
          <Grid.Col span={6}><Text size="sm">Trạng thái: <b>Hoạt động</b></Text></Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}
