import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Modal,
  PinInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { repositoryAuth } from "../../_const/_constVar";
import { NotificationExtension } from "../../extension/NotificationExtension";
import { ArrowRight, Lock, ShieldCheck, User } from "lucide-react";
import style from "./AuthenticationTitle.module.css";
import {
  buildDemoProfile,
  createDemoToken,
  findDemoAccount,
} from "../../../_setup/demo/demoAccounts";

/* Khoảng cách để CSS lo (qua `root`) thay vì prop mb/my của Mantine — prop đó
   sinh inline style nên media query không đè lại được khi màn hình thấp. */
const inputClassNames = {
  root: style.authRoot,
  input: style.authInput,
  label: style.authLabel,
  description: style.authDescription,
  required: style.authRequired,
  section: style.authSection,
  innerInput: style.authInnerInput,
};

const LOGIN_REQUEST_TIMEOUT_MS = 12000;

// Helper phân tích Browser và OS từ UserAgent
const getBrowserAndOS = () => {
  const ua = navigator.userAgent;
  let browser = "Trình duyệt chưa rõ";
  let os = "Hệ điều hành chưa rõ";

  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";

  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua)) browser = "Safari";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";
  else if (/MSIE|Trident/i.test(ua)) browser = "Internet Explorer";

  return { browser, os };
};

// Lấy thông tin thiết bị chi tiết
const getDeviceDetails = () => {
  const { browser, os } = getBrowserAndOS();
  const userAgent = navigator.userAgent;

  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", deviceId);
  }

  const deviceName = `${browser} trên ${os}`;

  return {
    deviceId,
    deviceName,
    browser,
    operatingSystem: os,
    userAgent,
  };
};

// Lấy IP client qua dịch vụ công khai với Timeout
const getIpAddress = async (): Promise<string> => {
  try {
    const res = await Promise.race([
      fetch("https://api.ipify.org?format=json").then((r) => r.json()),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2500)
      ),
    ]) as { ip: string };
    return res.ip || "";
  } catch (e) {
    return "";
  }
};

