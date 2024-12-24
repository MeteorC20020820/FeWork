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

export default function Asset() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState<DataType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State cho từ khóa tìm kiếm
  const [asset, setAsset] = useState<any>(null);
  const [modelEdit, setModelEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const apiGetAsset = async () => {
      try{
        const res = await axios.get("http://localhost:7295/api/Asset", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        setAssets(res.data.data);
      }
      catch(error){
        console.log(error)
      }
    };
    apiGetAsset();
  }, [token]);
  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.bodyAsset}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>
      <div className={styles.asset}>
        <div className={styles.header}>
          <p className={styles.titleEm}>Asset</p>
          <div className={styles.action}>
            <div className={styles.creatAss}>
              <button onClick={() => setIsModalOpen(true)}>Create Asset</button>
            </div>
            <div className={styles.searchBar}>
              <Input
                placeholder="Search asset by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
                className={styles.search}
              />
            </div>
          </div>
        </div>
        <div className={styles.assetCardsContainer}>
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              hoverable
              className={styles.assetCard}
              cover={
                <img alt="asset" src={asset.imageUrl} className={styles.img} />
              }
            >
              <Card.Meta
                title={asset.name}
                description={
                  <>
                    <p>
                      <strong>Price:</strong>{" "}
                      {asset.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {asset.quantiy}
                    </p>
                    <div className={styles.hoverDetails}>
                      <p>
                        <strong>CreatedDate:</strong>{" "}
                        {new Date(asset.createdDate).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <p>
                        <strong>Description:</strong> {asset.description}
                      </p>
                    </div>
                  </>
                }
            />

              <div className={styles.cardActions}>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="edit"
                        onClick={() => {
                          setModelEdit(true);
                          setAsset(asset);
                        }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        key="delete"
                        onClick={() => {
                          setAsset(asset);
                          setIsDeleteModalOpen(true);
                        }}
                        danger
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button type="link" icon={<MoreOutlined />} />
                </Dropdown>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {<Create isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      <Edit
        modelEdit={modelEdit}
        setModelEdit={() => setModelEdit(false)}
        dataAsset={asset}
      />
      <Delete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        asset={asset}
      />
    </div>
  );
}