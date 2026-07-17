import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Progress,
  Stack,
  Table,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import { IconCircleCheck, IconDownload, IconBell } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { modals } from "@mantine/modals";
import {
  ApprovalStep,
  Contract,
  ContractActionLog,
  ContractSignature,
} from "../../../model/ContractModel";
import { contractService } from "../../../api/contract/contractMockService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatDateTimeVi, formatDateVi, formatMoney } from "../components/contractShared";

interface Props {
  contract: Contract;
  onChanged: () => void;
}

const ContractApprovalTab = ({ contract, onChanged }: Props) => {
  const [steps, setSteps] = useState<ApprovalStep[]>([]);
  const [signatures, setSignatures] = useState<ContractSignature[]>([]);
  const [logs, setLogs] = useState<ContractActionLog[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [s, sig, l] = await Promise.all([
      contractService.getApprovals(contract.contractId),
      contractService.getSignatures(contract.contractId),
      contractService.getLogs(contract.contractId),
    ]);
    setSteps(s);
    setSignatures(sig);
    setLogs(l);
  }, [contract.contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const buyerSig = signatures.find((s) => s.party === "buyer");
  const supplierSig = signatures.find((s) => s.party === "supplier");

  const allApproved = steps.length > 0 && steps.every((s) => s.status === "approved");
  const bothSigned = buyerSig?.status === "signed" && supplierSig?.status === "signed";

  const progress = useMemo(() => {
    const totalUnits = steps.length + 2; // các bước duyệt + 2 chữ ký
    const done =
      steps.filter((s) => s.status === "approved").length +
      (buyerSig?.status === "signed" ? 1 : 0) +
      (supplierSig?.status === "signed" ? 1 : 0);
    return totalUnits > 0 ? Math.round((done / totalUnits) * 100) : 0;
  }, [steps, buyerSig, supplierSig]);

  const handleStartWorkflow = async () => {
    setBusy(true);
    try {
      await contractService.startApprovalWorkflow(contract.contractId);
      await load();
      NotificationExtension.Success("Đã khởi tạo quy trình phê duyệt.");
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async (step: ApprovalStep) => {
    await contractService.approveStep(step.stepId);
    await load();
  };

  const handleSign = async (party: "buyer" | "supplier") => {
    const name = party === "buyer" ? "Nguyễn Văn Mạnh" : contract.supplierName;
    const title = party === "buyer" ? "Nhân viên mua hàng" : "Đại diện NCC";
    await contractService.sign(contract.contractId, party, name, title);
    await load();
    NotificationExtension.Success(`${party === "buyer" ? "Buyer" : "Supplier"} đã ký.`);
  };

  const handlePublish = () => {
    modals.openConfirmModal({
      title: <Title order={5}>Xuất bản hợp đồng</Title>,
      children: <Text size="sm">Chuyển hợp đồng sang trạng thái Đang hoạt động?</Text>,
      labels: { confirm: "Xuất bản", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: async () => {
        await contractService.save({ contractId: contract.contractId, signed: true });
        await contractService.changeStatus(
          contract.contractId,
          "active",
          "publish_contract",
          "Xuất bản hợp đồng, chuyển sang hoạt động."
        );
        NotificationExtension.Success("Đã xuất bản hợp đồng.");
        onChanged();
      },
    });
  };

  const noWorkflow = steps.length === 0;

  return (
    <Stack gap="md">
      {/* Yêu cầu phê duyệt */}
      <Card withBorder>
        <Group justify="space-between" mb="sm">
          <Title order={5}>Yêu cầu phê duyệt hợp đồng - {contract.contractCode}</Title>
          {noWorkflow && contract.status === "pending_approval" && (
            <Button loading={busy} onClick={handleStartWorkflow}>
              Khởi tạo quy trình
            </Button>
          )}
        </Group>
        <Grid>
          <InfoCol label="Tên hợp đồng" value={contract.refCode || contract.name} />
          <InfoCol label="Nhà cung cấp" value={contract.supplierName} />
          <InfoCol label="Giá trị hợp đồng" value={formatMoney(contract.value, contract.currency)} />
          <InfoCol label="Ngày hiệu lực" value={formatDateVi(contract.effectiveDate)} />
          <InfoCol label="Ngày hết hạn" value={formatDateVi(contract.expiryDate)} />
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="xs" c="dimmed">
              Trạng thái
            </Text>
            <Badge color={contract.status === "active" ? "green" : "yellow"} variant="light">
              {contract.status === "active" ? "Đã xuất bản" : "Chờ phê duyệt"}
            </Badge>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Thông tin người phê duyệt */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Thông tin người phê duyệt
        </Title>
        <Table.ScrollContainer minWidth={640}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>NGƯỜI PHÊ DUYỆT</Table.Th>
                <Table.Th>VAI TRÒ</Table.Th>
                <Table.Th>CẤP ĐỘ</Table.Th>
                <Table.Th>TRẠNG THÁI</Table.Th>
                <Table.Th>HÀNH ĐỘNG</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {steps.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text size="sm" c="dimmed" ta="center">
                      Chưa có dữ liệu phê duyệt
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                steps.map((s) => (
                  <Table.Tr key={s.stepId}>
                    <Table.Td>{s.approverName}</Table.Td>
                    <Table.Td>{s.role}</Table.Td>
                    <Table.Td>Cấp {s.level}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={s.status === "approved" ? "green" : "yellow"}>
                        {s.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {s.status === "pending" ? (
                        <Button size="xs" variant="light" onClick={() => handleApprove(s)}>
                          Phê duyệt
                        </Button>
                      ) : (
                        <Text size="xs" c="dimmed">
                          {formatDateTimeVi(s.approvedAt)}
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Lịch sử phê duyệt */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Lịch sử phê duyệt
        </Title>
        <Timeline active={logs.length} bulletSize={18} lineWidth={2}>
          {logs.map((l) => (
            <Timeline.Item key={l.logId} title={l.actorName}>
              <Text size="sm">{l.note}</Text>
              <Group gap="xs">
                <Badge size="xs" variant="light">
                  {l.actionCode}
                </Badge>
                {l.fromStatus && l.toStatus && (
                  <Text size="xs" c="dimmed">
                    {l.fromStatus} → {l.toStatus}
                  </Text>
                )}
              </Group>
              <Text size="xs" c="dimmed" mt={2}>
                {formatDateTimeVi(l.createdAt)}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Chữ ký số 2 bên */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <SignatureCard
            title="Chữ ký số - Buyer"
            sig={buyerSig}
            hint="Chờ hoàn tất quy trình phê duyệt"
            buttonLabel="Ký hợp đồng"
            disabled={!allApproved || buyerSig?.status === "signed"}
            onSign={() => handleSign("buyer")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <SignatureCard
            title="Chữ ký số - Supplier"
            sig={supplierSig}
            hint="Chờ Buyer ký trước"
            buttonLabel="Ký xác nhận"
            disabled={buyerSig?.status !== "signed" || supplierSig?.status === "signed"}
            onSign={() => handleSign("supplier")}
          />
        </Grid.Col>
      </Grid>

      {/* Tiến độ + hành động */}
      <Card withBorder>
        <Group justify="space-between" mb="sm">
          <Text size="sm">Tiến độ phê duyệt:</Text>
          <Text size="sm" c={progress === 100 ? "green" : "dimmed"}>
            {progress}% hoàn thành
          </Text>
        </Group>
        <Progress value={progress} mb="md" />
        <Group justify="flex-end">
          <Button variant="default" leftSection={<IconDownload size={16} />}>
            Tải hợp đồng
          </Button>
          <Button variant="light" leftSection={<IconBell size={16} />}>
            Gửi nhắc nhở
          </Button>
          <Button
            color="green"
            leftSection={<IconCircleCheck size={16} />}
            disabled={!bothSigned || contract.status === "active"}
            onClick={handlePublish}
          >
            Xuất bản hợp đồng
          </Button>
        </Group>
      </Card>
    </Stack>
  );
};

const InfoCol = ({ label, value }: { label: string; value: string }) => (
  <Grid.Col span={{ base: 12, md: 4 }}>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text size="sm" fw={500}>
      {value}
    </Text>
  </Grid.Col>
);

const SignatureCard = ({
  title,
  sig,
  hint,
  buttonLabel,
  disabled,
  onSign,
}: {
  title: string;
  sig?: ContractSignature;
  hint: string;
  buttonLabel: string;
  disabled: boolean;
  onSign: () => void;
}) => {
  const signed = sig?.status === "signed";
  return (
    <Card withBorder h="100%">
      <Title order={5} mb="sm">
        {title}
      </Title>
      <Box
        style={{
          border: "1px dashed #ced4da",
          borderRadius: 8,
          padding: "24px 12px",
          textAlign: "center",
        }}
      >
        <Text size="sm" c="dimmed" mb="xs">
          {signed ? "Đã ký số" : hint}
        </Text>
        <Button variant="light" disabled={disabled} onClick={onSign}>
          {buttonLabel}
        </Button>
      </Box>
      <Stack gap={2} mt="sm">
        <SigRow label="Người ký" value={sig?.signerName || "-"} />
        <SigRow label="Chức vụ" value={sig?.signerTitle || "-"} />
        <SigRow
          label="Trạng thái"
          value={signed ? "signed" : "pending"}
          color={signed ? "green" : "orange"}
        />
        <SigRow label="Thời gian ký" value={sig?.signedAt ? formatDateTimeVi(sig.signedAt) : "-"} />
      </Stack>
    </Card>
  );
};

const SigRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <Group justify="space-between">
    <Text size="sm" c="dimmed">
      {label}:
    </Text>
    <Text size="sm" c={color}>
      {value}
    </Text>
  </Group>
);

export default ContractApprovalTab;
