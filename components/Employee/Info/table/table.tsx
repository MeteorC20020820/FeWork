import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import styles from './table.module.css'
import axios from "axios";
import './table.css'
interface DataType {
  key: string;
  id: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  month: number;
  year: number;
  createdAt:string;
}

type DataIndex = keyof DataType;


export default function App ({user}:any) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [dataSalary, setDataSalary] = useState<any>(null)
  const token = localStorage.getItem("authToken");
    useEffect(() =>{
        const apiGetSalary = async() =>{
            try{
                const res = await axios.get(
                  `http://localhost:7295/api/Salary/${user?.id}`,
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
                setDataSalary(formattedData)
                console.log(res.data.data)
            }
            catch(error){
                console.log(error)
            }
        }
        apiGetSalary()
    },[user])
    console.log(dataSalary)
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
      align: "center",
    },
    {
      title: "BaseSalary",
      dataIndex: "baseSalary",
      key: "baseSalary",
      align: "center",
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
      align: "center",
    },
    {
      title: "Deduction",
      dataIndex: "deduction",
      key: "deduction",
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      align:'center',
      ...getColumnSearchProps("month"),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      align:'center',
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
  const data: DataType[] = dataSalary
  return (
    <Table<DataType>
      className="custom-table"
      columns={columns}
      dataSource={data}
    />
  );
};

