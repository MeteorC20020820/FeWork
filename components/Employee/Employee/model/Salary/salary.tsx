import axios from "axios";
import styles from "./salary.module.css";
import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
interface DataType {
  key: string;
  id: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  month: number;
  year: number;
  createdAt: string;
}

type DataIndex = keyof DataType;


export default function Salary(open: boolean, setOpen: Function, dataEm: any) {
  const token = localStorage?.getItem("authToken");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [dataSalary, setDataSalary] = useState<any>(null);
  useEffect(() => {
    const apiGetSalary = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7295/api/Salary/${dataEm?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const formattedData = res.data.data.map((item: any) => ({
          key: item.id.toString(),
          id: item.id,
          baseSalary: item.baseSalary,
          bonus: item.bonus,
          deduction: item.deduction,
          total: item.total,
          month: item.month,
          year: item.year,
          createdAt: item.createdAt,
        }));
        setDataSalary(formattedData);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    apiGetSalary();
  }, [dataEm]);
  console.log(dataSalary);
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "BaseSalary",
      dataIndex: "baseSalary",
      key: "baseSalary",
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
    },
    {
      title: "Deduction",
      dataIndex: "deduction",
      key: "deduction",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      ...getColumnSearchProps("month"),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      ...getColumnSearchProps("year"),
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString("vi-VN");
      },
      align: "center",
    },
  ];
  const data: DataType[] = dataSalary;
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={1000}
      closable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
        <p className={styles.title}>Salary</p>
      <Table<DataType>
        className={styles.row}
        columns={columns}
        dataSource={data}
      />
    </Modal>
  );
}
