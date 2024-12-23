import axios from "axios";

const localApi = "http://localhost:7295/api";

export const fetchEmployees = async (token: string | null) => {
  const res = await axios.get(`${localApi}/Employee`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const fetchAccountEmailByEmployeeId = async (
  id: number,
  token: string | null
) => {
  const res = await axios.get(
    `${localApi}/Account/GetAccountByEmployeeId/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data.email;
};
export const fetchAccountAvatarByEmployeeId = async (
  id: number,
  token: string | null
) => {
  const res = await axios.get(
    `${localApi}/Account/GetAccountByEmployeeId/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data.faceUrl;
};