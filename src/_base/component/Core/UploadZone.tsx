import { useState, useRef } from "react";
import { Paper, Text, Group, Progress, ActionIcon, Stack } from "@mantine/core";
import { IconUpload, IconTrash, IconFile } from "@tabler/icons-react";
import { NotificationExtension } from "../../extension/NotificationExtension";

export interface UploadZoneProps {
  fileUrls: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  allowedTypes?: string[];
}

export function UploadZone({
  fileUrls = [],
  onChange,
  maxFiles = 5,
  maxSizeMb = 10,
  allowedTypes = [".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg"],
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    if (fileUrls.length + files.length > maxFiles) {
      NotificationExtension.Fails(`Tối đa được tải lên ${maxFiles} tệp tin.`);
      return;
    }

    const validFiles: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeMb = file.size / (1024 * 1024);
      
      if (sizeMb > maxSizeMb) {
        NotificationExtension.Fails(`Tệp ${file.name} vượt quá dung lượng cho phép (${maxSizeMb}MB).`);
        return;
      }
      
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedTypes.includes(fileExt)) {
        NotificationExtension.Fails(`Định dạng tệp ${fileExt} không hỗ trợ.`);
        return;
      }

      validFiles.push(file.name);
    }

    // Giả lập luồng upload lên server
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setUploading(false);
          onChange([...fileUrls, ...validFiles.map(name => `/uploads/mock_${Date.now()}_${name}`)]);
          NotificationExtension.Success("Tải tệp lên thành công!");
          return 100;
        }
        return old + 20;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleDelete = (indexToDelete: number) => {
    const updated = fileUrls.filter((_, idx) => idx !== indexToDelete);
    onChange(updated);
    NotificationExtension.Success("Đã xóa tệp đính kèm.");
  };

  const getFileName = (url: string) => {
    const parts = url.split("_");
    return parts.length > 2 ? parts.slice(2).join("_") : url.substring(url.lastIndexOf("/") + 1);
  };

  return (
    <Stack gap="xs">
      <Paper
        p="lg"
        radius="md"
        style={{
          border: isDragActive ? "2px dashed #1687e8" : "2px dashed #dee2e6",
          backgroundColor: isDragActive ? "#f0f8ff" : "#fdfdfd",
          cursor: "pointer",
          textAlign: "center",
          transition: "all 150ms ease",
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={allowedTypes.join(",")}
        />
        
        <Group justify="center" gap="sm">
          <IconUpload size={32} stroke={1.5} color="#1687e8" />
          <div>
            <Text size="sm" fw={600}>
              Kéo thả tệp tin hoặc click để chọn tệp
            </Text>
            <Text size="xs" c="dimmed">
              Chấp nhận: {allowedTypes.join(", ")} (Tối đa {maxSizeMb}MB/file, tối đa {maxFiles} files)
            </Text>
          </div>
        </Group>
      </Paper>

      {uploading && (
        <Stack gap={4}>
          <Text size="xs">Đang tải tệp lên...</Text>
          <Progress value={progress} size="sm" color="blue" animated />
        </Stack>
      )}

      {fileUrls.length > 0 && (
        <Stack gap={4} mt={6}>
          <Text size="xs" fw={600}>Tệp đính kèm ({fileUrls.length}):</Text>
          {fileUrls.map((url, idx) => (
            <Paper
              key={idx}
              p="xs"
              withBorder
              radius="sm"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
              }}
            >
              <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                <IconFile size={18} stroke={1.5} color="#9ca3af" />
                <Text size="xs" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {getFileName(url)}
                </Text>
              </Group>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(idx);
                }}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
