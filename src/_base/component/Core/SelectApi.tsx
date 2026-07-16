import { useEffect, useState, useRef } from "react";
import { Select, MultiSelect } from "@mantine/core";
import { repository } from "../../_const/_constVar";

export interface SelectApiProps {
  apiUrl: string;
  label: string;
  placeholder?: string;
  value?: any;
  onChange: (value: any) => void;
  searchKey?: string;
  isMulti?: boolean;
  error?: React.ReactNode;
  dependencies?: any;
  itemMapper?: (item: any) => { value: string; label: string };
  withAsterisk?: boolean;
}

export function SelectApi({
  apiUrl,
  label,
  placeholder = "Chọn giá trị...",
  value,
  onChange,
  searchKey = "KeySearch",
  isMulti = false,
  error,
  dependencies,
  itemMapper,
  withAsterisk = false,
}: SelectApiProps) {
  const [data, setData] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async (searchVal: string) => {
    setLoading(true);
    try {
      // Ví dụ URL: /api/v1/Employee/get-select?KeySearch=abc
      let url = apiUrl;
      const separator = url.includes("?") ? "&" : "?";
      if (searchVal) {
        url += `${separator}${searchKey}=${encodeURIComponent(searchVal)}`;
      }
      
      const res = await repository.get(url, true);
      let items: any[] = [];
      if (res?.success) {
        items = (res.data as any)?.lists ?? res.data ?? [];
      } else {
        items = res?.lists ?? res ?? [];
      }

      const formatted = items.map((item: any) => {
        if (itemMapper) return itemMapper(item);
        
        // Cố gắng đoán mapper mặc định
        const val = item.id ?? item.value ?? item.code ?? "";
        const lbl = item.name ?? item.label ?? item.title ?? val;
        return {
          value: String(val),
          label: String(lbl),
        };
      });

      setData(formatted);
    } catch (err) {
      console.error("Error fetching SelectApi data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("");
  }, [apiUrl, dependencies]);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchData(val);
    }, 400); // 400ms debounce
  };

  const inputStyles = {
    label: { fontWeight: 600, marginBottom: 6 },
  };

  if (isMulti) {
    return (
      <MultiSelect
        label={label}
        placeholder={placeholder}
        data={data}
        value={Array.isArray(value) ? value.map(String) : []}
        onChange={(val) => onChange(val)}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchable
        nothingFoundMessage="Không tìm thấy dữ liệu"
        styles={inputStyles}
        error={error}
        withAsterisk={withAsterisk}
      />
    );
  }

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={data}
      value={value !== undefined && value !== null ? String(value) : null}
      onChange={(val) => onChange(val)}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      searchable
      nothingFoundMessage="Không tìm thấy dữ liệu"
      styles={inputStyles}
      error={error}
      withAsterisk={withAsterisk}
    />
  );
}
