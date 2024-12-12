'use client'
import styles from './asset.module.css'
import SideBar from '../SideBar/sideBar'
import { useEffect, useRef, useState } from 'react'
import Create from './Model/Create/create'
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import axios from 'axios'
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import Edit from './Model/Edit/edit'
import Delete from './Model/Delete/delete'
interface DataType {
  key: number;
  id: number;
  name: string;
  quantiy: number;
  imageUrl: string;
  price: number;
  createdDate: string;
  description:string;
}
type DataIndex = keyof DataType;
export default function Asset(){
    const [user, setUser] = useState<any>({})
    const [userRoleP, setUserRoleP] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const token = localStorage.getItem("authToken");
    const [assets, setAssets] = useState<DataType[]>([]);
    const [asset, setAsset] = useState<any>(null)
    const [modelEdit, setModelEdit] = useState(false)
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


    const handleAddClick = () => {
      setIsModalOpen(true);
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
    };

    
    const columns: TableColumnsType<DataType> = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        align: "center",
        width: "6%",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
        align: "center",
      },
      {
        title: "Quantiy",
        dataIndex: "quantiy",
        key: "quantiy",
        align: "center",
      },
      {
        title: "Image",
        dataIndex: "imageUrl",
        key: "imageUrl",
        render: (text: string) => (
          <img
            src={text}
            alt="Asset"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        align: "center",
      },
      {
        title: "CreateDate",
        dataIndex: "createdDate",
        key: "createdDate",
        ...getColumnSearchProps("name"),
        render: (text: string) => {
          const date = new Date(text);
          return date.toLocaleDateString("vi-VN");
        },
        align: "center",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        align: "center",
      },
      {
        title: "Action",
        key: "action",
        align: "center",
        render: (text: any, record: DataType) => {
          const menu = (
            <Menu>
              <Menu.Item
                key="edit"
                onClick={() => {
                  setModelEdit(true)
                  setAsset(record)
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                key="delete"
                onClick={() => {
                  setIsDeleteModalOpen(true),
                  setAsset(record)
                }}
                danger
              >
                Delete
              </Menu.Item>
            </Menu>
          );
          return (
            <Dropdown overlay={menu} trigger={["hover"]}>
              <Button type="link" icon={<MoreOutlined />} />
            </Dropdown>
          );
        },
      },
    ];
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<DataType | null>(null);

    const handleDeleteClick = (asset: DataType) => {
      setAssetToDelete(asset);
      setIsDeleteModalOpen(true);
    };

    useEffect(() =>{
      const apiGetAsset = async() =>{
        try{
          const res = await axios.get("http://localhost:7295/api/Asset", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          setAssets(res.data.data)
        }
        catch(error){
          console.log(error)
        }
      }
      apiGetAsset()
    },[token])
    const data: DataType[] = assets;
    return (
      <div className={styles.bodyAsset}>
        <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
        <div style={{ width: "18%" }}></div>
        <div className={styles.asset}>
          <p className={styles.titleEm}>Asset</p>
          <div className={styles.creatAss}>
            <button onClick={() => handleAddClick()}>Add</button>
            <div className={styles.bodyTableAsset}>
              <Table<DataType>
                columns={columns}
                dataSource={data}
                scroll={{ x: 1000, y: 400 }}
              />
            </div>
          </div>
        </div>
        {<Create isOpen={isModalOpen} onClose={handleModalClose} />}
        <Edit
          modelEdit={modelEdit}
          setModelEdit={() => setModelEdit(false)}
          dataAsset={asset}
        />
        {
          <Delete
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            asset={asset}
          />
        }
      </div>
    );
}