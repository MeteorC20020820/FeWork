"use client";
import React, { useEffect, useRef, useState } from "react";
import SideBar from "../SideBar/sideBar";
import styles from "./department.module.css";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import type { FilterDropdownProps } from "antd/es/table/interface";
interface DataType {
  key: number;
  name: string;
  description: string;
  createdAt:string;
}
type DataIndex = keyof DataType;
export default function Department() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [department, setDepartment] = useState<DataType[]>([]);
  const [nameDep, setNameDep] = useState("");
  const [desDep, setDesDep] = useState("");
  const [senDep, setSendDep] = useState<any>({});

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
      ...getColumnSearchProps("description"),
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      sortDirections: ["descend", "ascend"],
    },
  ];
  const changeNameDep = (e: any) => {
    setNameDep(e.target.value);
  };
  const changeDesDep = (e: any) => {
    setDesDep(e.target.value);
  };
  useEffect(() => {
    setSendDep({
      name: nameDep,
      description: desDep,
      status: 0,
    });
  }, [nameDep, desDep]);
 useEffect(() => {
   const ApiGetDepartment = async () => {
     try {
       const res = await axios.get("http://localhost:7295/api/Department");
       console.log(res.data.data);

       // Ensure res.data.data is an array before setting it to `department`
       if (Array.isArray(res.data.data)) {
         setDepartment(res.data.data);
       } else {
         console.error("Expected array but received:", res.data.data);
       }
     } catch (error) {
       console.log(error);
     }
   };
   ApiGetDepartment();
 }, []);
 const data: DataType[] = department;
  const ApiPostDepartment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7295/api/Department",
        senDep
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.bodyDepartment}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div className={styles.department}>
        {userRoleP === "2" && (
          <div>
            <div></div>
            <div className={styles.creatDepartment}>
              <input
                type="text"
                className={styles.inputCreate}
                value={nameDep}
                onChange={changeNameDep}
                placeholder="Enter name department..."
              />
              <input
                type="text"
                className={styles.inputCreate}
                value={desDep}
                onChange={changeDesDep}
                placeholder="Enter description department..."
              />
              <button
                className={styles.btnCreate}
                onClick={() => ApiPostDepartment()}
              >
                Create
              </button>
            </div>
          </div>
        )}
        <Table<DataType> columns={columns} dataSource={data} />;
      </div>
    </div>
  );
}