const FormLogin = () => {
  const navigate = useNavigate();
  
  // States cho Form Đăng nhập
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");

  // States cho Modal OTP
  const [otpOpened, setOtpOpened] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [emailHidden, setEmailHidden] = useState("");

  // Tải IP khi mount component
  useEffect(() => {
    getIpAddress().then((ip) => setIpAddress(ip));
  }, []);

  // Xử lý đếm ngược OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Nếu đã đăng nhập, tự động chuyển hướng về trang chủ
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validate: {
      username: (v: string) => (!v ? "Vui lòng nhập tên đăng nhập" : null),
      password: (v: string) => (!v ? "Vui lòng nhập mật khẩu" : null),
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TẠM THỜI: đăng nhập bằng tài khoản mẫu, KHÔNG gọi API.
  // Tài khoản phải gõ tay, danh sách xem tại: src/_setup/demo/demoAccounts.ts
  //
  // Khi backend sẵn sàng, khôi phục luồng thật bằng cách:
  //   1. Truyền `handleLoginViaApi` vào `form.onSubmit(...)` thay cho `handleLogin`.
  //   2. Xoá `handleLogin` và thư mục _setup/demo.
  // ─────────────────────────────────────────────────────────────────────────
  const handleLogin = async ({ username, password }: typeof form.values) => {
    setLoading(true);
    try {
      // Giả lập độ trễ mạng để UI loading hiển thị tự nhiên
      await new Promise((resolve) => setTimeout(resolve, 400));

      const account = findDemoAccount(username, password);
      if (!account) {
        NotificationExtension.Fails(
          "Tên đăng nhập hoặc mật khẩu không chính xác!"
        );
        return;
      }

      localStorage.setItem("token", createDemoToken(account));
      localStorage.setItem(
        "userProFile",
        JSON.stringify(buildDemoProfile(account))
      );
      NotificationExtension.Success(`Xin chào ${account.fullName}!`);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API đăng nhập chính (đang tạm ngưng — xem ghi chú ở `handleLogin`)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLoginViaApi = async ({ username, password }: typeof form.values) => {
    try {
      setLoading(true);
      const deviceDetails = getDeviceDetails();

      const response = await repositoryAuth.post(`/api/v1/auth/login`, {
        username,
        password,
        ...deviceDetails,
        ipAddress,
      }, false, { timeoutMs: LOGIN_REQUEST_TIMEOUT_MS });
      if (!response) return;

      // API có thể trả về response trực tiếp hoặc bọc trong data
      const data = response?.data || response;

      if (data?.requiresOtp === true) {
        setEmailHidden(data?.email || "email của bạn");
        setOtpCode("");
        setOtpError("");
        setCountdown(60);
        setOtpOpened(true);
      } else {
        const token = data?.jwt || data?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem(
            "userProFile",
            JSON.stringify(data?.tblDmEmployee || data?.user || { userName: username })
          );
          NotificationExtension.Success("Đăng nhập thành công!");
          navigate("/");
        } else {
          NotificationExtension.Fails("Đăng nhập thất bại, không nhận được token!");
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      NotificationExtension.Fails(
        error?.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số");
      return;
    }
    try {
      setOtpLoading(true);
      setOtpError("");
      const deviceDetails = getDeviceDetails();

      const response = await repositoryAuth.post(`/api/v1/auth/verify-login-otp`, {
        username: form.values.username,
        otpCode,
        ...deviceDetails,
        ipAddress,
      }, false, { timeoutMs: LOGIN_REQUEST_TIMEOUT_MS });
      if (!response) {
        setOtpError("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.");
        return;
      }

      const data = response?.data || response;
      const token = data?.jwt || data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "userProFile",
          JSON.stringify(data?.tblDmEmployee || data?.user || { userName: form.values.username })
        );
        NotificationExtension.Success("Xác thực thiết bị thành công!");
        setOtpOpened(false);
        navigate("/");
      } else {
        setOtpError("Mã xác thực không hợp lệ hoặc đã hết hạn");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      setOtpError(
        error?.response?.data?.message || "Xác thực OTP thất bại! Vui lòng thử lại."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      setOtpLoading(true);
      const deviceDetails = getDeviceDetails();
      
      const response = await repositoryAuth.post(`/api/v1/auth/login`, {
        username: form.values.username,
        password: form.values.password,
        ...deviceDetails,
        ipAddress,
      }, false, { timeoutMs: LOGIN_REQUEST_TIMEOUT_MS });
      if (!response) return;

      const data = response?.data || response;
      NotificationExtension.Success(
        `Mã OTP mới đã được gửi tới email ${data?.email || "của bạn"}!`
      );
      setCountdown(60);
      setOtpCode("");
      setOtpError("");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setOtpError("Không thể gửi lại mã OTP. Vui lòng kiểm tra kết nối.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        className={style.form}
        onSubmit={form.onSubmit(handleLogin)}
      >
        <div className={style.formHeader}>
          <Title order={2} className={style.formTitle}>
            Đăng nhập
          </Title>
          <Text className={style.formSubtitle}>
            Vui lòng nhập thông tin tài khoản của bạn.
          </Text>
        </div>

        <TextInput
          label="Tên đăng nhập"
          withAsterisk
          placeholder="Nhập tên đăng nhập"
          size="md"
          leftSection={<User size={17} strokeWidth={1.8} />}
          classNames={inputClassNames}
          {...form.getInputProps("username")}
        />

        <PasswordInput
          label="Mật khẩu"
          withAsterisk
          placeholder="Nhập mật khẩu"
          size="md"
          leftSection={<Lock size={17} strokeWidth={1.8} />}
          classNames={{
            ...inputClassNames,
            visibilityToggle: style.authVisibilityToggle,
          }}
          {...form.getInputProps("password")}
        />

        <Group justify="space-between" className={style.formOptions}>
          <Checkbox
            label="Ghi nhớ đăng nhập"
            size="xs"
            classNames={{ label: style.rememberLabel }}
            {...form.getInputProps("remember", { type: "checkbox" })}
          />
          <Anchor
            component="button"
            type="button"
            size="sm"
            className={style.forgotLink}
          >
            Quên mật khẩu?
          </Anchor>
        </Group>

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={loading}
          rightSection={<ArrowRight size={17} strokeWidth={2.2} />}
          className={style.submitButton}
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </Box>

      {/* Modal Xác thực OTP cho Thiết bị mới */}
      <Modal
        opened={otpOpened}
        onClose={() => setOtpOpened(false)}
        title="Xác thực thiết bị mới"
        centered
        radius="md"
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Box ta="center" py="md">
          <ShieldCheck
            size={48}
            color="var(--mantine-color-blue-filled)"
            strokeWidth={1.5}
            style={{ marginBottom: 16 }}
          />
          <Title order={3} fw={700} mb="xs">
            Xác minh hai bước
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            Mã OTP đã được gửi đến email <b>{emailHidden}</b>.
            Vui lòng nhập mã để xác nhận thiết bị đăng nhập của bạn.
          </Text>

          <Box my="lg" style={{ display: "flex", justifyContent: "center" }}>
            <PinInput
              length={6}
              value={otpCode}
              onChange={setOtpCode}
              type="number"
              oneTimeCode
              autoFocus
              size="md"
              error={!!otpError}
            />
          </Box>

          {otpError && (
            <Text size="sm" c="red" mb="md" fw={500}>
              {otpError}
            </Text>
          )}

          <Group justify="space-between" mt="xl">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setOtpOpened(false)}
            >
              Hủy
            </Button>
            
            <Group gap="xs">
              <Button
                variant="outline"
                disabled={countdown > 0 || otpLoading}
                onClick={handleResendOtp}
                size="sm"
              >
                {countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi lại OTP"}
              </Button>
              <Button
                loading={otpLoading}
                onClick={handleVerifyOtp}
                color="blue"
                size="sm"
              >
                Xác nhận
              </Button>
            </Group>
          </Group>
          
          <Box mt="xl" p="sm" bg="var(--mantine-color-gray-0)" style={{ borderRadius: 8 }} ta="left">
            <Text size="xs" fw={600} c="gray.7" mb={4}>Thông tin kết nối:</Text>
            <Text size="xs" c="gray.6">Thiết bị: {getDeviceDetails().deviceName}</Text>
            {ipAddress && <Text size="xs" c="gray.6">Địa chỉ IP: {ipAddress}</Text>}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FormLogin;
