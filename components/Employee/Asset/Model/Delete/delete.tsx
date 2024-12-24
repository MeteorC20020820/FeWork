import React from "react";
import { Modal, Button } from "antd";
import axios from "axios";

interface DeleteProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
}

const Delete: React.FC<DeleteProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
    const token = localStorage.getItem("authToken");
    const apiDeleteAsset = async()=>{
        try{
            const res = await axios.delete(
              `http://localhost:7295/api/Asset/${asset?.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if(res.status == 200){
                alert('Delete assect success')
                onClose(),
                window.location.reload()
            }
        }
        catch(error){
            console.log(error)
        }
    }
  return (
    <Modal
      title="Delete Asset"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={() => apiDeleteAsset()}
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete the asset: {asset?.name}?</p>
    </Modal>
  );
};

export default Delete;
