"use client";
import styles from "./employee.module.css";
import SideBar from "../SideBar/sideBar";
import { useState, useEffect } from "react";
import { Card, Button, Dropdown, Menu, Input } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { fetchEmployees, fetchAccountEmailByEmployeeId, fetchAccountAvatarByEmployeeId } from "./apiHelper"; // Import helper
import Edit from "./model/Edit/edit";
import Delete from "./model/Delete/delete";
import Create from "./model/Create/create";
import Account from "./model/Account/account";
import Salary from "./model/Salary/salary";
import ModalWorkshedule from "./model/Workshedule/workshedule";
import "./employee.css";

interface DataType {
  id: number;
  fullName: string;
  position: string;
  identificationId: string;
  phone: string;
  birthday: string;
  address: string;
  baseSalary: string;
  status: number;
  departmentId: number;
  avatar:string,
  email:string
}

export default function Employee() {
  const [user, setUser] = useState<any>({});
  const [employee, setEmployee] = useState<DataType[]>([]);
  const [filteredEmployee, setFilteredEmployee] = useState<DataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [userRoleP, setUserRoleP] = useState<string | null>(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalAccount, setModalAccount] = useState(false);
  const [modalSalary, setModalSalary] = useState(false);
  const [modalWorkshedule, setModalWorkshedule] = useState(false);
  const [dataEm, setDataEm] = useState<DataType | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    // Fetch employees
    const getEmployees = async () => {
      try {
        const employees = await fetchEmployees(token);
        const formattedData = employees.map((item: any) => ({
          ...item,
          birthday: new Date(item.birthday).toLocaleDateString("en-GB"),
        }));
        setEmployee(formattedData);
        setFilteredEmployee(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    getEmployees();
  }, [token]);

  useEffect(() => {
    const filtered = employee.filter((emp) =>
      emp.fullName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredEmployee(filtered);
  }, [searchValue, employee]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const renderCardActions = (record: DataType) => {
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
        <Menu.Item
          key="workshedule"
          onClick={() => {
            setModalWorkshedule(true);
            setDataEm(record);
          }}
        >
          Workshedule
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="link" icon={<MoreOutlined />} />
      </Dropdown>
    );
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const employees = await fetchEmployees(token);
        const formattedData = await Promise.all(
          employees.map(async (item: any) => {
            try {
              const email = await fetchAccountEmailByEmployeeId(item?.id, token);
              const avatar = await fetchAccountAvatarByEmployeeId(item?.id, token);
        
              console.log(`Employee ID: ${item?.id}, Email: ${email}, Avatar: ${avatar}`);
              return {
                ...item,
                birthday: new Date(item.birthday).toLocaleDateString("en-GB"),
                email: email || "N/A",
                avatar: avatar || "",
              };
            } catch (error) {
              console.error(`Error fetching data for ID ${item?.id}:`, error);
              return {
                ...item,
                birthday: new Date(item.birthday).toLocaleDateString("en-GB"),
                email: "N/A",
                avatar: "",
              };
            }
          })
        );
        
        setEmployee(formattedData);
        setFilteredEmployee(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllData();
  }, [token]);

  console.log(filteredEmployee)
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
        <div className={styles.searchContainer}>
          <Input
            className={styles.searchInputs}
            placeholder="Search by name"
            value={searchValue}
            onChange={handleSearch}
            allowClear
          />
        </div>
        <div className="cardContainer">
          {filteredEmployee.map((record) => (
            <Card
              key={record.id}
              title={record.fullName}
              extra={userRoleP === "1" && renderCardActions(record)}
            >
              <div className={styles.bodyImg}>
                <img src={record.avatar} alt="" className={styles.imgEm} />
              </div>
              <p>
                <strong>Position:</strong> {record.position}
              </p>
              <p>
                <strong>Email:</strong> {record.email}
              </p>
              <p>
                <strong>Identification ID:</strong> {record.identificationId}
              </p>
              <p>
                <strong>Birthday:</strong> {record.birthday}
              </p>
              <p>
                <strong>Address:</strong> {record.address}
              </p>
              <p>
                <strong>Base Salary:</strong>{" "}
                {Number(record.baseSalary).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {Edit(modalEdit, setModalEdit, dataEm)}
      {Delete(modalDelete, setModalDelete, dataEm)}
      {Create(modalCreate, setModalCreate)}
      {Account(modalAccount, setModalAccount, dataEm)}
      {Salary(modalSalary, setModalSalary, dataEm)}
      {ModalWorkshedule(modalWorkshedule, setModalWorkshedule, dataEm)}
    </div>
  );
}
