import { Box, Button, Card, Grid, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { IconCalendarCheck, IconCopy, IconDatabasePlus, IconRefresh } from "@tabler/icons-react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const tools = [
  { title: "FX Revaluation", description: "Mô phỏng đánh giá lại số dư ngoại tệ theo tỷ giá cuối kỳ.", icon: IconRefresh, action: "Đã chạy FX Revaluation mô phỏng." },
  { title: "Period Closing Validation", description: "Kiểm tra chứng từ, accounting event và batch còn treo trước khi khóa kỳ.", icon: IconCalendarCheck, action: "Kỳ AR đủ điều kiện để tiếp tục đóng sổ (Demo)." },
  { title: "Copy Transaction", description: "Sao chép một giao dịch mẫu để rút ngắn luồng trình diễn.", icon: IconCopy, action: "Đã tạo bản sao giao dịch nháp (Demo)." },
  { title: "Tạo dữ liệu mẫu", description: "Khởi tạo nhanh bộ hóa đơn, phiếu thu và sự kiện kế toán dùng cho demo.", icon: IconDatabasePlus, action: "Đã chuẩn bị dữ liệu mẫu AR." },
];

export default function ARDemoToolsPanel() {
  return (
    <Box>
      <Title order={4} mb={4}>Công cụ Demo</Title>
      <Text c="dimmed" size="sm" mb="lg">Các tiện ích ít dùng được gom tại đây để không chiếm không gian menu nghiệp vụ.</Text>
      <Grid>
        {tools.map((tool) => (
          <Grid.Col key={tool.title} span={{ base: 12, md: 6 }}>
            <Card withBorder radius="md" h="100%">
              <Group align="flex-start" wrap="nowrap">
                <ThemeIcon size={42} radius="md" variant="light" color="indigo"><tool.icon size={22} /></ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text fw={700}>{tool.title}</Text>
                  <Text c="dimmed" size="sm" mt={4} mb="md">{tool.description}</Text>
                  <Button size="xs" variant="light" onClick={() => NotificationExtension.Success(tool.action)}>Chạy Demo</Button>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
