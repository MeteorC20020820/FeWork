'use client'
import styles from './employee.module.css'
import SideBar from '../SideBar/sideBar'
import { useState, useRef, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { ColumnsType } from "antd/es/table";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import type { FilterDropdownProps } from "antd/es/table/interface";
import axios from 'axios';
import Edit from './model/Edit/edit';
import Delete from './model/Delete/delete';
import Create from './model/Create/create';
import Account from './model/Account/account';
import Salary from './model/Salary/salary';
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
const localApi = "http://localhost:7295/api";
interface DataType {
  key: number;
  id:number;
  fullName: string;
  position: string;
  identificationId: string;
  phone: string;
  birthday: string;
  address: string;
  baseSalary: string;
  status: number;
  departmentId:number;
}
type DataIndex = keyof DataType;
export default function Employee(){
    const [user, setUser] = useState<any>({});
    const [employee, setEmployee] = useState<DataType[]>([]);
    const [userRoleP, setUserRoleP] = useState<any>(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalCreate, setModalCreate] = useState(false)
    const [modalAccout, setModalAccount] = useState(false)
    const [modalSalary, setModalSalary] = useState(false)
    const [dataEm, setDataEm] = useState<any>(null)
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
    const columns: ColumnsType<DataType> = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        align: "center",
        width:"70px",
      },
      {
        title: "fullName",
        dataIndex: "fullName",
        key: "fullName",
        align: "center",
        ...getColumnSearchProps("fullName"),
      },
      {
        title: "Position",
        dataIndex: "position",
        key: "position",
        align: "center",
        ...getColumnSearchProps("position"),
      },
      {
        title: "IdentificationId",
        dataIndex: "identificationId",
        key: "identificationId",
        align: "center",
        ...getColumnSearchProps("identificationId"),
      },
      {
        title: "Birthday",
        dataIndex: "birthday",
        key: "birthday",
        align: "center",
        ...getColumnSearchProps("birthday"),
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        ...getColumnSearchProps("address"),
      },
      {
        title: "BaseSalary",
        dataIndex: "baseSalary",
        key: "baseSalary",
        align: "center",
        ...getColumnSearchProps("baseSalary"),
      },
    ];
   if (userRoleP === "1") {
     columns.push({
       title: "Actions",
       key: "actions",
       render: (text: any, record: DataType) => {
         const menu = (
           <Menu>
             <Menu.Item
               key="edit"
               onClick={() => {
                 setModalEdit(true);
                 setDataEm(record);
               }}
             >
               Edit
             </Menu.Item>
             <Menu.Item
               key="delete"
               onClick={() => {
                 setModalDelete(true);
                 setDataEm(record);
               }}
               danger
             >
               Delete
             </Menu.Item>
             <Menu.Item
               key="account"
               onClick={() => {
                 setModalAccount(true);
                 setDataEm(record);
               }}
             >
               Account
             </Menu.Item>
             <Menu.Item
               key="salary"
               onClick={() => {
                 setModalSalary(true);
                 setDataEm(record);
               }}
             >
               Salary
             </Menu.Item>
           </Menu>
         );
         return (
           <Dropdown overlay={menu} trigger={["hover"]}>
             <Button type="link" icon={<MoreOutlined />} />
           </Dropdown>
         );
       },
     });
   }
   const token = localStorage?.getItem("authToken");
    useEffect(() =>{
        const ApiGetEmployee = async() =>{
            try{
                const res = await axios.get(`${localApi}/Employee`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                if (Array.isArray(res.data.data)) {
                  const formattedData = res.data.data.map((item: any) => ({
                    ...item,
                    birthday: new Date(item.birthday).toLocaleDateString(
                      "en-GB"
                    ),
                    
                  }));
                  setEmployee(formattedData);
                } else {
                  console.error("Expected array but received:", res.data.data);
                }
            }
            catch(error){
                console.log(error)
            }
        }
        ApiGetEmployee()
    },[])
    const data: DataType[] = employee;
    return (
      <div className={styles.bodyEmployee}>
        <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
        <div style={{ width: "18%" }}></div>
        <div className={styles.employee}>
          <p className={styles.titleEm}>Employee</p>
          {userRoleP === "1" && (
            <div className={styles.bodyCreateEm}>
              <button
                className={styles.btnCreateEm}
                onClick={() => setModalCreate(true)}
              >
                Create Employee
              </button>
            </div>
          )}
          <Table<DataType>
            columns={columns}
            dataSource={data}
            scroll={{ x: 1000, y: 400 }}
          />
        </div>

        {Edit(modalEdit, setModalEdit, dataEm)}
        {Delete(modalDelete, setModalDelete, dataEm)}
        {Create(modalCreate, setModalCreate)}
        {Account(modalAccout, setModalAccount, dataEm)}
        {Salary(modalSalary, setModalSalary, dataEm)}
      </div>
    );
}