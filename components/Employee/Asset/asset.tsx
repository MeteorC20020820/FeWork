'use client'
import styles from './asset.module.css'
import SideBar from '../SideBar/sideBar'
import { useEffect, useState } from 'react'
import Create from './Model/Create/create'
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Card, Dropdown, Menu } from "antd";
import Highlighter from "react-highlight-words";
import axios from 'axios'
import { MoreOutlined } from "@ant-design/icons";
import Edit from './Model/Edit/edit'
import Delete from './Model/Delete/delete'
import {FilterDropdownProps } from "antd/es/table/interface";

interface DataType {
  key: number;
  id: number;
  name: string;
  quantiy: number;
  imageUrl: string;
  price: number;
  createdDate: string;
  description: string;
}

export default function Asset(){
    const [user, setUser] = useState<any>({})
    const [userRoleP, setUserRoleP] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [assets, setAssets] = useState<DataType[]>([]);
    const [asset, setAsset] = useState<any>(null)
    const [modelEdit, setModelEdit] = useState(false)
    const token = localStorage.getItem("authToken");

    const handleSearch = (
      selectedKeys: string[],
      confirm: FilterDropdownProps["confirm"],
      dataIndex: keyof DataType
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setSearchText("");
    };

    
    const handleAddClick = () => setIsModalOpen(true);

    const handleModalClose = () => setIsModalOpen(false);

    const handleDeleteClick = (asset: DataType) => {
      setAsset(asset);
      setIsDeleteModalOpen(true);
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<DataType | null>(null);

    useEffect(() => {
      const apiGetAsset = async () => {
        try {
          const res = await axios.get("http://localhost:7295/api/Asset", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          setAssets(res.data.data)
        } catch (error) {
          console.log(error)
        }
      }
      apiGetAsset()
    }, [token]);

    return (
      <div className={styles.bodyAsset}>
        <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
        <div style={{ width: "18%" }}></div>
        <div className={styles.asset}>
          <p className={styles.titleEm}>Asset</p>
          <div className={styles.creatAss}>
            <button onClick={handleAddClick}>Add</button>
          </div>
          <div className={styles.assetCardsContainer}>
            {assets.map((asset) => (
              <Card
                key={asset.id}
                hoverable
                className={styles.assetCard}
                cover={<img alt="asset" src={asset.imageUrl} className={styles.img}/>}
              >
                <Card.Meta
                  title={asset.name}
                  description={
                    <>
                      <p><strong>Price:</strong> {asset.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                      <p><strong>Quantity:</strong> {asset.quantiy}</p>
                      <p><strong>Description:</strong> {asset.description}</p>
                    </>
                  }
                />
                <div className={styles.cardActions}>
                  <Dropdown overlay={
                    <Menu>
                      <Menu.Item key="edit" onClick={() => { setModelEdit(true); setAsset(asset); }}>Edit</Menu.Item>
                      <Menu.Item key="delete" onClick={() => { setAsset(asset); setIsDeleteModalOpen(true); }} danger>Delete</Menu.Item>
                    </Menu>
                  } trigger={['click']}>
                    <Button type="link" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {<Create isOpen={isModalOpen} onClose={handleModalClose} />}
        <Edit modelEdit={modelEdit} setModelEdit={() => setModelEdit(false)} dataAsset={asset} />
        <Delete isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} asset={asset} />
      </div>
    );
}
