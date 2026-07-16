/**
 * ConfigurableTable Component
 *
 * Bảng có thể cấu hình với Drawer tích hợp drag & drop, hỗ trợ ẩn/hiện cột, sắp xếp lại thứ tự cột
 *
 * @example
 * ```tsx
 * import ConfigurableTable, { ColumnConfig } from "../../_base/component/Core/ConfigurableTable";
 *
 * const MyComponent = () => {
 *   const [data, setData] = useState<any[]>([]);
 *
 *   const columnConfig: ColumnConfig[] = [
 *     { accessorKey: "STT", header: "STT", key: "1", size: 50, dataType: "1", isShow: true },
 *     { accessorKey: "name", header: "Tên", key: "2", size: 225, dataType: "1", isShow: true },
 *     { accessorKey: "amount", header: "Số tiền", key: "3", size: 225, dataType: "2", isShow: true },
 *   ];
 *
 *   const updateField = (index: number, field: string, value: any) => {
 *     setData((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
 *   };
 *
 *   const deleteRow = (index: number) => {
 *     setData((prev) => prev.filter((_, i) => i !== index));
 *   };
 *
 *   // Custom cell cho cột đặc biệt
 *   const renderCustomCell = (config: ColumnConfig, cell: any, row: any, updateField: any) => {
 *     if (config.accessorKey === "status") {
 *       return <Select value={cell.getValue() as string} onChange={(v) => updateField(row.index, "status", v)} />;
 *     }
 *     return null; // Dùng render mặc định
 *   };
 *
 *   return (
 *     <ConfigurableTable
 *       data={data}
 *       initialColumnConfig={columnConfig}
 *       onUpdateField={updateField}
 *       onDeleteRow={deleteRow}
 *       renderCustomCell={renderCustomCell}
 *       height={600}
 *       enableEdit={true} // Cho phép thêm/xóa cột trong drawer
 *       showActionColumn={true}
 *       showTableConfigButton={true}
 *       customToolbarActions={<Button>Thêm dòng</Button>}
 *     />
 *   );
 * };
 * ```
 *
 * @props
 * - data: Dữ liệu bảng
 * - initialColumnConfig: Cấu hình cột ban đầu
 * - onUpdateField: Callback khi cập nhật field
 * - onDeleteRow: Callback khi xóa row
 * - renderCustomCell: Custom render cho cell đặc biệt (return null để dùng mặc định)
 * - height: Chiều cao bảng (default: 500)
 * - enableEdit: Cho phép thêm/xóa cột trong drawer (default: false)
 * - showActionColumn: Hiển thị cột Actions (default: true)
 * - showTableConfigButton: Hiển thị nút "Thao tác bảng" (default: true)
 * - customToolbarActions: Custom toolbar actions
 * - additionalColumns: Cột bổ sung
 * - tableOptions: Options cho MantineReactTable
 */

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Drawer,
  Flex,
  Grid,
  Group,
  Menu,
  NumberInput,
  ScrollArea,
  Select,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
  MRT_TableOptions,
} from "mantine-react-table";
import {
  IconCheck,
  IconGripVertical,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { NotificationExtension } from "../../extension/NotificationExtension";

export interface ColumnConfig {
  accessorKey: string;
  header: string;
  key: string;
  size?: number;
  dataType?: string;
  isShow: boolean;
}

interface ConfigurableTableProps {
  data: any[];
  initialColumnConfig: ColumnConfig[];
  onUpdateField?: (index: number, field: string, value: any) => void;
  onDeleteRow?: (index: number) => void;
  renderCustomCell?: (
    config: ColumnConfig,
    cell: any,
    row: any,
    updateField: (index: number, field: string, value: any) => void
  ) => React.ReactNode;
  additionalColumns?: MRT_ColumnDef<any>[];
  tableOptions?: Partial<MRT_TableOptions<any>>;
  height?: number;
  showActionColumn?: boolean;
  showTableConfigButton?: boolean;
  customToolbarActions?: React.ReactNode;
  enableEdit?: boolean; // Cho phép edit inline trong drawer
}

// Component ActionTableDrawer - tích hợp drag & drop
const ActionTableDrawer = ({
  dataColumnProps,
  onSuccess,
  height,
  enableEdit = false,
}: {
  dataColumnProps: any[];
  onSuccess: any;
  height: number;
  enableEdit?: boolean;
}) => {
  const viewport = useRef<HTMLDivElement>(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      dataColumn: dataColumnProps,
    },
  });

  const fields = form.getValues().dataColumn.map((item, index) => (
    <Draggable key={item.key} index={index} draggableId={item.key}>
      {(provided) => (
        <Group
          ref={provided.innerRef}
          mt={index === 0 ? 5 : 20}
          {...provided.draggableProps}
          w={"100%"}
        >
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={18} />
          </Center>
          <Flex direction={"column"} w={"92.5%"}>
            <Grid w={"92.5%"}>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <TextInput
                  label="Khóa truy cập"
                  placeholder="Nhập tên khóa truy cập"
                  key={form.key(`dataColumn.${index}.accessorKey`)}
                  {...form.getInputProps(`dataColumn.${index}.accessorKey`)}
                  disabled={!enableEdit}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <TextInput
                  label="Tên trường dữ liệu"
                  placeholder="Nhập tên trường dữ liệu"
                  key={form.key(`dataColumn.${index}.header`)}
                  {...form.getInputProps(`dataColumn.${index}.header`)}
                />
              </Grid.Col>
            </Grid>
            <Grid w={"92.5%"}>
              <Grid.Col span={{ base: 12, lg: 12 }}>
                <NumberInput
                  label="Kích thước"
                  placeholder="Nhập kích thước"
                  hideControls
                  allowNegative={false}
                  min={0}
                  key={form.key(`dataColumn.${index}.size`)}
                  {...form.getInputProps(`dataColumn.${index}.size`)}
                />
              </Grid.Col>
            </Grid>
            <Flex
              justify={"space-between"}
              gap={"md"}
              align={"center"}
              mt={5}
              w={"92.5%"}
            >
              <Checkbox
                label="Hiển thị"
                key={form.key(`dataColumn.${index}.isShow`)}
                {...form.getInputProps(`dataColumn.${index}.isShow`, {
                  type: "checkbox",
                })}
              />
              {enableEdit && (
                <Menu>
                  <Menu.Target>
                    <Button
                      leftSection={<IconTrash />}
                      size="xs"
                      color="red"
                      variant="filled"
                    >
                      Xóa
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconCheck size={14} />}
                      onClick={() => form.removeListItem("dataColumn", index)}
                    >
                      Xác nhận
                    </Menu.Item>
                    <Menu.Item leftSection={<IconX size={14} />}>Hủy</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Flex>
          </Flex>
        </Group>
      )}
    </Draggable>
  ));

  const scrollToTop = () =>
    viewport.current!.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Box component="form" onSubmit={form.onSubmit((e: any) => onSuccess(e))}>
      <ScrollArea h={height + 130} viewportRef={viewport}>
        <DragDropContext
          onDragEnd={({ destination, source }) =>
            destination?.index !== undefined &&
            form.reorderListItem("dataColumn", {
              from: source.index,
              to: destination.index,
            })
          }
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollArea>

      <Group justify="center" mt="md">
        {enableEdit && (
          <Button
            leftSection={<IconPlus size={14} />}
            color="blue"
            onClick={() => {
              form.insertListItem(
                "dataColumn",
                {
                  accessorKey: "",
                  header: "",
                  key: String(form.getValues().dataColumn.length + 1),
                  isShow: true,
                  size: 225,
                  dataType: "1",
                },
                0
              );
              scrollToTop();
            }}
            w={150}
          >
            Thêm mới
          </Button>
        )}
        <Button
          leftSection={<IconCheck size={14} />}
          color="teal"
          w={150}
          type="submit"
        >
          Lưu
        </Button>
      </Group>
    </Box>
  );
};

