import { DatePickerInput } from "@mantine/dates";
import { Button, Group } from "@mantine/core";
import dayjs from "dayjs";

export interface DateRangeERPProps {
  label?: string;
  placeholder?: string;
  value: [Date | null, Date | null];
  onChange: (value: [Date | null, Date | null]) => void;
  error?: React.ReactNode;
}

export function DateRangeERP({
  label = "Chọn khoảng thời gian",
  placeholder = "Từ ngày - Đến ngày",
  value,
  onChange,
  error,
}: DateRangeERPProps) {
  const setPresets = (preset: "today" | "week" | "month" | "quarter") => {
    const now = new Date();
    if (preset === "today") {
      onChange([now, now]);
    } else if (preset === "week") {
      const start = dayjs().startOf("week").toDate();
      const end = dayjs().endOf("week").toDate();
      onChange([start, end]);
    } else if (preset === "month") {
      const start = dayjs().startOf("month").toDate();
      const end = dayjs().endOf("month").toDate();
      onChange([start, end]);
    } else if (preset === "quarter") {
      // Ở đây sử dụng dayjs, ta tự tính hoặc dựa trên tháng.
      // Quý bắt đầu từ tháng: (Tháng hiện tại / 3) * 3
      const currentMonth = now.getMonth();
      const startMonth = Math.floor(currentMonth / 3) * 3;
      const startDate = new Date(now.getFullYear(), startMonth, 1);
      const endDate = new Date(now.getFullYear(), startMonth + 3, 0);
      onChange([startDate, endDate]);
    }
  };

  const inputStyles = {
    label: { fontWeight: 600, marginBottom: 6 },
  };

  return (
    <div>
      <DatePickerInput
        type="range"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        valueFormat="DD/MM/YYYY"
        clearable
        styles={inputStyles}
        error={error}
      />
      <Group gap={6} mt={6}>
        <Button variant="subtle" size="compact-xs" color="gray" onClick={() => setPresets("today")}>
          Hôm nay
        </Button>
        <Button variant="subtle" size="compact-xs" color="gray" onClick={() => setPresets("week")}>
          Tuần này
        </Button>
        <Button variant="subtle" size="compact-xs" color="gray" onClick={() => setPresets("month")}>
          Tháng này
        </Button>
        <Button variant="subtle" size="compact-xs" color="gray" onClick={() => setPresets("quarter")}>
          Quý này
        </Button>
      </Group>
    </div>
  );
}