const ConfigurableTable: React.FC<ConfigurableTableProps> = ({
  data,
  initialColumnConfig,
  onUpdateField,
  onDeleteRow,
  renderCustomCell,
  additionalColumns = [],
  tableOptions = {},
  height = 500,
  showActionColumn = true,
  showTableConfigButton = true,
  customToolbarActions,
  enableEdit = false,
}) => {
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [columnConfig, setColumnConfig] =
    useState<ColumnConfig[]>(initialColumnConfig);

  const handleSaveColumnConfig = useCallback(
    (e: any) => {
      setColumnConfig(e.dataColumn);
      closeDrawer();
      NotificationExtension.Success("Lưu cấu hình bảng thành công!");
    },
    [closeDrawer]
  );

  const handleUpdateField = useCallback(
    (index: number, field: string, value: any) => {
      if (onUpdateField) {
        onUpdateField(index, field, value);
      }
    },
    [onUpdateField]
  );

  const handleDeleteRow = useCallback(
    (index: number) => {
      if (onDeleteRow) {
        onDeleteRow(index);
      }
    },
    [onDeleteRow]
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    const baseColumns: MRT_ColumnDef<any>[] = [];

    columnConfig.forEach((config) => {
      if (!config.isShow) return;

      // Custom cell rendering if provided
      if (renderCustomCell) {
        const customCell = renderCustomCell(
          config,
          null,
          null,
          handleUpdateField
        );
        if (customCell !== null) {
          baseColumns.push({
            accessorKey: config.accessorKey,
            header: config.header,
            size: config.size || 225,
            Cell: ({ cell, row }) =>
              renderCustomCell(config, cell, row, handleUpdateField),
          });
          return;
        }
      }

      // STT column
      if (config.accessorKey === "STT") {
        baseColumns.push({
          header: config.header,
          accessorKey: config.accessorKey,
          enableColumnActions: false,
          enableSorting: false,
          enableResizing: false,
          Cell: ({ row }) => <>{row?.index + 1}</>,
          size: config.size || 50,
        });
        return;
      }

      // Number type
      if (config.dataType === "2") {
        baseColumns.push({
          accessorKey: config.accessorKey,
          header: config.header,
          size: config.size || 225,
          Cell: ({ cell, row }) => (
            <TextInput
              size="xs"
              value={(cell.getValue() as number) || 0}
              onChange={(e) =>
                handleUpdateField(
                  row.index,
                  config.accessorKey,
                  Number(e.target.value)
                )
              }
              type="number"
            />
          ),
        });
        return;
      }

      // Default string type
      baseColumns.push({
        accessorKey: config.accessorKey,
        header: config.header,
        size: config.size || 225,
        Cell: ({ cell, row }) => (
          <TextInput
            size="xs"
            value={(cell.getValue() as string) || ""}
            onChange={(e) =>
              handleUpdateField(row.index, config.accessorKey, e.target.value)
            }
          />
        ),
      });
    });

    // Add additional columns if provided
    if (additionalColumns.length > 0) {
      baseColumns.push(...additionalColumns);
    }

    // Add action column
    if (showActionColumn && onDeleteRow) {
      baseColumns.push({
        header: "Actions",
        accessorKey: "actions",
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => handleDeleteRow(row.index)}
          >
            <IconTrash size={14} />
          </ActionIcon>
        ),
        size: 80,
      });
    }

    return baseColumns;
  }, [
    columnConfig,
    handleUpdateField,
    handleDeleteRow,
    renderCustomCell,
    additionalColumns,
    showActionColumn,
    onDeleteRow,
  ]);

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnResizing: true,
    enableColumnFilters: true,
    enableSorting: true,
    enableColumnActions: true,
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    positionToolbarAlertBanner: "bottom",
    initialState: {
      showColumnFilters: false,
      columnPinning: {
        left: ["STT"],
        right: showActionColumn ? ["actions"] : [],
      },
      columnVisibility: { id: false },
      density: "xs",
    },
    renderToolbarInternalActions: ({ table }) => <></>,
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        {customToolbarActions}
        {showTableConfigButton && (
          <Button variant="outline" color="teal" size="xs" onClick={openDrawer}>
            Thao tác bảng
          </Button>
        )}
      </>
    ),
    mantineTopToolbarProps: {
      style: {
        borderBottom: "3px solid rgba(128, 128, 128, 0.5)",
        marginBottom: 5,
      },
    },
    getRowId: (row, index) => index.toString(),
    enableStickyHeader: true,
    mantineTableBodyCellProps: ({ row }) => ({
      style: {
        fontWeight: 500,
        fontSize: "11.5px",
        padding: "5px 12px",
      },
    }),
    mantinePaginationProps: {
      style: { display: "none" },
      showRowsPerPage: false,
    },
    enableColumnPinning: true,
    mantineTableProps: {
      striped: false,
    },
    mantineTableContainerProps: {
      style: { maxHeight: height - 148, minHeight: height - 148 },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: "pointer" },
    }),
    ...tableOptions,
  });

  return (
    <>
      <Drawer
        opened={openedDrawer}
        onClose={closeDrawer}
        title="Thao tác bảng"
        position="left"
        size="33%"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <ActionTableDrawer
          dataColumnProps={columnConfig}
          onSuccess={handleSaveColumnConfig}
          height={height}
          enableEdit={enableEdit}
        />
      </Drawer>

      <MantineReactTable table={table} />
    </>
  );
};

export default ConfigurableTable;
